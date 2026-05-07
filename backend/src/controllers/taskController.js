const db = require('../config/db');

// @desc    Get all tasks
// @route   GET /tasks
const getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }
        
        if (req.query.project) {
            query.project = req.query.project;
        }

        const tasks = await db.tasks.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create task
// @route   POST /tasks
const createTask = async (req, res) => {
    try {
        req.body.createdBy = req.user._id;
        const task = await db.tasks.insert({
            ...req.body,
            createdAt: new Date()
        });
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update task
// @route   PUT /tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await db.tasks.update(
            { _id: req.params.id },
            { $set: req.body },
            { returnUpdatedDocs: true }
        );
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
const deleteTask = async (req, res) => {
    try {
        await db.tasks.remove({ _id: req.params.id });
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
