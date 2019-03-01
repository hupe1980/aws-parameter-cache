export abstract class Refreshable {
  private readonly maxAge: number | undefined;
  private lastRefreshTime: number;

  constructor(maxAge?: number) {
    this.maxAge = maxAge;
  }

  protected abstract refreshParameter(): void;

  public refresh() {
    this.refreshParameter();
    this.updateLastRefreshTime();
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
