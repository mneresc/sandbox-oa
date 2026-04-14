import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('repositórios')
@Controller('repositories')
export class RepositoriesController {
  private readonly repos: Record<string, unknown>[] = [];

  @Get()
  list() {
    return this.repos;
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    this.repos.push(body);
    return body;
  }
}
