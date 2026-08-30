import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/login/LoginForm';
import { LoginHero } from '../components/login/LoginHero';
import { getCurrentUser } from '../utils/auth';

export function LoginPage() {
  if (getCurrentUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="grid min-h-screen lg:grid-cols-[3fr_2fr]">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
