function marshalBody(body) {
  if (typeof body !== 'object') {
	throw new Error("The response body must be an object or empty");
  }

  return body;
}

module.exports = function (req, res, next) {
	var response = {
		meta: (res.meta) ? res.meta : null,
		data: (res.body) ? marshalBody(res.body) : {}
	};

	res.json(response);
};
