# Releasing

After having merged new commits - either via PR or directly on default branch - run the following NPM scripts on default branch to publish new version tags:

```sh
npm version <major | minor | patch>
npm run tag
```

The commit log should now contain the updated `Criipto.Signatures.csproj` and `package.json` version.
When the commit log is satisfying, the version commit and tags can then be pushed by `npm run tag:post`, which ensures that the commits and tag is pushed to remote.
