var express = require("express");
var router = express.Router();
const jsend = require("jsend");
router.use(jsend.middleware);

/* GET home page. */
router.post("/", function (req, res, next) {
  const test = req.body.email;
  res.jsend.success(test);
});

module.exports = router;
