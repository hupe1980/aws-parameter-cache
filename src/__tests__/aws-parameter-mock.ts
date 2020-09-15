import { SSM } from 'aws-sdk';

export class AwsParameterMock {
  private parameters: { [key: string]: SSM.GetParameterResult } | undefined;
  private rejects = false;
  private rejectionMessage: string | undefined;

  public reset(): void {
    this.parameters = undefined;
    this.rejects = false
    this.rejectionMessage = undefined
  }

  public addParameter(param: SSM.PutParameterRequest): void {
    this.parameters = {
      ...this.parameters,
      [param.Name]: {
        Parameter: param
      }
    };
  }

  public rejectsPromise(message = 'failed to fetch param'): void {
    this.rejects = true
    this.rejectionMessage = message 
  }

  public get implementation(): Record<string, unknown> {
    return {
      getParameter: jest.fn(params => ({
        promise: jest.fn(() => {
          return new Promise((resolve, reject) => {
            if(this.rejects) {
              reject(new Error(this.rejectionMessage))
            }
            if (this.parameters && this.parameters[params.Name]) {
              return resolve(this.parameters[params.Name]);
            }
            reject(new Error('Missing param'));
          });
        })
      }))
    };
  }
}
