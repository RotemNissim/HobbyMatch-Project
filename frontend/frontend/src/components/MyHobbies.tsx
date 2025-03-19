import { useEffect, useState } from "react";
import { listHobbies, toggleHobby } from "../services/hobbyService";
import { getUserHobbies } from "../services/userService";
import Select, { ActionMeta, MultiValue } from "react-select";

const MyHobbies = ({ user }: { user: any }) => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [allHobbies, setAllHobbies] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    console.log("THIS IS THE HOBBIES: " + hobbies);
    if (!user || !user._id) return;

    const fetchHobbies = async () => {
      setLoading(true);
      try {
        console.log("🔥 Fetching hobbies for user:", user._id);
        const [userHobbies, hobbiesList] = await Promise.all([
          getUserHobbies(user._id),
          listHobbies(),
        ]);

        console.log("✅ API Response - User Hobbies:", userHobbies);
        console.log("✅ API Response - All Hobbies:", hobbiesList);

        const userHobbyIds = userHobbies.map(
          (hobby: { _id: string }) => hobby._id
        );

        setHobbies(userHobbyIds);
        setAllHobbies(hobbiesList);
      } catch (error) {
        console.error("❌ Error fetching hobbies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, [user]); // ✅ Only fetch when user changes

  const handleHobbyToggle = async (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (!user || !user._id || isUpdating) return;
    const hobbyId: string | undefined = actionMeta.option?.value;
    if (!hobbyId) throw new Error("Invalid hobby ID");

    try {
      setIsUpdating(true);
      console.log("🔥 Toggling hobby:", hobbyId);

      // 🔥 Backend update first
      await toggleHobby(user._id, hobbyId);

      // 🔥 Refetch hobbies from backend
      const [updatedHobbies, updatedHobbyList] = await Promise.all([
        getUserHobbies(user._id),
        listHobbies(),
      ]);

      const updatedHobbyIds = updatedHobbies.map(
        (hobby: { _id: string }) => hobby._id
      );
      setHobbies(updatedHobbyIds);
      setAllHobbies(updatedHobbyList); // ✅ Ensures hobbies list stays in sync
    } catch (error) {
      console.error("❌ Error updating hobbies:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="my-hobbies-container">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="toggle-btn"
      >
        {isCollapsed ? "Show My Hobbies" : "Hide My Hobbies"}
      </button>

      {!isCollapsed && (
        <div className="hobbies-list">
          <h3>My Hobbies</h3>
          {loading ? (
            <p>Loading hobbies...</p>
          ) : hobbies.length > 0 ? (
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
          <Select
            isMulti
            options={allHobbies.map((h) => ({ value: h._id, label: h.name }))}
            placeholder="Select hobbies"
            className="ESF_hobbiFilter-input"
            onChange={handleHobbyToggle}
          />
        </div>
      )}
    </div>
  );
};

export default MyHobbies;
