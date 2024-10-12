import Boom from '@hapi/boom';
import db from '../models/db';

interface PropsUsers {
    id?: string | number,
    username: string,
    firstname?: string | null,
    lastname?: string | null,
    phonenumber?: string | null,
    password: string,
    email?: string,
    type?: string,
}

export const createUser = async ({ username, firstname, lastname, phonenumber, password, email, type }: PropsUsers) => {
    try {
        await db.none('INSERT INTO users(username, firstname, lastname, phonenumber, password, email, type) VALUES($1, $2, $3, $4, $5, $6, $7)', 
            [username, firstname, lastname, phonenumber, password, email, type]);
        return { status: true, message: 'User added successfully.' };
    } catch (error: any) {
        let message: string | null = null;
        if (error?.code === '23505') {
            message = 'User data already exists!';
        }
        throw Boom.badRequest(`Failed, ${message}`);
    }
};

export const updateUser = async ({ id, username, firstname, lastname, phonenumber, password, email, type }: PropsUsers) => {
    try {
        await db.none('UPDATE users SET username = $1, firstname = $2, lastname = $3, phonenumber = $4, password = $5, email = $6, type = $7 WHERE id = $8', 
            [username, firstname, lastname, phonenumber, password, email, type, id]);
        return { status: true, message: 'User updated successfully.' };
    } catch (error: any) {
        throw Boom.badRequest(`Failed, ${error.message}`);
    }
};

export const readListUser = async ({ search, page, size, sort_by, order_by }: { search?:string, page?:number, size?:number, sort_by?:string, order_by?:string }) => {
    try {
        const Query = search || '';
        const Page = Number(page) || 1;
        const Size = Number(size) || 5;
        const Offset = (Page - 1) * Size;
        const OrderBy = order_by ? order_by : 'desc';
        const SortBy = sort_by ? sort_by : 'id';

        const user = await db.any(`
            SELECT * 
            FROM users 
            WHERE firstname ILIKE '%$1:value%'
            OR lastname ILIKE '%$1:value%'
            OR email ILIKE '%$1:value%'
            ORDER BY $2:name $3:raw
            LIMIT $4
            OFFSET $5
        `, [Query, SortBy, OrderBy, Size, Offset]);

        const total = await db.one(`
            SELECT COUNT(*) 
            FROM users 
            WHERE firstname ILIKE '%$1:value%'
            OR lastname ILIKE '%$1:value%'
            OR email ILIKE '%$1:value%'
        `, [Query]);

        const DataPassing = {
            pagination: {
                query: Query,
                page: Page,
                size: Size,
                offset: Offset,
                order_by: OrderBy,
                sort_by: SortBy,
                total_data: Number(total?.count) || 0,
                total: user?.length,
            },
            data: user,
        };

        return DataPassing;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve users: ${error.message}`);
    }
};

export const readDetailUser = async ({ id }: { id: number }) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (!user) {
            throw Boom.badRequest('User data does not exist!');
        }
        return user;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve user: ${error.message}`);
    }
};

export const deleteUser = async ({ id }: { id: number }) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (!user) {
            throw Boom.badRequest('User data does not exist!');
        }

        await db.none('DELETE FROM users WHERE id = $1', [id]);
        return { status: true, message: 'User deleted successfully.' };
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed, ${error.message}`);
    }
};

export const readLoginUser = async ({ username }: { username: string }) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
        if (!user) {
            throw Boom.badRequest('User data does not exist!');
        }
        return user;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve user: ${error.message}`);
    }
};