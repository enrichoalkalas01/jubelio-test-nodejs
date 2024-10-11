import Boom from '@hapi/boom';
import db from '../models/db';

interface PropsUsers {
    username: string,
    firstname?: string,
    lastname?: string,
    phonenumber?: string,
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

export const updateUser = async (id: number, { username, firstname, lastname, phonenumber, password, email, type }: PropsUsers) => {
    try {
        await db.none('UPDATE users SET username = $1, firstname = $2, lastname = $3, phonenumber = $4, password = $5, email = $6, type = $7 WHERE id = $8', 
            [username, firstname, lastname, phonenumber, password, email, type, id]);
        return { status: true, message: 'User updated successfully.' };
    } catch (error: any) {
        throw Boom.badRequest(`Failed, ${error.message}`);
    }
};

export const readListUser = async () => {
    try {
        const users = await db.any('SELECT * FROM users');
        return users;
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