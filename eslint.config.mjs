import nextConfig from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'pnpm-lock.yaml',
      '.claude/**',
      '.opencode/**',
    ],
  },
  ...nextConfig,
];

export default eslintConfig;
