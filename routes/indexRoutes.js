const router = require("express").Router();
const { indexRoute } = require("../controllers/indexControllers");

router.route("/").get(indexRoute);

module.exports = router;