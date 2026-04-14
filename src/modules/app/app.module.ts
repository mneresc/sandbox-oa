import { Module } from '@nestjs/common';
import { HealthController } from '../health/health.controller';
import { RepositoriesController } from '../repositories/repositories.controller';
import { ComponentsController } from '../components/components.controller';
import { EnvDiscoveryController } from '../env-discovery/env-discovery.controller';
import { RecipesController } from '../recipes/recipes.controller';
import { InfraController } from '../infra/infra.controller';
import { SandboxController } from '../sandbox/sandbox.controller';
import { ExecutionsController } from '../executions/executions.controller';
import {
  AwsSdkMessagePublisher,
  FilesystemExecutionArtifactStore,
  GitCliSourceProvider,
  JsonExecutionMonitor,
  LocalEnvDiscoveryService,
  LocalStackAwsProvider,
  NodeLambdaRuntimeAdapter,
  YamlRecipeStore,
} from '../../infrastructure/adapters';
import { ExecutionService } from '../../application/execution.service';
import { RecipeValidator } from '../../application/recipe-validator';

const infraProvider = new LocalStackAwsProvider();
const recipeStore = new YamlRecipeStore();
const componentSource = new GitCliSourceProvider();
const envDiscovery = new LocalEnvDiscoveryService();
const monitor = new JsonExecutionMonitor();
const artifacts = new FilesystemExecutionArtifactStore('/data/executions');
const publisher = new AwsSdkMessagePublisher();
const runtime = new NodeLambdaRuntimeAdapter();
const executionService = new ExecutionService(runtime, artifacts, monitor, publisher);
const recipeValidator = new RecipeValidator();

@Module({
  controllers: [
    HealthController,
    RepositoriesController,
    ComponentsController,
    EnvDiscoveryController,
    RecipesController,
    InfraController,
    SandboxController,
    ExecutionsController,
  ],
  providers: [
    { provide: 'InfraProvider', useValue: infraProvider },
    { provide: 'RecipeStore', useValue: recipeStore },
    { provide: 'ComponentSourceProvider', useValue: componentSource },
    { provide: 'EnvDiscoveryService', useValue: envDiscovery },
    { provide: 'ExecutionMonitor', useValue: monitor },
    { provide: 'ExecutionArtifactStore', useValue: artifacts },
    { provide: 'MessagePublisher', useValue: publisher },
    { provide: ExecutionService, useValue: executionService },
    { provide: RecipeValidator, useValue: recipeValidator },
  ],
})
export class AppModule {}
