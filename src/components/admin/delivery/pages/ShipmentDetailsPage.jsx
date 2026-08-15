import { useParams } from 'react-router-dom';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { shipments } from '../../shared/adminData';

export default function ShipmentDetailsPage() {
  const params = useParams();
  const record = shipments.find((item) => item.id === params.shipmentId) || shipments[0];
  return <div><PageHeader title="Shipment Details" description="Operational detail view for the selected record."/><Card className="p-6"><div className="space-y-4">{Object.entries(record).map(([key,value])=><div key={key} className="flex justify-between gap-5 border-b border-lightBorder pb-3 text-sm"><span className="capitalize text-textMuted">{key}</span><span className="font-semibold">{key === 'status' ? <StatusBadge value={value}/> : String(value)}</span></div>)}</div></Card></div>;
}
