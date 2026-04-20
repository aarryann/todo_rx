import assert from 'node:assert';
import { compilePage } from '../src/cli/compilePage.js';
import fs from 'node:fs/promises';
import path from 'node:path';

describe('staticload feature', function(){
  it('expands staticload into todo-list-src and pipelines generated', async function(){
    const manifest = { pages: ['example-app/src/index.html'], outDir: 'example-app/dist', loadersFile: 'src/loaders/index.js' };
    await compilePage('example-app/src/index.html', manifest);
    const outIndex = await fs.readFile(path.join(manifest.outDir,'index.html'),'utf8');
    assert.ok(outIndex.includes('id="todo-list"') || outIndex.includes('data-rx-for'), 'index should contain todo-list placeholder');
    const pipelines = await fs.readFile(path.join(manifest.outDir,'pipelines.js'),'utf8');
    assert.ok(pipelines.includes('window.__MICRORX_PIPELINES__'), 'pipelines should be generated');
  });
});

//node --test test/staticload.test.js

/*
# make CLI executable
chmod +x src/cli/index.js

# run compiler (uses package.json microrx manifest or default)
node src/cli/index.js

# or compile single page via small script invoking compilePage
node -e "import('./src/cli/compilePage.js').then(m=>m.compilePage('example-app/src/index.html', { outDir: 'example-app/dist', loadersFile:'src/loaders/index.js'}))"

# serve dist
cd example-app/dist
npx serve -p 3000

*/