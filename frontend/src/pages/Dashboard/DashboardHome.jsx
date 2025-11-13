import { useAuth } from "@/hooks/useAuth";
import DashboardOwner from "./DashboardOwner";
import DashboardSeeker from "./DashboardSeeker";
import LoadingPage from "@/pages/LoadingPage";

const DashboardHome = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (user?.role === 'OWNER') {
    return <DashboardOwner />;
  }
  if (user?.role === 'SEEKER') {
    return <DashboardSeeker />;
  }

  return (
    <div className="p-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600">
          Please complete your profile to get started
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
