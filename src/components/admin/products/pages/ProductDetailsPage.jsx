import { useParams } from 'react-router-dom';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { products } from '../../shared/adminData';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const product = products.find((item) => item.id === productId) || products[0];
  return <div><PageHeader title={product.name} description="Product profile, seller information, stock and moderation state."/><div className="grid gap-5 lg:grid-cols-2"><Card className="p-6"><h2 className="text-lg font-semibold">Product details</h2><div className="mt-5 space-y-4">{[['Shop',product.shop],['Category',product.category],['Price',product.price],['Stock',product.stock],['Rating',`★ ${product.rating}`],['Status',product.status]].map(([label,value])=><div key={label} className="flex justify-between border-b border-lightBorder pb-3 text-sm"><span className="text-textMuted">{label}</span><span className="font-semibold">{value}</span></div>)}</div></Card><Card className="p-6"><h2 className="text-lg font-semibold">Moderation checklist</h2><div className="mt-5 space-y-3">{['Product information complete','Images reviewed','Category verified','Price reviewed','Prohibited-content check'].map((item)=><label key={item} className="flex items-center gap-3 rounded-xl border border-lightBorder p-3 text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--color-brandRed)]"/>{item}</label>)}</div></Card></div></div>;
}
