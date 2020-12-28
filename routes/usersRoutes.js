const express = require('express');
const router = express.Router();

const authentication = new (require('../controllers/authenticationController')); // This middleware allow to validate JWT token

const usersController = new (require('../controllers/usersController'))(router);//require('../controllers/users_controller');
 
/**
 * @swagger
 * /api/users/createUser:
 *   post:
 *     description: API to Create user
 *     parameters:
 *      - name: firstName 
 *        description: Enter user First Name
 *        in: formData
 *        required: true
 *        type: string
 *      - name: lastName
 *        description: Enter user Last Name
 *        in: formData
 *        required: true
 *        type: string
 *      - name: userName 
 *        description: User Name 
 *        in: formData
 *        required: true
 *        type: string
 *      - name: email
 *        description: Email id
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: Password
 *        in: formData
 *        required: true
 *        type: string
 *      - name: passwordConfirm
 *        description: Confirm Password
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: User signup/registration service
 */
router.post('/createUser', usersController.create); // Create user

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     description: API for user login
 *     parameters:
 *      - name: email
 *        description: Enter Email id 
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: Enter Password
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
router.post('/login', usersController.login); // User login


/**
 * @swagger
 * /api/users/updateUser/{id}:
 *   put:
 *     description: API to update the user profile
 *     parameters:
 *      - name: id 
 *        description: User Id
 *        in: path
 *        type: string
 *      - name: firstName 
 *        description: First Name
 *        in: formData
 *        type: string
 *      - name: lastName
 *        description: Last Name
 *        in: formData
 *        type: string
 *      - name: bio
 *        description: bio
 *        in: formData
 *        type: string
 *      - name: Authorization
 *        description: JWT Authorization Bearer token
 *        in: header
 *        required: true
 *     responses:
 *       200:
 *         description: User profile updated.
 */
router.put('/updateUser/:id', authentication.protect, usersController.edit); // Updating the user profile


/**
 * @swagger
 * /api/users/deleteUser/{id}:
 *   delete:
 *     description: API to Delete user
 *     parameters:
 *      - name: id
 *        description: User ID
 *        in: path
 *        required: true
 *        type: string
 *      - name: Authorization
 *        description: JWT Authorization Bearer token
 *        in: header
 *        required: true
 *     responses:
 *       201:
 *         description: User deleted sucessfully
 */
router.delete('/deleteUser/:id',authentication.protect, usersController.delete); // user deletion

/**
 * @swagger
 * /api/users/followuser:
 *   post:
 *     description: API to follow user
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: body
 *           name: body
 *           description: User to follow
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               followUser:
 *                 type: object
 *                 properties:
 *                   id:
 *                      type: string
 *     responses:
 *       201:
 *         description: User has started following you
 */
router.post('/followuser', authentication.protect, usersController.followUser); // Follow person

/**
 * @swagger
 * /api/users/unfollowuser:
 *   put:
 *     description: Delete user
 *     parameters:
 *         - name: API to un follow user
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: body
 *           name: body
 *           description: User to unfollow
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               unfollowUser:
 *                 type: object
 *                 properties:
 *                   id:
 *                      type: string
 *                   name:
 *                      type: string  
 *     responses:
 *       200:
 *         description: User Deleted Sucessfully
 */
router.put('/unfollowuser', authentication.protect, usersController.unfollowUser); // unfollow the user

/**
 * @swagger
 * /api/users/following/{id}:
 *   get:
 *     description: API to get list of all followers
 *     parameters:
 *         - name: id 
 *           description: User Id
 *           in: path
 *           type: string
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *     responses:
 *       200:
 *         description: List of all the users you are following
 */
router.get('/following/:id', authentication.protect, usersController.following); /// provide the list of all the following users



/**
 * @swagger
 * /api/users/upload:
 *   post:
 *     description: API to upload image 
 *     parameters:
 *      - name: Authorization
 *        description: JWT Authorization Bearer token
 *        in: header
 *        required: true
 *      - name: userId
 *        description: User id for which image needs to be uploded
 *        in: formData
 *        type: string
 *      - name: file
 *        description: Image to upload
 *        in: formData
 *        required: true
 *        type: file
 *     responses:
 *       200:
 *         description: User image uploded sucessfully
 */
router.post('/upload', authentication.protect, usersController.upload.single('file'),usersController.uploadUserImage) // Uplod photo using this router

/**
 * @swagger
 * /api/users/image/{filename}:
 *   get:
 *     description: API to get/download user image
 *     parameters:
 *      - name: filename
 *        description: Image name to download
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Created
 */
router.get('/image/:filename',usersController.getUserImage); // Get image for User profile pic
router.get('/viewScreen', usersController.uploadScreen); // User can upload image using this page


module.exports = router;

