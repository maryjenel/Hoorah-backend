const jwt = require("jsonwebtoken");
const Cookies = require('cookies');

const db = require('../db');

exports.saveJwtCookie = async (req, res) => {

    // try to see if the cookie exists
    const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
    // Get a secure / signed cookie if it exists
    let cookieValue = cookies.get('jwtTokenCookie', { signed: true });
    // if cookieValue isnt found, sign a new one and set a cookie with jwt
    if (!cookieValue) {
        const token = jwt.sign({ userIp: req.ip, issuedAt: Date.now(), requestCount: 0 }, process.env.TOKEN_KEY, { expiresIn: '60m' });
        const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });

        cookieValue = JSON.stringify(token);
        // Set a secure cookie
        cookies.set('jwtTokenCookie', cookieValue, { signed: true, httpOnly: true, secure: false, expiresIn: '60m' });
    }
    req.headers["x-access-token"] = cookieValue;

};