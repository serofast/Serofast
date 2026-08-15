import ResourcePage from '../../shared/resource/ResourcePage';
import { supportTickets as seed } from '../../shared/adminData';
export default function SupportTicketsPage(){return <ResourcePage title="Support" description="Manage customer and seller support tickets, complaints and escalations." seed={seed} columns={['id','subject','requester','type','priority','status','updated'].map(key=>({key,label:key}))} />}
