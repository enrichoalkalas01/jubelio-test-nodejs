import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import Bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { validationHandler } from '../../middlewares/ValidationHandler';
import {
    readLoginUser,
    createUser,
    updateUser,
    readDetailUser,
    
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

interface PropsDataPassing {
    username: string,
    firstname?: string,
    lastname?: string,
    phonenumber?: string,
    password: string,
    email: string,
    type?: "user" | "admin",
}

export const ReadList = async (request: Request, h: ResponseToolkit) => {
    const { query, size, page, sorted_by, order_by, usage } = request.query;
    const UserData = (request as any).UserData;
    const Username = (UserData?.username && (usage === 'private')) ? UserData?.username : null;
    
    const getData = await readListUser({
        search: query,
        size: Number(size),
        page: Number(page),
        sort_by: sorted_by,
        order_by: order_by,
    });

    return h.response(getData).code(200);
};

export const Create = async (request: Request, h: ResponseToolkit) => {
    const { username, firstname, lastname, phonenumber, password, email, type } = request.payload as PropsDataPassing;

    const UserData = (request as any).UserData;
    if ( UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized!');
    }

    const create = await createUser({
        username: username,
        firstname: firstname || null,
        lastname: lastname || null,
        phonenumber: phonenumber || null,
        password: await Bcrypt.hash(`${password}`, 10),
        email: email,
        type: type || "user",
    });

    return h.response({
        statusCode: 200,
        message: 'Successfull to create data!',
    }).code(200);
};

export const ReadDetail = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const getData = await readDetailUser({ id: id });
    const DataPassing = {
        statusCode: 200,
        message: 'Successfull to get data!',
        data: getData,
    };

    return h.response(DataPassing).code(200);
};

export const Update = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const { username, firstname, lastname, phonenumber, password, email, type } = request.payload as PropsDataPassing;

    const UserData = (request as any).UserData;
    if ( UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized!');
    }

    let getData = await readDetailUser({ id: id })

    let update = updateUser({
        id: id,
        username: username || getData?.username,
        firstname: firstname || getData?.firstname,
        lastname: lastname || getData?.lastname,
        phonenumber: phonenumber,
        email: email || getData?.email,
        password: password ? await Bcrypt.hash(`${password}`, 10) : getData?.password,
        type: type || getData?.type,
    })

    return h.response({
        statusCode: 200,
        message: 'Successfull to update data!',
    }).code(200);
};

export const Delete = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    const UserData = (request as any).UserData;
    const getData = await readDetailUser({ id: id });
    if ( !getData ) {
        throw Boom.badRequest('Data is not exist!');
    }
    
    if ( UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized, to update data!');
    }

    let deleteData = await deleteUser({ id: id })

    return h.response({
        statusCode: 200,
        message: 'Successfull to delete data!'
    }).code(200);
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