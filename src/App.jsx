import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Inventory from './pages/Inventory'
import ProductInfo from './pages/ProductInfo'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/inventory" replace />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<ProductInfo />} />
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route path="/suppliers" element={<Placeholder title="Suppliers" />} />
            <Route path="/orders" element={<Placeholder title="Orders" />} />
            <Route path="/store" element={<Placeholder title="Manage Store" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}