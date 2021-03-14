import { Secret, SecretProps } from "./secret";

export function secretsManagerSecret(props: SecretProps): Secret {
  return new Secret(props);
}
