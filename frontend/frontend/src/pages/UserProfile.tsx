// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UserProfile = () => {
//   const [user, setUser] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [updatedUser, setUpdatedUser] = useState({ firstName: '', lastName: '', profilePicture: '' });

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get('/api/user/{userId}', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
//       });
//       setUser(response.data);
//       setUpdatedUser({ firstName: response.data.firstName, lastName: response.data.lastName, profilePicture: response.data.profilePicture });
//     } catch (error) {
//       console.error('Error fetching user data', error);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`/api/user/${user._id}`, updatedUser, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
//       });
//       setUser(updatedUser);
//       setEditing(false);
//     } catch (error) {
//       console.error('Error updating user data', error);
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('profilePicture', file);

//     try {
//       const response = await axios.post(`/api/user/${user._id}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });
//       setUpdatedUser((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
//     } catch (error) {
//       console.error('Error uploading profile picture', error);
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>User Profile</h2>
//       <img src={user.profilePicture || '/default-profile.png'} alt="Profile" width={100} />
//       {editing ? (
//         <>
//           <input type="text" value={updatedUser.firstName} onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} />
//           <input type="text" value={updatedUser.lastName} onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} />
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={handleUpdate}>Save</button>
//           <button onClick={() => setEditing(false)}>Cancel</button>
//         </>
//       ) : (
//         <>
//           <p>{user.firstName} {user.lastName}</p>
//           <button onClick={() => setEditing(true)}>Edit</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserProfile;
