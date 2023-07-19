export {};
import { createServer } from 'http';
import { parse } from 'querystring';

interface Contact {
    id: number;
    name: string;
    phoneNumber: string;
    address: string;
}

let contacts: Contact[] = [
    { id: 1, name: 'John Doe', phoneNumber: '1234567890', address: '123 Main St' },
    { id: 2, name: 'Jane Smith', phoneNumber: '9876543210', address: '456 Elm St' },
];

function getContacts(): Contact[] {
    return contacts;
}

function getContactById(id: number): Contact | undefined {
    return contacts.find(contact => contact.id === id);
}

function getContactByName(name: string): Contact | undefined {
    return contacts.find(contact => contact.name === name);
}

function sortContactsByName(ascending: boolean): Contact[] {
    return [...contacts].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
}

function sortContactsByAddress(): Contact[] {
    return [...contacts].sort((a, b) => a.address.localeCompare(b.address));
}

function addContact(contact: Contact): void {
    contacts.push(contact);
}

function deleteContactById(id: number): void {
    contacts = contacts.filter(contact => contact.id !== id);
}

function deleteContactsByName(name: string): void {
    contacts = contacts.filter(contact => contact.name !== name);
}

function clearContacts(): void {
    contacts = [];
}

const server = createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        if (url === '/api/contacts') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(getContacts()));
        } else if (url && url.startsWith('/api/contacts/')) {
            const parts = url.split('/');
            const id = Number(parts[parts.length - 1]);
            const contact = getContactById(id);
            if (contact) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(contact));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Contact not found');
            }
        } else if (url === '/api/contacts/sortByName') {
            const ascending = parse(req.url?.split('?')[1]).ascending === 'true';
            const sortedContacts = sortContactsByName(ascending);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sortedContacts));
        } else if (url === '/api/contacts/sortByAddress') {
            const sortedContacts = sortContactsByAddress();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sortedContacts));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Endpoint not found');
        }
    } else if (method === 'POST' && url === '/api/contacts') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const contact = JSON.parse(body);
            addContact(contact);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Contact added successfully');
        });
    } else if (method === 'DELETE') {
        if (url && url.startsWith('/api/contacts/')) {
            const parts = url.split('/');
            const id = Number(parts[parts.length - 1]);
            deleteContactById(id);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Contact deleted successfully');
        } else if (url === '/api/contacts/deleteByName') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const name = JSON.parse(body).name;
                deleteContactsByName(name);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Contacts deleted successfully');
            });
        } else if (url === '/api/contacts/clear') {
            clearContacts();
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('All contacts cleared successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Endpoint not found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method not allowed');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
