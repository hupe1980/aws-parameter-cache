import { Parameter, ParameterProps } from './parameter';

export function ssmParameter(props: ParameterProps): Parameter {
  return new Parameter(props);
}
