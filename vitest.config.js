import { configDefaults, defineConfig } from 'vitest/config'


export default defineConfig({
  test: {
    include:[
      'tests/*'
    ],
    exclude:[
      ...configDefaults.exclude,
      '*'
    ],
    coverage: {
      reporter: ['lcov', 'json', 'text', 'html', 'clover'],
      all: true,
      exclude: [
        '**/*.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/node_modules/**',
      ],
      include: [
        'dist/*'
      ]
    },
  },
});
