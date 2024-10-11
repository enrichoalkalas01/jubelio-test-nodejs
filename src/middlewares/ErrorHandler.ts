import { Request, ResponseToolkit } from '@hapi/hapi';
import moment from 'moment';

interface PropsErrorHandler {
    err: any,
    request: any,
    h: any,
}

export const errorHandler = ({ err, request, h }: PropsErrorHandler) => {
    // console.error(err);
    // console.log(err)

    console.log(err);

    // let statusCode = 500;
    // let errorMessageCustom = err.message;

    // // Jika ada status yang ditentukan dalam kesalahan
    // if (err.isBoom) {
    //     statusCode = err.output.statusCode;
    //     errorMessageCustom = err.output.payload.message || err.message;
    // }

    // const errResponse = {
    //     status: statusCode,
    //     statusCode: statusCode,
    //     statusText: `${errorMessageCustom} | ${err.name}`,
    //     message: errorMessageCustom || 'Internal Server Error',
    //     fetchDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    // };

    return h.response().code(400);
};
