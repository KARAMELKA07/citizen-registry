import { Link, useParams } from 'react-router';

import { citizens } from '../data/citizens.js';
import { appeals } from '../data/appeals.js';

export default function CitizenDetailPage() {
    const { id } = useParams();

    const citizen = citizens.find(citizen => citizen.id === id);

    const citizenAppeals = appeals.filter(
        (appeal) => appeal.citizenId === id
    );

    if (!citizen) {
        return <h2>Гражданин не найден</h2>;
    }

    return (
        <section>
            <Link to="/citizens">Назад к списку</Link>

            <h2>
                {citizen.lastName} {citizen.firstName} {citizen.middleName}
            </h2>

            <h3>Основные сведения</h3>
            <p>Дата рождения: {citizen.birthDate}</p>
            <p>Регион: {citizen.region}</p>

            <h3>Контакты</h3>
            <p>Телефон: {citizen.phone}</p>
            <p>Email: {citizen.email || 'Не указан'}</p>

            <h3>Обращения ({citizenAppeals.length})</h3>

            {citizenAppeals.length === 0 ? (
                <p>Обращений пока нет.</p>
            ) : (
                <ul>
                    {citizenAppeals.map((appeal) => (
                        <li key={appeal.id}>
                            {appeal.number} — {appeal.subject}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
