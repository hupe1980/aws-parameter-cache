import { Parameter, ParameterProps } from "./parameter";

export const  ssmParameter = (props: ParameterProps): Parameter => new Parameter(props);
