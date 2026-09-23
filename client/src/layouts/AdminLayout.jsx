// This layout provides the shared content frame for authenticated admin pages.
function AdminLayout({ sidebar, topbar, children }) {
  return <div className="admin-layout">{sidebar}<div className="admin-main">{topbar}<div className="admin-content">{children}</div></div></div>;
}

export default AdminLayout;
