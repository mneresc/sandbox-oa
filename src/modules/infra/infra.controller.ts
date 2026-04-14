import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfraProvider } from '../../contracts/ports';

@ApiTags('provisionamento')
@Controller('infra')
export class InfraController {
  constructor(@Inject('InfraProvider') private readonly infra: InfraProvider) {}

  @Get('plan/:recipeId')
  plan(@Param('recipeId') recipeId: string) {
    return this.infra.plan(recipeId);
  }

  @Post('provision/:recipeId')
  provision(@Param('recipeId') recipeId: string) {
    return this.infra.provision(recipeId);
  }
}
