module.exports = {
	ApiError: require('./ApiError.js'),
	EntityNotSupportedError: require('./EntityNotSupportedError.js'),
	EntityTooLargeError: require('./EntityTooLargeError.js'),
	ExistsError: require('./ExistsError.js'),
	ExternalProviderError: require('./ExternalProviderError.js'),
	InvalidHeaderError: require('./InvalidHeaderError.js'),
	InvalidParameterError: require('./InvalidParameterError.js'),
	MissingHeaderError: require('./MissingHeaderError.js'),
	MissingParameterError: require('./MissingParameterError.js'),
	NotFoundError: require('./NotFoundError.js'),
	TokenExpirationError: require('./TokenExpirationError.js'),
	UnauthorizedError: require('./UnauthorizedError.js'),
	UnprocessableRequestError: require('./UnprocessableRequestError.js')
};
