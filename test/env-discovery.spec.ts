import { LocalEnvDiscoveryService } from '../src/infrastructure/adapters';

describe('LocalEnvDiscoveryService', () => {
  const svc = new LocalEnvDiscoveryService();

  it('scans .env style text', async () => {
    const vars = await svc.scan('A=1\n#x\nB=2');
    expect(vars).toEqual(['A', 'B']);
  });

  it('maps and renders', async () => {
    const mapping = await svc.map(['A']);
    expect(mapping.A).toBe('mapped_a');
    const rendered = await svc.render(mapping);
    expect(rendered).toContain('A=mapped_a');
  });
});
