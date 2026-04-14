import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('saúde')
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('system')
  system() {
    return { node: process.version, memory: process.memoryUsage() };
  }

  @Get('localstack')
  localstack() {
    return { reachable: false, mode: 'stub-v1' };
  }
}
