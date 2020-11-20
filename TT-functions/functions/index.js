require("dotenv").config();

const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./utility/fbAuth");

const { getAllStatus, postOneStatus } = require("./handlers/status");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

// Status Routes
app.get("/all-status", getAllStatus);
app.post("/post-status", FBAuth, postOneStatus);
app.get("/status/:statusId", getStatus);
// TODO: comment on status
// TODO: delete status
// TODO: like a status
// TODO: unlike a status

// User Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/users/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
