const express = require("express");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../services/contactService");

const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const contacts = await getAllContacts(req.user._id);
    if (!contacts.length) {
      return res.status(404).json({ message: "No contacts found." });
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", auth, async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    const contact = await getContactById(id, req.user._id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const newContact = await addContact({
      name,
      email,
      phone,
      favorite,
      owner: req.user._id,
    });
    res.status(201).json({
      message: "Contact created",
      contact: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", auth, async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    const deletedContact = await removeContact(id, req.user._id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", auth, async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const { name, email, phone, favorite } = req.body;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const updatedContact = await updateContact(id, {
      name,
      email,
      phone,
      favorite,
    }, req.user._id);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", auth, async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const updatedContact = await updateContact(id, { favorite }, req.user._id);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
