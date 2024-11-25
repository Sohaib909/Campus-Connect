const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const multerMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: multerMemoryStorage });

const authController = require('../Controllers/authController.js');
const societyController = require('../Controllers/societyController.js');
const postController = require('../Controllers/postController.js');

upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }])


router.post(
    '/',
    authController.protect,
    upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]),
    societyController.createSociety
);

router.get('/joined-societies', authController.protect, societyController.getUserJoinedSocieties);
router.post('/:id', authController.protect, authController.restrict('admin'), societyController.updateSocietyStatus);
router.get('/manageSocieties', authController.protect, societyController.manageSocieties);
router.get('/', authController.protect, societyController.getAllSocieties);
router.get('/approvedSocieties', authController.protect, societyController.getApprovedSocieties);
router.post('/:id/posts', authController.protect, postController.createPost);
router.get('/:id/posts', authController.protect, postController.getPosts);
router.get('/:id', authController.protect, societyController.getSocietyById);
router.patch('/:id/like', authController.protect, postController.likePost);
router.get('/:id/members/count', societyController.getMembersCount);
router.get('/:societyId/isUserMember', societyController.isUserMember);
router.post('/:id/join', authController.protect, societyController.joinSociety);
router.get('/:id/joinRequests', authController.protect, societyController.getJoinRequests);
router.patch('/:societyId/manageMembers/manageRequests/:userId/:action', authController.protect, societyController.handleJoinRequest);
router.get('/:id/viewMembers', authController.protect, societyController.getAllMembers);


module.exports = router;
