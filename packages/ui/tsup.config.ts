import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // your main exports
  format: ['esm'], // or ['esm', 'cjs'] if needed
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
  loader: {
    '.css': 'css' // allow CSS imports
  }
})