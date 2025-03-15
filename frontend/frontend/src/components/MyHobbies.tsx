import { useEffect, useState } from "react";
import { listHobbies, toggleHobby } from "../services/hobbyService";
import { getUserHobbies } from "../services/userService";

const MyHobbies = ({user} : {user:any}) => {
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [allHobbies, setAllHobbies] = useState<{ _id: string; name: string }[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        if (!user || !user._id) return;

        const fetchHobbies = async () => {
            try {
                const [userHobbies, hobbiesList] = await Promise.all([
                    getUserHobbies(user._id),
                    listHobbies(),
                ]);

                setHobbies(userHobbies);
                setAllHobbies(hobbiesList);
            } catch (error) {
                console.error("❌ Error fetching user or hobbies:", error);
            }
        };

        fetchHobbies();
    }, [user]);

    const handleHobbyToggle = async (hobbyId: string) => {
        if (!user || !user._id) return;

        try {
            const updatedHobbies = await toggleHobby(user._id, hobbyId);
            setHobbies(updatedHobbies);  // ✅ Update UI instantly
        } catch (error) {
            console.error("❌ Error updating hobbies:", error);
        }
    };

    return (
        <div className="my-hobbies-container">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="toggle-btn">
                {isCollapsed ? "Show My Hobbies" : "Hide My Hobbies"}
            </button>

            {!isCollapsed && (
                <div className="hobbies-list">
                    <h3>My Hobbies</h3>
                    {hobbies.length > 0 ? (
                        <ul>
                            {hobbies.map((hobbyId) => {
                                const hobby = allHobbies.find((h) => h._id === hobbyId);
                                return hobby ? <li key={hobby._id}>{hobby.name}</li> : null;
                            })}
                        </ul>
                    ) : (
                        <p>No hobbies selected yet.</p>
                    )}

                    <h3>Add More Hobbies</h3>
                    <select onChange={(e) => handleHobbyToggle(e.target.value)} className="hobby-dropdown">
                        {allHobbies.map((hobby) => (
                            <option key={hobby._id} value={hobby._id} selected={hobbies.includes(hobby._id)}>
                                {hobby.name} {hobbies.includes(hobby._id) ? "✅" : ""}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default MyHobbies;
