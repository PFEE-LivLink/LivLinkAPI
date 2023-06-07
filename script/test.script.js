const { leaf, runner, branch } = require('scriptease-cli');

leaf('test', async () => {
  await runner.npxExec('jest', [], [{ option: '--passWithNoTests' }]);
});

branch('test', () => {
  leaf('watch', async () => {
    await runner.npxExec('jest', [], [{ option: '--watch' }]);
  });
  leaf('cov', async () => {
    await runner.npxExec('jest', [], [{ option: '--coverage' }]);
  });
  leaf('e2e', async () => {
    await runner.npxExec('jest', [], [{ option: '--config', value: './test/jest-e2e.json' }]);
  });
});
