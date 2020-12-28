

UserController = function (router) {

  const User = require('../models/usersModel');
  const mongoose = require('mongoose');
  const GridFsStorage = require('multer-gridfs-storage');
  const Grid = require('gridfs-stream');
  const multer = require('multer');
  const crypto = require('crypto');
  const path = require('path');
  const methodOverride = require('method-override');
  const { promisify } = require('util');
  const jwt = require('jsonwebtoken');
  const authentication = require('./authenticationController');

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
  
  this.uploadUserImage = function (req, res) {
    console.log(req.body.userId);
    // res.json({ file: req.file });

    User.findByIdAndUpdate({ _id: req.body.userId }, { profilePicture: req.file.filename })
      .then(() => User.findById({ _id: req.body.userId }))
      .then(user => {
        res.send(user)
      })
      .catch(error => {
        console.log(error);
        res.send({ error: error.message })
      });
  }

  // @route GET /image/:filename
  // @desc Display Image
  this.getUserImage = function (req, res, next) {
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

  // @route DELETE /files /: id
  // @desc  Delete file
  router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      res.redirect('/');
    });
  });

  this.login = async function (req, res, next) {
    console.log("########## " + process.env.JWT_SECRET);
    const userProps = req.body;

    const user = await User.findOne({ email: userProps.email }).select('+password')

    try {
      if (!user || !(await user.correctPassword(userProps.password, user.password))) {

        res.status(401).send({
          sucess: false,
          message: "Incorrect email or password."
        })
      }
      else {
        createSendToken(user, 200, res);
      }

    }
    catch (e) {
      res.status(401).send({
        sucess: false,
        message: "User Login Failed."
      })
    }
  };
  
  this.edit = function (req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;

    User.findByIdAndUpdate({ _id: userId }, userProps)
      .then(() => User.findById({ _id: userId }))
      .then(user => res.send(user))
      .catch(next);
  };

  const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };


  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
  this.create = async function (req, res, next) {
    const userProps = req.body;
    try {
      const newUser = await User.create(userProps);
      if (newUser) {
        //user => res.send(user)
        createSendToken(newUser, 201, res);
      }
      else {
        next();
      }
    }
    catch (err) {
      res.status(400).send({ error: err.message, sucess: false });
    }



    /*.then(user => res.send(user))
    .catch(next)*/
  }
  this.uploadScreen = function (req, res) {
    res.render('uploadUserImage');
  }
  this.delete = async function (req, res, next) {
   const userId = req.params.id;

  try {
    const user = await User.findByIdAndRemove({
      _id: userId
    })
    res.status(200).send({sucess: true, message: "User deleted successfully."});
  } catch (e) {
    next(e);
  }
  }
  this.followUser = async (req, res, next) => {
    const { userId, followUser } = req.body;
    try {
      await User.updateOne({ _id: userId }, {
        $push: { following: followUser.id }
      })
      const user = await User.findOne({ _id: followUser.id });
      res.status(200).send(`You are following ${user.firstName} ${user.lastName}`);
    } catch (e) {
      next(e);
    }
  };

  this.unfollowUser = async (req, res, next) => {
    const { userId, unfollowUser } = req.body;
    try {
      await User.updateOne(
        { _id: userId },
        { $pull: { following: unfollowUser.id } }
      );
      const user = await User.findOne({ _id: unfollowUser.id });
      res.status(200).send(`You are no longer following ${user.firstName} ${user.lastName}`);
    } catch (e) {
      next(e);
    }
  };

  this.following = async (req, res, next) => {
    const userId = req.params.id;

    try {
      const user = await User.findOne({ _id: userId });
      const userList = await User.find({ _id: { $in: user.following } });

      res.status(200).send(userList);
    } catch (e) {
      next(e);
    }
  };



};
module.exports = UserController;

