import http, { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

/**
 * Генерирует страницу на основе аргументов командной строки.
 *
 * @param {string} title - Заголовок страницы (обязательный аргумент).
 * @param {string} [author] - Автор страницы (необязательный аргумент).
 * @param {string} [language='en'] - Язык страницы (необязательный аргумент, значение по умолчанию 'en').
 * @returns {string} Сгенерированная страница в виде HTML-кода.
 */
function generatePage(title: string, author?: string, language: string = 'en'): string {
    // Ваш код для генерации страницы на основе аргументов
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Автор: ${author || 'Автор не указан'}</p>
        <p>Язык: ${language}</p>
      </body>
    </html>
  `;
}

// Создание HTTP-сервера
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url!, true);

    // Получение аргументов из параметров запроса
    const { title, author, language } = parsedUrl.query;

    // Проверка обязательного аргумента
    if (!title) {
        res.statusCode = 400;
        res.end('Ошибка: Не указан заголовок страницы.');
        return;
    }

    // Генерация страницы
    const pageContent = generatePage(decodeURIComponent(title as string), decodeURIComponent(author as string), decodeURIComponent(language as string));

    // Установка заголовков ответа
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;

    // Отправка сгенерированной страницы в ответ
    res.end(pageContent);
});

// Запуск сервера на порте 3000
server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
