import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv from 'ajv';

export class RecipeValidator {
  private readonly ajv = new Ajv();
  private readonly validate;

  constructor(schemaPath = join(process.cwd(), 'recipes/schemas/sandbox.recipe.schema.json')) {
    this.validate = this.ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf8')));
  }

  validateRecipe(input: unknown): { valid: boolean; errors?: string[] } {
    const valid = this.validate(input);
    if (valid) return { valid: true };
    return { valid: false, errors: (this.validate.errors ?? []).map((e) => `${e.instancePath} ${e.message}`.trim()) };
  }
}
