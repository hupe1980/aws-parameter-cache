import { SecretsManagerMock } from "./secrets-manager-mock";
import { secretsManagerSecret } from "../secrets-manager-secret";

const mock = new SecretsManagerMock();
jest.mock("@aws-sdk/client-secrets-manager", () => ({
  SecretsManager: jest.fn().mockImplementation(() => mock.implementation),
}));

describe("aws-parameter-cache: secrets-manager-secret", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return the secretString", async () => {
    const secret = secretsManagerSecret({ secretId: "foo" });
    mock.addSecretString("foo", "bar");
    expect(secret.secretId).toBe("foo");
    expect(await secret.secretString).toBe("bar");
  });
});
