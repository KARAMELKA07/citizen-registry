const maleNames = ['Алексей', 'Дмитрий', 'Михаил', 'Андрей', 'Николай', 'Кирилл', 'Роман', 'Денис', 'Артём', 'Виктор'];
const femaleNames = ['Мария', 'Ольга', 'Ирина', 'Татьяна', 'Светлана', 'Наталья', 'Юлия', 'Дарья', 'Вера', 'Екатерина'];
const maleSurnames = ['Соколов', 'Кузнецов', 'Волков', 'Морозов', 'Лебедев', 'Козлов', 'Новиков', 'Федоров', 'Белов', 'Громов'];
const femaleSurnames = ['Соколова', 'Кузнецова', 'Волкова', 'Морозова', 'Лебедева', 'Козлова', 'Новикова', 'Федорова', 'Белова', 'Громова'];
const malePatronymics = ['Александрович', 'Андреевич', 'Викторович', 'Дмитриевич', 'Сергеевич'];
const femalePatronymics = ['Александровна', 'Андреевна', 'Викторовна', 'Дмитриевна', 'Сергеевна'];
const locations = [
    { region: 'Москва', city: 'Москва' },
    { region: 'Московская область', city: 'Подольск' },
    { region: 'Тверская область', city: 'Тверь' },
    { region: 'Республика Татарстан', city: 'Казань' },
    { region: 'Свердловская область', city: 'Екатеринбург' },
    { region: 'Новосибирская область', city: 'Новосибирск' },
    { region: 'Краснодарский край', city: 'Краснодар' },
    { region: 'Нижегородская область', city: 'Нижний Новгород' },
    { region: 'Самарская область', city: 'Самара' },
    { region: 'Санкт-Петербург', city: 'Санкт-Петербург' },
    { region: 'Республика Башкортостан', city: 'Уфа' },
    { region: 'Пермский край', city: 'Пермь' },
    { region: 'Ростовская область', city: 'Ростов-на-Дону' },
    { region: 'Воронежская область', city: 'Воронеж' },
    { region: 'Ярославская область', city: 'Ярославль' },
    { region: 'Калининградская область', city: 'Калининград' },
    { region: 'Иркутская область', city: 'Иркутск' },
    { region: 'Приморский край', city: 'Владивосток' },
];
const streets = ['Лесная', 'Садовая', 'Солнечная', 'Парковая', 'Центральная', 'Новая', 'Зелёная', 'Школьная'];
const educationLevels = ['secondary', 'vocational', 'higher', 'other'];
const categories = [
    { category: 'waste_collection', subject: 'Вывоз отходов', description: 'Просьба проверить график вывоза отходов.' },
    { category: 'illegal_dumping', subject: 'Несанкционированная свалка', description: 'Сообщение о скоплении отходов рядом с жилым районом.' },
    { category: 'recycling', subject: 'Раздельный сбор отходов', description: 'Вопрос о размещении контейнеров для раздельного сбора.' },
    { category: 'other', subject: 'Вопрос по обращению с отходами', description: 'Просьба предоставить информацию по обращению с отходами.' },
];
const statuses = ['new', 'in_progress', 'resolved', 'rejected'];
const sources = ['website', 'phone', 'email', 'in_person'];
const priorities = ['low', 'medium', 'high'];
const assignees = ['Иванов И. И.', 'Петрова А. С.', 'Сидоров П. В.', ''];

function randomFor(seed) {
    let value = seed;
    return (limit) => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return Math.floor((value / 4294967296) * limit);
    };
}

function pad(number, length = 2) {
    return String(number).padStart(length, '0');
}

function makeAddress(random, number) {
    return {
        ...locations[(number + random(locations.length)) % locations.length],
        street: streets[random(streets.length)],
        house: String(random(80) + 1),
        apartment: String(random(150) + 1),
    };
}

export function createDemoCitizens() {
    return Array.from({ length: 117 }, (_, index) => {
        const number = index + 4;
        const random = randomFor(number);
        const gender = number % 2 === 0 ? 'female' : 'male';
        const registrationAddress = makeAddress(random, number);
        const sameAsRegistration = number % 4 !== 0;
        const residentialAddress = sameAsRegistration
            ? { ...registrationAddress }
            : makeAddress(random, number * 7);
        const birthYear = 1947 + random(57);
        const birthMonth = random(12) + 1;
        const birthDay = random(28) + 1;
        const registrationYear = 2023 + random(2);
        const registrationMonth = random(12) + 1;
        const registrationDay = random(28) + 1;

        return {
            id: `CIT-${pad(number, 3)}`,
            lastName: gender === 'female' ? femaleSurnames[random(femaleSurnames.length)] : maleSurnames[random(maleSurnames.length)],
            firstName: gender === 'female' ? femaleNames[random(femaleNames.length)] : maleNames[random(maleNames.length)],
            middleName: gender === 'female' ? femalePatronymics[random(femalePatronymics.length)] : malePatronymics[random(malePatronymics.length)],
            birthDate: `${birthYear}-${pad(birthMonth)}-${pad(birthDay)}`,
            gender,
            recordStatus: number % 7 === 0 ? 'archived' : 'active',
            createdAt: `${registrationYear}-${pad(registrationMonth)}-${pad(registrationDay)}T10:00:00Z`,
            phone: `+7 (900) 000-${pad(Math.floor(number / 100))}-${pad(number % 100)}`,
            additionalPhone: '',
            email: `citizen${number}@example.com`,
            preferredContact: number % 3 === 0 ? 'email' : 'phone',
            contactComment: '',
            registrationAddress,
            sameAsRegistration,
            residentialAddress,
            educationLevel: educationLevels[random(educationLevels.length)],
            notes: '',
        };
    });
}

export function createDemoAppeals() {
    const generatedAppeals = [];

    for (let citizenNumber = 4; citizenNumber <= 120; citizenNumber += 1) {
        const remainder = citizenNumber % 6;
        const count = remainder === 0 ? 0 : remainder === 1 ? 1 : 3;

        for (let index = 0; index < count; index += 1) {
            const number = generatedAppeals.length + 5;
            const random = randomFor(number * 17);
            const topic = categories[random(categories.length)];
            const status = statuses[random(statuses.length)];
            const monthIndex = (number - 5) % 22;
            const year = 2025 + Math.floor(monthIndex / 12);
            const month = monthIndex % 12 + 1;
            const day = random(28) + 1;

            generatedAppeals.push({
                id: `APP-${pad(number, 3)}`,
                citizenId: `CIT-${pad(citizenNumber, 3)}`,
                number: `ОБР-${pad(number, 3)}`,
                createdAt: `${year}-${pad(month)}-${pad(day)}T10:00:00Z`,
                subject: topic.subject,
                category: topic.category,
                source: sources[random(sources.length)],
                description: topic.description,
                priority: priorities[random(priorities.length)],
                status,
                assignee: status === 'new' ? '' : assignees[random(assignees.length)],
                dueDate: '',
                result: status === 'resolved' ? 'Заявителю направлен ответ.' : status === 'rejected' ? 'Обращение отклонено.' : '',
            });
        }
    }

    return generatedAppeals;
}
