# Здача ПР9 · Серверна розробка

Прізвище та ім’я: …

Commit або назви двох змінених файлів: `src/registration.repository.ts`, `src/registration.controller.ts`

## Три перевірки

Не вставляйте `.env` або пароль БД. id відповіді може бути будь-яким згенерованим числом.

| Сценарій | Метод і URL, тіло | Фактичний статус і JSON |
|---|---|---|
| Нова пара | `POST /events/1/registrations` `{"userId":2}` | `201 {"id":5,"eventId":1,"userId":2}` |
| Та сама пара повторно | `POST /events/1/registrations` `{"userId":2}` | `409 {"code":"ALREADY_REGISTERED"}` |
| Відсутня подія | `POST /events/9999/registrations` `{"userId":2}` | `404 {"code":"RELATED_RESOURCE_NOT_FOUND"}` |

`npm run check`: `PASS: 201 / 409 / 404 / 404 / 400; one persisted row` (`npm run typecheck` — без помилок)

Поясніть 2–3 реченнями: що захищає від дублікатів і який шар перетворює помилки БД на відповідь HTTP?

Від дублікатів захищає обмеження `@@unique([eventId, userId])` у PostgreSQL: БД атомарно відхиляє другу вставку тієї самої пари навіть при двох одночасних запитах, тоді як pre-check у коді (спочатку `findFirst`, потім `create`) має вікно гонки, у яке обидва запити можуть пройти перевірку. Репозиторій лише виконує одну `prisma.registration.create`, а помилки Prisma (P2002 — порушення UNIQUE, P2003 — порушення зовнішнього ключа) у `catch` контролера перетворює scoped mapper `toRegistrationError` на `ApiError` 409/404. Далі централізований обробник помилок Express у `app.ts` віддає їх клієнту як `{"code": ...}`.
