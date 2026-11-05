# Модель данных — Citizen Registry

Приложение для ведения картотеки граждан и учёта
их обращений.

Основные сущности: граждане (citizens) и
обращения (appeals).

У одного гражданина может быть несколько обращений.

## 1. Граждане (citizens)

 Основные сведения

| Поле | Тип | Ввод | Обязательное |
|---|---|---|---|
| id | string | Авто | — |
| photoUrl | string | Фото (путь к изображению) | Нет |
| lastName | string | Текст | Да |
| firstName | string | Текст | Да |
| middleName | string | Текст | Нет |
| birthDate | string (date) | Дата | Нет |
| gender | string | Список | Нет |
| recordStatus | string | Список | Да |
| createdAt | string (datetime) | Авто | — |
| educationLevel | string | Список | Нет |

 Контактные данные

| Поле | Тип | Ввод | Обязательное |
|---|---|---|---|
| phone | string | Телефон | Да |
| additionalPhone | string | Телефон | Нет |
| email | string | Email | Нет |
| preferredContact | string | Список | Нет |
| contactComment | string | Многострочный текст | Нет |


 Адрес и дополнительные сведения

| Поле | Тип | Ввод | Обязательное |
|---|---|---|---|
| registrationAddress | Address | Группа полей | Да |
| sameAsRegistration | boolean | Checkbox | Нет |
| residentialAddress | Address | Группа полей | Нет |
| notes | string | Многострочный текст | Нет |

 Структура адреса (Address)

| Поле | Тип | Ввод | Обязательное |
|---|---|---|---|
| region | string | Список / текст | Да для регистрации |
| city | string | Текст | Нет |
| street | string | Текст | Нет |
| house | string | Текст | Нет |
| apartment | string | Текст | Нет |

 Адрес регистрации и адрес проживания используют
 одинаковую структуру Address.

 Если sameAsRegistration = true, адрес проживания
 автоматически копируется из адреса регистрации.

 В режиме просмотра оба адреса отображаются
 одной строкой. В режиме редактирования используются
 отдельные поля региона, города, улицы, дома и квартиры.


## 2. Обращения (appeals)

Обращения будут отображаться отдельным разделом
в карточке гражданина.

| Поле | Тип | Ввод | Обязательное |
|---|---|---|---|
| id | string | Авто | — |
| citizenId | string | Авто | — |
| number | string | Авто | — |
| createdAt | string (datetime) | Авто | — |
| subject | string | Текст | Да |
| category | string | Список | Да |
| source | string | Список | Да |
| description | string | Многострочный текст | Да |
| priority | string | Список | Да |
| status | string | Список | Да |
| assignee | string | Текст | Нет |
| dueDate | string (date) | Дата | Нет |
| result | string | Многострочный текст | Нет |

## 3. Значения списков

Пол
- male
- female
- not_specified

Статус гражданина
- active
- archived

Предпочтительный способ связи
- phone
- email

Уровень образования
- secondary — Среднее
- vocational — Среднее профессиональное
- higher — Высшее
- other

Категория обращения
- waste_collection — Вывоз отходов
- illegal_dumping — Несанкционированная свалка
- recycling — Раздельный сбор
- other

Источник обращения
- website
- phone
- email
- in_person

Статус обращения
- new
- in_progress
- resolved
- rejected

Приоритет обращения
- low
- medium
- high

## 4. Связь данных

Граждане и обращения связаны по полю citizenId.

## 5. Хранение данных

ID храним строками.
Даты без времени: YYYY-MM-DD.
Даты со временем: ISO 8601.
Начальный статус гражданина — active.
Начальный статус обращения — new.
Dashboard использует те же данные, что и картотека.
