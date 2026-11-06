import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';

import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CitizensPage from '../pages/CitizensPage.jsx';
import CitizenDetailPage from '../pages/CitizenDetailPage.jsx';
import CitizenCreatePage from '../pages/CitizenCreatePage.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
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
          path="/citizens/new"
          element={<CitizenCreatePage />}
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
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
