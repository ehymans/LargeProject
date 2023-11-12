require("express");
require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}
exports.setApp = function (app, client) {
  app.post("/api/addExperience", async (req, res, next) => {
    // incoming: userId, awardExp
    // outgoing: error

    const { userId, awardExp, jwtToken } = req.body;
    /*try
          {
          if( token.isExpired(jwtToken))
            {
              var r = {error:'The JWT is no longer valid', jwtToken: ''};
              res.status(200).json(r);
              return;
            }
          }
        catch(e)
          {
            console.log("1");
            console.log(e.message);
            var r = {error:e.message, jwtToken: ''};
            res.status(200).json(r);
            return;
          }*/

    //const newCard = {Card:card,UserId:userId};
    var error = "";

    //const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

    try {
      //console.log("2");
      const db = client.db("LargeProject");
      const doc = await db
        .collection("TaskProgress")
        .find({ UserId: userId })
        .toArray();
      console.log("doc before update:", doc);

      if (doc.length == 0) {
        return record_not_found;
      } else if (doc.length > 1) {
        return too_many_records;
      } else {
        //id = results[0].UserId;
        CurExp = doc[0].CurrentExp;
        console.log("curExp");
        console.log(CurExp);

        //const curExp = db.collection.findOne()
        //{'title':'MongoDB Overview'},{$set:{'title':'New MongoDB Tutorial'}}
        const result = await db
          .collection("TaskProgress")
          .findOneAndUpdate(
            { UserId: userId },
            { $set: { CurrentExp: CurExp + awardExp } }
          );

        //test printing:
        //const newdoc = await db.collection('TaskProgress').find({UserId:"1"}).toArray();
        //console.log("newdoc:",newdoc);
      }
    } catch (e) {
      //console.log("3");
      error = e.toString();
    }
    var refreshedToken = null;
    /*try
          {
            //console.log("4");
            refreshedToken = token.refresh(jwtToken);
          }
          catch(e)
          {
            //console.log("5");
          console.log(e.message);
          }*/
    //cardList.push(card);

    var ret = { error: error };
    res.status(200).json(ret);
  });

  app.post("/api/addTask", async (req, res, next) => {
    const { userId, taskName, taskDescription, taskDifficulty, jwtToken } =
      req.body;

    try {
      const db = client.db("LargeProject");

      // Get the current maximum task ID in the collection

      // Increment the task ID

      const newTask = {
        UserID: userId,
        TaskName: taskName,
        TaskDescription: taskDescription,
        TaskDifficulty: taskDifficulty,
      };

      await db.collection("Tasks").insertOne(newTask);
      res.status(200).json({ success: "Task added" });
    } catch (e) {
      // Handle any database or other errors
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/register", async (req, res, next) => {
    // Incoming: first name, last name, username, password
    const { firstName, lastName, username, password, email } = req.body;

    try {
      const db = client.db("LargeProject");

      const normalizedUsername = username.toLowerCase();
      const existingUser = await db
        .collection("Users")
        .findOne({ Login: normalizedUsername });

      if (existingUser) {
        // Username is already taken
        return res.status(400).json({ error: "Username already taken" });
      } else {
        // Username is unique, insert the new user into the database
        const newUser = {
          FirstName: firstName,
          LastName: lastName,
          Login: username,
          Email: email,
          Password: password,
        };

        // Insert the new user into the database
        await db.collection("Users").insertOne(newUser);

        res.status(200).json({ success: "Registration successful" });
      }
    } catch (e) {
      // Handle any database or other errors
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/login", async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = "";

    //console.log(req.body);
    const { login, password } = req.body;

    const db = client.db("LargeProject");
    const results = await db
      .collection("Users")
      .find({ Login: login, Password: password })
      .toArray();

    var id = -1;
    var fn = "";
    var ln = "";
    var username = "";
    if (results.length > 0) {
      id = results[0].Login;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      try {
        const token = require("./createJWT.js");
        ret = token.createToken(fn, ln, id);
      } catch (e) {
        ret = { error: e.message };
      }
    } else {
      ret = { error: "Login/Password incorrect" };
      //ret = {error:"req.body"};
    }

    res.status(200).json(ret);
  });

  app.post("/api/searchcards", async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = "";

    const { userId, search, jwtToken } = req.body;
    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: "The JWT is no longer valid", jwtToken: "" };
        res.status(200).json(r);
        return;
      }
    } catch (e) {
      console.log(e.message);
      var r = { error: e.message, jwtToken: "" };
      res.status(200).json(r);
      return;
    }
    var _search = search.trim();

    const db = client.db("COP4331Cards");
    const results = await db
      .collection("Cards")
      .find({ Card: { $regex: _search + ".*", $options: "i" } })
      .toArray();

    var _ret = [];
    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i].Card);
    }
    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log(e.message);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
  });

  app.post("/api/searchtasks", async (req, res, next) => {
    var error = "";
    const { userId, search, jwtToken } = req.body;
    var _search = search.trim();
    const db = client.db("LargeProject");
    const results = await db
      .collection("Tasks")
      .find({ UserID: userId, TaskName: { $regex: _search, $options: "i" } })
      .toArray();
    // var _ret = [];
    // for( var i=0; i<results.length; i++ )
    // {
    //   _ret.push( results[i].TaskName );
    //   _ret.push( results[i].TaskDescription );
    //   _ret.push( results[i].TaskDifficulty );
    // }

    var ret = { results, error: error };
    res.status(200).json(ret);
  });

  app.post("/api/deletetask", async (req, res, next) => {
    // Incoming: taskId, jwtToken
    const { taskId, jwtToken } = req.body;

    try {
      const db = client.db("LargeProject");

      // Convert taskId to ObjectId
      const objectId = new ObjectId(taskId);

      // Check if the task exists
      const existingTask = await db
        .collection("Tasks")
        .findOne({ _id: objectId });

      if (!existingTask) {
        // Task not found
        return res.status(404).json({ error: "Task not found" });
      }

      // Delete the task from the database
      await db.collection("Tasks").deleteOne({ _id: objectId });

      res.status(200).json({ success: "Task deleted" });
    } catch (e) {
      // Handle any database or other errors
      res.status(500).json({ error: e.message });
    }
  });

  const { ObjectId } = require("mongodb");

  app.post("/api/updatetask", async (req, res, next) => {
    // Incoming: _id, taskName, taskDescription, taskDifficulty, jwtToken
    const { _id, taskName, taskDescription, taskDifficulty, jwtToken } =
      req.body;

    try {
      const db = client.db("LargeProject");

      // Convert _id to ObjectId
      const objectId = new ObjectId(_id);

      // Check if the task exists
      const existingTask = await db
        .collection("Tasks")
        .findOne({ _id: objectId });

      if (!existingTask) {
        // Task not found
        return res.status(404).json({ error: "Task not found" });
      }

      // Update the task fields
      await db.collection("Tasks").updateOne(
        { _id: objectId },
        {
          $set: {
            TaskName: taskName || existingTask.TaskName,
            TaskDescription: taskDescription || existingTask.TaskDescription,
            TaskDifficulty: taskDifficulty || existingTask.TaskDifficulty,
          },
        }
      );

      res.status(200).json({ success: "Task updated" });
    } catch (e) {
      // Handle any database or other errors
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/deletetask/:id", async (req, res) => {
    try {
      const UserObjectId = new ObjectId(req.params.id);
      const db = client.db("LargeProject");
      const task = await db
        .collection("Tasks")
        .deleteOne({ _id: UserObjectId });
      res.status(200).send("task Deleted");
    } catch (err) {
      console.error("Error deleting task: " + err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.put("/api/updatetask/:id", async (req, res) => {
    try {
      const db = client.db("LargeProject");
      const collection = db.collection("Tasks");
      const updatedTask = await collection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnOriginal: false }
      );
      if (updatedTask) {
        res.status(200).send("Task Updated!");
      }
    } catch (err) {
      console.error("Error updating task: " + err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/api/getcode/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const randomOTP = generateOTP();
      console.log(randomOTP);
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Dare2Do Verify Email!",
        text: `Here is your 6 digit one-time code: "${randomOTP}" to verify email.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ code: randomOTP });
      });
    } catch (error) {
      console.log("Error while sending email: ", error);
      res.status(500).send("Internal server error");
    }
  });

  app.patch("/api/reset-password/:UserID", async (req, res) => {
    try {
      const db = client.db("LargeProject");
      const collection = db.collection("Users");
      const user = await collection.findOneAndUpdate(
        { _id: new ObjectId(req.params.UserID) },
        { $set: req.body },
        { returnOriginal: false }
      );
      if (user) {
        await db
          .collection("userotp")
          .deleteOne({ userID: new ObjectId(req.params.UserID) });
        res.status(200).send("Password updated!");
      } else {
        res.status(404).send("User not found!");
      }
    } catch (error) {
      console.log("Error while updating password: ", error);
      res.status(500).send("Internal server error!");
    }
  });

  app.post("/api/send-reset-link", async (req, res) => {
    try {
      const origin = req.get("Referer");
      const db = client.db("LargeProject");
      const collection = db.collection("Users");
      const user = await collection.findOne(req.body);
      if (user) {
        const randomOTP = generateOTP();
        console.log(randomOTP);
        const existingUserCode = await db
          .collection("userotp")
          .findOne({ userID: user._id });
        if (existingUserCode) {
          console.log("OTP exist");
          const updatedUserCode = await db
            .collection("userotp")
            .findOneAndUpdate(
              { userID: user._id },
              { $set: { OTP: randomOTP } },
              { returnOriginal: false }
            );
        } else {
          console.log("OTP not found");
          const newUserCode = {
            userID: user._id,
            OTP: randomOTP,
          };
          await db.collection("userotp").insertOne(newUserCode);
        }

        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: req.body.Email,
          subject: "Dare2Do Password Reset & Email Verification",
          text: `Here is your 6 digit one-time code: "${randomOTP}" to verify your email and a link to reset your password: ${origin + "reset-password/" + user._id
            }`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
            return res.status(500).send("Error sending email.");
          }
          console.log("Email sent:", info.response);
          res.status(200).json({ code: randomOTP });
        });
      } else {
        res.status(404).send("User not found!");
      }
    } catch (error) {
      console.log("Error while sending email: ", error);
      res.status(500).send("Internal server error");
    }
  });

  app.get("/api/fetchotp/:userID", async (req, res) => {
    if (!(typeof req.params.userID === 'string' && /^[0-9a-fA-F]{24}$/.test(req.params.userID))) {
      return res.status(404).send("User not found!");
    }
    try {
      console.log(req.params.userID);
      const db = client.db("LargeProject");
      const user = await db
        .collection("userotp")
        .findOne({ userID: new ObjectId(req.params.userID) });
      if (user) {
        res.status(200).send(user.OTP);
      } else {
        res.status(404).send("User not found!");
      }
    } catch (error) {
      console.log('Error: ', error);
      res.status(500).send("Internal server error!");
    }
  });
};
