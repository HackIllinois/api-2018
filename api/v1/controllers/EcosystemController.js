const bodyParser = require('body-parser');
const middleware = require('../middleware');
const router = require('express').Router();

const requests = require('../requests');
const roles = require('../utils/roles');

const EcosystemService = require('../services/EcosystemService');

function createEcosystem(req, res, next) {
	EcosystemService
		.createEcosystem(req.body.name)
		.then((newEcosystem) => {
			res.body = newEcosystem.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function getAllEcosystems(req, res, next) {
	EcosystemService
		.getAllEcosystems()
		.then((results) => {
			res.body = results.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function deleteEcosystem(req, res, next) {
	EcosystemService
		.deleteEcosystem(req.body.name)
		.then(() => {
			res.body = {};

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/all', middleware.permission(roles.ORGANIZERS), getAllEcosystems);
router.post('/', middleware.request(requests.EcosystemCreationRequest), middleware.permission(roles.ORGANIZERS), createEcosystem);
router.delete('/', middleware.permission(roles.ORGANIZERS), deleteEcosystem);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
