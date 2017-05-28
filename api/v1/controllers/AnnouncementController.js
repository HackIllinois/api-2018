var bodyParser = require('body-parser');
var router = require('express')
  .Router();

var AnnouncementRequest = require('../requests/AnnouncementRequest');
var AnnouncementService = require('../services/AnnouncementService');
var middleware = require('../middleware');
var roles = require('../utils/roles');

function getAllAnnouncements(req, res, next) {

    var before = (Date.parse(req.query.before)) ? new Date(req.query.before) : null;
    var after = (Date.parse(req.query.after)) ? new Date(req.query.after) : null;
    var limit = Number.parseInt(req.query.limit) || null;

    return AnnouncementService.getAllAnnouncements(before, after, limit)
    .then(function(result) {
        res.body = result.toJSON();
        next();
        return null;
    })
    .catch(function(err) {
        next(err);
        return null;
    });
}

function createAnnouncement(req, res, next) {
    return AnnouncementService.createAnnouncement(req.body)
    .then(function(result) {
        res.body = result.toJSON();
        next();
        return null;
    })
    .catch(function(err) {
        next(err);
        return null;
    });
}

function updateAnnouncement(req, res, next) {
    return AnnouncementService.findById(req.params.id)
    .then(function(announcement) {
        return AnnouncementService.updateAnnouncement(announcement, req.body);
    })
    .then(function(result) {
        res.body = result.toJSON();
        next();
        return null;
    })
    .catch(function(err) {
        next(err);
        return null;
    });
}

function deleteAnnouncement(req, res, next) {
    return AnnouncementService.findById(req.params.id)
    .then(function(announcement) {
        return AnnouncementService.deleteAnnouncement(announcement);
    })
    .then(function() {
        next();
        return null;
    })
    .catch(function(err) {
        next(err);
        return null;
    });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(AnnouncementRequest), middleware.permission(roles.ADMIN), createAnnouncement);
router.get('/all', getAllAnnouncements);
router.put('/:id(\\d+)', middleware.request(AnnouncementRequest), middleware.permission(roles.ADMIN), updateAnnouncement);
router.delete('/:id(\\d+)', middleware.permission(roles.ADMIN), deleteAnnouncement);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
