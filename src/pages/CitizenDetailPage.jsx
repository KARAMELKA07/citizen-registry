import { useParams } from 'react-router';

export default function CitizenDetailPage() {
    const { id } = useParams();

    return (
        <section>
            <h2>Карточка гражданина №{id}</h2>
            <p>Здесь будут личные сведения, семья, образование и обращения.</p>
        </section>
    );
}