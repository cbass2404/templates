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
app.get("/status", getAllStatus);
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
    return db
      .doc(`/status/${snapshot.data().statusId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/status/${snapshot.data().statusId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();
      return db
        .collection("status")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const status = db.doc(`/status/${doc.id}`);
            batch.update(status, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onStatusDelete = functions
  .region("us-central1")
  .firestore.document("/status/{statusId}")
  .onDelete((snapshot, context) => {
    const statusId = context.params.statusId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("statusId", "==", statusId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("statusId", "==", statusId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("statusId", "==", statusId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
