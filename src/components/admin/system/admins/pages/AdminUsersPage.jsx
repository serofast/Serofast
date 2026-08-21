import ResourcePage from '../../../shared/resource/ResourcePage';
import { adminUsers as seed } from '../../../shared/adminData';
const columns=['id','name','email','role','status','lastLogin'].map(key=>({key,label:key}));
export default function AdminUsersPage(){return <ResourcePage title="Admin Users" description="Manage internal administrator accounts and roles." seed={seed} columns={columns} createLabel="Add New" viewPath={(row) => `/admin/admin-users/${encodeURIComponent(row.id)}`} routeParam="adminId" basePath="/admin/admin-users" />}
