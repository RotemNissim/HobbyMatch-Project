import React, { useEffect, useState } from "react";
import { createUser, deleteUser, updateUser, listUsers } from "../services/adminService";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Edit, Plus } from "lucide-react";
import { IUser } from "../types";

const AdminUsersList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<IUser>({ firstName: "", lastName: "", email: "", password: "", profilePicture: "" });
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await listUsers();
      setUsers(usersData || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser._id || "", editingUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === editingUser._id ? editingUser : user))
      ); // Optimistic update
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
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
                <div key={user._id} className="flex justify-between items-center p-2 border-b">
                  <span>{user.firstName} {user.lastName} ({user.email})</span>
                  <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full" />
                  <div className="space-x-2">
                    <Button size="icon" variant="outline" onClick={() => setEditingUser(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteUser(user._id || "")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found.</p>
            )}
            {editingUser && (
              <div className="flex space-x-2 p-2 border-t mt-4">
                <Input placeholder="First Name" value={editingUser.firstName} onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} />
                <Input placeholder="Last Name" value={editingUser.lastName} onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} />
                <Input placeholder="Email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                <Input placeholder="Password" type="password" value={editingUser.password || ""} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
                <Button onClick={handleUpdateUser}>Update</Button>
                <Button onClick={() => setEditingUser(null)} variant="outline">Cancel</Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminUsersList;