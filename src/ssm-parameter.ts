import { Parameter, ParameterProps } from './parameter';

export function ssmParameter(props: ParameterProps) {
  return new Parameter(props);
}
