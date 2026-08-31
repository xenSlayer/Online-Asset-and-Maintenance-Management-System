import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { default: app } = require('../../backend/dist/app.js');

export default app;
