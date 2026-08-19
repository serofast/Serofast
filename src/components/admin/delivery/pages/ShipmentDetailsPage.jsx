import { useParams } from 'react-router-dom';
import { Card, PageHeader, StatusBadge } from '../../shared/ui';
import { shipments } from '../../shared/adminData';

export default function ShipmentDetailsPage() {
  const params = useParams();
  const record = shipments.find((item) => item.id === params.shipmentId) || shipments[0];
  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">Shipment Details</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">Operational detail view for the selected record.</p>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {Object.entries(record).map(([key,value])=>
            <div key={key} className="flex justify-between gap-5 border-b border-slate-100 pb-3 text-xs">
              <span className="capitalize text-slate-500 font-normal">{key}</span>
              <span className="font-medium text-slate-900">{key === 'status' ? <StatusBadge value={value}/> : String(value)}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
