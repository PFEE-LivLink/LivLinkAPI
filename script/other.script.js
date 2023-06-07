const { leaf, runner, branch } = require('scriptease-cli');

leaf('build', async () => {
  await runner.npxExec('nest', ['build']);
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
