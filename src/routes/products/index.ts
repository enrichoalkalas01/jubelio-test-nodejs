import { ServerRoute } from '@hapi/hapi';
import { ReadList, Create, ReadDetail, Update, Delete } from '../../controllers/products/products';

const productRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/products', // ini akan menjadi /api/v1/product
        handler: ReadList
    },
    {
        method: 'POST',
        path: '/products', // ini akan menjadi /api/v1/product
        options: {
            payload: {
                output: 'stream',
                allow: 'multipart/form-data',
                maxBytes: 10 * 1024 * 1024, // Set file size limit (10MB)
                multipart: true,
            },
            // pre: [
            //     { method: CheckAuthorization, assign: 'checkAuth' },
            //     { method: VerifyAuthorization, assign: 'verifyAuth' }
            // ]
        },
        handler: Create
    },
    {
        method: 'GET',
        path: '/products/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: ReadDetail
    },
    {
        method: 'PUT',
        path: '/products/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: Update
    },
    {
        method: 'DELETE',
        path: '/products/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: Delete
    }
];

export default productRoutes;
