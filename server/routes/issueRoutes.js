const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  upvoteIssue,
  deleteIssue
} = require('../controllers/issueController');

const upload = multer({ storage });

router.route('/')
  .post(protect, upload.single('image'), createIssue)
  .get(getIssues);

router.route('/:id')
  .get(getIssueById)
  .delete(protect, admin, deleteIssue);

router.put('/:id/status', protect, admin, updateIssueStatus);
router.put('/:id/upvote', protect, upvoteIssue);

module.exports = router;