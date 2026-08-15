import { useParams } from 'react-router-dom';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { customers } from '../../shared/adminData';

export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const customer = customers.find((item) => item.id === customerId) || customers[0];
  return <div><PageHeader title={customer.name} description="Customer profile, account status and marketplace activity."/><Card className="p-6"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-textMuted">Email</p><p className="mt-1 font-semibold">{customer.email}</p></div><div><p className="text-xs text-textMuted">Orders</p><p className="mt-1 font-semibold">{customer.orders}</p></div><div><p className="text-xs text-textMuted">Total spent</p><p className="mt-1 font-semibold">{customer.spent}</p></div><div><p className="text-xs text-textMuted">Status</p><div className="mt-1"><StatusBadge value={customer.status}/></div></div></div></Card></div>;
}
