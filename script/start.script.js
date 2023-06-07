const { leaf, runner, branch } = require('scriptease-cli');

leaf('start', async () => {
  await runner.npxExec('nest', ['start']);
});

branch('start', () => {
  leaf('dev', async () => {
    await runner.npxExec('nest', ['start'], [{ option: '--watch' }], { argsAlign: 'LEFT' });
  });
});
