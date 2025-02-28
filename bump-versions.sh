#!/usr/bin/env bash
set -e

if [[ `git status --porcelain` ]];
then
    echo "There are still changes present. Please commit those before updating version."
    exit 1
fi

defaultBranch="master"
currentBranch=$(git branch --show-current)
if [[ ${currentBranch} != ${defaultBranch} ]];
then
    echo "Currently not on default branch. Please checkout ${defaultBranch} before retrying."
    exit 1
fi

# extract overaching package version
export VERSION=$(npm pkg get version | tr -d \")

# bump nodejs version
pushd packages/nodejs > /dev/null
npm version ${VERSION} --allow-same-version
popd > /dev/null

# bump csproj version
echo ${VERSION} | dotnet fsi bump-csproj-version.fsx

# commit the changes as a version commit
git add packages/
git commit -m "${VERSION}"

# git tag the version change commit
LATEST_GIT_SHA=$(git rev-parse HEAD)
git tag -a ${VERSION} ${LATEST_GIT_SHA} -m "${VERSION}"
