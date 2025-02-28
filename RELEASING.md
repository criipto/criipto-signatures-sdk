# Releasing

Releasing a new version of the SDKs are divided in two steps:

1. Tag changes
2. Create release

The process aims to eliminate human interaction and reduce point-of-failures (or rather, remember what to do and when).

## Tagging

After having merged new commits - either via PR or directly on default branch - run the following NPM scripts on default branch to publish new version tags:

```sh
npm version <major | minor | patch>
npm run tag
```

The commit log should now contain the updated `Criipto.Signatures.csproj` and `package.json` version.
When the commit log is satisfying, the version commit and tags can then be pushed by `npm run tag:post`, which ensures that the commits and tag is pushed to remote.

## Create release

Whenever the changes have been tagged and is ready to be released, a release needs to be created in GitHub, which in turn will perform the necessary steps to push the SDKs to their respective package sources.

The release changelog **should** contain the changes in a presentable fashion to help the users understand the update.

The [`publish.yml` workflow](.github/workflows/publish.yml) takes care of the necessary technicalities.
