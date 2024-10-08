import { Request, ResponseToolkit } from '@hapi/hapi';

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
