var express = require("express");
var router = express.Router();
const jsend = require("jsend");
router.use(jsend.middleware);
const CyclicDB = require("@cyclic.sh/dynamodb");
const db = CyclicDB(process.env.CYCLIC_DB);
let participants = db.collection("participants");

/* GET home page. */
router.post("/", async function (req, res, next) {
  const { email, firstName, lastName, dob, active } = req.body;
  const isValidEmail = emailRegex.test(email);

  if (!email || isValidEmail == false) {
    return res.jsend.fail("You must provide a valid email");
  }
  await users.set(email, {
    firstName: firstName,
    secondName: lastName,
    dob: dob,
    active: active,
  });
  res.jsend.success("You successfully added a record");
});

module.exports = router;
