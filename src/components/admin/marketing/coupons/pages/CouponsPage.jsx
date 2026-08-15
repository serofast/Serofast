import ResourcePage from '../../../shared/resource/ResourcePage';
import { coupons as seed } from '../../../shared/adminData';
export default function CouponsPage(){return <ResourcePage title="Coupons" description="Create and monitor marketplace coupon codes." seed={seed} columns={['id','code','type','value','minOrder','usage','status','expires'].map(key=>({key,label:key}))} createLabel="Add New"/>}
