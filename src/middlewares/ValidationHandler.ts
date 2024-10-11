import Boom from '@hapi/boom';
import FastestValidator from 'fastest-validator';

const val = new FastestValidator();

export const validationHandler = ({ request, schemaValidation }: { request: any, schemaValidation: any }) => {
    if ( !request.payload ) {
        throw Boom.badRequest('Unexpected Input');
    }

    const validationResponse = val.validate(request.payload, schemaValidation);
    if (validationResponse !== true) {
        throw Boom.badRequest('Invalid input body', validationResponse);
    }
};