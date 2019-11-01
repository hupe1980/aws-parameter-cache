# aws-parameter-cache

[![Build Status](https://travis-ci.org/hupe1980/aws-parameter-cache.svg?branch=master)](https://travis-ci.org/hupe1980/aws-parameter-cache)

> Parameter cache for AWS System Manager Parameter Store and AWS Secrets Manager

## Installation

```bash
npm install --save aws-parameter-cache
```

## How to use

```javascript
import { ssmParameter } from 'aws-parameter-cache';

const param = ssmParameter({ name: 'foo' });
const value = await param.value;
```

### Secrets Manager Parameter

```javascript
import { secretsManagerParameter } from 'aws-parameter-cache';

const param = secretsManagerParameter({ name: 'foo' });
const value = await param.value;
```

### Cache invalidation

```javascript
const param = ssmParameter({ name: 'foo', maxAge: 1000 * 60 * 5 });
const value = await param.value;
```

### Force refresh

```javascript
const param = ssmParameter({ name: 'foo' });
const value = await param.value;

param.refresh();

const newValue = await param.value;
```

### StringList
```javascript
const param = ssmParameter({ name: 'fooList' });
const valueArray = await param.value;

valueArray.map(console.log)
```

## IAM
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
