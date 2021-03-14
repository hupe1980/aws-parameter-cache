import { SecretsManager } from "aws-sdk";
import { Refreshable } from "./refreshable";

export interface SecretProps {
  /** Specifies the secret containing the version that you want to retrieve. */
  secretId: string;

  /** Specifies the unique identifier of the version of the secret that you want to retrieve. */
  versionId?: string;

  /** Specifies the secret version that you want to retrieve by the staging label attached to the version. */
  versionStage?: string;

  /** Speciifies the key of the seceretString that you want to retireve. */
  key?: string;

  /** The maximum amount of time in milliseconds a parameter will be considered fresh */
  maxAge?: number;

  /** https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#constructor-property */
  secretsManagerConfiguration?: SecretsManager.ClientConfiguration;
}
export class Secret extends Refreshable {
  public readonly secretId: string;
  public readonly versionId?: string;
  public readonly versionStage?: string;
  public readonly key?: string;

  private readonly secretsManager: SecretsManager;
  private cachedResponse: Promise<SecretsManager.GetSecretValueResponse>;

  constructor(props: SecretProps) {
    super(props.maxAge);
    this.secretId = props.secretId;
    this.versionId = props.versionId;
    this.versionStage = props.versionStage;
    this.key = props.key;
    this.secretsManager = new SecretsManager(props.secretsManagerConfiguration);
  }

  public get secretString(): Promise<string> {
    if (!this.cachedResponse || this.isExpired()) {
      this.refresh();
    }

    return this.cachedResponse.then((data) => {
      if (data.SecretString) {
        return this.key
          ? JSON.parse(data.SecretString)[this.key]
          : data.SecretString;
      }

      throw new Error(
        `The secretString is missing for secret ${this.secretId}`
      );
    });
  }

  protected refreshParameter(): void {
    this.cachedResponse = this.getSecretValue();
  }

  private getSecretValue(): Promise<SecretsManager.GetSecretValueResponse> {
    const params = {
      SecretId: this.secretId,
      VersionId: this.versionId,
      VersionStage: this.versionStage,
    };
    return this.secretsManager.getSecretValue(params).promise();
  }
}
