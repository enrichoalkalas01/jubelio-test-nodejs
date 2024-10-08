import { Request, ResponseToolkit } from '@hapi/hapi';
// import { generate as GRandom } from "randomstring";

const DataPassing: object = {
    title: 'Product 1',
    slug: 'product-1',
    description: 'lorem ipsum sit dolor amet!',
    sku: 'asd',
    price: 10000,
    image: null
};


export const ReadList = async (request: Request, h: ResponseToolkit) => {
    // Logic to read product list
    return h.response(DataPassing).code(200);
};

export const Create = async (request: Request, h: ResponseToolkit) => {
    const { title, slug, description, sku, price } = request.payload as { title: string, slug: string, description: string, sku: string, price: boolean }
    console.log(title, slug, description, sku, price)
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
