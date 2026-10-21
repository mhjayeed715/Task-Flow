function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function malformedJson(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body' });
  }
  next(err);
}

function serverError(err, req, res, next) {
  res.status(500).json({ error: 'An unexpected error occurred' });
}

export { notFound, malformedJson, serverError };
