const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Token = require('../Models/tokens');

module.exports = {
    AuthMiddleware: (roles = []) => {
        return async (req, res, next) => {
            try {

                let token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(401).json({
                        status: 'Error',
                        message: 'No token provided'
                    });
                }
                let decoded = jwt.verify(token, process.env.Token_Secret);
                console.log(decoded);

                let tokenExist = await Token.findOne({ token: token });
                if (!tokenExist) {
                    return res.status(401).json({
                        status: 'Error',
                        message: 'Login First'
                    });
                }

                let user = await User.findOne({ _id: decoded.userId });
                console.log(user);

                if (!user) {
                    return res.status(401).json({
                        status: 'Error',
                        message: 'User not found'
                    });
                }
                req.user = {
                    userId: user._id,
                    role: user.role
                };
                console.log(req.user.role);


                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(403).json({
                        status: 'Error',
                        message: 'Access denied'
                    });
                }

                next();
            } catch (error) {
                return res.status(400).json({
                    status: 'Error',
                    message: error.message
                });
            }
        };
    }
};
