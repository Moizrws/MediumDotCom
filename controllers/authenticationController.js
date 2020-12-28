

AuthenticationController = function () {
    const { promisify } = require('util');
    const jwt = require('jsonwebtoken');

    const User = require('../models/usersModel');

    this.protect = async function (req, res, next) {
        try{
            // 1) Getting token and check of it's there 
            let token;

            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return next(
                     res.status(401).json({
                        err: 'You are not logged in! Please log in to get access.',
                        sucess:false
                      })   
                );
            }

            // 2) Verification token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // 3) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {

                return next(
                    res.status(404).json({
                       err: 'The user belonging to this token does no longer exist.',
                       sucess:false
                     })   
               );
                
            }

            // GRANT ACCESS TO PROTECTED ROUTE
            req.user = currentUser;
            next();
        }
        catch(e) {
            return res.status(405).send(e);
        }

    };


}
module.exports = AuthenticationController;
