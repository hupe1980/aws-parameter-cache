import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'jest-aws-client-mock';

import { secretsManagerSecret } from '../src/secrets-manager-secret';

const secretsManagerMock = mockClient(SecretsManagerClient);

beforeEach(() => {
  secretsManagerMock.mockReset();
});

it('should return the secretString', async () => {
  expect.assertions(2);

  secretsManagerMock.mockResolvedValue({
    Name: 'foo',
    SecretString: 'bar',
  });

  const secret = secretsManagerSecret({ secretId: 'foo' });

  expect(secret.secretId).toBe('foo');
  expect(await secret.secretString).toBe('bar');
});

