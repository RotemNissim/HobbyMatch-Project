import React, { useEffect, useState } from "react";
import { createUser, deleteUser, listUsers } from "../services/adminService";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

const AdminUsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(true); // Set to true for debugging
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    
  }, [users]);

  const fetchUsers = async () => {
    try {
      const usersData = await listUsers(); // listUsers already returns data
      
      setUsers(usersData || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      alert("Please fill all fields before adding a user.");
      return;
    }

    try {
      await createUser(newUser);
      setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Optimistic update
    } catch (error) {
      console.error("Error deleting user:", error);
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
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id || Math.random()} className="flex justify-between items-center p-2 border-b">
                  <span>{user.firstName} {user.lastName} ({user.email})</span>
                  <Button size="icon" variant="outline" onClick={() => handleDeleteUser(user._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found.</p>
            )}
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
