import { IDatabase } from 'pg-promise';

export const table_name = 'users';
export const up = async (db: IDatabase<any>) => {
    await db.none(`
        CREATE TABLE ${ table_name } (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            firstname VARCHAR(255) NULL,
            lastname VARCHAR(255) NULL,
            phonenumber VARCHAR(255) NULL,
            password VARCHAR(255) NULL,
            email VARCHAR(255) NULL,
            type VARCHAR(50) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

export const down = async (db: IDatabase<any>) => {
    await db.none('DROP TABLE IF EXISTS users;');
};
