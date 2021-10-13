import { SSMClient, GetParameterCommand, SSMClientConfig, GetParameterCommandOutput } from '@aws-sdk/client-ssm';
import { Refreshable } from './refreshable';

export interface ParameterProps {
  /** The name of the parameter you want to query. */
  name: string;

  /** The parameter version. */
  version?: string;

  /** Return decrypted values for secure string parameters. This flag is ignored for String and StringList parameter types. */
  withDecryption?: boolean;

  /** The maximum amount of time in milliseconds a parameter will be considered fresh */
  maxAge?: number;

  /** https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/interfaces/ssmclientconfig.html */
  ssmClientConfig?: SSMClientConfig;
}
export class Parameter extends Refreshable {
  public readonly name: string;

  private readonly withDecryption: boolean;
  private readonly ssmClient: SSMClient;
  private cachedResult?: Promise<GetParameterCommandOutput>;

  constructor(props: ParameterProps) {
    super(props.maxAge);
    this.name = props.version ? props.name + ':' + props.version : props.name;
    this.withDecryption = props.withDecryption || true;
    this.ssmClient = new SSMClient({ ...props.ssmClientConfig });
  }

  public get value(): Promise<string | string[]> {
    if (!this.cachedResult || this.isExpired()) {
      this.refresh();
    }

    return this.cachedResult!.then((data) => {
      if (data.Parameter?.Value) {
        return data.Parameter.Type === 'StringList'
          ? data.Parameter.Value.split(',')
          : data.Parameter.Value;
      }

      throw new Error(`The value is missing for parameter ${this.name}`);
    });
  }

  protected refreshParameter(): void {
    this.cachedResult = this.getParameter();
  }

  private getParameter(): Promise<GetParameterCommandOutput> {
    const command = new GetParameterCommand({
      Name: this.name,
      WithDecryption: this.withDecryption,
    });

    return this.ssmClient.send(command);
  }
}
