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
    createdAt: new Date().toISOString(),
  };

  db.collection("status")
    .add(newStatus)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
