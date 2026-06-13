import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AccountSetupComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card-glow rounded-3xl max-w-md w-full p-10 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "var(--gradient-brand)", filter: "blur(120px)" }}
        />
        <div className="relative">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="mt-5 text-2xl font-display font-bold tracking-tight">You're all set!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your profile is ready. Start learning and building to unlock personalized insights.</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-1 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
          >
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
