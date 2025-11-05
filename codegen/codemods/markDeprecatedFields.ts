import type { Transform } from 'jscodeshift/src/core';

const deprecations = [
  {
    name: 'role',
    message: `Deprecated in favor of 'signingAs'`,
  },
];

const transform: Transform = (file, { j }) => {
  return j(file.source)
    .find(j.TSPropertySignature)
    .replaceWith(({ node }) => {
      for (const { name, message } of deprecations) {
        if (node.key.type == 'Identifier' && node.key.name === name) {
          node.comments ??= [];
          if (!node.comments.find(comment => comment.value.includes('@deprecated'))) {
            node.comments.push({
              type: 'Block',
              value: `* @deprecated("${message}") `,
              leading: true,
            });
          }
        }
      }

      return node;
    })
    .toSource();
};

export default transform;
export const parser = 'ts';
