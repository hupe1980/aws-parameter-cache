import { SSM, GetParameterResult, SSMClientConfig } from "@aws-sdk/client-ssm";
import { Refreshable } from "./refreshable";

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
  ssmConfiguration?: SSMClientConfig;
}
export class Parameter extends Refreshable {
  public readonly name: string;

  private readonly withDecryption: boolean;
  private readonly ssmClient: SSM;
  private cachedResult: Promise<GetParameterResult>;

  constructor({version = '', name = '' ,maxAge = undefined, ssmConfiguration = {}, withDecryption =true}: ParameterProps) {
    super(maxAge);
    this.name = version ? name + ":" + version : name;
    this.withDecryption =withDecryption;
    this.ssmClient = new SSM(ssmConfiguration);
  }

  public get value(): Promise<string | string[]> {
    if (!this.cachedResult || this.isExpired()) {
      this.refresh();
    }

    return this.cachedResult.then((data) => {
      if (data.Parameter?.Value) {
        return data.Parameter.Type === "StringList"
          ? data.Parameter.Value.split(",")
          : data.Parameter.Value;
      }

      throw new Error(`The value is missing for parameter ${this.name}`);
    });
  }

  protected refreshParameter(): void {
    this.cachedResult = this.getParameter();
  }

  private getParameter(): Promise<GetParameterResult> {
    const params = {
      Name: this.name,
      WithDecryption: this.withDecryption,
    };
    return this.ssmClient.getParameter(params);
  }
}
