import { NavLink } from 'react-router-dom'

const top = [
  ['/dashboard', '🏠', 'Dashboard'],
  ['/inventory', '🛒', 'Inventory'],
  ['/reports', '📊', 'Reports'],
  ['/suppliers', '👤', 'Suppliers'],
  ['/orders', '📦', 'Orders'],
  ['/store', '🗂️', 'Manage Store'],
]

export default function Sidebar() {
  const cls = ({ isActive }) => 'nav-item' + (isActive ? ' active' : '')
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-box">K</span> KANBAN
      </div>
      <nav>
        {top.map(([to, icon, label]) => (
          <NavLink key={to} to={to} className={cls}>
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" className={cls}><span>⚙️</span> Settings</NavLink>
        <button className="nav-item" onClick={() => alert('Chiqish bosildi')}>
          <span>🚪</span> Log Out
        </button>
      </div>
    </aside>
  )
}