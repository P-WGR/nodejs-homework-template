const express = require('express');
const Joi = require('joi');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

// Definicja schematu walidacji z użyciem Joi
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  email: Joi.string().email({ tlds: { allow: ['com', 'net', 'pl'] } }).required(),
  phone: Joi.string().min(5).required(),
});

// GET /api/contacts - Pobiera wszystkie kontakty
router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

// GET /api/contacts/:contactId - Pobiera kontakt po ID
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

// POST /api/contacts - Dodaje nowy kontakt
router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      // Zwracamy dokładny komunikat o błędzie w walidacji
      const errorField = error.details[0].context.key;
      return res.status(400).json({ message: `missing required ${errorField} field` });
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contacts/:contactId - Usuwa kontakt po ID
router.delete('/:contactId', async (req, res, next) => {
  try {
    const deletedContact = await removeContact(req.params.contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contacts/:contactId - Aktualizuje kontakt po ID
router.put('/:contactId', async (req, res, next) => {
  try {
    // Sprawdzamy, czy dane w body są puste
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }

    // Walidacja danych przy użyciu Joi
    const { error } = contactSchema.validate(req.body);
    if (error) {
      // Zwracamy dokładny komunikat o błędzie w walidacji
      const errorField = error.details[0].context.key;
      return res.status(400).json({ message: `invalid data for ${errorField} field` });
    }

    // Próba aktualizacji kontaktu
    const updatedContact = await updateContact(req.params.contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Zwracamy zaktualizowany kontakt
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
