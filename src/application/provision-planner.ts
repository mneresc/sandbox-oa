export class ProvisionPlanner {
  plan(recipe: Record<string, any>) {
    return {
      recipeId: recipe.id,
      resources: [
        { type: 'queue', name: `${recipe.id}-queue` },
        { type: 'topic', name: `${recipe.id}-topic` },
      ],
    };
  }
}
