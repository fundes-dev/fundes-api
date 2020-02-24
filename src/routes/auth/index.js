const express = require('express');
const router = express.Router();

//Placholders for auth logic
const isPasswordValid = (email, password) => {
  return true
}
const generateToken = () => {
  return '1234'
}

router.route('/login')
  .post((req, res) => {
    const { email, password } = req.body;
    try {
      const user = await isPasswordValid(email, password)
      const token = await generateToken()
      res.send({ user, token })
    } catch (e) {
      res.status(400).send()
    }
  })
router.route('/logout')
  .post(async (req, res) => {
    try {
      // Remove token from list of tokens
      res.send()
    } catch (e) {
      res.status(500).send()
    }
  })

module.exports = router;