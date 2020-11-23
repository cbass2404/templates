require("dotenv").config();

const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./utility/fbAuth");

const { db } = require("./utility/admin");

const {
  getAllStatus,
  postOneStatus,
  getStatus,
  commentOnStatus,
  likeStatus,
  unlikeStatus,
  deleteStatus,
} = require("./handlers/status");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

// Status Routes
app.get("/all-status", getAllStatus);
app.post("/post-status", FBAuth, postOneStatus);
app.get("/status/:statusId", getStatus);
app.post("/status/:statusId/comment", FBAuth, commentOnStatus);
app.delete("/status/:statusId", FBAuth, deleteStatus);
app.get("/status/:statusId/like", FBAuth, likeStatus);
app.get("/status/:statusId/unlike", FBAuth, unlikeStatus);

// User Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/users/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/status/${snapshot.data().statusId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            statusId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/status/${snapshot.data().statusId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            statusId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
