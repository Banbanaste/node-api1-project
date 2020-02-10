// implement your API here
const express = require("express");
const Hubs = require("./data/db.js");

// init server
const server = express();

// port
const port = 5000;

// middleware
server.use(express.json());
server.use(cors());

// GET api/users
server.get("/api/users", (req, res) => {
  Hubs.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// GET api/users/:id
server.get("/api/users/:id", (req, res) => {
  Hubs.findById(req.params.id)
    .then(hub => {
      if (hub.id) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// POST api/users
server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  if (!userInfo.name || !userInfo.bio) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    Hubs.insert(userInfo)
      .then(hub => {
        res.status(201).json(hub);
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

// DELETE api/users/:id
server.delete("/api/users/:id", (req, res) => {
  Hubs.remove(req.params.id)
    .then(removed => {
      if (removed) {
        res.status(200).json(removed);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

// PUT api/users/:id
server.put("/api/users/:id", (req, res) => {
  if (!req.body.bio || !req.body.name) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        Hubs.findById(req.params.id).then(putObj =>
          res.status(200).json(putObj)
        );
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified." });
    });
});

// listen on port
server.listen(port);
