import { RecipeValidator } from '../src/application/recipe-validator';

describe('RecipeValidator', () => {
  it('validates valid recipe', () => {
    const validator = new RecipeValidator();
    const result = validator.validateRecipe({
      id: 'r1',
      version: '1',
      component: { id: 'c1', repository: 'x', entrypoint: 'handler.js' },
      runtime: { timeoutMs: 1000 },
    });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid recipe', () => {
    const validator = new RecipeValidator();
    const result = validator.validateRecipe({ id: 'r1' });
    expect(result.valid).toBe(false);
  });
});
