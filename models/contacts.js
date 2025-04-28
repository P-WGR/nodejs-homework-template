const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

// Funkcja do wczytania wszystkich kontaktów z pliku
async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
}

// Funkcja do pobrania kontaktu po ID
async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === contactId) || null;
}

// Funkcja do usunięcia kontaktu
async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null; // Kontakt nie znaleziony
  }
  const [removedContact] = contacts.splice(index, 1); // Usuwamy kontakt z listy
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // Zapisujemy zmodyfikowaną listę
  return removedContact; // Zwracamy usunięty kontakt
}

// Funkcja do dodania nowego kontaktu
async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(), // Generowanie unikalnego ID
    name,
    email,
    phone,
  };
  contacts.push(newContact); // Dodajemy nowy kontakt do listy
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // Zapisujemy zmodyfikowaną listę
  return newContact; // Zwracamy nowo dodany kontakt
}

// Funkcja do aktualizacji kontaktu
async function updateContact(contactId, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null; // Kontakt nie znaleziony
  }

  // Zaktualizowanie kontaktu w oparciu o dane z body
  const updatedContact = { ...contacts[index], ...body };

  // Zaktualizowanie kontaktu na liście
  contacts[index] = updatedContact;

  // Zapisanie zaktualizowanej listy kontaktów
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact; // Zwrócenie zaktualizowanego kontaktu
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
