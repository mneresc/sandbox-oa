import { ProvisionPlanner } from '../src/application/provision-planner';

describe('ProvisionPlanner', () => {
  it('creates provisioning plan', () => {
    const planner = new ProvisionPlanner();
    const plan = planner.plan({ id: 'r1' });
    expect(plan.resources).toHaveLength(2);
  });
});
