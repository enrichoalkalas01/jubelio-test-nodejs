import { ServerRoute } from '@hapi/hapi';
import { ReadList, Create, ReadDetail, Update, Delete } from '../../controllers/users/users';
// import { CheckAuthorization, VerifyAuthorization } from '../../../middlewares/jwt/token';

const userRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/users', // ini akan menjadi /api/v1/product
        handler: ReadList
    },
    {
        method: 'POST',
        path: '/users', // ini akan menjadi /api/v1/product
        // options: {
        //     pre: [
        //         { method: CheckAuthorization, assign: 'checkAuth' },
        //         { method: VerifyAuthorization, assign: 'verifyAuth' }
        //     ]
        // },
        handler: Create
    },
    {
        method: 'GET',
        path: '/users/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: ReadDetail
    },
    {
        method: 'PUT',
        path: '/users/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: Update
    },
    {
        method: 'DELETE',
        path: '/users/{id}', // ini akan menjadi /api/v1/product/{id}
        handler: Delete
    }
];

export default userRoutes;
