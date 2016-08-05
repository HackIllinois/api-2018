/* jshint esversion: 6 */

var _Promise = require('bluebird');

var errors = require('../errors');
const TOO_MANY_REQUESTS = "The maximum number of concurrent requests was exceeded";

/**
 * A self-managed mapping of requesters to their requests. Serves to keep concurrent
 * requests synchronous while enforcing a maximum number of such requests.
 * It is recommended that the maximum number of requests be set low to avoid high memory usage.
 * @param {Integer} maxRequests			the maximum number of concurrent requests to allow per requester
 * @param {Function} resolveRequester	a method that returns a hashable entity representing
 *                                    	the requester given an Express request object
 */
function RequestQueueMap(maxRequests, resolveRequester) {
	this._requestQueues = {};
	this._maxRequests = maxRequests;
	this._resolveRequester = resolveRequester;
}

RequestQueueMap.prototype._finalizeDequeue = function (requester) {
	if (this._requestQueues.hasOwnProperty(requester)) {
		this._requestQueues[requester].unshift();
		this._dequeue(requester);
	}
};

RequestQueueMap.prototype._buildQueueObject = function (requester, req, res, next) {
	req.release = function () { this._finalizeDequeue(requester); };
	return { req: req, res: res, next: next, processing: false };
};

RequestQueueMap.prototype._enqueue = function (requester, queueObject) {
	if (!this._requestQueues.hasOwnProperty(requester)) {
		this._requestQueues[requester] = [];
	}

	if (this._requestQueues[requester].length >= this._maxRequests) {
		queueObject.next(new errors.RateLimitError(TOO_MANY_REQUESTS));
	} else {
		this._requestQueues[requester].push(queueObject);
		this._dequeue(requester);
	}
};

RequestQueueMap.prototype._dequeue = function (requester) {
	if (!this._requestQueues.hasOwnProperty(requester)) {
		return;
	}

	if (this._requestQueues[requester].length === 0) {
		delete this._requestQueues[requester];
		return;
	}

	if (!this._requestQueues[requester][0].processing) {
		var currentRequest = this._requestQueues[requester][0];
		currentRequest.processing = true;
		currentRequest.next();
	}
};

/**
 * Enqueues a request. Later request handlers _must_ call req.release() after
 * synchronous processing is complete, or the queue will be unable to dequeue
 * @param  {Object}   req 	an Express request object
 * @param  {Object}   res	an Express response object
 * @param  {Function} next	an Express request-response cycle callback
 */
RequestQueueMap.prototype.enqueue = function (req, res, next) {
	if ('function' === typeof this._resolveRequester.then) {
		this._resolveRequester(req)
			.then(function (requester) {
				this._enqueue(requester, _buildQueueObject(requester, req, res, next));
			})
			.catch(function (error) {
				next(error);
			});
	} else {
		var requester = this._resolveRequester(req);
		this._enqueue(requester, _buildQueueObject(requester, req, res, next));
	}
};

RequestQueue.prototype.constructor = RequestQueue;

module.exports = function (maxRequests, resolveRequester) {
	var synchronizer = new RequestQueueMap(maxRequests, resolveRequester);

	return function (req, res, next) {
		synchronizer.enqueue(req, res, next);
	};
};
