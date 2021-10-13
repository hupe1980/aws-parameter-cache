import { SSMClient } from '@aws-sdk/client-ssm';
import { mockClient } from 'jest-aws-client-mock';
import { secretsManagerParameter } from '../src/secrets-manager-parameter';

const ssmMock = mockClient(SSMClient);

beforeEach(() => {
  ssmMock.mockReset();
});

it('should append the prefix', async () => {
  expect.assertions(2);

  ssmMock.mockResolvedValue({
    Parameter: {
      Name: '/aws/reference/secretsmanager/foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  const param = secretsManagerParameter({ name: 'foo' });

  expect(param.name).toBe('/aws/reference/secretsmanager/foo');
  expect(await param.value).toBe('bar');
});

it('should ignore the prefix', async () => {
  expect.assertions(2);

  ssmMock.mockResolvedValue({
    Parameter: {
      Name: '/aws/reference/secretsmanager/foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  const param = secretsManagerParameter({
    name: '/aws/reference/secretsmanager/foo',
  });

  expect(param.name).toBe('/aws/reference/secretsmanager/foo');
  expect(await param.value).toBe('bar');
});

it('should reject when ssm rejects', async () => {
  expect.assertions(1);

  const rejectionMessage = 'ParameterNotFound: ParameterNotFoun';
  ssmMock.mockRejectedValue(rejectionMessage);

  const param = secretsManagerParameter({
    name: '/aws/reference/secretsmanager/missing-foo',
  });

  await expect(param.value).rejects.toEqual(new Error(rejectionMessage));
});

