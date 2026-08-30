import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button, Input, Label, Logo, Select } from '../ui';

const roleOptions = [
  { value: 'ADMINISTRATOR', label: 'Administrator' },
  { value: 'STAFF_USER', label: 'Staff User' },
  { value: 'TECHNICIAN', label: 'Technician' },
];

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
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

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              placeholder="Select your role"
              options={roleOptions}
              required
            />
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" fullWidth className="py-3">
            Sign In
            <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-muted">
            Access is granted based on your assigned role. Contact your
            administrator if you need help signing in.
          </p>
        </div>
      </div>
    </div>
  );
}
