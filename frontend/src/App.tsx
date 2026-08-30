import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <AssetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance-requests"
          element={
            <ProtectedRoute>
              <MaintenanceRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technicians"
          element={
            <ProtectedRoute>
              <TechniciansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance-records"
          element={
            <ProtectedRoute>
              <MaintenanceRecordsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
