


module.exports = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after 10 min"
});
app.post("/create-account", loginLimiter, function(req, res) {
  //...
});