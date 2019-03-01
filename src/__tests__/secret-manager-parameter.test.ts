import { AwsParameterMock } from './aws-parameter-mock';
import { secretsManagerParameter } from '../secrets-manager-parameter';

const mock = new AwsParameterMock();
jest.mock('aws-sdk', () => ({
  SSM: jest.fn().mockImplementation(() => mock.implementation)
}));

describe('aws-parameter-cache: secrets-manager-parameter', () => {
  beforeEach(() => {
    mock.reset();
    mock.addParameter({
      Name: '/aws/reference/secretsmanager/foo',
      Type: 'String',
      Value: 'bar'
    });
  });

  it('should append the prefix', async () => {
    const param = secretsManagerParameter({ name: 'foo' });

    expect(param.name).toBe('/aws/reference/secretsmanager/foo');
    expect(await param.value).toBe('bar');
  });

  it('should ignore the prefix', async () => {
    const param = secretsManagerParameter({
      name: '/aws/reference/secretsmanager/foo'
    });

    expect(param.name).toBe('/aws/reference/secretsmanager/foo');
    expect(await param.value).toBe('bar');
  });
});
