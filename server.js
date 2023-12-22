const express = require("express");
const path = require("path");
const { router } = require("./routes");
const { PORT } = require("./config/envConfig");

const app = express();
app.use(express.urlencoded({ extended: true}));

// Serve static files from the "public" directory
app.use(express.static(path.resolve(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});