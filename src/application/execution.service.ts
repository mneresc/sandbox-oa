import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import { ExecutionArtifactStore, ExecutionMonitor, LambdaRuntimeAdapter, MessagePublisher } from '../contracts/ports';

export class ExecutionService {
  private readonly bus = new EventEmitter();
  private readonly queue: Record<string, unknown>[] = [];

  constructor(
    private readonly runtime: LambdaRuntimeAdapter,
    private readonly artifactStore: ExecutionArtifactStore,
    private readonly monitor: ExecutionMonitor,
    private readonly publisher: MessagePublisher,
  ) {}

  enqueue(payload: Record<string, unknown>): { runId: string } {
    const runId = randomUUID();
    this.queue.push({ runId, ...payload });
    this.bus.emit('queued', { runId });
    return { runId };
  }

  async poll(): Promise<void> {
    const next = this.queue.shift();
    if (!next) return;
    const runId = String(next.runId);
    await this.publisher.publish('internal.sqs', { type: 'execution.started', runId });
    const result = await this.runtime.execute({
      entrypoint: String(next.entrypoint),
      payload: next.payload,
      timeoutMs: Number(next.timeoutMs ?? 5000),
    });
    const artifact = { runId, ...result };
    const location = await this.artifactStore.save(String(next.componentId ?? 'default'), runId, artifact);
    await this.monitor.track({ type: 'execution.completed', runId, location: location.path, ...result });
    this.bus.emit('completed', { runId, location: location.path });
  }

  stream(cb: (event: Record<string, unknown>) => void): () => void {
    const handler = (event: Record<string, unknown>) => cb(event);
    this.bus.on('queued', handler);
    this.bus.on('completed', handler);
    return () => {
      this.bus.off('queued', handler);
      this.bus.off('completed', handler);
    };
  }
}
