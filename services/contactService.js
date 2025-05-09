const Contact = require("../models/schema");

const getAllContacts = async (owner) => {
  return await Contact.find({ owner });
};

const getContactById = async (contactId, owner) => {
  return await Contact.findOne({ _id: contactId, owner });
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body, owner) => {
  return await Contact.findOneAndUpdate({ _id: contactId, owner }, body, {
    new: true,
  });
};

const removeContact = async (contactId, owner) => {
  return await Contact.findOneAndDelete({ _id: contactId, owner });
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
