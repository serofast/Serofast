import { useState } from "react";
import { GraduationCap, Award, CheckCircle2, FileCheck, Sparkles } from "lucide-react";
import { adminStudents as initialStudents } from "../../data/adminData";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(initialStudents);

  const toggleCertificate = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              certificateStatus:
                s.certificateStatus === "Issued" ? "Pending Approval" : "Issued",
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Entrepreneur Program</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Manage campus promoters, issue verified certificates &amp; top performer commendations.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 font-bold uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Student Promoter</th>
                <th className="px-5 py-3.5">College / Campus</th>
                <th className="px-5 py-3.5">Orders Promoted</th>
                <th className="px-5 py-3.5">Total Commission Earned</th>
                <th className="px-5 py-3.5">Award Rank</th>
                <th className="px-5 py-3.5">Certificate</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-850 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{st.name}</span>
                        <span className="text-[11px] text-slate-400">ID: {st.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{st.college}</td>
                  <td className="px-5 py-4 font-bold text-white">{st.referralsCount} orders</td>
                  <td className="px-5 py-4 font-extrabold text-purple-400">{st.totalEarned}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                      <Award size={12} /> {st.awardRank}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        st.certificateStatus === "Issued"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {st.certificateStatus === "Issued" ? <CheckCircle2 size={12} /> : <FileCheck size={12} />}
                      <span>{st.certificateStatus}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleCertificate(st.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        st.certificateStatus === "Issued"
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {st.certificateStatus === "Issued" ? "Revoke Certificate" : "Issue PDF Certificate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
