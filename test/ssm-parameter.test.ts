import { SSMClient } from '@aws-sdk/client-ssm';
import { mockClient } from 'jest-aws-client-mock';

import { ssmParameter } from '../src/ssm-parameter';

const ssmMock = mockClient(SSMClient);

beforeEach(() => {
  ssmMock.mockReset();
});

it('should return the parameter value', async () => {
  expect.assertions(2);

  ssmMock.mockResolvedValue({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  const param = ssmParameter({ name: 'foo' });

  expect(param.name).toBe('foo');
  expect(await param.value).toBe('bar');
});

it('should ignore the parameter change', async () => {
  expect.assertions(3);

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  const param = ssmParameter({ name: 'foo' });

  expect(param.name).toBe('foo');
  expect(await param.value).toBe('bar');

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'XXX',
    },
  });

  expect(await param.value).toBe('bar');
});

it('should force a refresh', async () => {
  expect.assertions(4);

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  const param = ssmParameter({ name: 'foo' });

  expect(param.name).toBe('foo');
  expect(await param.value).toBe('bar');

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'XXX',
    },
  });

  expect(await param.value).toBe('bar');

  param.refresh();

  expect(await param.value).toBe('XXX');
});

it('should invalidate the cache', async () => {
  expect.assertions(4);

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'bar',
    },
  });

  Date.now = jest.fn(() => 1000);
  const param = ssmParameter({ name: 'foo', maxAge: 1000 });

  expect(param.name).toBe('foo');
  expect(await param.value).toBe('bar');

  ssmMock.mockResolvedValueOnce({
    Parameter: {
      Name: 'foo',
      Type: 'String',
      Value: 'XXX',
    },
  });

  expect(await param.value).toBe('bar');

  Date.now = jest.fn(() => 3000);
  expect(await param.value).toBe('XXX');
});

it('should return the the stringList as array', async () => {
  expect.assertions(2);

  ssmMock.mockResolvedValue({
    Parameter: {
      Name: 'fooList',
      Type: 'StringList',
      Value: 'XXX,YYY,ZZZ',
    },
  });

  const param = ssmParameter({ name: 'fooList' });

  expect(param.name).toBe('fooList');
  expect(await param.value).toEqual(['XXX', 'YYY', 'ZZZ']);
});

it('should reject when ssm rejects', async() => {
  expect.assertions(1);

  const rejectionMessage = 'ParameterNotFound: ParameterNotFoun';
  ssmMock.mockRejectedValue(rejectionMessage);

  const param = ssmParameter({
    name: '/aws/reference/secretsmanager/missing-foo',
  });

  await expect(param.value).rejects.toEqual(new Error(rejectionMessage));
});
