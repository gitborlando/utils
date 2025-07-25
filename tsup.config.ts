import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/node/index.ts',
    'src/script/index.ts',
    'src/react/index.ts',
  ],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,
  external: [],
})
