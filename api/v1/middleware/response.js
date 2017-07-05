module.exports = (req, res, next) => {
  if (res.headersSent) {
    return next();
  }

  const response = {
    meta: (res.meta) ? res.meta : null,
    data: (res.body) ? res.body : {}
  };

  res.json(response);
  return next();
};
