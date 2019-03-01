import { Parameter, ParameterProps } from './parameter';

const PREFIX = '/aws/reference/secretsmanager/';

export function secretsManagerParameter(props: ParameterProps) {
  if (!props.name.startsWith(PREFIX)) {
    props.name = PREFIX + props.name;
  }
  return new Parameter(props);
}
