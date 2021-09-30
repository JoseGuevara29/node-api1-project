// BUILD YOUR SERVER HERE
const express = require("express");

const User = require("./users/model");

const server = express();

server.use(express.json());
//Endpoints

//POST  / Create
server.post("/api/users", (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  } else {
    User.insert(newUser)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
        });
      });
  }
});

//GET Return all users

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The users information could not be retrieved" });
    });
});

//GET user by id

server.get("/api/users/:id", (req, res) => {
  const idVar = req.params.id;
  User.findById(idVar)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist",
        });
      } else {
        res.json(user);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved" });
    });
});

//DELETE
server.delete("/api/users/:id", (req, res) => {
  const idVar = req.params.id;
  User.remove(idVar)
    .then((deletedUser) => {
      if (!deletedUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(201).json(deletedUser);
      }
    })
    .catch(() => {
      res.status(500).json({ message: "The user could not be removed" });
    });
});

//PUT user by id
server.put("/api/users/:id", (req, res) => {
  const idVar = req.params.id;
  const changes = req.body;

  User.update(idVar, changes)
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({
          message: "The user with the specified ID does not exist",
        });
      } else {
        if (!changes.name || !changes.bio) {
          res.status(400).json({
            message: "Please provide name and bio for the user",
          });
        } else {
          res.status(200).json(updatedUser);
        }
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The user information could not be modified" });
    });
});

//another way with try catch
// server.put("/api/users/:id", async (req, res) => {
//   const idVar = req.params.id;
//   const changes = req.body;

//   try {
//     if (!changes.name || changes.bio) {
//       res
//         .status(400)
//         .json({ message: "Please provide name and bio for the user" });
//     } else {
//       const updatedUser = await User.update(idVar, changes);
//       if (!updatedUser) {
//         res.status(404).json("The user with the specified ID does not exist.");
//       } else {
//         res.status(200).json(updatedUser);
//       }
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "The user information could not be modified" });
//   }
// });

module.exports = server; // EXPORT YOUR SERVER instead of {}
