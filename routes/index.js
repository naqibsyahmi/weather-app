const router = require("express").Router();
const indexRouter = require("./indexRoutes");
const weatherRouter = require("./weatherRoutes");

router.use("/", indexRouter);
router.use("/", weatherRouter);

module.exports = { router };