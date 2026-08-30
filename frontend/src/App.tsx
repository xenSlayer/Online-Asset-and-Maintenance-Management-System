import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<PlaceholderPage title="Users" />} />
        <Route path="/assets" element={<PlaceholderPage title="Assets" />} />
        <Route
          path="/maintenance-requests"
          element={<PlaceholderPage title="Maintenance Requests" />}
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
