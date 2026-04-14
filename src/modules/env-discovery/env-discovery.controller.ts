import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnvDiscoveryService } from '../../contracts/ports';

@ApiTags('env-mapping')
@Controller('env')
export class EnvDiscoveryController {
  constructor(@Inject('EnvDiscoveryService') private readonly envService: EnvDiscoveryService) {}

  @Post('discovery')
  async discovery(@Body() body: { content: string }) {
    return { vars: await this.envService.scan(body.content) };
  }

  @Post('mappings')
  async mappings(@Body() body: { vars: string[] }) {
    return { mapping: await this.envService.map(body.vars) };
  }

  @Post('render')
  async render(@Body() body: { mapping: Record<string, string> }) {
    return { env: await this.envService.render(body.mapping) };
  }
}
