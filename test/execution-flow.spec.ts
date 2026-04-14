import { ExecutionService } from '../src/application/execution.service';
import { FilesystemExecutionArtifactStore, JsonExecutionMonitor } from '../src/infrastructure/adapters';

const runtime = {
  execute: jest.fn().mockResolvedValue({
    stdout: 'ok',
    stderr: '',
    durationMs: 10,
    memoryMbEstimate: 128,
  }),
};
const publisher = { publish: jest.fn().mockResolvedValue(undefined) };

describe('runtime/poller/bridge/artifacts', () => {
  it('runs queued job and stores artifact', async () => {
    const monitor = new JsonExecutionMonitor();
    const artifacts = new FilesystemExecutionArtifactStore('data/executions');
    const service = new ExecutionService(runtime as any, artifacts, monitor, publisher as any);
    service.enqueue({ componentId: 'cmp1', entrypoint: 'x.js', payload: {}, timeoutMs: 10 });
    await service.poll();
    expect(monitor.events[0].type).toBe('execution.completed');
  });
});
