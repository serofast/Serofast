import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import DashboardPage from './dashboard/pages/DashboardPage';
import ShopsPage from './shops/pages/ShopsPage';
import ShopDetailsPage from './shops/pages/ShopDetailsPage';
import ShopApprovalPage from './shops/pages/ShopApprovalPage';
import CustomersPage from './customers/pages/CustomersPage';
import CustomerDetailsPage from './customers/pages/CustomerDetailsPage';
import ProductsPage from './products/pages/ProductsPage';
import ProductDetailsPage from './products/pages/ProductDetailsPage';
import ProductApprovalPage from './products/pages/ProductApprovalPage';
import ProductFormPage from './products/pages/ProductFormPage';
import CategoriesPage from './categories/pages/CategoriesPage';
import OrdersPage from './orders/pages/OrdersPage';
import OrderDetailsPage from './orders/pages/OrderDetailsPage';
import InventoryPage from './inventory/pages/InventoryPage';
import ReturnsPage from './returns/pages/ReturnsPage';
import ReturnDetailsPage from './returns/pages/ReturnDetailsPage';
import ReviewsPage from './reviews/pages/ReviewsPage';
import ShipmentsPage from './delivery/pages/ShipmentsPage';
import ShipmentDetailsPage from './delivery/pages/ShipmentDetailsPage';
import TransactionsPage from './finance/pages/TransactionsPage';
import CommissionsPage from './finance/pages/CommissionsPage';
import WithdrawalsPage from './finance/pages/WithdrawalsPage';
import RefundsPage from './finance/pages/RefundsPage';
import CouponsPage from './marketing/coupons/pages/CouponsPage';
import CouponFormPage from './marketing/coupons/pages/CouponFormPage';
import CampaignsPage from './marketing/campaigns/pages/CampaignsPage';
import CampaignFormPage from './marketing/campaigns/pages/CampaignFormPage';
import BannersPage from './marketing/banners/pages/BannersPage';
import BannerFormPage from './marketing/banners/pages/BannerFormPage';
import HomepageCMSPage from './marketing/homepage/pages/HomepageCMSPage';
import AnalyticsPage from './analytics/pages/AnalyticsPage';
import SearchAnalyticsPage from './analytics/pages/SearchAnalyticsPage';
import SupportTicketsPage from './support/pages/SupportTicketsPage';
import TicketDetailsPage from './support/pages/TicketDetailsPage';
import NotificationsPage from './notifications/pages/NotificationsPage';
import RiskDashboardPage from './risk/pages/RiskDashboardPage';
import ReportsPage from './reports/pages/ReportsPage';
import AdminUsersPage from './system/admins/pages/AdminUsersPage';
import RolesPage from './system/roles/pages/RolesPage';
import AuditLogsPage from './system/audit/pages/AuditLogsPage';
import SettingsPage from './system/settings/pages/SettingsPage';

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="shops" element={<ShopsPage />} />
        <Route path="shops/approvals" element={<Navigate to="/admin/shops" replace />} />
        <Route path="shops/:shopId" element={<ShopDetailsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId" element={<CustomerDetailsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/approvals" element={<Navigate to="/admin/products" replace />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:productId" element={<ProductDetailsPage />} />
        <Route path="products/:productId/edit" element={<ProductFormPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="inventory" element={<Navigate to="/admin/products" replace />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="returns/:returnId" element={<ReturnDetailsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="delivery" element={<ShipmentsPage />} />
        <Route path="delivery/:shipmentId" element={<ShipmentDetailsPage />} />
        <Route path="finance/transactions" element={<TransactionsPage />} />
        <Route path="finance/commissions" element={<CommissionsPage />} />
        <Route path="finance/withdrawals" element={<WithdrawalsPage />} />
        <Route
          path="finance/withdrawals/:withdrawalId"
          element={<WithdrawalsPage />}
        />
        <Route path="finance/refunds" element={<RefundsPage />} />
        <Route path="finance/refunds/:refundId" element={<RefundsPage />} />
        <Route path="marketing/coupons" element={<CouponsPage />} />
        <Route path="marketing/coupons/new" element={<CouponFormPage />} />
        <Route
          path="marketing/coupons/:couponId/edit"
          element={<CouponFormPage />}
        />
        <Route path="marketing/campaigns" element={<CampaignsPage />} />
        <Route path="marketing/campaigns/new" element={<CampaignFormPage />} />
        <Route
          path="marketing/campaigns/:campaignId/edit"
          element={<CampaignFormPage />}
        />
        <Route path="marketing/banners" element={<BannersPage />} />
        <Route path="marketing/banners/new" element={<BannerFormPage />} />
        <Route
          path="marketing/banners/:bannerId/edit"
          element={<BannerFormPage />}
        />
        <Route path="marketing/homepage" element={<HomepageCMSPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="analytics/search" element={<SearchAnalyticsPage />} />
        <Route path="support" element={<SupportTicketsPage />} />
        <Route path="support/:ticketId" element={<TicketDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="risk" element={<RiskDashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="admin-users/:adminId" element={<AdminUsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="roles/:roleId" element={<RolesPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
