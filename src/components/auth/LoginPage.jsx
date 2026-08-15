import AuthShell from "./components/AuthShell";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">
          Shop Owner Workspace
        </span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Shop Owner Login
        </h1>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-brandRed/30" />
      </div>

      <div>
        <LoginForm />
      </div>
    </AuthShell>
  );
}
