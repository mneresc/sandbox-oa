import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecutionService } from '../../application/execution.service';

@ApiTags('execuções')
@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executions: ExecutionService) {}

  @Post()
  enqueue(@Body() body: Record<string, unknown>) {
    return this.executions.enqueue(body);
  }

  @Post('poll')
  async poll() {
    await this.executions.poll();
    return { ok: true };
  }

  @Get('bridge/status')
  status() {
    return { bridge: 'sns->sqs-internal', status: 'enabled' };
  }
}
