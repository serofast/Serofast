import AuthShell from "./components/AuthShell";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell mode="signup">
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-brandRed">
          Campus Store Onboarding
        </span>
        <h1 className="mt-1 text-2xl font-black text-textPrimary sm:text-[28px]">
          Become a Shop Owner
        </h1>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-brandRed/30" />
      </div>

      <div className="mt-6">
        <RegisterForm />
      </div>
    </AuthShell>
  );
}
