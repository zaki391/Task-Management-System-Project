const db = require('../config/db');

// @desc    Get all projects
// @route   GET /projects
const getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.members = req.user._id;
        }

        const projects = await db.projects.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single project
// @route   GET /projects/:id
const getProject = async (req, res) => {
    try {
        const project = await db.projects.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create project
// @route   POST /projects
const createProject = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        if (!req.body.members) req.body.members = [req.user._id];
        else if (!req.body.members.includes(req.user._id)) req.body.members.push(req.user._id);

        const project = await db.projects.insert({
            ...req.body,
            createdAt: new Date()
        });

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update project
// @route   PUT /projects/:id
const updateProject = async (req, res) => {
    try {
        const project = await db.projects.update(
            { _id: req.params.id },
            { $set: req.body },
            { returnUpdatedDocs: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /projects/:id
const deleteProject = async (req, res) => {
    try {
        const numRemoved = await db.projects.remove({ _id: req.params.id });

        if (numRemoved === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Also delete tasks associated with this project
        await db.tasks.remove({ project: req.params.id }, { multi: true });

        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
