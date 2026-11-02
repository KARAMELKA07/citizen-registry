import { Link } from 'react-router';
import { citizens } from '../data/citizens.js';

export default function CitizensPage() {
    return (
        <section>
            <h2>Картотека граждан</h2>

            <p>Всего граждан: {citizens.length}</p>

            <ul>
                {citizens.map((citizen) => (
                    <li key={citizen.id}>
                        <Link to={`/citizens/${citizen.id}`}>
                            {citizen.lastName} {citizen.firstName} {citizen.middleName}
                        </Link>
                        {' — '}
                        {citizen.region}
                    </li>
                ))}
            </ul>
        </section>
    );
}
