const express = require('express');
const fetch = require('node-fetch');
const NpmPackage = require('../models/package');

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    const { name } = req.body;
    try {
      const npmPackage = await NpmPackage.findOne({ name });
      if (npmPackage) {
        return res.status(200).json({ npmPackage });
      }
      const response = await fetch(`https://registry.npmjs.org/${name}`);
      const data = await response.json();
      if (!data.error) {
        const {
          _id, name: pkgName, description, maintainers, homepage,
        } = data;
        const newPackage = new NpmPackage({
          npmID: _id,
          name: pkgName,
          description,
          maintainers: [...maintainers],
          homePage: homepage,
          transactions: [],
          donations: [],
        });
        await newPackage.save();
        return res.status(200).json({ npmPackage: newPackage });
      }
      return res.status(404).json({ message: 'package not found' });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

router.route('/supporters')
  .get(async (req, res) => {
    const { id } = req.body;
    try {
      const npmPackage = await NpmPackage.findOne({ _id: id });
      if (!npmPackage) {
        return res.status(404).send({ message: 'package not found' });
      }

      await npmPackage.populate({
        path: 'donations',
        populate: {
          path: 'user',
        },
      }).execPopulate();

      const supporters = npmPackage.donations.map((donation) => {
        const { user } = donation;
        delete user.adminOf;

        return user;
      });
      return res.status(200).send({ supporters });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ message: 'internal server error' });
    }
  });


module.exports = router;
