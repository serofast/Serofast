import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { productApprovals } from '../../shared/adminData';

export default function ProductApprovalPage() {
  const [rows,setRows] = useState(productApprovals);
  function update(id) { setRows((current)=>current.filter((item)=>item.id!==id)); }
  return <div><PageHeader title="Product Approval Queue" description="Review new catalog submissions before products become active marketplace inventory."/><Card className="overflow-hidden"><div className="divide-y divide-lightBorder">{rows.map((product)=><div key={product.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-3"><h2 className="font-semibold">{product.name}</h2><StatusBadge value="Pending"/></div><p className="mt-1 text-sm text-textSecondary">{product.shop} · {product.category} · {product.price}</p><p className="mt-1 text-xs text-textMuted">Submitted {product.submitted}</p></div><div className="flex gap-2"><button onClick={()=>update(product.id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold"><X size={15}/> Reject</button><button onClick={()=>update(product.id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white"><Check size={15}/> Approve</button></div></div>)}</div></Card></div>;
}
