import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { branch, leaf, runner } from 'scriptease-cli';

const docDir = 'doc';

branch('doc', () => {
  leaf('generate', async () => {
    return await runner.run('doc:generate:redoc');
  });

  branch('generate', () => {
    leaf('open-api-yaml', async () => {
      if (!existsSync(docDir)) {
        mkdirSync(docDir, { recursive: true });
      }
      const openApiYaml = path.resolve(docDir, 'openapi.yaml');
      await runner.npxExec(
        'nest',
        ['start', '--', 'doc'],
        [
          { option: '-f', value: openApiYaml },
          { option: '-t', value: 'yml' },
        ],
        { argsAlign: 'LEFT' },
      );
      return openApiYaml;
    });
    leaf('redoc', async () => {
      const result = await runner.run('doc:generate:open-api-yaml');
      if (result.isKO()) {
        return result;
      }
      const openApiYaml = result.getPayload() as string;
      const redocPath = path.resolve(docDir, 'redoc.html');
      return await runner.npxExec('redocly', ['build-docs', openApiYaml], [{ option: '--output', value: redocPath }]);
    });
  });
});
