import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetsPage } from './pages/AssetsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { MaintenanceRecordsPage } from './pages/MaintenanceRecordsPage';
import { MaintenanceRequestsPage } from './pages/MaintenanceRequestsPage';
import { TechniciansPage } from './pages/TechniciansPage';
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
        <Route path="/technicians" element={<TechniciansPage />} />
        <Route
          path="/maintenance-records"
          element={<MaintenanceRecordsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
