import { NavLink, Outlet } from 'react-router';

export default function MainLayout() {
    return (
        <div className="app-layout">
            <header>
                <h1>Citizen Registry</h1>

                <nav>
                    <NavLink to="/" end>
                        Главная
                    </NavLink>

                    <NavLink to="/citizens">
                        Граждане
                    </NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}