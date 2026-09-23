import { FolderKanban, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';

// This component contains the private admin navigation shared by dashboard pages.
function AdminSidebar({ activePage, open, onClose, onLogout }) {
  return <aside className={open ? 'admin-sidebar open' : 'admin-sidebar'}><div className="admin-brand"><ProfileAvatar /><div><strong>Soom Raj.</strong><span>MERN Developer</span></div></div><nav><Link className={activePage === 'dashboard' ? 'nav-link active' : 'nav-link'} to="/admin" onClick={onClose}><LayoutDashboard size={17} /> Dashboard</Link><Link className={activePage === 'projects' ? 'nav-link active' : 'nav-link'} to="/admin/projects" onClick={onClose}><FolderKanban size={17} /> Projects</Link><Link className={activePage === 'add' ? 'nav-link active' : 'nav-link'} to="/admin/add-project" onClick={onClose}><Plus size={17} /> Add project</Link></nav><button className="logout-link" onClick={onLogout}><LogOut size={17} /> Logout</button></aside>;
}

export default AdminSidebar;
