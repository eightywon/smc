config_data = require("./config.json");
const mongoose = require("./database/mongoose");
const express = require("express");
const User = require("./database/models/users");
const Post = require("./database/models/posts");
const twilio = require('twilio')(config_data.twilio_sid, config_data.twilio_token);
const https = require("https");
const fs = require("fs");
const app = express();
const key = fs.readFileSync("../frontend/smokingmonkey.club.key");
const cert = fs.readFileSync("../frontend/smokingmonkey.club.crt");
const sslCreds = { key: key, cert: cert };
const httpsServer = https.createServer(sslCreds, app);
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Event = require("./database/models/events");
const socketServer = https.createServer(sslCreds, app);

const { Server } = require("socket.io");
const io = new Server(socketServer, {
  cors: {
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

app.use(express.json());

//set headers for CORS support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,AcceptContent-Type,Authorization");
  next();
});

app.post("/regsms", function (req, res) {
  twilio.messages.create({
    body: req.body.message,
    from: '+12107746873',
    to: '1' + req.body.cell
  })
    .then(message => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 201;
      res.send(JSON.stringify({ sid: message.sid, status: res.statusCode }));
    })
    .catch(error => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 202;
      res.send(JSON.stringify({ error: `${error}`, status: res.statusCode }));
      res.end();
      console.log(error)
    });
});

//users
app.get("/users", (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((error) => console.log(error));
});

app.post("/updateAvatar", (req, res) => {
  const newDir = `/root/smc/frontend/src/assets/avatars/${req.body._id}`;
  try {
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }

    fs.copyFile(`/root/smc/frontend/src/assets/avatars/${req.body.newAvatarLoc}`, `${newDir}/avatar.png`, (err) => {
      if (err) throw err;

      fs.unlink(`/root/smc/frontend/src/assets/avatars/${req.body.newAvatarLoc}`, (err) => {
        if (err) throw err;
      });

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.send(JSON.stringify({ result: `success` }));
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addUser", (req, res) => {
  (new User({
    'realName': req.body.realName,
    'displayName': req.body.displayName,
    'email': req.body.email,
    'cell': req.body.cell,
    'verificationCode': req.body.verificationCode
  }))
    .save()
    .then((user) => {
      //generate JWT 
      let payload = { subject: user._id };
      let token = jwt.sign(payload, config_data.jwt_key);

      const newDir = `/root/smc/frontend/src/assets/avatars/${user._id}`
      try {
        if (!fs.existsSync(newDir)) {
          fs.mkdirSync(newDir);
        }

        fs.copyFile("/root/smc/frontend/src/assets/smc_head.png", `${newDir}/avatar.png`, (err) => {
          if (err) throw err;
          console.log("copied avatar");
        });
      } catch (err) {
        console.log(err);
      }

      res.status(200).send({ token, userId: user._id });
    })
    .catch((error) => console.log(error));
});

app.get("/users/:_id", (req, res) => {
  User.find({ _id: req.params._id })
    .then(user => {
      res.send(user[0])
    })
    .catch((error) => console.log(error));
});

app.get("/userByCell/:cell", (req, res) => {
  User.find({ cell: req.params.cell })
    .then(user => res.send(user))
    .catch((error) => console.log(error));
});

app.patch("/users/:_id", (req, res) => {
  User.findOneAndUpdate({ "_id": req.params._id }, { $set: req.body }, { new: true })
    .then(user => res.send(user))
    .catch((error) => console.log(error));
});

app.delete("/users/:_id", (req, res) => {
  User.findOneAndDelete({ "_id": req.params._id })
    .then(user => res.send(user))
    .catch((error) => console.log(error));
});

app.get("/login/:_id", (req, res) => {
  console.log("login generating jwt", req.params);
  //generate JWT 
  let payload = { subject: req.params._id };
  let token = jwt.sign(payload, config_data.jwt_key);
  //console.log({token});
  res.status(200).send({ token, userId: req.params._id });
});

//posts by specific user
app.get("/users/:_id/posts/", (req, res) => {
  Post.find({ postedByUserId: req.params._id })
    .then(post => res.send(post))
    .catch((error) => console.log(error));
});

//posts
app.get("/posts", verifyToken, (req, res) => {
  Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "postedByUserId",
        foreignField: "_id",
        as: "postUser"
      }
    },
    {
      $unwind: "$postUser"
    }
  ])
    .then(function (agg) {
      Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "replies.postedByUserId",
            foreignField: "_id",
            as: "replyUser"
          }
        },
        {
          $unwind: "$replyUser"
        },
        {
          $project: {
            "_id": 0,
            "replyUser._id": 1,
            "replyUser.displayName": 1
          }
        }
      ])
        .then(function (repAgg) {
          for (var i = 0; i < agg.length; i++) {
            for (var x = 0; x < agg[i].replies.length; x++) {
              for (var z = 0; z < repAgg.length; z++) {
                if (repAgg[z].replyUser._id.equals(agg[i].replies[x].postedByUserId)) {
                  agg[i].replies[x].displayName = repAgg[z].replyUser.displayName;
                }
              }
            }
          }
          io.emit("postCollection", agg);
          res.send(agg);
        })

    })
    .catch((error) => console.log(error));
});

app.post("/addPost", (req, res) => {
  (new Post({
    'postText': req.body.postText,
    'postedByUserId': req.body.postedByUserId,
    'postDate': new Date()
  }))
    .save()
    .then(function (post) {
      Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postedByUserId",
            foreignField: "_id",
            as: "postUser"
          }
        },
        {
          $unwind: "$postUser"
        }
      ])
        .then(function (agg) {
          Post.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "replies.postedByUserId",
                foreignField: "_id",
                as: "replyUser"
              }
            },
            {
              $unwind: "$replyUser"
            },
            {
              $project: {
                "_id": 0,
                "replyUser._id": 1,
                "replyUser.displayName": 1
              }
            }
          ])
            .then(function (repAgg) {
              for (var i = 0; i < agg.length; i++) {
                for (var x = 0; x < agg[i].replies.length; x++) {
                  for (var z = 0; z < repAgg.length; z++) {
                    if (repAgg[z].replyUser._id.equals(agg[i].replies[x].postedByUserId)) {
                      agg[i].replies[x].displayName = repAgg[z].replyUser.displayName;
                    }
                  }
                }
              }
              io.emit("postCollection", agg);
              res.send(agg);
            })

        })

    })
});

app.get("/posts/:_id", (req, res) => {
  Post.find({ _id: req.params._id })
    .then(post => res.send(post))
    .catch((error) => console.log(error));
});

app.delete("/posts/:_id", (req, res) => {
  Post.findOneAndDelete({ "_id": req.params._id })
    .then(post => {
      Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postedByUserId",
            foreignField: "_id",
            as: "postUser"
          }
        },
        {
          $unwind: "$postUser"
        }
      ])
        .then(function (agg) {
          Post.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "replies.postedByUserId",
                foreignField: "_id",
                as: "replyUser"
              }
            },
            {
              $unwind: "$replyUser"
            },
            {
              $project: {
                "_id": 0,
                "replyUser._id": 1,
                "replyUser.displayName": 1
              }
            }
          ])
            .then(function (repAgg) {
              for (var i = 0; i < agg.length; i++) {
                for (var x = 0; x < agg[i].replies.length; x++) {
                  for (var z = 0; z < repAgg.length; z++) {
                    if (repAgg[z].replyUser._id.equals(agg[i].replies[x].postedByUserId)) {
                      agg[i].replies[x].displayName = repAgg[z].replyUser.displayName;
                    }
                  }
                }
              }
              io.emit("postCollection", agg);
              res.send(agg);
            })

        })
    })
    .catch((error) => console.log(error));
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized Request");
  }
  let token = req.headers.authorization.split(" ")[1]; //the token
  if (token === 'null') {
    return res.status(401).send("Unauthorized Request");
  }
  try {
    const payload = jwt.verify(token, config_data.jwt_key);
    req.userId = payload.subject;
    next();
  } catch (err) {
    console.log("jwt err: ", err);
    return res.status(401).send("Unauthorized Request");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/root/smc/frontend/src/assets/avatars/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/uploadFile", upload.single("avatarUpload"), uploadFiles);

function uploadFiles(req, res) {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  else if (!req.file) {
    return res.send({ "resp": "Please select an image to upload" });
  }
  /*
  else if (err instanceof multer.MulterError) {
    console.log("error 3");
    return res.send(JSON.stringify(err));
  }
  else if (err) {
    console.log("error 4");
    return res.send(JSON.stringify(err));
  }
  */
  //we good
  res.send({ "loc": req.file.filename });
}

//replies
app.patch("/addReply/:_id", (req, res) => {
  //User.findOneAndUpdate({ "_id": req.params._id }, { $set: req.body }, { new: true })
  console.log("addReply, parentId: ", req.params);
  const repObj = {
    'postText': req.body.postText,
    'postedByUserId': req.body.postedByUserId,
    'postDate': new Date(),
    'parentId': req.body.parentId
  };
  Post.findOneAndUpdate({ "_id": req.params._id }, { $push: { replies: repObj } }, { new: true })
    .then(post => {
      Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postedByUserId",
            foreignField: "_id",
            as: "postUser"
          }
        },
        {
          $unwind: "$postUser"
        }
      ])
        .then(function (agg) {
          Post.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "replies.postedByUserId",
                foreignField: "_id",
                as: "replyUser"
              }
            },
            {
              $unwind: "$replyUser"
            },
            {
              $project: {
                "_id": 0,
                "replyUser._id": 1,
                "replyUser.displayName": 1
              }
            }
          ])
            .then(function (repAgg) {
              for (var i = 0; i < agg.length; i++) {
                for (var x = 0; x < agg[i].replies.length; x++) {
                  for (var z = 0; z < repAgg.length; z++) {
                    if (repAgg[z].replyUser._id.equals(agg[i].replies[x].postedByUserId)) {
                      agg[i].replies[x].displayName = repAgg[z].replyUser.displayName;
                    }
                  }
                }
              }
              io.emit("postCollection", agg);
              res.send(agg);
            })

        })
    })
    .catch((error) => console.log(error));
});

//socketio shit
io.on('connection', (socket) => {
  console.log('a user connected ', socket.id);

  /*
  socket.on("getDoc", docId => {
    console.log("getDoc");
    io.emit("document", "io emit");
    //socket.emit("document", "socket emit");
  });
  */
  socket.on("someoneTyping", (postId, socketId) => {
    //console.log("someone is typing ",postId,socketId);
    io.emit("someoneTyping", postId, socketId);
  });
});

httpsServer.listen(3978, function () {
  console.log("listening on port 3978");
});

socketServer.listen(4444, function () {
  console.log("socket io listening on port 4444");
});

//events
app.get("/events", verifyToken, (req, res) => {
  console.log("getting events");
  Event.find({})
    .then(function (agg) {
      //io.emit("postCollection", agg);
      //console.log(agg);
      res.send(agg);
    })
    .catch((error) => console.log(error));
});

app.post("/addEvent", (req, res) => {
  console.log("adding event, ",req.body);
  (new Event({
    'eventDescription': req.body.eventDescription,
    'eventCreatedByUserId': req.body.eventCreatedByUserId,
    'creationDate': new Date(),
    'eventType': req.body.eventType,
    'eventDateTime': req.body.eventDateTime,
    'eventOtherDesc': req.body.eventOtherDesc
  }))
    .save()
    .then(function (event) {
      res.send(event);
      console.log("add event: ",event);

    })
});

app.delete("/events/:_id", (req, res) => {
  console.log("del event ",req.params._id);
  Event.findOneAndDelete({ "_id": req.params._id })
    .then(event => res.send(event))
    .catch((error) => console.log(error));
});