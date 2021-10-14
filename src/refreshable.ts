export abstract class Refreshable {
  private lastRefreshTime?: number;

  constructor(private readonly maxAge?: number) {}

  protected abstract refreshParameter(): void;

  public refresh(): void {
    this.updateLastRefreshTime();
    this.refreshParameter();
  }

  private updateLastRefreshTime(): void {
    this.lastRefreshTime = Date.now();
  }

  public isExpired(): boolean {
    if (!this.maxAge) return false;
    if (!this.lastRefreshTime) return true;
    return Date.now() > this.lastRefreshTime + this.maxAge;
  }
}
