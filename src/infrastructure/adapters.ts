import { execFile } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { dump, load } from 'js-yaml';
import { v4 as uuid } from 'uuid';
import {
  ComponentSourceProvider,
  EnvDiscoveryService,
  ExecutionArtifactStore,
  ExecutionMonitor,
  InfraProvider,
  LambdaRuntimeAdapter,
  MessagePublisher,
  RecipeStore,
} from '../contracts/ports';

const execFileAsync = promisify(execFile);

export class LocalStackAwsProvider implements InfraProvider {
  async plan(recipeId: string): Promise<Record<string, unknown>> {
    return { recipeId, resources: [{ type: 'sqs' }, { type: 'sns' }], provider: 'localstack' };
  }
  async provision(recipeId: string): Promise<{ status: string }> {
    return { status: `provisioned:${recipeId}` };
  }
}

export class YamlRecipeStore implements RecipeStore {
  constructor(private readonly baseDir = 'recipes/examples') {}
  async list(): Promise<string[]> {
    return ['sample-recipe'];
  }
  async get(id: string): Promise<Record<string, unknown>> {
    const raw = readFileSync(join(this.baseDir, `${id}.yaml`), 'utf8');
    return (load(raw) as Record<string, unknown>) ?? {};
  }
}

export class GitCliSourceProvider implements ComponentSourceProvider {
  async fetch(repositoryUrl: string): Promise<{ path: string }> {
    return { path: `/tmp/source-${Buffer.from(repositoryUrl).toString('base64').slice(0, 6)}` };
  }
}

export class NodeLambdaRuntimeAdapter implements LambdaRuntimeAdapter {
  async execute(input: { entrypoint: string; payload: unknown; timeoutMs: number }) {
    const start = Date.now();
    const out = await execFileAsync('node', [input.entrypoint, JSON.stringify(input.payload)], {
      timeout: input.timeoutMs,
    });
    return {
      stdout: out.stdout,
      stderr: out.stderr,
      durationMs: Date.now() - start,
      memoryMbEstimate: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
      output: out.stdout ? JSON.parse(out.stdout) : undefined,
    };
  }
}

export class FilesystemExecutionArtifactStore implements ExecutionArtifactStore {
  constructor(private readonly root = '/data/executions') {}
  async save(componentId: string, runId: string, artifact: Record<string, unknown>): Promise<{ path: string }> {
    const date = new Date();
    const path = join(
      this.root,
      componentId,
      String(date.getUTCFullYear()),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0'),
    );
    mkdirSync(path, { recursive: true });
    const file = join(path, `${runId}.json`);
    writeFileSync(file, JSON.stringify(artifact, null, 2));
    return { path: file };
  }
}

export class LocalEnvDiscoveryService implements EnvDiscoveryService {
  async scan(content: string): Promise<string[]> {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => line.split('=')[0]);
  }
  async map(vars: string[]): Promise<Record<string, string>> {
    return vars.reduce<Record<string, string>>((acc, cur) => {
      acc[cur] = `mapped_${cur.toLowerCase()}`;
      return acc;
    }, {});
  }
  async render(mapping: Record<string, string>): Promise<string> {
    return Object.entries(mapping)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
  }
}

export class JsonExecutionMonitor implements ExecutionMonitor {
  public readonly events: Record<string, unknown>[] = [];
  async track(event: Record<string, unknown>): Promise<void> {
    this.events.push({ id: uuid(), ...event, at: new Date().toISOString() });
  }
}

export class AwsSdkMessagePublisher implements MessagePublisher {
  async publish(topic: string, message: Record<string, unknown>): Promise<void> {
    // placeholder v1: bridge handled locally; SDK integration is swappable.
    void dump({ topic, message });
  }
}
