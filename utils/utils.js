const  jwt = require('jsonwebtoken');
const  atob = require('atob');

const utils = class {
    static generateAccessToken(username) {
        return jwt.sign(username, process.env.TOKEN_SECRET || 'abc', { expiresIn: '1801s' });
    };
    
    static authenticateToken(req, res, next) {
        const token = req.cookies['auth-token']
    
        if (token == null) return res.status(401).json({message: 'Unauthorized'});
        
        jwt.verify(token, process.env.TOKEN_SECRET || 'abc', (err, user) => {
            if (err) {
                console.log(err)
                return res.status(403).json({message: 'Forbidden'});
            }
            req.user = user
            next()
        })
    };

    static decodeRequestBody(data) {
        for (let key in data) {
            data[key] = atob(data[key]);
        }
        return data;
    };

    static convertCmToInch(val) {
        return parseFloat(val / 2.54).toFixed(1)
    }
    
    static convertKgToLbs(val) {
        return parseFloat(val * 2.205).toFixed(1)
    }

    static convertKjToCal(val) {
        return parseInt(val * 0.239)
    }
}

module.exports = utils;