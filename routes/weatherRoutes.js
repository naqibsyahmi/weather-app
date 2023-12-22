const router = require("express").Router();
const { weatherRoute } = require("../controllers/weatherControllers");

router.route("/forecast").get(weatherRoute); // /forecast?q=query (forecast)

module.exports = router;
