

PublicationController = function (router) {

    //const User = require('../models/Users');
    const Publication = require('../models/publicationModel');
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

    this.uploadPublicationImage = function (req, res) {
        console.log(req.body.publicationId);
        // res.json({ file: req.file });

        Publication.findByIdAndUpdate({ _id: req.body.publicationId }, { image: req.file.filename })
            .then(() => Publication.findById({ _id: req.body.publicationId }))
            .then(pub => {
                res.send(pub)
            })
            .catch(error => {
                console.log(error);
                res.send(error)
            });
    }


    // @route GET /image/:filename
    // @desc Display Image
    this.getPublicationImage = function (req, res, next) {
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

    this.updatePublication = async function (req, res, next) {
        const publicationId = req.params.id;
        const props = req.body;

        const publication = await Publication.findByIdAndUpdate({ _id: publicationId }, props);
        console.log(publication);
        if (publication) {
            res.send(publication);

        }
        else {
            res.status(404).json({ status: false, error: "Invalid Publication id passed." });
        }
    };
    this.createPublication = function (req, res, next) {
        const props = req.body;

        Publication.create(props)
            .then(pub => res.send(pub))
            .catch(next)
    }
    this.uploadScreen = function (req, res) {
        res.render('uploadPublicationImage');
    }
    this.deletePublication = function (req, res, next) {
        const publicationId = req.params.id;

        Publication.findByIdAndRemove({ _id: publicationId })
            .then(pub => res.status(200).send({
                sucess: true,
                message: "Publication removed sucessfully"
            }))
            .catch(next);
    }
    this.getPublication = async function (req, res, next) {
        try {
            if (req.params.id) {
                const pub = await Publication.findById(req.params.id)
                if (pub)
                    res.send({ pub })
                else
                    res.status(400).send({
                        error: "Invalid publication id",
                    })
            }
            else {
                // return all publications
                res.status(400).send({
                    error: "Please enter publication id",
                })
            }
        }
        catch (e) {
            res.status(400).send({
                error: e.message,
            })
        }


    }
    this.getallPublication = async function (req, res, next) {
        try {
            const pub = await Publication.find({})
            res.send(pub)
        }
        catch (e) {
            res.status(400).send({
                error: e,
            })
        }


    }

    this.getPublicationByUser = async function (req, res, next) {
        if (req.params.editor) {
            const pub = await Publication.find({ editor: req.params.editor })
            res.send({ pub })
        }
        else {
            res.status(400).send({
                error: "Something went wrong",
            })
        }

    }
    this.addWriter = async function (req, res, next) {

        const { writerId, publicationId } = req.body;
        try {
            await Publication.updateOne({ _id: publicationId }, {
                $push: { writer: writerId }
            })
            const pub = await Publication.findOne({ _id: publicationId });
            res.status(200).send(pub);
        } catch (e) {
            next(e);
        }

    }

    this.removeWriter = async function (req, res, next) {
        const { writerId, publicationId } = req.body;
        try {
            await Publication.updateOne(
                { _id: publicationId },
                { $pull: { writer: writerId } }
            );
            const pub = await Publication.findOne({ _id: publicationId });
            res.status(200).send(pub);
        } catch (e) {
            next(e);
        }

    }

    this.addCategory = async function (req, res, next) {

        const { categoryName, publicationId } = req.body;
        try {
            await Publication.updateOne({ _id: publicationId }, {
                $push: { category: categoryName }
            })
            const pub = await Publication.findOne({ _id: publicationId });
            res.status(200).send(pub);
        } catch (e) {
            next(e);
        }

    }

    this.removeCategory = async function (req, res, next) {
        const { categoryName, publicationId } = req.body;
        try {
            await Publication.updateOne(
                { _id: publicationId },
                { $pull: { category: categoryName } }
            );
            const pub = await Publication.findOne({ _id: publicationId });
            res.status(200).send(pub);
        } catch (e) {
            next(e);
        }

    }
};




module.exports = PublicationController;

