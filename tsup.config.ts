import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server/index.ts'],
  format: ['esm'],
  outDir: 'dist/server',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  noExternal: [],
});
