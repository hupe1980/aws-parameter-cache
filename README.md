# aws-parameter-cache
![Build](https://github.com/hupe1980/aws-parameter-cache/workflows/build/badge.svg)
![Release](https://github.com/hupe1980/aws-parameter-cache/workflows/release/badge.svg)

> Parameter cache for AWS System Manager Parameter Store and AWS Secrets Manager

## Installation

```bash
npm install aws-parameter-cache @aws-sdk/client-ssm @aws-sdk/client-secrets-manager
```

## How to use

```typescript
import { ssmParameter } from 'aws-parameter-cache';

const param = ssmParameter({ name: 'foo' });
const value = await param.value;
```

### Secrets Manager Parameter

```typescript
// https://docs.aws.amazon.com/systems-manager/latest/userguide/integration-ps-secretsmanager.html
import { secretsManagerParameter } from 'aws-parameter-cache';

const param = secretsManagerParameter({ name: 'foo' });
const value = await param.value;
```
### Secrets Manager Secret

```typescript
import { secretsManagerSecret } from 'aws-parameter-cache';

const secret = secretsManagerSecret({ secretId: 'foo' });
const secretString = await secret.secretString;
```

### Cache invalidation

```typescript
const param = ssmParameter({ name: 'foo', maxAge: 1000 * 60 * 5 });
const value = await param.value;
```

### Force refresh

```typescript
const param = ssmParameter({ name: 'foo' });
const value = await param.value;

param.refresh();

const newValue = await param.value;
```

### StringList (SSM Parameter)
```typescript
const param = ssmParameter({ name: 'fooList' }); // XXX,YYY,ZZZ
const valueArray = await param.value; // ['XXX','YYY','ZZZ']

valueArray.forEach(console.log)
```

### Usage with AWS Lambda
```typescript
const param = ssmParameter({ name: 'name' });

export const handler =  async (event, context) => {
  const value = await param.value
  return `Hello ${value}`
}

```

## IAM (SSM Parameter)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameter"
            ],
            "Resource": "arn:aws:ssm:<REGION>:<ACCOUNT_ID>:parameter/<PARAMETER_NAME>"
        },
        {
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt"
            ],
            "Resource": "arn:aws:kms:<REGION>:<ACCOUNT_ID>:alias/aws/ssm"
        }
    ]
}
```

## License

[MIT](LICENSE)
