import React, { useEffect, useState } from "react";
import {createUser, deleteUser, listUsers} from "../services/adminService";
import  Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Edit, Plus } from "lucide-react";

const AdminUsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h2 className="text-xl font-semibold">Users List</h2>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex justify-between items-center p-2 border-b">
                <span>{user.firstName} {user.lastName} ({user.email})</span>
                <div className="space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleDeleteUser(user._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
              <Input placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
              <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <Button onClick={handleAddUser}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminUsersList;
