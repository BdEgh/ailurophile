const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Image = require('../models/image');
const User = require('../models/user');
const multer = require('multer');
const router = Router();
const path = require("path");

const pathDataUploads = 'data/uploads/';
var storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './public/' + pathDataUploads); },
    filename: (req, file, cb) => { cb(null, Math.random() + path.extname(file.originalname)) }
});
var upload = multer({
    storage: storage
});

router.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

router.get('/', async (req, res) => {
    const images = await Image.find().limit(1);

    res.render('index', {
        title: "Котосервис - картинки котов",
        isIndex: true,
        images
    });
});

router.get('/gallery', ensureAuth, async (req, res) => {
    const images = await Image.find().limit(1);

    res.render('gallery', {
        title: "Галерея",
        isIndex: true,
        images
    });
});


router.get('/getImages', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    const images = await Image.find()
        .limit(limit)
        .skip(skip);

    var response = [];

    for (const item of images) {
        const authorName = await User.findById(item.owner);
        response.push({
            title: item.title,
            description: item.description,
            id: item._id,
            imageUrl: item.image,
            author: authorName.login
        });
    }

    res.json(response);
});

router.get('/write', ensureAuth, (req, res) => {
    res.render('write', {
        title: "Добавить кота",
        isWrite: true
    });
});

router.post('/write',
    ensureAuth,
    upload.single('photo'),
    [
        check('title').isLength({ max: 50 }).notEmpty().withMessage("Название не должно быть пустым и не может превышать 50 символов"),
        check('description').isLength({ max: 500 }).withMessage("Описание должно быть менее 500 символов"),
        check('photo').custom((val, { req }) => {
            if (req.file != undefined)
                switch (req.file.mimetype) {
                    case 'image/png':
                        return true;
                    case 'image/jpeg':
                        return true;
                    default:
                        throw new Error('Требуется изображение');
                }
            else
                throw new Error('Требуется изображение');
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('write', {
                title: "Добавить кота",
                isWrite: true,
                errors: errors.array()
            });
            return;
        }

        const objectImage = {
            title: req.body.title,
            content: req.body.content,
            description: req.body.description,
            owner: req.user._id
        }

        if (req.file != undefined)
            objectImage.image = pathDataUploads + req.file.filename

        const image = new Image(objectImage);
        await image.save();

        res.redirect('/image/' + image._id);
    }
);

router.get('/image/:id', ensureAuth, async (req, res) => {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);
    const user = await User.findById(image.owner);
    res.render('cat', {
        title: image.title,
        image,
        user
    });
});

router.delete('/image/:id', ensureAuth, async (req, res) => {
    const _id = req.params.id;
    await Image.deleteOne({ _id });
    res.sendStatus(200);
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: "Что это за сервис?",
    })
});

function ensureAuth(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else {
        req.flash('error', 'Для этого действия нужна авторизация');
        res.redirect('/login');
    }
}

module.exports = router;
