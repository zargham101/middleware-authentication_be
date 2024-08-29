const User = require('../Models/user');
const Token = require('../Models/tokens');
const env = require('dotenv');
const jwt = require('jsonwebtoken');


env.config();

module.exports = {

    List: async (req, res) => {
        try {

            const users = await User.find({});

            return res.status(200).json({
                status: 'success',
                data: users
            })
        } catch (error) {
            return res.status(400).json({
                status: 'Error',
                message: error.message
            })
        }
    },
    Read: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await User.findOne({ _id: id })
            return res.status(200).json({
                status: 'success',
                data: user
            })
        } catch (error) {
            return res.status(400).json({
                status: 'Error',
                message: error.message
            })
        }
    },
    Update: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true })
            return res.status(200).json({
                status: 'success',
                data: user
            })
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            })
        }
    },
    Delete: async (req, res) => {
        try {
            // let token = req.headers.authorization.split(' ')[1];

            // let decoded = jwt.verify(token, process.env.Token_Secret);

            let result = await User.deleteOne({ _id: req.user.id })
            if (!result) {
                return res.status(404).json({
                    status: 'error',
                    message: "User not found"
                })
            }
            await Token.deleteMany({ userId: req.user.userId })
            return res.status(200).json({
                status: 'Success',
                message: "Deleted the user"
            })
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            })
        }
    }
}

