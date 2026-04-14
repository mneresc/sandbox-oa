import { LocalStackAwsProvider } from '../src/infrastructure/adapters';

describe('InfraProvider contract', () => {
  it('plan/provision return contract shape', async () => {
    const provider = new LocalStackAwsProvider();
    const plan = await provider.plan('r1');
    const provision = await provider.provision('r1');
    expect(plan.provider).toBe('localstack');
    expect(provision.status).toContain('provisioned');
  });
});
