import Logo from "../../reusable/Logo";
import AppBackButton from "../../reusable/AppBackButton";

export default function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between bg-white font-sans antialiased">
      {/* Top Left Back Button (Exact Flutter SafeArea padding) */}
      <header className="w-full px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex w-full max-w-[440px] items-center justify-start">
          <AppBackButton to="/" size={38} iconSize={19} />
        </div>
      </header>

      {/* Center Section: Animated Logo Stack + Card */}
      <main className="my-auto flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6">
        {/* SEROFAST LOGO STACK */}
        <div className="-translate-y-2 flex flex-col items-center justify-center text-center">
          <Logo size={68} iconClassName="drop-shadow-xs" />
          <span className="mt-2 font-sansation text-[34px] sm:text-[40px] font-bold tracking-[-0.5px] text-brandRed leading-none">
            SEROFAST
          </span>
        </div>

        <div className="h-6" />

        {/* FLUTTER-EXACT LOGIN / REGISTER CARD */}
        <div className="w-full max-w-[440px] rounded-[35px] bg-white border border-[#F3E5E5] px-6 py-7 sm:px-7 sm:py-8 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-300">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs font-normal text-slate-400">
        © {new Date().getFullYear()} SeroFast Platform
      </footer>
    </div>
  );
}
