var express = require("express");
var router = express.Router();
const jsend = require("jsend");
router.use(jsend.middleware);
const CyclicDB = require("@cyclic.sh/dynamodb");
const db = CyclicDB(process.env.CYCLIC_DB);
let participants = db.collection("participants");

router.get("/", async function (req, res, next) {
  let data = [];
  let list = await participants.list();
  for (const participant of list.results) {
    let item = await participants.get(participant.key);
    if (item.props.active == true) {
      data.push(item);
    }
  }
  console.log(data);
  res.jsend.success(data);
});

router.get("/:details", async function (req, res, next) {
  let details = await participants.list();
  console.log(details.results);
  res.jsend.success(details);
});

router.post("/add", async function (req, res, next) {
  const { email, firstName, lastName, dob, active } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  if (!email || isValidEmail == false) {
    return res.jsend.fail("You must provide a valid email");
  }
  await participants.set(email, {
    firstName: firstName,
    secondName: lastName,
    dob: dob,
    active: active,
  });
  res.jsend.success("You successfully added a record");
});

module.exports = router;
