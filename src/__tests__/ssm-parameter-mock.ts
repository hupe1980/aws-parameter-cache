import {  GetParameterResult, PutParameterRequest} from "@aws-sdk/client-ssm";

export class SSMParameterMock {
  private parameters: { [key: string]: GetParameterResult } | undefined;
  private rejects = false;
  private rejectionMessage: string | undefined;

  public reset(): void {
    this.parameters = undefined;
    this.rejects = false;
    this.rejectionMessage = undefined;
  }

  public addParameter(param: PutParameterRequest): void {
    this.parameters = {
      ...this.parameters,
      [param.Name as any]: {
        Parameter: param,
      },
    };
  }

  public rejectsPromise(message = "failed to fetch param"): void {
    this.rejects = true;
    this.rejectionMessage = message;
  }

  public get implementation(): Record<string, unknown> {
    return {
      getParameter: jest.fn((params) =>  new Promise((resolve, reject) => {
            if (this.rejects) {
              reject(new Error(this.rejectionMessage));
            }
            if (this.parameters && this.parameters[params.Name]) {
              return resolve(this.parameters[params.Name]);
            }
            reject(new Error("Missing param"));
          })
      ),
    };
  }
}
