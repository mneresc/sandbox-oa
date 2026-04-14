export class MetricsRegistry {
  private counters: Record<string, number> = {};

  inc(name: string) {
    this.counters[name] = (this.counters[name] ?? 0) + 1;
  }

  snapshot() {
    return this.counters;
  }
}
