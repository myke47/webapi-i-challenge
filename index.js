// implement your API here
const express = require('express'); //importing express package

const Users = require('./data/db.js'); //defining database

const server = express(); //creating server

server.use(express.json());

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if(!name || !bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'});
  } else {
    Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'There was an error while saving the user to the database.' });
    });
  }
});

server.get('/now', (request, response) => {
  const now = new Date().toISOString();
  response.send(now);
});

server.get('/api/users', (request, response) => {
  Users.find()
  .then(users => {
    response.status(200).json(users);
  })
  .catch(() => {
    response.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
  });
  });


server.get('/api/users/:id', (request, response) => {
  Users.findById(request.params.id)
  .then(user => {
    if(user) {
      response.status(200).json(user);
    } else {
      response.status(404).json({ message:"The user with the specified ID does not exist." });
    }
  })
  .catch(() => {
    response.status(500).json({ errorMessage: 'The user information could not be retrieved.' });
  });
});

server.delete('/api/users/:id', (request, response) => {
  Users.remove(request.params.id)
  .then(count => {
    if(count && count > 0) {
      response.status(200).json({ message: 'the user was deleted.'}); 
    } else {
      response.status(404).json({ message:'The user with the specified ID does not exist.' })
    }
  })
  .catch(() => {
    response.status(500).json({ errorMessage: 'The user could not be removed.' });
  });
});

// watch for connections on port 5000
const port = 5000;
server.listen(port, () => console.log(`\n*** API on port ${port} ***\n`));