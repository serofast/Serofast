import ResourcePage from '../../../shared/resource/ResourcePage';
import { banners as seed } from '../../../shared/adminData';
export default function BannersPage(){return <ResourcePage title="Banners" description="Manage hero and promotional banners." seed={seed} columns={['id','title','placement','status','priority','start','end'].map(key=>({key,label:key}))} createLabel="Add New" createPath="/admin/marketing/banners/new" editPath={(row) => `/admin/marketing/banners/${encodeURIComponent(row.id)}/edit`} />}
