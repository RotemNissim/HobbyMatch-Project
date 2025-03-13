import AdminUsersList from "../components/AdminUsersList";
import AdminEventsList from "../components/AdminEventsList";
import AdminAdminsList from "../components/AdminAdminsList";
import AdminHobbiesList from "../components/AdminHobbiesList";
import { Card } from "../components/ui/Card";
const AdminPanel = () => {
    return (
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
      );
    };
    

export default AdminPanel; 