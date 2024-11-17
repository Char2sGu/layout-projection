import { execSync } from 'node:child_process';
import { argv } from 'node:process';
import { releaseVersion } from 'nx/release/index.js';
import { simpleGit } from 'simple-git';

main();

async function main() {
  const [, , specifier, preid] = argv;
  if (!specifier) throw new Error('Missing required arguments');

  /**@type {import('nx/src/command-line/release/command-object').VersionOptions} */
  const options = { specifier };
  if (preid) {
    options.specifier = 'pre' + options.specifier;
    options.preid = preid;
  }

  const version = await releaseVersion({
    /**@satisfies {import('nx/src/command-line/release/version').ReleaseVersionGeneratorSchema } */
    generatorOptionsOverrides: {
      // The built-in lock file update is problematic and brings tons of
      // irrelevant changes.
      skipLockFileUpdate: true,
    },
    ...options,
  }).then((r) => r.workspaceVersion);

  execSync('npm install --package-lock-only');

  const repository = simpleGit();
  await repository
    .add('package-lock.json')
    .commit(`build(release): v${version}`)
    .addAnnotatedTag(`v${version}`, `Release v${version}`);
}
