const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../Models/tokens');
const User = require('../Models/user');


module.exports = {
    Create: async (req, res) => {
        try {
            let user = {};
            const { role } = req.body
            if (role === 'Admin') {
                const existingAdmin = await User.findOne({ role })
                if (existingAdmin) {
                    return res.status(400).json({ message: 'Admin already exists' })
                }
            }
            user = await User.create(req.body);
            user.save();

            let token = jwt.sign({ user: user._id }, process.env.Token_Secret, { expiresIn: '1h' });
            token = await Token.create({
                userId: user._id,
                token
            })
            token.save();


            return res.status(200).json({
                status: 'Success',
                message: 'Registration Successful',
                data: user, token
            })
        } catch (error) {
            return res.status(400).json({
                status: 'Error',
                message: error.message
            })
        }
    },
    Login: async (req, res) => {
        try {
            let { email, password } = req.body;
            let user = {};
            user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    status: 'Bad request',
                    message: 'invalid credentials'
                })
            }
            let compare = await bcrypt.compare(password, user.password);
            if (!compare) {
                return res.status(401).json({
                    status: 'Bad Request',
                    message: 'Invalid password'
                })
            }
            let token = jwt.sign({ userId: user._id }, process.env.Token_Secret, { expiresIn: '1h' });
            let newToken = await Token.create({
                userId: user._id,
                token: token
            })
            newToken.save();

            return res.status(200).json({
                status: 'Success',
                message: "Logged in",
                data: user, token
            })
        } catch (error) {
            return res.status(400).json({
                status: 'Error',
                message: error.message
            })
        }
    },
    Logout: async (req, res) => {
        try {
            let token = req.headers.authorization.split(' ')[1];

            let decoded = jwt.verify(token, process.env.Token_Secret);

            await Token.deleteMany({ userId: decoded.userId });

            // if (result.deletedCount === 0) {
            //     res.status(401).json({
            //         status: 'Error',
            //         message: 'Token not found'
            //     })
            // }
            return res.status(200).json({
                status: 'Success',
                message: 'Logged out'
            })
        } catch (error) {
            return res.status(400).json({
                status: 'Error',
                message: error.message
            })
        }
    }
}