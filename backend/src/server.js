import app from './app.js';
import { pool } from './config/db.js';
import { env } from './config/env.js';

pool.query('SELECT 1').then(() => {
  app.listen(env.port, () => {
    console.log(`Ainewpartour API running on port ${env.port}`);
  });
});
