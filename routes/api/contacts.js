const express = require('express');
const router = express.Router();
const ctrl = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await ctrl.updateStatusContact(contactId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    if (error.message === 'missing field favorite') {
      return res.status(400).json({ message: 'missing field favorite' });
    }
    
    next(error);
  }
});

module.exports = router;
