import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecipeStore } from '../../contracts/ports';
import { RecipeValidator } from '../../application/recipe-validator';

@ApiTags('receita')
@Controller('recipes')
export class RecipesController {
  constructor(
    @Inject('RecipeStore') private readonly recipeStore: RecipeStore,
    private readonly validator: RecipeValidator,
  ) {}

  @Get()
  async list() {
    return { items: await this.recipeStore.list() };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.recipeStore.get(id);
  }

  @Post('validate')
  validate(@Body() body: unknown) {
    return this.validator.validateRecipe(body);
  }
}
