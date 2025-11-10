import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './adapters/ui/components/Layout';
import RoutesPage from './adapters/ui/pages/RoutesPage';
import ComparePage from './adapters/ui/pages/ComparePage';
import BankingPage from './adapters/ui/pages/BankingPage';
import PoolingPage from './adapters/ui/pages/PoolingPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/routes" replace />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/banking" element={<BankingPage />} />
        <Route path="/pooling" element={<PoolingPage />} />
      </Route>
    </Routes>
  );
}
