import { execSync } from 'node:child_process';
import { argv } from 'node:process';
import {
  releaseVersion,
  releaseChangelog,
  releasePublish,
} from 'nx/release/index.js';
import { simpleGit } from 'simple-git';

main().then(() => process.exit(0));

async function main() {
  const [, , specifier, preid] = argv;
  if (!specifier) throw new Error('Missing required arguments');

  const repository = simpleGit();

  const version = await releaseVersion({
    ...(preid
      ? {
          specifier: 'pre' + specifier,
          preid,
        }
      : {
          specifier,
        }),
    /**@satisfies {import('nx/src/command-line/release/version').ReleaseVersionGeneratorSchema } */
    generatorOptionsOverrides: {
      // The built-in lock file update is problematic and brings tons of
      // irrelevant changes.
      skipLockFileUpdate: true,
    },
    gitCommit: false,
    gitTag: false,
  }).then((r) => r.workspaceVersion);

  execSync('npm install --package-lock-only');
  await repository.add('package-lock.json');

  await releaseChangelog({
    version,
    gitCommit: false,
    gitTag: false,
  });

  await repository.add('CHANGELOG.md');

  await repository
    .commit(`build(release): v${version}`)
    .addAnnotatedTag(`v${version}`, `Release v${version}`);

  await releasePublish({ access: 'public' });
}
