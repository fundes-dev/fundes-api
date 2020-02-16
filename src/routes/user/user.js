const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4')
const remove = require('lodash.remove');

const users = [
  { id: "0", username: "Eugene", name: "Eugene", email: "eugene@email.com", maintainer: true },
  { id: "1", username: 'Can', name: 'Can', email: "can@email.com", maintainer: false },
  { id: "2", username: 'Garett', name: 'Garett', email: "garett@email.com", maintainer: true }
]

router.route('/:id')
  //get by id
  .get((req, res) => {
    const user = users.find((user) => {
      return user.id === req.params.id;
    })
    if (!user) {
      res.status(404).json({ message: `user with id ${req.params.id} doesn't exist` })
    }
    return res.status(200).json({ data: user })
  })
  //delete by id
  .delete((req, res) => {
    remove(users, user => {
      return user.id === req.params.id;
    })
    return res.status(200).send()
  })
router.route('/')
  //add new user
  .post((req, res) => {
    const { username, email, name } = req.body;
    if (!username || !email || !name) {
      return res.status(404).json({ message: `user can't be created due to missing fields` })
    }
    const newUser = { id: uuid(), username, email, name, maintainer: false }
    users.push(newUser);
    return res.status(200).json({ message: `user with username: ${username} successfully created` })
  })
  //update email
  .put((req, res) => {
    const { username, oldEmail, newEmail } = req.body;
    if (!username || !oldEmail || !newEmail) {
      return res.status(404).json({ message: `email can't be changed created due to missing fields` })
    }
    const user = remove(users, user => user.email === oldEmail)
    user.email = newEmail
    users.push(user);
    return res.status(200).send()
  })

module.exports = router;