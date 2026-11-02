import { Routes, Route } from 'react-router';

import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CitizensPage from '../pages/CitizensPage.jsx';
import CitizenDetailPage from '../pages/CitizenDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<DashboardPage />}
        />

        <Route
          path="/citizens"
          element={<CitizensPage />}
        />

        <Route
          path="/citizens/:id"
          element={<CitizenDetailPage />}
        />

        <Route
          path="*"
          element={<h2>Страница не найдена</h2>}
        />
      </Route>
    </Routes>
  );
}