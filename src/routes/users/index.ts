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
        handler: ReadList
    },
    
    // {
    //     method: 'POST',
    //     path: '/users'
    //     // options: {
    //     //     pre: [
    //     //         { method: CheckAuthorization, assign: 'checkAuth' },
    //     //         { method: VerifyAuthorization, assign: 'verifyAuth' }
    //     //     ]
    //     // },
    //     handler: Create
    // },
    // {
    //     method: 'GET',
    //     path: '/users/{id}',
    //     handler: ReadDetail
    // },
    // {
    //     method: 'PUT',
    //     path: '/users/{id}',
    //     handler: Update
    // },
    // {
    //     method: 'DELETE',
    //     path: '/users/{id}',
    //     handler: Delete
    // }
];

export default userRoutes;
