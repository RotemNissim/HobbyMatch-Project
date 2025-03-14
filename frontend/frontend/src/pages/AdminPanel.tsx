import AdminUsersList from "../components/AdminUsersList";
import AdminEventsList from "../components/AdminEventsList";
import AdminAdminsList from "../components/AdminAdminsList";
import AdminHobbiesList from "../components/AdminHobbiesList";
import ErrorBoundary from "../components/ErrorBoundary";
import { Card } from "../components/ui/Card";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin } from "../services/adminService";
const AdminPanel = () => {
  const [admin, setAdmin] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
        try {
            const currentAdmin = await getCurrentAdmin();
        
            setAdmin(currentAdmin);
        } catch (error) {
            console.error("Admin not authenticated, redirecting...");
            navigate('/login');
        }
    };
    fetchAdmin();
}, [navigate]);
  
    return (
        <ErrorBoundary>
        
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Card>
            <AdminUsersList />
          </Card>
          <Card>
            <AdminEventsList />
          </Card>
          <Card>
            <AdminHobbiesList />
          </Card>
          <Card>
            <AdminAdminsList />
          </Card>
        </div>
        </ErrorBoundary>
      );
    };
    

export default AdminPanel; 