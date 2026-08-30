import { LoginForm } from '../components/login/LoginForm';
import { LoginHero } from '../components/login/LoginHero';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-page">
      <div className="grid min-h-screen lg:grid-cols-[3fr_2fr]">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
