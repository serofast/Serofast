import AuthShell from "./components/AuthShell";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell mode="signup">
      <RegisterForm />
    </AuthShell>
  );
}
