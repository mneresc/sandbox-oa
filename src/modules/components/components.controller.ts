import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('componentes')
@Controller('components')
export class ComponentsController {
  private readonly components: Record<string, unknown>[] = [];

  @Get()
  list() {
    return this.components;
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    this.components.push(body);
    return body;
  }
}
