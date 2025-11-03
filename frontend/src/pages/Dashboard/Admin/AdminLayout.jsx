import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/Navbar/AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
