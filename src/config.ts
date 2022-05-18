import dotenv from 'dotenv';
dotenv.config();

//destructuring the env into the config
export default {
    port: parseInt(process.env.PORT as string, 10),
    POSTGRES_DB:
        process.env.ENV === 'dev'
            ? process.env.POSTGRES_DB
            : process.env.POSTGRES_DB_test,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    BCRYPT_PASS: process.env.BCRYPT_PASS,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    TOKEN_PASS: process.env.TOKEN_PASS,
};
