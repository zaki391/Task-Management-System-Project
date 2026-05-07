const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res, next) => {
    try {
        let query;

        // Filtering by project, status, priority, assignedTo
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // If not admin, restrict to tasks in projects the user is part of
        if (req.user.role !== 'admin') {
            const projects = await Project.find({ members: req.user.id });
            const projectIds = projects.map(p => p._id);
            reqQuery.project = { $in: projectIds };
        }

        query = Task.find(reqQuery).populate('project', 'name').populate('assignedTo', 'name email').populate('createdBy', 'name');

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const tasks = await query;

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name members').populate('assignedTo', 'name email');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check if user is part of the project
        if (req.user.role !== 'admin' && !task.project.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        // Check if project exists and user is member
        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (req.user.role !== 'admin' && !project.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to add tasks to this project' });
        }

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && !task.project.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark task as done
// @route   PATCH /api/tasks/:id/done
// @access  Private
exports.markTaskAsDone = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && !task.project.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
        }

        task.status = 'done';
        await task.save();

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && !task.project.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
