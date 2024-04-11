import * as esbuild from 'esbuild'
//esbuild --bundle --minify  --outfile=./dist/api.js  --platform=node --target=node20 ./src/functions/api.ts
await esbuild.build({

  bundle: true,
  minify: true,
  
  outdir: './dist',
  platform: 'node',
  target: 'node20',
  entryPoints: ['./src/functions/api.ts', './src/functions/ws.ts'],

})