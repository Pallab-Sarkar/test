import { constants } from './../config/constants.js';
import jwt from 'jsonwebtoken';
const { verify } = jwt
import { getOne } from '../dao/user-dao.js';
import { prepareUserResponse as prepareUserRes } from '../utils/utils.js';

//Authentication of user using JWT token
async function isAuthenticate(req, res, next) {
    try {
        if(!req.headers.authorization) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'Access denied!'})
        }
        const token = req.headers.authorization.replace("Bearer ", "");
        if (token == null) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'Token not found in request'})
        }
        // Verify token with APP_SECRET
        const userDetail = verify(token, process.env.API_SECRET);
        if (userDetail == null) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'Invalid Token'})
        }
        // check user data with database if user is valid or not...
        let user;
        user = await getOne({_id : userDetail._id }, null);
        if (user == null) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'Invalid Token'})
        }
        if (!user.auditFields.isActive) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'User not active , please contact admin !!'})
        }
        if (user.auditFields.isDeleted) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({Message: 'User not active , please contact admin !!'})
        }
        // Add userDetail in req.user so that we can use user detail in future
        req.user = prepareUserRes(user);
        next();
    } catch (error) {
        if (error.name && error.name.indexOf('TokenExpiredError') > -1) {
            return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json(error);
        } else {
            return res.status(error.status || constants.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
        }
    }
}

export default isAuthenticate;