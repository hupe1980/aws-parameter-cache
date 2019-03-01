# aws-parameter-cache

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

## License

[MIT](LICENSE)
