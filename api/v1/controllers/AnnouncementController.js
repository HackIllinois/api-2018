const bodyParser = require('body-parser');
const router = require('express').Router();

const AnnouncementRequest = require('../requests/AnnouncementRequest');
const AnnouncementService = require('../services/AnnouncementService');
const middleware = require('../middleware');
const roles = require('../utils/roles');

function getAllAnnouncements(req, res, next) {
  const before = (Date.parse(req.query.before)) ? new Date(req.query.before) : null;
  const after = (Date.parse(req.query.after)) ? new Date(req.query.after) : null;
  const limit = Number.parseInt(req.query.limit) || null;

  return AnnouncementService.getAllAnnouncements(before, after, limit)
    .then((result) => {
      res.body = result.toJSON();
      return next();
    })
    .catch((err) => next(err));
}

function createAnnouncement(req, res, next) {
  return AnnouncementService.createAnnouncement(req.body)
    .then((result) => {
      res.body = result.toJSON();
      return next();
    })
    .catch((err) => next(err));
}

function updateAnnouncement(req, res, next) {
  return AnnouncementService.findById(req.params.id)
    .then((announcement) => AnnouncementService.updateAnnouncement(announcement, req.body))
    .then((result) => {
      res.body = result.toJSON();
      return next();
    })
    .catch((err) => next(err));
}

function deleteAnnouncement(req, res, next) {
  return AnnouncementService.findById(req.params.id)
    .then((announcement) => AnnouncementService.deleteAnnouncement(announcement))
    .then(() => next())
    .catch((err) => next(err));
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
