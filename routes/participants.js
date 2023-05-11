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
    data.push(item);
  }
  res.jsend.success(data);
});

router.get("/details", async function (req, res, next) {
  let data = [];
  let list = await participants.list();
  for (const participant of list.results) {
    let item = await participants.get(participant.key);
    if (item.props.active == true) {
      data.push(item);
    }
  }
  res.jsend.success(data);
});

router.get("/details/deleted", async function (req, res, next) {
  let data = [];
  let list = await participants.list();
  for (const participant of list.results) {
    let item = await participants.get(participant.key);
    if (item.props.active == false) {
      data.push(item);
    }
  }
  res.jsend.success(data);
});

router.get("/details/:email", async function (req, res, next) {
  let item = await participants.get(req.params.email);
  if (item == null) {
    return res.jsend.fail("No participant with this email");
  }
  console.log(item);
  if (item != null && item.props.active != true) {
    return res.jsend.fail("No active participant with this email");
  }
  res.jsend.success(item);
});

router.get("/work/:email", async function (req, res, next) {
  let item = await participants.get(req.params.email);
  if (item == null) {
    return res.jsend.fail("No participant with this email");
  }
  if (item != null && item.props.active != true) {
    return res.jsend.fail("No active participant with this email");
  }
  let participantWork = await participants
    .item(req.params.email)
    .fragment("work")
    .get();
  console.log(participantWork[0].props.currency);
  let workDetails = {
    currency: participantWork[0].props.currency,
    company: participantWork[0].props.company,
    salary: participantWork[0].props.salary,
  };
  res.jsend.success(workDetails);
});

router.get("/home/:email", async function (req, res, next) {
  let item = await participants.get(req.params.email);
  if (item == null) {
    return res.jsend.fail("No participant with this email");
  }
  if (item != null && item.props.active != true) {
    return res.jsend.fail("No active participant with this email");
  }
  let participantWork = await participants
    .item(req.params.email)
    .fragment("home")
    .get();
  let homeDetails = {
    currency: participantWork[0].props.country,
    company: participantWork[0].props.city,
  };
  res.jsend.success(homeDetails);
});

router.post("/add", async function (req, res, next) {
  let { email, firstName, lastName, dob, active } = req.body;
  let { company, salary, currency, country, city } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  const isValidDate = dateRegex.test(dob);

  if (!email || isValidEmail == false) {
    return res.jsend.fail("You must provide a valid email");
  }
  if (!firstName) {
    return res.jsend.fail("You must provide a first name");
  }
  if (!lastName) {
    return res.jsend.fail("You must provide a first name");
  }
  if (!active) {
    active = false;
  }
  if (!dob || isValidDate == false) {
    return res.jsend.fail("You must provide a valid date");
  }
  if (!company) {
    return res.jsend.fail("You must provide a company");
  }
  if (!salary) {
    return res.jsend.fail("You must provide a salary");
  }
  if (!currency) {
    return res.jsend.fail("You must provide a currency");
  }
  if (!country) {
    return res.jsend.fail("You must provide a country");
  }
  if (!city) {
    return res.jsend.fail("You must provide a city");
  }
  await participants.set(email, {
    firstName: firstName,
    secondName: lastName,
    dob: dob,
    active: active,
  });
  await participants.item(email).fragment("work").set({
    company: company,
    salary: salary,
    currency: currency,
  });
  await participants.item(email).fragment("home").set({
    country: country,
    city: city,
  });
  res.jsend.success("You successfully added a record");
});

router.delete("/:email", async function (req, res, next) {
  let item = await participants.get(req.params.email);
  if (item == null || item == undefined) {
    return res.jsend.fail("No user with that email");
  }
  await participants.delete(req.params.email);
  res.jsend.success("You successfully deleted a participant.");
});

router.put("/:email", async function (req, res, next) {
  let { email, firstName, lastName, dob, active } = req.body;
  let { company, salary, currency, country, city } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  const isValidDate = dateRegex.test(dob);

  if (!email || isValidEmail == false) {
    return res.jsend.fail("You must provide a valid email");
  }
  if (!firstName) {
    return res.jsend.fail("You must provide a first name");
  }
  if (!lastName) {
    return res.jsend.fail("You must provide a first name");
  }
  if (!active) {
    active = false;
  }
  if (!dob || isValidDate == false) {
    return res.jsend.fail("You must provide a valid date");
  }
  if (!company) {
    return res.jsend.fail("You must provide a company");
  }
  if (!salary) {
    return res.jsend.fail("You must provide a salary");
  }
  if (!currency) {
    return res.jsend.fail("You must provide a currency");
  }
  if (!country) {
    return res.jsend.fail("You must provide a country");
  }
  if (!city) {
    return res.jsend.fail("You must provide a city");
  }
  await participants.set(email, {
    firstName: firstName,
    secondName: lastName,
    dob: dob,
    active: active,
  });
  await participants.item(email).fragment("work").set({
    company: company,
    salary: salary,
    currency: currency,
  });
  await participants.item(email).fragment("home").set({
    country: country,
    city: city,
  });
  res.jsend.success("You successfully updated a record");
});

module.exports = router;
