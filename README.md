# StoreBackend with node

## Download the following
-   Download and install [PostgreSql](https://www.postgresql.org/download/)
-   Download and install [node.js](https://nodejs.org/en/)


## check the REQUIREMENTS.md 
- in this file you will find all the routes in the api 
 and how to create user and token to use for all the rest of the routes

## Database 
- after downloading PostgreSql and install it 

open the default postgres user by running this command in the terminal
```sql
psql -U postgres
```
and write your password u created in the installation.

after connecting to the default postgres user 

run this command 
```sql
CREATE DATABASE store_dev;
CREATE DATABASE store_test;
```
now you are ready to start the project


## to start the project 

 build the server and connect to the database
 
```bash
npm run initialize   
```

- Start the server to start using the api

```bash
npm run jsStart
```

## Environment Variables

-  you need to create .env file and put this inside it
    PORT = 3000
    
    ENV = dev
    
    POSTGRES_HOST = localhost
    
    POSTGRES_PORT = 5432
    
    POSTGRES_DB = store_dev
    
    POSTGRES_DB_test = store_test
    
    POSTGRES_USER = postgres
    
    POSTGRES_PASSWORD = 123123pass
    
    BCRYPT_PASS = ThisIsTotalyNotAPassWord
    
    TOKEN_PASS = ThisIsTotalyNotAPassWord
    
    SALT_ROUNDS = 11

## ports server and postgres
server running on port `3000` 
PSQL running on port `5432`


## Scripts

#### To run db-migrate up to start the migration
```bash
npm run migration:stop
```
#### To run db-migrate down to stop the migration
```bash
npm run migration:stop
```

#### To run jasmine tests
```bash
npm run unit_test
```


### to use prettier and eslint for better code formatting
```bash
npm run clean
```

#### To run the nodemon to watch for any changes in the dev phase
```bash
npm run dev
```


#### To build the project
```bash
npm run build
```
