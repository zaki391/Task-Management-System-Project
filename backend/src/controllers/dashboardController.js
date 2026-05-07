const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        let projectIds = [];
        
        // If not admin, restrict to projects the user is part of
        if (req.user.role !== 'admin') {
            const projects = await Project.find({ members: req.user.id });
            projectIds = projects.map(p => p._id);
        } else {
            const projects = await Project.find();
            projectIds = projects.map(p => p._id);
        }

        const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
        const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'done' });
        const pendingTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'in-progress' });
        
        const now = new Date();
        const overdueTasks = await Task.countDocuments({ 
            project: { $in: projectIds }, 
            status: { $ne: 'done' },
            dueDate: { $lt: now }
        });

        // Recent activity (last 5 tasks)
        const recentActivity = await Task.find({ project: { $in: projectIds } })
            .sort('-createdAt')
            .limit(5)
            .populate('project', 'name')
            .populate('createdBy', 'name');

        // Project-wise statistics
        const projectStats = await Task.aggregate([
            { $match: { project: { $in: projectIds } } },
            { $group: { 
                _id: '$project', 
                count: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } }
            }},
            { $lookup: {
                from: 'projects',
                localField: '_id',
                foreignField: '_id',
                as: 'projectInfo'
            }},
            { $unwind: '$projectInfo' },
            { $project: {
                name: '$projectInfo.name',
                total: '$count',
                completed: '$completed'
            }}
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
                recentActivity,
                projectStats
            }
        });
    } catch (err) {
        next(err);
    }
};
