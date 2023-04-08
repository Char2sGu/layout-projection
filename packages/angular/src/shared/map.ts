export class MapExpirer<Key> {
  timeouts = new Map<Key, any>();

  constructor(
    protected map: Map<Key, unknown>,
    protected secondsBeforeDeletion: number,
  ) {}

  stale(id: Key): void {
    const timeout = setTimeout(
      () => this.performDeletion(id),
      this.secondsBeforeDeletion * 1000,
    );
    this.timeouts.set(id, timeout);
  }

  refresh(id: Key): void {
    const timeout = this.timeouts.get(id);
    clearTimeout(timeout);
    this.timeouts.delete(id);
  }

  protected performDeletion(id: Key): void {
    this.map.delete(id);
    this.timeouts.delete(id);
  }
}
