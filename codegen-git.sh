#!/bin/bash

set -euxo pipefail
date=$(date '+%Y-%m-%d')

if [ -n "$(git status --porcelain -- . ':(exclude)codegen/' ':(exclude)codegen-git.sh')" ]; then
  echo "your working git has ch-ch-chaaaanges outside codegen/, exiting"
  exit 1
fi

git checkout -B codegen-$date
npm run codegen

git add .

git commit -m "codegen: $date"

git push --force origin codegen-$date

gh pr create --title "Codegen: $date" --body "Codegen: $date"
