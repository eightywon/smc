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

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,AcceptContent-Type,Authorization");
  next();
});

app.post("/regsms", function (req, res, next) {
  twilio.messages.create({
    body: req.body.message,
    from: '+12107746873',
    to: '1' + req.body.cell
  })
    .then(message => {
      console.log(message.sid)
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
      
      const newDir=`/root/smc/frontend/src/assets/avatars/${user._id}`
      try {
        if (!fs.existsSync(newDir)) {
          fs.mkdirSync(newDir);
        }

        fs.copyFile("/root/smc/frontend/src/assets/smc_head.png",`${newDir}/avatar.png`, (err) => {
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
      console.log(user);
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
  Post.find({ postedByUserIdid: req.params._id })
    .then(post => res.send(post))
    .catch((error) => console.log(error));
});

//posts
app.get("/posts", verifyToken, (req, res) => {
  Post.aggregate([{
    $lookup: {
      from: "users",
      localField: "postedByUserId",
      foreignField: "_id",
      as: "users"
    }
  }])
    .then(function (agg) {
      res.send(agg);
    })
    .catch((error) => console.log(error));
});

/* outdated, sending back aggregate object above so we have access to posted by user's name
app.get("/posts",(req,res) => {
 Post.find({})
  .then(posts=>res.send(posts))
  .catch((error) => console.log(error));
});
*/

app.post("/addPost", (req, res) => {
  (new Post({
    'postText': req.body.postText,
    'postedByUserId': req.body.postedByUserId,
    'postDate': new Date()
  }))
    .save()
    .then((post) => {
      //send back new post collection so UI is updated
      Post.aggregate([{
        $lookup: {
          from: "users",
          localField: "postedByUserId",
          foreignField: "_id",
          as: "users"
        }
      }])
        .then(function (agg) {
          console.log("sending back ", agg);
          res.send(agg);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/posts/:_id", (req, res) => {
  Post.find({ _id: req.params._id })
    .then(post => res.send(post))
    .catch((error) => console.log(error));
});

app.delete("/posts/:_id", (req, res) => {
  Post.findOneAndDelete({ "_id": req.params._id })
    .then(post => {
      //send back new post collection so UI is updated
      Post.aggregate([{
        $lookup: {
          from: "users",
          localField: "postedByUserId",
          foreignField: "_id",
          as: "users"
        }
      }])
        .then(function (agg) {
          console.log("sending back ", agg);
          res.send(agg);
        })
        .catch((error) => console.log(error));
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
  console.log("will verify token");
  try {
    const payload = jwt.verify(token, config_data.jwt_key);
    req.userId = payload.subject;
    next();
  } catch (err) {
    console.log("jwt err: ", err);
    return res.status(401).send("Unauthorized Request");
  }
}

httpsServer.listen(3978, function () {
  console.log("listening on port 3978");
});
