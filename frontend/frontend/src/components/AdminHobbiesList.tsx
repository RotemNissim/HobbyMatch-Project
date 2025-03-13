import React, { useEffect, useState } from "react";
import {createHobby, updateHobby, deleteHobby, listHobbies} from "../services/adminService";
import  Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Plus, Edit } from "lucide-react";

const AdminHobbiesList = () => {
    const [hobbies, setHobbies] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [newHobby, setNewHobby] = useState( {name: "", category: ""} );
    const [editingHobby, setEditingHobby] = useState<any | null>(null);
  
    useEffect(() => {
      fetchHobbies();
    }, []);
  
    const fetchHobbies = async () => {
      try {
        const response = await listHobbies();
        setHobbies(response.data);
      } catch (error) {
        console.error("Error fetching hobbies", error);
      }
    };
  
    const handleAddHobby = async () => {
      try {
        await createHobby(newHobby);
        setNewHobby({ name: "", category: "" });
        fetchHobbies();
      } catch (error) {
        console.error("Error adding hobby", error);
      }
    };
  
    const handleUpdateHobby = async () => {
      if (!editingHobby) return;
      try {
        await updateHobby(editingHobby._id, editingHobby);
        setEditingHobby(null);
        fetchHobbies();
      } catch (error) {
        console.error("Error updating hobby", error);
      }
    };
  
    const handleDeleteHobby = async (hobbyId: string) => {
      try {
        await deleteHobby(hobbyId);
        fetchHobbies();
      } catch (error) {
        console.error("Error deleting hobby", error);
      }
    };
  
    return (
      <Card>
        <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <h2 className="text-xl font-semibold">Hobbies List</h2>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expanded && (
          <CardContent>
            <div className="space-y-4">
              {hobbies.map((hobby) => (
                <div key={hobby._id} className="flex justify-between items-center p-2 border-b">
                  <span>{hobby.name}</span>
                  <div className="space-x-2">
                    <Button size="icon" variant="outline" onClick={() => setEditingHobby(hobby)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteHobby(hobby._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {editingHobby && (
                <div className="flex space-x-2">
                  <Input placeholder="Hobby Name" value={editingHobby.name} onChange={(e) => setEditingHobby({ ...editingHobby, name: e.target.value })} />
                  <Button onClick={handleUpdateHobby}>Update</Button>
                </div>
              )}
              <div className="flex space-x-2">
                <Input placeholder="New Hobby" value={newHobby.name} onChange={(e) => setNewHobby({ name: e.target.value, category: e.target.value })} />
                <Button onClick={handleAddHobby}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };
  
  export default AdminHobbiesList;
  