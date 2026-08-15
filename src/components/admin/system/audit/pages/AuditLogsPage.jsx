import ResourcePage from '../../../shared/resource/ResourcePage';
import { auditLogs as seed } from '../../../shared/adminData';
const columns=['id','actor','action','target','module','time'].map(key=>({key,label:key}));
export default function AuditLogsPage(){return <ResourcePage title="Audit Logs" description="Review administrative actions for accountability and debugging." seed={seed} columns={columns}/> }
