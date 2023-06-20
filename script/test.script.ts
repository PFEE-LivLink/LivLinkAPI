import { branch, leaf, runner } from 'scriptease-cli';

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

branch('coveralls', () => {
  leaf('send', async () => {
    if (process.env.COVERALLS_REPO_TOKEN === undefined) {
      throw new Error('COVERALLS_REPO_TOKEN is not defined');
    }
    await runner.exec('cat ./coverage/lcov.info | npx coveralls');
  });
});
