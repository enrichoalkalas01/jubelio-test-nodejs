import Boom from '@hapi/boom';
import db from '../models/db';

interface PropsProducts {
    id?: number | string,
    title: string,
    slug?: string,
    description?: string,
    sku?: string,
    price?: number,
    images?: string,
    username?: string,
}

export const createProduct = async ({ title, slug, description, sku, price, images, username }: PropsProducts) => {
    try {
        await db.none('INSERT INTO products(title, slug, description, sku, price, images, username) VALUES($1, $2, $3, $4, $5, $6, $7)', 
            [title, slug, description, sku, price, images, username]);
        return { status: true, message: 'product added successfully.' };
    } catch (error: any) {
        let message: string | null = null;
        message = error.message;
        throw Boom.badRequest(`Failed, ${message}`);
    }
};

export const updateProduct = async ({ id, title, slug, description, sku, price, images, username }: PropsProducts) => {
    try {
        await db.none('UPDATE products SET title = $1, slug = $2, description = $3, sku = $4, price = $5, images = $6 WHERE id = $7', 
            [title, slug, description, sku, price, images, id]);
        return { status: true, message: 'product updated successfully.' };
    } catch (error: any) {
        throw Boom.badRequest(`Failed, ${error.message}`);
    }
};

export const readListProduct = async ({ search, page, size, sort_by, order_by, username }: { search?:string, page?:number, size?:number, sort_by?:string, order_by?:string, username?:string }) => {
    try {
        const Query = search || '';
        const Page = Number(page) || 1;
        const Size = Number(size) || 5;
        const Offset = (Page - 1) * Size;
        const OrderBy = order_by ? order_by : 'desc';
        const SortBy = sort_by ? sort_by : 'id';
        const Username = username || '';

        const products = await db.any(`
            SELECT * 
            FROM products 
            WHERE title ILIKE '%$1:value%'
            ${Username ? 'AND username ILIKE \'%$6:value%\'' : ''}
            ORDER BY $2:name $3:raw
            LIMIT $4
            OFFSET $5
        `, [Query, SortBy, OrderBy, Size, Offset, Username]);

        const total = await db.one(`
            SELECT COUNT(*) 
            FROM products 
            ${
    Username && Query ? 
        'WHERE username ILIKE \'%$1:value%\' AND title ILIKE \'%$2:value%\'' :
        Username ? 
            'WHERE username ILIKE \'%$1:value%\'' :
            Query ? 
                'WHERE title ILIKE \'%$1:value%\'' :
                ''
}
        `, Username && Query ? [Username, Query] : [Username || Query]);

        const DataPassing = {
            pagination: {
                query: Query,
                page: Page,
                size: Size,
                offset: Offset,
                order_by: OrderBy,
                sort_by: SortBy,
                total_data: Number(total?.count) || 0,
                total: products?.length,
            },
            data: products,
        };

        return DataPassing;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve products: ${error.message}`);
    }
};

export const readDetailProduct = async ({ id }: { id: number }) => {
    try {
        const product = await db.oneOrNone('SELECT * FROM products WHERE id = $1', [id]);
        if (!product) {
            throw Boom.badRequest('product data does not exist!');
        }
        return product;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve product: ${error.message}`);
    }
};

export const deleteProduct = async ({ id }: { id: number }) => {
    try {
        const product = await db.oneOrNone('SELECT * FROM products WHERE id = $1', [id]);
        if (!product) {
            throw Boom.badRequest('product data does not exist!');
        }

        await db.none('DELETE FROM products WHERE id = $1', [id]);
        return { status: true, message: 'product deleted successfully.' };
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed, ${error.message}`);
    }
};

export const readLoginProduct = async ({ productname }: { productname: string }) => {
    try {
        const product = await db.oneOrNone('SELECT * FROM products WHERE productname = $1', [productname]);
        if (!product) {
            throw Boom.badRequest('product data does not exist!');
        }
        return product;
    } catch (error: any) {
        console.error(error);
        throw Boom.badRequest(`Failed to retrieve product: ${error.message}`);
    }
};