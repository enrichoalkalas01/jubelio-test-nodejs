import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import Bcrypt from 'bcryptjs';
import db from '../../models/db';

import { validationHandler } from '../../middlewares/ValidationHandler';
import {
    createUser,
    updateUser,
    readDetailUser,
    readLoginUser,
    readListUser,
    deleteUser,
} from '../../repositories/users';
import { CreateTokenJWT } from '../../middlewares/JsonwebtokenHandler';

interface PropsUsers {
    username: string,
    firstname?: string,
    lastname?: string,
    phonenumber?: string,
    password: string,
    email?: string,
    type?: string,
}

const schema = {
    username: { type: 'string', min: 3, max: 30, optional: false },
    firstname: { type: 'string', min: 3, max: 30, optional: true },
    lastname: { type: 'string', min: 3, max: 30, optional: true },
    phonenumber: { type: 'string', optional: true },
    password: { type: 'string', min: 4, max: 100, optional: false },
    email: { type: 'string', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, optional: true },
    type: { type: 'string', optional: true }
};

export const ReadList = async (request: Request, h: ResponseToolkit) => {
    // Logic to read product list
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

export const Create = async (request: Request, h: ResponseToolkit) => {
    // Logic to create a product
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

export const ReadDetail = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    // Logic to read product detail by id
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

export const Update = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    // Logic to update product by id
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

export const Delete = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    // Logic to delete product by id
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

export const UserRegistration = async (request: Request, h: ResponseToolkit) => {
    // Validation Input
    validationHandler({ request: request, schemaValidation: schema });

    const { username, firstname, lastname, phonenumber, password, email, type } = request.payload as PropsUsers;
    const DataPassing = {
        username: username,
        firstname: firstname || null,
        lastname: lastname || null,
        phonenumber: phonenumber || null,
        password: await Bcrypt.hash(`${password}`, 10),
        email: email || null,
        type: 'user'
    } as PropsUsers;

    const create = await createUser(DataPassing);
    
    return h.response({
        statusCode: 200,
        message: 'Successfull to register!',
    }).code(200);
};

export const UserLogin = async (request: Request, h: ResponseToolkit) => {
    // Validation Input
    validationHandler({ request: request, schemaValidation: schema });

    const { username, password } = request.payload as PropsUsers;
    const getData = await readLoginUser({ username: username });
    
    const checkPassword = await Bcrypt.compare(password, getData?.password);
    if ( !checkPassword ) {
        throw Boom.badRequest('Username / Password is not match!');
    }

    const createToken = await CreateTokenJWT({
        token_type: 'access_token',
        expired_type: 'hours',
        expired_number: 6,
        user_data: {
            username: getData?.username,
            type: getData?.type,
            email: getData?.email,
        }
    });

    const createRefreshToken = await CreateTokenJWT({
        token_type: 'refresh_token',
        expired_type: 'hours',
        expired_number: 1,
        user_data: {
            username: getData?.username,
            type: getData?.type,
            email: getData?.email,
        }
    });

    const DataPassing = {
        username: getData?.username,
        firstname: getData?.firstname,
        lastname: getData?.lastname,
        phonenumber: getData?.phonenumber,
        email: getData?.email,
        access_token: createToken,
        refresh_token: createRefreshToken,
    };

    return h.response({
        statusCode: 200,
        message: 'Successfull to register!',
        data: DataPassing,
    }).code(200);
};