const requestLogger = (req, res, next) => {
    console.log(`A new request received at ${Date.now()}`);
    next();
  };

  module.exports = requestLogger;