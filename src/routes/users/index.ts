import { ServerRoute } from '@hapi/hapi';
import {
    ReadList,
    Create,
    ReadDetail,
    Update,
    Delete,
    UserRegistration,
    UserLogin,
} from '../../controllers/users/users';

import { CheckAuthorization } from '../../middlewares/JsonwebtokenHandler';

const userRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/register',
        handler: UserRegistration
    },
    {
        method: 'POST',
        path: '/login',
        handler: UserLogin
    },
    {
        method: 'GET',
        path: '/users',
        options: {
            pre: [{ method: CheckAuthorization }]
        },
        handler: ReadList
    },
    {
        method: 'POST',
        path: '/users',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
        },
        handler: Create
    },
    {
        method: 'PUT',
        path: '/users/{id}',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
        },
        handler: Update
    },
    {
        method: 'delete',
        path: '/users/{id}',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
        },
        handler: Delete
    },
    {
        method: 'GET',
        path: '/users/{id}',
        options: {
            pre: [
                { method: CheckAuthorization }
            ],
        },
        handler: ReadDetail
    }
];

export default userRoutes;
