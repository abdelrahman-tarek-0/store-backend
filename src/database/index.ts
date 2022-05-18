import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    max: 100,
    port: parseInt(config.POSTGRES_PORT as string, 10),
});
pool.on('error', (error: Error) => {
    throw new Error('Error connecting to database: ' + error.message);
});
export default pool;
