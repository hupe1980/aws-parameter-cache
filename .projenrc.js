const { TypeScriptProject, UpgradeDependenciesSchedule } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'aws-parameter-cache',
  description: 'Parameter cache for AWS System Manager Parameter Store and AWS Secrets Manager',
  keywords: [
    'aws',
    'aws-sdk',
    'aws-sdk-v3',
    'aws-client',
    'ssm',
    'aws-ssm',
    'cache',
    'secrests-manager',
    'parameter-store',
  ],
  repository: 'https://github.com/hupe1980/aws-parameter-cache.git',
  license: 'MIT',
  copyrightOwner: 'Frank Hübner',
  majorVersion: 2,
  releaseToNpm: true,
  devDeps: ['@aws-sdk/client-secrets-manager', '@aws-sdk/client-ssm', 'jest-aws-client-mock'],
  peerDeps: ['@aws-sdk/client-secrets-manager', '@aws-sdk/client-ssm'],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: 'AUTOMATION_GITHUB_TOKEN',
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['hupe1980'],
  },
});
project.gitignore.exclude('.DS_Store');
project.synth();