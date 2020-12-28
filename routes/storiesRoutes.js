const express = require('express');
const storiesRouter = express.Router();
const authentication = new (require('../controllers/authenticationController')); // This middleware allow to validate JWT token


 const StoryController = new (require('../controllers/storiesController'))(storiesRouter);

 /**
 * @swagger
 * /api/stories/getStoryById/{id}:
 *   get:
 *     description: API to get the stories by story id
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: story id 
 *     responses:
 *       200:
 *         description: Return the specific story
 */

 storiesRouter.get('/getStoryById/:id', StoryController.getStoryById) // Get Story by Story Id

 /** 
* @swagger
* /api/stories/getAllStories:
*   get:
*     description: API to Get the list of all the Stories 
*     responses:
*       200:
*         description: Return the list of all the Stories 
*/
 storiesRouter.get('/getAllStories', StoryController.getAllStories)// Get the list of all the Stories 
 

/**
 * @swagger
 * /api/stories/createStory:
 *   post:
 *     description: API to Create the new Story
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
 *               title:
 *                 type: string
 *                 required: true
 *                 example: "Title for the story"
 *               description:
 *                 type: string
 *                 example: "Story Description"
 *               content:
 *                 type: string
 *                 example: "Story Content"
 *               author:
 *                 type: string
 *                 required: true
 *                 example: "Author id"
 *               tags:
 *                 type: array
 *                 items:
 *                    type: string
 *               topics:
 *                 type: array
 *                 items:
 *                    type: string
 *     responses:
 *       200:
 *         description: Return the new created story
 */
 
 storiesRouter.post('/createStory', authentication.protect, authentication.protect, StoryController.createStories) // Create the new Story


/**
 * @swagger
 * /api/stories/updateStory/{id}:
 *   put:
 *     description: API to Update the specific story
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - name: id
 *           description: Story Id
 *           in: path
 *           required: true
 *         - in: body
 *           name: body
 *           description: User to follow
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "Story Id"
 *               title:
 *                 type: string
 *                 example: "Title for the story"
 *               description:
 *                 type: string
 *                 example: "Description for story"
 *               content:
 *                 type: string
 *                 example: "Story Content"
 *               tags:
 *                 type: array
 *                 items:
 *                    type: string
 *               topics:
 *                 type: array
 *                 items:
 *                    type: string
 *     responses:
 *       200:
 *         description: Story updated
 */
 storiesRouter.put('/updateStory/:id', authentication.protect, StoryController.updateStories) //  Update the story
 
 
/**
 * @swagger
 * /api/stories/deleteStory/{id}:
 *   delete:
 *     description: API to delete the specific story by passing Story Id
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: story id 
 *     responses:
 *       200:
 *         description: Delete the story
 */
 storiesRouter.delete('/deleteStory/:id', authentication.protect, StoryController.deleteStories) // Delete the specific story by passing Story Id

 /**
 * @swagger
 * /api/stories/getStoryByPublicationId/{id}:
 *   get:
 *     description: API to get all the Story by Publication Id
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: Publication Id 
 *     responses:
 *       200:
 *         description: Returns the list of stories.
 */

 storiesRouter.get('/getStoryByPublicationId/:id', StoryController.getStoriesByPublicationId) // Get all the Story by Publication Id
 
 /** 
* @swagger
* /api/stories/getStoriesByUserId/{id}:
*   get:
*     description: API to get Story by User Id
*     parameters:
*         - in: path
*           name: id
*           schema:
*              type: string
*           description: User id 
*     responses:
*       200:
*         description: Returns the list of stories.
*/
 storiesRouter.get('/getStoriesByUserId/:id', StoryController.getStoriesByUserId) // Get Story by User Id
 
 storiesRouter.get('/viewScreen', StoryController.uploadScreen); // Allow user to upload photo to Story using uploadStoryImage.ejs templet


/**
 * @swagger
 * /api/stories/upload:
 *   post:
 *     description: API to upload the image for the story
 *     parameters:
 *      - name: Authorization
 *        description: JWT Authorization Bearer token
 *        in: header
 *        required: true
 *      - name: storyId
 *        description: Story ID
 *        in: formData
 *        type: string
 *      - name: file
 *        description: Select Image
 *        in: formData
 *        required: true
 *        type: file
 *     responses:
 *       200:
 *         description: Created
 */
 storiesRouter.post('/upload', authentication.protect,StoryController.upload.single('file'),StoryController.uploadStoryImage) // Upload photo using this router
 
 /**
 * @swagger
 * /api/stories/image/{filename}:
 *   get:
 *     description: Get the image URL
 *     parameters:
 *      - name: filename
 *        description: Image file name
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Get the image URL
 */
 
 storiesRouter.get('/image/:filename',StoryController.getStoryImage); // Get image for Story

 
module.exports = storiesRouter;  