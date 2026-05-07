const db = require('../config/db');

// @desc    Get all users
// @route   GET /users
const getUsers = async (req, res) => {
    try {
        const users = await db.users.find({}, { password: 0 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get current user profile
// @route   GET /users/me
const getMe = async (req, res) => {
    try {
        const user = await db.users.findOne({ _id: req.user._id }, { password: 0 });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getUsers,
    getMe
};
