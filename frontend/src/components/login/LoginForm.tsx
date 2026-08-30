import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginRequest } from '../../utils/auth';
import { Button, Input, Label, Logo } from '../ui';

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      await loginRequest(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-10 lg:px-16">
      <div className="mx-auto w-full max-w-[440px]">
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo variant="dark" className="h-14" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              required
            />
          </div>

          <Button type="submit" fullWidth className="py-3" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
}
