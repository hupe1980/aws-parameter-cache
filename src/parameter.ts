import { SSM } from 'aws-sdk';
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

  /** https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#constructor-property */
  ssmConfiguration?: SSM.ClientConfiguration;
}
export class Parameter extends Refreshable {
  public readonly name: string;

  private readonly withDecryption: boolean;
  private readonly ssmClient: SSM;
  private cachedResult: Promise<SSM.GetParameterResult>;

  constructor(props: ParameterProps) {
    super(props.maxAge);
    this.name = props.version ? props.name + ':' + props.version : props.name;
    this.withDecryption = props.withDecryption || true;
    this.ssmClient = new SSM(props.ssmConfiguration);
  }

  public get value() {
    if (!this.cachedResult || this.isExpired()) {
      this.refresh();
    }
    return new Promise(async (resolve, reject) => {
      const data = await this.cachedResult;
      if (data.Parameter && data.Parameter.Value) {
        resolve(data.Parameter.Value);
      } else {
        reject(`The value is missing for parameter ${this.name}`);
      }
    });
  }

  protected refreshParameter() {
    this.cachedResult = this.getParameter(this.name, this.withDecryption);
  }

  private getParameter(name: string, withDecryption: boolean) {
    const params = {
      Name: name,
      WithDecryption: withDecryption
    };
    return this.ssmClient.getParameter(params).promise();
  }
}
