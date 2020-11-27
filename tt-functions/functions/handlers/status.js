const { db } = require("../utility/admin");

exports.getAllStatus = (req, res) => {
  db.collection("status")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let status = [];
      data.forEach((doc) => {
        status.push({
          statusId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(status);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneStatus = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newStatus = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("status")
    .add(newStatus)
    .then((doc) => {
      const resStatus = newStatus;
      resStatus.statusId = doc.id;
      res.json({ resStatus });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

// Fetch one status
exports.getStatus = (req, res) => {
  let statusData = {};
  db.doc(`/status/${req.params.statusId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      statusData = doc.data();
      statusData.statusId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("statusId", "==", req.params.statusId)
        .get();
    })
    .then((data) => {
      statusData.comments = [];
      data.forEach((doc) => {
        statusData.comments.push(doc.data());
      });
      return res.json(statusData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on Status
exports.commentOnStatus = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    statusId: req.params.statusId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/status/${req.params.statusId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// Like a status
exports.likeStatus = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("statusId", "==", req.params.statusId)
    .limit(1);

  const statusDocument = db.doc(`/status/${req.params.statusId}`);

  let statusData;

  statusDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        statusData = doc.data();
        statusData.statusId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Status not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            statusId: req.params.statusId,
            userHandle: req.user.handle,
          })
          .then(() => {
            statusData.likeCount++;
            return statusDocument.update({ likeCount: statusData.likeCount });
          })
          .then(() => {
            return res.json(statusData);
          });
      } else {
        return res.status(400).json({ error: "Status already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// unlike status
exports.unlikeStatus = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("statusId", "==", req.params.statusId)
    .limit(1);

  const statusDocument = db.doc(`/status/${req.params.statusId}`);

  let statusData;

  statusDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        statusData = doc.data();
        statusData.statusId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Status not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Status not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            statusData.likeCount--;
            return statusDocument.update({ likeCount: statusData.likeCount });
          })
          .then(() => {
            res.json(statusData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete a status
exports.deleteStatus = (req, res) => {
  const document = db.doc(`/status/${req.params.statusId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Status deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
