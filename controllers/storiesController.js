

StoriesController = function (router) {

  //const User = require('../models/Users');
  const Stories = require('../models/storiesModel');
  const mongoose = require('mongoose');
  const GridFsStorage = require('multer-gridfs-storage');
  const Grid = require('gridfs-stream');
  const multer = require('multer');
  const crypto = require('crypto');
  const path = require('path');
  const methodOverride = require('method-override');

  console.log("@@@@", mongoose.connections.length);

  // Init gfs
  let gfs;

  var connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error:'));

  connection.once('open', function () {
    console.log("Connected!")
    var mongoDriver = mongoose.mongo;
    gfs = new Grid(connection.db, mongoDriver);
    gfs.collection('uploads');
  });
  // Create storage engine
  const storage = new GridFsStorage({
    url: process.env.DATABASE_LOCAL,//'mongodb://localhost/medium_dev',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  this.upload = multer({ storage });

  // @route POST /upload
  // @desc  Uploads file to DB
  this.uploadStoryImage = function (req, res) {
    console.log(req.body.storyId);
    // res.json({ file: req.file });

    Stories.findByIdAndUpdate({ _id: req.body.storyId }, { image: req.file.filename })
      .then(() => Stories.findById({ _id: req.body.storyId }))
      .then(story => {
        res.send(story)
      })
      .catch(error => {
        console.log(error);
        res.send({ error: error.message })
      });
  }



  // @route GET /image/:filename
  // @desc Display Image
  this.getStoryImage = function (req, res, next) {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  }

  this.updateStories = function (req, res, next) {
    const storyId = req.params.id;
    const storyProps = req.body;

    Stories.findByIdAndUpdate({ _id: storyId }, storyProps)
      .then(() => Stories.findById({ _id: storyId }))
      .then(story => res.send(story))
      .catch(next);
  };
  this.createStories = function (req, res, next) {
    const storyProps = req.body;

    Stories.create(storyProps)
      .then(story => res.send(story))
      .catch(next)
  }
  this.uploadScreen = function (req, res) {
    res.render('uploadStoryImage');
  }
  this.deleteStories = function (req, res, next) {
    const StoryId = req.params.id;

    Stories.findByIdAndRemove({ _id: StoryId })
      .then(story => res.status(200).send(story))
      .catch(next);
  }
  this.getStoryById = async function (req, res, next) {
    const story = await Stories.findById(req.params.id)
    res.send({ story })
  }

  this.getStoriesByPublicationId = async function (req, res, next) {
    const story = await Stories.find({ publicationId: req.params.id })
    res.send({ story })
  }
  this.getStoriesByUserId = async function (req, res, next) {
    const story = await Stories.find({ author: req.params.id })
    res.send({ story })
  }
  this.getAllStories = async function (req, res, next) {
    const story = await Stories.find({})
    res.send({ story })
  }

};
module.exports = StoriesController;

