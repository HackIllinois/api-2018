const bodyParser = require('body-parser');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function createTrackedEvent(req, res, next) {
	services.TrackingService
		.createTrackingEvent(req.body)
		.then((result) => {
			res.body = result.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function addTrackedEventParticipant(req, res, next) {
	services.TrackingService
		.addEventParticipant(req.params.participantId)
		.then(() => {

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.UniversalTrackingRequest),
	middleware.permission(roles.ADMIN), createTrackedEvent);
router.get('/:participantId', middleware.permission(roles.HOSTS), addTrackedEventParticipant);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
