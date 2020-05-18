import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../common/authentication';
import { decodeJwt } from '../common/tokenUtils';

export const JWT_SECRET: string = process.env.JWT_SECRET || "d3vS3cr37";

/**
 * Creates a compact JWT token string that from the given TokenPayload.
 * This token string can then be used in subsequent requests via headers
 * or cookies.
 *
 * @export
 * @param {TokenPayload} payload
 * @param {string} [secret=JWT_SECRET]
 * @param {jwt.SignOptions} [signOptions]
 * @returns {(Promise<string | undefined>)}
 */
export async function createToken(payload: TokenPayload, secret: string = JWT_SECRET, signOptions?: jwt.SignOptions): Promise<string | undefined> {
    if (payload) {
        console.log('Creating JWT token');
        return jwt.sign({
            scopes: [],
            appScopes: [],
            ...payload
        }, secret, {
            algorithm: 'HS256',
            issuer: 'jag-shuber-api',
            audience: 'jag-shuber-client',
            // TODO: Make token expiry configurable
            expiresIn: '30m',
            ...signOptions
        })
    }
}

/**
 * Verifies a compact JWT token string returning the TokenPayload if successful
 * Throw an exception if the token can't be verified.
 *
 * @export
 * @param {string} token
 * @param {string} [secret=JWT_SECRET]
 * @returns {Promise<TokenPayload>}
 */
export async function verifyToken(token: string, secret: string = JWT_SECRET): Promise<TokenPayload> {
    return await new Promise((resolve, reject) => {
        // console.log('Verifying token...');
        if (!token) {
            // console.log('Verifying token failed, no token provided');
            reject(new Error("No token provided"))
        }

        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                // console.log('Verifying token failed');
                // console.log(err);
                reject(err)
            } else {
                // console.log('Token decoded:');
                // console.log(decodeJwt(token));
                resolve(decoded as TokenPayload);
            }
        });
    })
}
