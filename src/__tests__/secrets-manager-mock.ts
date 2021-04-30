export class SecretsManagerMock {
  private secretStrings?: Record<string, Record<string, string>>;
  private rejects = false;
  private rejectionMessage: string | undefined;

  public reset(): void {
    this.secretStrings = undefined;
    this.rejects = false;
    this.rejectionMessage = undefined;
  }

  public addSecretString(secretId: string, secretString: string): void {
    this.secretStrings = {
      ...this.secretStrings,
      [secretId as any]: {
        SecretString: secretString,
      },
    };
  }

  public rejectsPromise(message = "failed to fetch param"): void {
    this.rejects = true;
    this.rejectionMessage = message;
  }

  public get implementation(): Record<string, unknown> {
    return {
      getSecretValue: jest.fn((params) =>  new Promise((resolve, reject) => {
            if (this.rejects) {
              reject(new Error(this.rejectionMessage));
            }
            if (this.secretStrings && this.secretStrings[params.SecretId]) {
              return resolve(this.secretStrings[params.SecretId]);
            }
            reject(new Error("Missing secret"));
          }
        ),
      ),
    };
  }
}
