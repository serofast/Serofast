import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, FileCheck2 } from 'lucide-react';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { shopApprovals } from '../../shared/adminData';

export default function ShopApprovalPage() {
  const [rows, setRows] = useState(shopApprovals);
  const navigate = useNavigate();
  function update(id, status) { setRows((current) => current.filter((item) => item.id !== id)); }
  return <div><PageHeader title="Shop Approval Queue" description="Review seller applications, verification state and submitted business information."/><Card className="overflow-hidden"><div className="divide-y divide-lightBorder">{rows.map((shop)=><div key={shop.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-3"><h2 className="font-semibold">{shop.name}</h2><StatusBadge value="Pending"/></div><p className="mt-1 text-sm text-textSecondary">{shop.owner} · {shop.category}</p><p className="mt-1 text-xs text-textMuted">{shop.verification} · Submitted {shop.submitted}</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>navigate(`/admin/shops/${shop.id}`)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold"><FileCheck2 size={15}/> Review</button><button onClick={()=>update(shop.id,'Rejected')} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-rose-300 hover:text-rose-700"><X size={15}/> Reject</button><button onClick={()=>update(shop.id,'Active')} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white"><Check size={15}/> Approve</button></div></div>)}</div>{rows.length===0&&<div className="p-12 text-center text-sm text-textMuted">No pending shop applications.</div>}</Card></div>;
}
