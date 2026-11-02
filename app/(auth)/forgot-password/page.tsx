import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-warm-red flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-heading text-2xl font-bold">Galaxy Workforce</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-warm-ink">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-warm-muted">
            Enter your email address and we'll send you reset instructions
          </p>
        </div>

        <form className="space-y-6" action="/api/auth/reset-password" method="POST">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 focus:ring ring-2 focus:ring-warm-red focus:ring-offset-2"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-warm-red hover:text-warm-red-hover">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}