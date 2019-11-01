import { SSM } from 'aws-sdk';

export class AwsParameterMock {
  private parameters: { [key: string]: SSM.GetParameterResult } | undefined;

  public reset(): void {
    this.parameters = undefined;
  }

  public addParameter(param: SSM.PutParameterRequest): void {
    this.parameters = {
      ...this.parameters,
      [param.Name]: {
        Parameter: param
      }
    };
  }

  public get implementation() {
    return {
      getParameter: jest.fn(params => ({
        promise: jest.fn(() => {
          return new Promise((resolve, reject) => {
            if (this.parameters && this.parameters[params.Name]) {
              resolve(this.parameters[params.Name]);
            }
            reject();
          });
        })
      }))
    };
  }
}
