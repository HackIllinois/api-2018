var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();

var requests = require('../requests');
var roles = require('../utils/roles');

var EcosystemService = require('../services/EcosystemService');


function createEcosystem (req, res, next) {
    var name = req.body.name;

    EcosystemService
		.createEcosystem(name)
		.then(function (newEcosystem) {
    res.body = newEcosystem.toJSON();

    next();
    return null;
})
		.catch(function (error){
    next(error);
    return null;
});
}

function getAllEcosystems (req, res, next) {
    EcosystemService
		.getAllEcosystems()
		.then(function (results) {
    res.body = results.toJSON();

    next();
    return null;
})
		.catch(function (error){
    next(error);
    return null;
});
}

function deleteEcosystem (req, res, next) {
    var name = req.body.name;

    EcosystemService
		.deleteEcosystem(name)
		.then(function () {
    res.body = {};

    next();
    return null;
})
		.catch(function (error){
    next(error);
    return null;
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
