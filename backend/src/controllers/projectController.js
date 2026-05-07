const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        let query;

        // If admin, can see all projects. If member, only projects they are part of.
        if (req.user.role === 'admin') {
            query = Project.find().populate('members', 'name email');
        } else {
            query = Project.find({ members: req.user.id }).populate('members', 'name email');
        }

        const projects = await query;

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('members', 'name email').populate('tasks');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Check if user is member or admin
        if (req.user.role !== 'admin' && !project.members.some(m => m._id.toString() === req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this project' });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only usually, but let's allow members to create their own)
exports.createProject = async (req, res, next) => {
    try {
        // Add user to req.body as owner and first member
        req.body.owner = req.user.id;
        if (!req.body.members) req.body.members = [req.user.id];
        else if (!req.body.members.includes(req.user.id)) req.body.members.push(req.user.id);

        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Check ownership or admin
        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Check ownership or admin
        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
