import { IDatabase } from 'pg-promise';

export const table_name = 'products';
export const up = async (db: IDatabase<any>) => {
    await db.none(`
        CREATE TABLE ${ table_name } (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NULL,
            slug VARCHAR(255) NULL,
            sku VARCHAR(255) NULL,
            price DECIMAL(20, 2),
            description VARCHAR(255) NULL,
            username VARCHAR(255) NULL,
            images VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

export const down = async (db: IDatabase<any>) => {
    await db.none('DROP TABLE IF EXISTS products;');
};
