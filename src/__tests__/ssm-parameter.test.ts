import { AwsParameterMock } from './aws-parameter-mock';
import { ssmParameter } from '../ssm-parameter';

const mock = new AwsParameterMock();
jest.mock('aws-sdk', () => ({
  SSM: jest.fn().mockImplementation(() => mock.implementation)
}));

describe('aws-parameter-cache: ssm-parameter', () => {
  beforeEach(() => {
    mock.reset();
    mock.addParameter({
      Name: 'foo',
      Type: 'String',
      Value: 'bar'
    });
  });

  it('should return the parameter value', async () => {
    const param = ssmParameter({ name: 'foo' });

    expect(param.name).toBe('foo');
    expect(await param.value).toBe('bar');
  });

  it('should ignore the parameter change', async () => {
    const param = ssmParameter({ name: 'foo' });

    expect(param.name).toBe('foo');
    expect(await param.value).toBe('bar');

    mock.addParameter({
      Name: 'foo',
      Type: 'String',
      Value: 'XXX'
    });

    expect(await param.value).toBe('bar');
  });

  it('should force a refresh', async () => {
    const param = ssmParameter({ name: 'foo' });

    expect(param.name).toBe('foo');
    expect(await param.value).toBe('bar');

    mock.addParameter({
      Name: 'foo',
      Type: 'String',
      Value: 'XXX'
    });

    param.refresh();

    expect(await param.value).toBe('XXX');
  });

  it('should invalidate the cache', async () => {
    Date.now = jest.fn(() => 1000);
    const param = ssmParameter({ name: 'foo', maxAge: 1000 });

    expect(param.name).toBe('foo');
    expect(await param.value).toBe('bar');

    mock.addParameter({
      Name: 'foo',
      Type: 'String',
      Value: 'XXX'
    });

    expect(await param.value).toBe('bar');

    Date.now = jest.fn(() => 3000);
    expect(await param.value).toBe('XXX');
  });
});
