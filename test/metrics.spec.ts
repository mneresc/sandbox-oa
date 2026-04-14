import { MetricsRegistry } from '../src/modules/observability/metrics';

describe('MetricsRegistry', () => {
  it('increments counters', () => {
    const m = new MetricsRegistry();
    m.inc('executions_total');
    m.inc('executions_total');
    expect(m.snapshot().executions_total).toBe(2);
  });
});
