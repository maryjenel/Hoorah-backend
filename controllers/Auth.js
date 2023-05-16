const jwt = require("jsonwebtoken");
const utf8 = require('utf8');
const Cookies = require('cookies');
const CONSTANTS = require('../constants');

exports.getAccessToken = async (request, response) => {
    const { JWT_TOKEN_COOKIE } =  CONSTANTS;
    const { TOKEN_KEY, COOKIE_KEY } =  process.env;
    try {
        // try to see if the cookie exists
        const cookies = new Cookies(request, response, { keys: [COOKIE_KEY] });
        // Get a secure / signed cookie if it exists
        const cookie = cookies.get(JWT_TOKEN_COOKIE, { signed: true });
        let returnToken = 'token';
        // if it doesnt exist, sign a new one, encode it,a save cookie and send token in response
        if (!cookie) {
            const token = jwt.sign({ userIp: request.ip, issuedAt: Date.now(), requestCount: 0 }, TOKEN_KEY, { expiresIn: '60m' });
            const encodedToken = utf8.encode(token);
            // Set a secure cookie
            cookies.set(JWT_TOKEN_COOKIE, encodedToken, { signed: true, httpOnly: true, secure: false, expiresIn: '60m' });
            returnToken = token;
        } else {
            // token exists, decode and verify its still valid
            const decodedToken = utf8.decode(cookie);
            jwt.verify(decodedToken, process.env.TOKEN_KEY, (err, decoded) => {
                if (err) {
                    // not valid, sign a new one
                    const token = jwt.sign({ userIp: request.ip, issuedAt: Date.now(), requestCount: 0 }, TOKEN_KEY, { expiresIn: '60m' });
                    const encodedToken = utf8.encode(token);
                    // Set a secure cookie with newly signed token
                    cookies.set(JWT_TOKEN_COOKIE, encodedToken, { signed: true, httpOnly: true, secure: false, expiresIn: '60m' });
                    returnToken = token;
                }
                else {
                    // token is valid, set the decodedToken to be returned
                    returnToken = decodedToken;
                }
            });
        }
        // return 200
        response.status(200).send(returnToken);
    } catch (error) {
        // any error return 500 with the error as message
        response.status(500).send({ message: 'Error getting access token, ' + error});
    }
};