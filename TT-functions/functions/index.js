require("dotenv").config();

const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./utility/fbAuth");

const { getAllStatus, postOneStatus } = require("./handlers/status");
const { signup, login, uploadImage } = require("./handlers/users");

// Status Routes
app.get("/all-status", getAllStatus);
app.post("/post-status", FBAuth, postOneStatus);

// User Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/users/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
