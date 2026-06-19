import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="p-4 md:p-8 bg-gray-50 min-h-screen">{children}</main>
    </ProtectedRoute>
  );
}