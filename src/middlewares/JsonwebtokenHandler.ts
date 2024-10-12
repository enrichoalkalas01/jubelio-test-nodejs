import JWT from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

export const getFutureDate = ({ expiredType, value }:{ expiredType: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years', value: number }) => {
    const futureDate = moment().add(value, expiredType);
    return {
        formattedDate: futureDate.format('YYYY-MM-DD HH:mm:ss'),
        milliseconds: futureDate.valueOf()
    };
};

export const CryptoEncrypter = ({ textData }: { textData: string }) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(`${process.env.SECRET_KEY}`, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(textData, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    
    return { iv: iv.toString('hex'), encryptedText: encrypted };
};

export const CryptoDecrypter = ({ textCode, iv }: { textCode: string, iv: string }) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(`${process.env.SECRET_KEY}`, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(textCode, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

interface PropsCreateJWT {
    user_data: any,
    token_type: string,
    expired_type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years',
    expired_number: number,
}

export const CreateTokenJWT = async ({
    user_data, token_type, expired_type, expired_number
}: PropsCreateJWT) => {
    try {
        const UserData = {
            username: user_data?.username || null,
            email: user_data?.email || null,
            type: user_data?.type || null,
        };

        const createCrypter = CryptoEncrypter({ textData: JSON.stringify(UserData) });
        const sourceFromEncrypt = await bcrypt.hash(token_type, 10);
        const tokenExpired = getFutureDate({ expiredType: expired_type || 'hours', value: expired_number || 1 });
        const createToken = JWT.sign({
            exp: tokenExpired?.milliseconds,
            sub: createCrypter?.encryptedText,
            usiv: createCrypter?.iv,
            scrf: sourceFromEncrypt
        }, `${process.env.SECRET_KEY}`, { algorithm: 'HS256' });
        
        return { token: createToken, expired: tokenExpired };
    } catch (error:any) {
        throw Boom.badImplementation('Something wrong with token generated!');
    }
};

export const CheckAuthorization = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const authorizationHeader = request.headers.authorization;
        if ( !authorizationHeader ) {
            throw Boom.unauthorized();
        }
        
        const token = authorizationHeader?.split(' ');
        if ( token[0]?.toLowerCase() !== 'bearer' ) {
            throw Boom.unauthorized();
        }
        
        const parsedToken = JWT.verify(token[1], `${process.env.SECRET_KEY}`);
        if ( !parsedToken ) {
            throw Boom.unauthorized();
        }
        
        if (typeof parsedToken !== 'string' && 'scrf' in parsedToken) {
            const checkSourceFrom = await bcrypt.compare('access_token', parsedToken.scrf);
            
            if ( !checkSourceFrom ) {
                throw Boom.unauthorized();
            }
            
            interface PropsUserData {
                username: string,
                email: string,
                type: string,
            }
            
            const UserData = JSON.parse(CryptoDecrypter({ textCode: `${parsedToken.sub}`, iv: `${parsedToken.usiv}` })) as PropsUserData;
            (request as any).UserData = UserData;
            
            return h.continue;
        }
    } catch (error) {
        throw Boom.unauthorized('Unauthorized!');
    }
};

export const ParseAuthorization = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const authorizationHeader = request.headers.authorization;
        if ( authorizationHeader ) {
            const token = authorizationHeader?.split(' ');
            if ( token[0]?.toLowerCase() !== 'bearer' ) {
                throw Boom.unauthorized('Bad Authorization!');
            }
            
            const parsedToken = JWT.verify(token[1], `${process.env.SECRET_KEY}`);
            if (typeof parsedToken !== 'string' && 'scrf' in parsedToken) {
                const checkSourceFrom = await bcrypt.compare('access_token', parsedToken.scrf);
                
                interface PropsUserData {
                    username: string,
                    email: string,
                    type: string,
                }
                
                const UserData = JSON.parse(CryptoDecrypter({ textCode: `${parsedToken.sub}`, iv: `${parsedToken.usiv}` })) as PropsUserData;
                (request as any).UserData = UserData;
                
                return h.continue;
            }
        } else {
            return h.continue;
        }
    } catch (error) {
        throw Boom.unauthorized('Unauthorized!');
    }
};