import { Request, ResponseToolkit } from '@hapi/hapi';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Boom from '@hapi/boom';
import {
    createProduct,
    updateProduct,
    readListProduct,
    readDetailProduct,
} from '../../repositories/products';

const DataPassing: object = {
    title: 'Product 1',
    slug: 'product-1',
    description: 'lorem ipsum sit dolor amet!',
    sku: 'asd',
    price: 10000,
    image: null
};

interface PropsDataPassing {
    title: string,
    slug?: string,
    description?: string,
    sku?: string,
    price?: number,
}

export const ReadList = async (request: Request, h: ResponseToolkit) => {
    const { query, size, page, sorted_by, order_by, usage } = request.query;
    const UserData = (request as any).UserData;
    const Username = (UserData?.username && (usage === 'private')) ? UserData?.username : null;
    
    const getData = await readListProduct({
        search: query,
        size: Number(size),
        page: Number(page),
        sort_by: sorted_by,
        order_by: order_by,
        username: Username,
    });

    return h.response(getData).code(200);
};

export const Create = async (request: Request, h: ResponseToolkit) => {
    const { title, slug, description, sku, price } = request.payload as PropsDataPassing;

    const UserData = (request as any).UserData;
    if ( UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized!');
    }

    // Images Handler
    const imageFile = (request.payload as any).images;
    let filelocation = null;
    if ( imageFile ) {
        const { hapi, ...fileData } = imageFile;
        const namefile = `${ Date.now() }${ hapi['headers']['content-type'].replace('image/', '.') }`;
        const filepath = path.join(__dirname, '../../public', namefile);
        const filestreams = fs.createWriteStream(filepath);
        await new Promise((resolve, reject) => {
            imageFile.pipe(filestreams);
            imageFile.on('error', reject);
            filestreams.on('finish', resolve);
        });
        
        filelocation = `/public/${ namefile }`;
    }

    const create = await createProduct({
        title: title,
        slug: slug || title?.replace(/ /g, '-'),
        description: description,
        sku: sku || uuidv4(),
        price: Number(price),
        images: `${filelocation}`,
        username: `${ UserData?.username }`,
    });

    return h.response({
        statusCode: 200,
        message: 'Successfull to create data!',
    }).code(200);
};

export const ReadDetail = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const getData = await readDetailProduct({ id: id });
    const DataPassing = {
        statusCode: 200,
        message: 'Successfull to get data!',
        data: getData,
    };

    return h.response(DataPassing).code(200);
};

export const Update = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const { title, slug, description, sku, price } = request.payload as PropsDataPassing;

    const UserData = (request as any).UserData;
    if ( UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized!');
    }

    const getData = await readDetailProduct({ id: id });
    if ( UserData?.username !== getData?.username && UserData.type !== 'admin' ) {
        throw Boom.unauthorized('Unauthorized, to update data!');
    }

    // Images Handler
    const imageFile = (request.payload as any).images;
    let filelocation = null;
    if ( imageFile ) {
        const { hapi, ...fileData } = imageFile;
        const namefile = `${ Date.now() }${ hapi['headers']['content-type'].replace('image/', '.') }`;
        const filepath = path.join(__dirname, '../../public', namefile);
        const filestreams = fs.createWriteStream(filepath);
        await new Promise((resolve, reject) => {
            imageFile.pipe(filestreams);
            imageFile.on('error', reject);
            filestreams.on('finish', resolve);
        });
        
        filelocation = `/public/${ namefile }`;

        const filepathexist = path.join(__dirname, '../../', getData.images);
        fs.readdir(path.join(__dirname, '../../public'), (err, files) => {
            if (err) console.log('Previous file is not found!');
            if (files) {
                const fileFound = files.find(file => file === getData.images?.replace('/public/', ''));
                if ( fileFound ) {
                    fs.unlink(filepathexist, (err) => {
                        if ( err ) console.log(err);
                        else console.log('Success remove previous files!');
                    });
                }
            }
        });
    }
    
    const update = await updateProduct({
        id: id,
        title: title || `${getData?.title}`,
        slug: slug || title?.replace(/ /g, '-'),
        description: description,
        sku: sku || uuidv4(),
        price: Number(price),
        images: `${filelocation}`,
    });

    return h.response({
        statusCode: 200,
        message: 'Successfull to update data!',
    }).code(200);
};

export const Delete = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    // Logic to delete product by id
    const data = {
        message: 'Hello from the controller!',
    };

    return h.response(data).code(200);
};

// CRUD banyak lebih dari 1 table
// masing" gerai 150cup per hari
// misalkan product

// 150 x 25.000 = 
