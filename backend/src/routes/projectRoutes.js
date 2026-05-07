const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all routes in this router

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
