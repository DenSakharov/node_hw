import * as express from 'express';
import { parse } from 'querystring';

interface Contact {
    id: number;
    name: string;
    phoneNumber: string;
    address: string;
}

const app = express();
app.use(express.json());

let contacts: Contact[] = [
    { id: 1, name: 'John Doe', phoneNumber: '1234567890', address: '123 Main St' },
    { id: 2, name: 'Jane Smith', phoneNumber: '9876543210', address: '456 Elm St' },
];

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

app.get('/api/contacts/:idOrName', (req, res) => {
    const { idOrName } = req.params;
    const id = parseInt(idOrName, 10);
    if (!isNaN(id)) {
        const contact = contacts.find(contact => contact.id === id);
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).send('Contact not found');
        }
    } else {
        const contact = contacts.find(contact => contact.name === idOrName);
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).send('Contact not found');
        }
    }
});

app.get('/api/contacts/sortByName', (req, res) => {
    const ascending = parse(req.url?.split('?')[1]).ascending === 'true';
    const sortedContacts = [...contacts].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    res.json(sortedContacts);
});

app.get('/api/contacts/sortByAddress', (req, res) => {
    const sortedContacts = [...contacts].sort((a, b) => a.address.localeCompare(b.address));
    res.json(sortedContacts);
});

app.post('/api/contacts', (req, res) => {
    const contact = req.body;
    contacts.push(contact);
    res.status(201).send('Contact added successfully');
});

app.delete('/api/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).send('Invalid contact ID');
    } else {
        contacts = contacts.filter(contact => contact.id !== id);
        res.send('Contact deleted successfully');
    }
});

app.delete('/api/contacts/deleteByName', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).send('Name parameter is missing');
    } else {
        contacts = contacts.filter(contact => contact.name !== name);
        res.send('Contacts deleted successfully');
    }
});

app.delete('/api/contacts/clear', (req, res) => {
    contacts = [];
    res.send('All contacts cleared successfully');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
