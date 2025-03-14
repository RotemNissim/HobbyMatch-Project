import React, { useEffect, useState } from "react";
import { createAdmin, deleteAdmin, updateAdmin, listAdmins } from "../services/adminService";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Edit, Plus } from "lucide-react";

const AdminAdminsList = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(true); // Set to true for debugging
  const [newAdmin, setNewAdmin] = useState({ firstName: "", lastName: "", email: "", password: "", role: 'admin' as const });
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    console.log("Admins state updated:", admins);
  }, [admins]);

  const fetchAdmins = async () => {
    try {
      const adminsData = await listAdmins();
      console.log("Fetched admins:", adminsData);
      setAdmins(adminsData || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password) {
      alert("Please fill all fields before adding an admin.");
      return;
    }

    try {
      await createAdmin(newAdmin);
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "", role: 'admin' });
      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    try {
      await updateAdmin(editingAdmin._id, editingAdmin);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) => (admin._id === editingAdmin._id ? editingAdmin : admin))
      ); // Optimistic update
      setEditingAdmin(null);
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await deleteAdmin(adminId);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId)); // Optimistic update
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h2 className="text-xl font-semibold">Admins List</h2>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div key={admin._id || Math.random()} className="flex justify-between items-center p-2 border-b">
                  <span>{admin.firstName} {admin.lastName} ({admin.email})</span>
                  <div className="space-x-2">
                    <Button size="icon" variant="outline" onClick={() => setEditingAdmin(admin)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteAdmin(admin._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No admins found.</p>
            )}
            {editingAdmin && (
              <div className="flex space-x-2">
                <Input placeholder="First Name" value={editingAdmin.firstName} onChange={(e) => setEditingAdmin({ ...editingAdmin, firstName: e.target.value })} />
                <Input placeholder="Last Name" value={editingAdmin.lastName} onChange={(e) => setEditingAdmin({ ...editingAdmin, lastName: e.target.value })} />
                <Input placeholder="Email" value={editingAdmin.email} onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })} />
                <Button onClick={handleUpdateAdmin}>Update</Button>
              </div>
            )}
            <div className="flex space-x-2">
              <Input placeholder="First Name" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} />
              <Input placeholder="Last Name" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} />
              <Input placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              <Input placeholder="Password" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              <Button onClick={handleAddAdmin}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminAdminsList;
