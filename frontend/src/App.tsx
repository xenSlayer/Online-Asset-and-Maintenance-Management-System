import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetsPage } from './pages/AssetsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { MaintenanceRequestsPage } from './pages/MaintenanceRequestsPage';
import { UsersPage } from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route
          path="/maintenance-requests"
          element={<MaintenanceRequestsPage />}
        />
        <Route
          path="/technicians"
          element={<PlaceholderPage title="Technicians" />}
        />
        <Route
          path="/maintenance-records"
          element={<PlaceholderPage title="Maintenance Records" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
