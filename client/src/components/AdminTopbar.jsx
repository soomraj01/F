import { ChevronDown, Menu, X } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

// This component renders the compact admin header and mobile navigation toggle.
function AdminTopbar({ mobileNav, onToggle }) {
  return <header className="admin-topbar"><button className="mobile-menu" onClick={onToggle} aria-label="Toggle navigation">{mobileNav ? <X /> : <Menu />}</button><span>Portfolio admin</span><div className="admin-user"><ProfileAvatar className="avatar-small" /><strong>Soom Raj</strong><ChevronDown size={15} /></div></header>;
}

export default AdminTopbar;
