const express = require('express');
const router = express.Router();


 const publicationController = new (require('../controllers/publicationController'))(router); 
 const authentication = new (require('../controllers/authenticationController')); // This middleware allow to validate JWT token


 /**
 * @swagger
 * /api/publication/getPublication/{id}:
 *   get:
 *     description: API provides publication by publication id
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: Publication id 
 *     responses:
 *       200:
 *         description: Returns the publication
 */
 router.get('/getPublication/:id', publicationController.getPublication) // Provides publication by publication id
 
 /**
 * @swagger
 * /api/publication/getallPublication:
 *   get:
 *     description: API to get list of all the publication
 *     responses:
 *       200:
 *         description: List of publication
 */

 router.get('/getallPublication',publicationController.getallPublication)// Get list of all the publication

 /**
 * @swagger
 * /api/publication/createPublication:
 *   post:
 *     description: API to create the publication
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
 *               name:
 *                 type: string
 *                 required: true
 *                 example: "Publication name"
 *               tagline:
 *                 type: string
 *                 example: "Publication tagline"
 *               description:
 *                 type: string
 *                 example: "escription for publication"
 *               editor:
 *                 type: string
 *                 required: true
 *                 example: "Editor id"
 *               tags:
 *                 type: array
 *                 items:
 *                    type: string
 *               category:
 *                 type: array
 *                 items:
 *                    type: string
 *     responses:
 *       200:
 *         description: Returns the created publication.
 */
 router.post('/createPublication/', publicationController.createPublication)// Create the publication

 /**
 * @swagger
 * /api/publication/updatePublication/{id}:
 *   put:
 *     description: API to update a publication
 *     parameters:
 *         - name: id 
 *           description: Publication Id
 *           in: path
 *           type: string
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
 *               name:
 *                 type: string
 *                 example: "Publication Name"
 *               tagline:
 *                 type: string
 *                 example: "Publication Tagline"
 *               description:
 *                 type: string
 *                 example: "Description for publication"
 *               tags:
 *                 type: array
 *                 items:
 *                    type: string
 *               category:
 *                 type: array
 *                 items:
 *                    type: string
 *     responses:
 *       200:
 *         description: Publication updated sucessfuly
 *
 */
 router.put('/updatePublication/:id', authentication.protect ,publicationController.updatePublication)// update the publication
 
 /**
 * @swagger
 * /api/publication/deletePublication/{id}:
 *   delete:
 *     description: API to delete publication by passing id
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: Publication Id
 *     responses:
 *       200:
 *         description: Publication deleted sucessfully
 *
 */

 router.delete('/deletePublication/:id', publicationController.deletePublication)// delete publication by passing id
 
 /**
 * @swagger
 * /api/publication/getPublicationByUser/{id}:
 *   get:
 *     description: API to get publication passing user id
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           description: user id 
 *     responses:
 *       200:
 *         description: Returns publication list
 *
 */
 router.get('/getPublicationByUser/:editor', publicationController.getPublicationByUser)// get publication passing user id
 
 /**
 * @swagger
 * /api/publication/addWriter:
 *   put:
 *     description: API to add other members into the publication
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
 *               publicationId:
 *                 type: string
 *                 required: true
 *                 example: "Publication Id"
 *               writerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added to publication sucessfully
 *
 */
 router.put('/addWriter', publicationController.addWriter) // Add other members into the publication

 /**
 * @swagger
 * /api/publication/removeWriter:
 *   delete:
 *     description: Remove members from publication
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
 *               publicationId:
 *                 type: string
 *                 required: true
 *                 example: "Publication Id"
 *               writerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created
 *
 */

 router.delete('/removeWriter', publicationController.removeWriter) // Remove members from publication

 /**
 * @swagger
 * /api/publication/addCategory:
 *   put:
 *     description: API to add category to publication
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: body
 *           name: body
 *           description: Name
 *           schema:
 *             type: object
 *             properties:
 *               publicationId:
 *                 type: string
 *                 required: true
 *                 example: "Publication Id"
 *               categoryName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category added sucessfully
 *
 */
 router.put('/addCategory', publicationController.addCategory) // Add category to publication


 /**
 * @swagger
 * /api/publication/removeCategory:
 *   delete:
 *     description: API to remove category from publication
 *     parameters:
 *         - name: Authorization
 *           description: JWT Authorization Bearer token
 *           in: header
 *           required: true
 *         - in: body
 *           name: body
 *           description: Name
 *           schema:
 *             type: object
 *             properties:
 *               publicationId:
 *                 type: string
 *                 required: true
 *                 example: "Publication Id"
 *               categoryName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category removed sucessfully
 *
 */
 router.delete('/removeCategory', publicationController.removeCategory) // Remove category from publication

router.get('/viewScreen', publicationController.uploadScreen); // Allow user to upload photo to publication using uploadPublicationImage.ejs templet


/**
 * @swagger
 * /api/publication/upload:
 *   post:
 *     description: API to upload photo for publication 
 *     parameters:
 *      - name: Authorization
 *        description: JWT Authorization Bearer token
 *        in: header
 *        required: true
 *      - name: publicationId
 *        description: Publication Id
 *        in: formData
 *        type: string
 *      - name: file
 *        description: Image to upload
 *        in: formData
 *        required: true
 *        type: file
 *     responses:
 *       200:
 *         description: Image uploded sucessfully
 */

router.post('/upload',publicationController.upload.single('file'),publicationController.uploadPublicationImage) // Upload photo for publication using this router

/**
 * @swagger
 * /api/publication/image/{filename}:
 *   get:
 *     description: API to get/Download the image for publication
 *     parameters:
 *      - name: filename
 *        description: file name
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Created
 */

router.get('/image/:filename',publicationController.getPublicationImage); // Get/Download the image for publication


 
module.exports = router;  

