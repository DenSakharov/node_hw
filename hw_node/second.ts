import fs from 'fs';
import readline from 'readline';

interface Note {
    title: string;
    text: string;
}

function saveNoteToFile(note: Note): void {
    fs.writeFileSync(`${note.title}.txt`, JSON.stringify(note));
}

function loadNoteFromFile(title: string): Note | null {
    try {
        const data = fs.readFileSync(`${title}.txt`, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

function deleteNoteFile(title: string): void {
    fs.unlinkSync(`${title}.txt`);
}

function listNotes(): void {
    const notes = fs.readdirSync('.', { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'))
        .map(dirent => dirent.name.replace('.txt', ''));
    console.log('Список заметок:');
    notes.forEach((note, index) => console.log(`${index + 1}. ${note}`));
}

async function createNote(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const title = await askQuestion(rl, 'Введите название заметки: ');
    const text = await askQuestion(rl, 'Введите текст заметки: ');

    const note: Note = { title, text };
    saveNoteToFile(note);

    console.log(`Заметка "${title}" успешно создана.`);

    rl.close();
    startApp();
}

function readNote(): void {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    askQuestion(rl, 'Введите название заметки для прочтения: ')
        .then((title) => {
            const note = loadNoteFromFile(title);
            if (note) {
                console.log(`Заголовок: ${note.title}`);
                console.log(`Текст: ${note.text}`);
            } else {
                console.log(`Заметка "${title}" не найдена.`);
            }

            rl.close();
            startApp();
        });
}

async function deleteNote(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const title = await askQuestion(rl, 'Введите название заметки для удаления: ');

    const note = loadNoteFromFile(title);
    if (note) {
        deleteNoteFile(title);
        console.log(`Заметка "${title}" успешно удалена.`);
    } else {
        console.log(`Заметка "${title}" не найдена.`);
    }

    rl.close();
    startApp();
}

function deleteAllNotes(): void {
    const notes = fs.readdirSync('.', { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'));
    notes.forEach(dirent => fs.unlinkSync(dirent.name));
    console.log('Все заметки успешно удалены.');

    startApp();
}

function showMenu(): void {
    console.log(`
    1. Создать заметку
    2. Список заметок
    3. Прочитать заметку
    4. Удалить заметку
    5. Удалить все заметки
    6. Выйти
  `);
}

async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function startApp(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    showMenu();

    const answer = await askQuestion(rl, 'Выберите действие: ');

    switch (answer) {
        case '1':
            await createNote();
            break;
        case '2':
            listNotes();
            break;
        case '3':
            readNote();
            break;
        case '4':
            await deleteNote();
            break;
        case '5':
            deleteAllNotes();
            break;
        case '6':
            console.log('До свидания!');
            rl.close();
            break;
        default:
            console.log('Неверный ввод. Повторите выбор.');
            startApp();
    }
}

startApp();
