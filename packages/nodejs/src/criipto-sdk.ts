// Required at runtime rather than imported, so tsc keeps src/ as the root of dist/.
const { version } = require('../package.json') as { version: string };

export const criiptoSdk = `criipto-signatures-nodejs@${version}`;
