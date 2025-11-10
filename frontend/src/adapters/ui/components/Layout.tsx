import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from './Button';

const Tab = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-1.5 rounded-lg text-sm font-medium ${
        isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {label}
  </NavLink>
);

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⛴️</span>
            <span className="font-semibold text-lg tracking-tight">FuelEU Compliance</span>
          </Link>
          <nav className="flex gap-2">
            <Tab to="/routes" label="Routes" />
            <Tab to="/compare" label="Compare" />
            <Tab to="/banking" label="Banking" />
            <Tab to="/pooling" label="Pooling" />
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => window.open('http://localhost:3001/health', '_blank')}>
              API Health
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Outlet />
      </main>

      <footer className="mt-10 border-t bg-white">
        <div className="container py-6 text-sm text-gray-500">
          FuelEU Maritime • Demo Dashboard • © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
