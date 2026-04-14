export interface InfraProvider {
  plan(recipeId: string): Promise<Record<string, unknown>>;
  provision(recipeId: string): Promise<{ status: string }>;
}

export interface RecipeStore {
  list(): Promise<string[]>;
  get(id: string): Promise<Record<string, unknown>>;
}

export interface ComponentSourceProvider {
  fetch(repositoryUrl: string, ref?: string): Promise<{ path: string }>;
}

export interface LambdaRuntimeAdapter {
  execute(input: { entrypoint: string; payload: unknown; timeoutMs: number }): Promise<{ stdout: string; stderr: string; durationMs: number; memoryMbEstimate: number; output?: unknown }>;
}

export interface ExecutionArtifactStore {
  save(componentId: string, runId: string, artifact: Record<string, unknown>): Promise<{ path: string }>;
}

export interface EnvDiscoveryService {
  scan(content: string): Promise<string[]>;
  map(vars: string[]): Promise<Record<string, string>>;
  render(mapping: Record<string, string>): Promise<string>;
}

export interface ExecutionMonitor {
  track(event: Record<string, unknown>): Promise<void>;
}

export interface MessagePublisher {
  publish(topic: string, message: Record<string, unknown>): Promise<void>;
}
