import { Secret, SecretProps } from "./secret";

export const  secretsManagerSecret = (props: SecretProps): Secret => new Secret(props);

