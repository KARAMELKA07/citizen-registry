import { Link } from 'react-router';

export default function CitizensPage() {
    return (
        <section>
            <h2>Картотека граждан</h2>
            <p>Здесь будет таблица с поиском и фильтрами.</p>

            <Link to="/citizens/1">
                Открыть тестовую карточку №1
            </Link>
        </section>
    );
}