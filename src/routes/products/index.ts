import Hapi, { ServerRoute } from '@hapi/hapi';
import { ReadList, Create, ReadDetail, Update, Delete } from '../../controllers/products/products';
import { CheckAuthorization, ParseAuthorization } from '../../middlewares/JsonwebtokenHandler';

const productRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/products',
        options: {
            pre: [{ method: ParseAuthorization }]
        },
        handler: ReadList
    },
    {
        method: 'POST',
        path: '/products',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
            payload: {
                output: 'stream',
                allow: 'multipart/form-data',
                maxBytes: 10 * 1024 * 1024, // Set file size limit (10MB)
                multipart: true,
            },
        },
        handler: Create
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
            payload: {
                output: 'stream',
                allow: 'multipart/form-data',
                maxBytes: 10 * 1024 * 1024, // Set file size limit (10MB)
                multipart: true,
            },
        },
        handler: Update
    },
    {
        method: 'delete',
        path: '/products/{id}',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
        },
        handler: Delete
    },
    {
        method: 'GET',
        path: '/products/{id}',
        handler: ReadDetail
    }
];

export default productRoutes;
