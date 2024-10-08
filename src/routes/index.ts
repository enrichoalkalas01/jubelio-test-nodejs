import { ServerRoute } from '@hapi/hapi';
import userRoutes from './users';
import productRoutes from './products';

const extRoutes: any[] = [];
userRoutes.map((route) => extRoutes.push({ ...route, path: `/api/v1${route.path}` }));
productRoutes.map((route) => extRoutes.push({ ...route, path: `/api/v1${route.path}` }));

export const routes: ServerRoute[] = extRoutes.map((route) => ({ ...route }));