import { Body, Controller, MessageEvent, Post, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ExecutionService } from '../../application/execution.service';

@ApiTags('sandbox')
@Controller('sandbox')
export class SandboxController {
  constructor(private readonly executions: ExecutionService) {}

  @Post('sessions')
  createSession(@Body() body: Record<string, unknown>) {
    return { id: `sbx_${Date.now()}`, ...body };
  }

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      const unsubscribe = this.executions.stream((event) => subscriber.next({ data: event }));
      return () => unsubscribe();
    });
  }
}
