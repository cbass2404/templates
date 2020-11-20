let db = {
  users: [
    {
      userId: "dh23ggj5h32g43j5gf43",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-03-15T10:59:52.798Z",
      imageUrl: "image/dsfaslkdfjasflkjsa/asldkfjslkfj",
      bio: "Hello, stuff about me",
      website: "https://user.com",
      location: "Newnan, Ga",
    },
  ],
  status: [
    {
      userHandle: "user",
      body: "this is the status body",
      createdAt: "2020-11-18T22:55:45.116Z",
      likeCount: 5,
      commentCount: 2,
    },
  ],
  comments: [
    {
      userHandle: "user",
      statusId: "lkjsdflkjsflksnv",
      body: "comment",
      createdAt: "2020-11-20T12:43:45.654Z",
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "dh23ggj5h32g43j5gf43",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfaslkdfjasflkjsa/asldkfjslkfj",
    bio: "Hello, stuff about me",
    website: "https://user.com",
    location: "Newnan, Ga",
  },
  likes: [
    {
      userHandle: "user",
      statusId: "lkjdjf88978fasdkf",
    },
    {
      userHandle: "user",
      statusId: "lkjfasldk982409234kjf",
    },
  ],
};
