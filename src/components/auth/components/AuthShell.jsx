import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthShell({ children, mode }) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-textPrimary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex justify-center">
          <Link
            to="/"
            className="group inline-flex flex-col items-center"
            aria-label="Back to SeroFast home"
          >
            <span className="font-sansation text-[34px] font-medium tracking-[-1.5px] text-[#C93A2F] sm:text-[38px]">
              SEROFAST
            </span>
            <span className="mt-3 h-1 w-11 rounded-full bg-[#F0D1CF]" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 sm:py-10">
          <div className="w-full max-w-[540px] rounded-[30px] bg-white p-7 shadow-[0_20px_55px_rgba(17,24,39,0.07)] sm:p-9 lg:p-10">
            {children}
          </div>
        </main>

        <div className="pb-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8FA0B8] transition hover:text-brandRed"
          >
            <ArrowLeft size={15} />
            BACK TO SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}
