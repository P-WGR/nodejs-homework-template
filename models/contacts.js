const Contact = require('./contact'); // importujemy model Mongoose

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

// Dodajemy tę nową funkcję dla PATCH /favorite
const updateStatusContact = async (contactId, body) => {
  if (!body || typeof body.favorite !== 'boolean') {
    throw new Error('missing field favorite');
  }

  return await Contact.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
