import ResourcePage from '../../../shared/resource/ResourcePage';
import { campaigns as seed } from '../../../shared/adminData';
export default function CampaignsPage(){return <ResourcePage title="Campaigns" description="Plan and monitor marketplace campaigns." seed={seed} columns={['id','name','audience','budget','reach','status','starts','ends'].map(key=>({key,label:key}))} createLabel="Add New"/>}
