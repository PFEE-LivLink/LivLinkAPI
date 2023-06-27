import { readdirSync, rmSync, statSync } from 'fs';
import { branch, leaf, runner } from 'scriptease-cli';

leaf('build', async () => {
  await runner.npxExec('nest', ['build']);
  const fsObjs = readdirSync('dist/');
  for (const fsObj of fsObjs) {
    const isDirectory = statSync(`dist/${fsObj}`).isDirectory();
    if (fsObj !== 'src' && isDirectory) {
      rmSync(`dist/${fsObj}`, { recursive: true });
    }
  }
});

leaf('format', async () => {
  await runner.npxExec('prettier', ['"src/**/*.ts"', '"test/**/*.ts"'], [{ option: '--write' }]);
});

leaf('lint', async () => {
  await runner.npxExec('eslint', ['"{src,apps,libs,test}/**/*.ts"']);
});

branch('lint', () => {
  leaf('fix', async () => {
    await runner.npxExec('eslint', ['"{src,apps,libs,test}/**/*.ts"'], [{ option: '--fix' }]);
  });
});
