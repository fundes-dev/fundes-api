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
        return res.status(200).json({ data: newPackage });
      }
      return res.status(404).json({ message: 'package not found' });
    } catch (e) {
      return res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;
