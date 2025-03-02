import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ role: "Job Seeker" }); // Default role

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/user/admin/users", {
                withCredentials: true,
            });
            setUsers(res.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:4000/api/v1/user/admin/delete/${id}`, {
                    withCredentials: true,
                });
                setUsers(users.filter((user) => user._id !== id));
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({ ...user });
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:4000/api/v1/user/update/${selectedUser._id}`,
                editFormData,
                {
                    withCredentials: true,
                }
            );
            setIsEditDialogOpen(false);
            setSelectedUser(null);
            setEditFormData({});
            fetchUsers();
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    const handleAddUserClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
        setAddFormData({ role: "Job Seeker" }); // Reset form with default role
    };

    const handleInputChangeForAdd = (e) => {
        setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
    };

    const handleAddNewUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/v1/user/register", addFormData, { // Use register route for adding users
                withCredentials: true, // If needed for your register route
            });
            setIsAddDialogOpen(false);
            setAddFormData({ role: "Job Seeker" }); // Reset form
            fetchUsers(); // Refresh user list
            alert("User added successfully!");
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user.");
        }
    };


    return (
        <section style={{ padding: "20px" }}>
            <div style={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
                <h1>Manage Users</h1>
                {/* Add User Button (now opens dialog) */}
                <button
                    onClick={handleAddUserClick}
                    style={{
                        display: "inline-block",
                        marginBottom: "15px",
                        padding: "10px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        textDecoration: "none",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Add New User
                </button>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Name</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Email</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Role</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{user.name}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{user.email}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{user.role}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        style={{
                                            margin: "5px",
                                            padding: "8px 12px",
                                            border: "none",
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            borderRadius: "4px",
                                            display: "inline-block",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        style={{
                                            margin: "5px",
                                            padding: "8px 12px",
                                            border: "none",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            borderRadius: "4px",
                                            display: "inline-block",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Edit User Dialog */}
                {isEditDialogOpen && selectedUser && (
                    <div className="edit-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="edit-dialog" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '600px' }}>
                            <h2>Edit User</h2>
                            <form onSubmit={handleUpdateUser}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                                    <input type="text" id="name" name="name" value={editFormData.name || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                                    <input type="email" id="email" name="email" value={editFormData.email || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
                                    <input type="text" id="phone" name="phone" value={editFormData.phone || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
                                    <select id="role" name="role" value={editFormData.role || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                        <option value="Job Seeker">Job Seeker</option>
                                        <option value="Employer">Employer</option>
                                    </select>
                                </div>

                                <div className="buttons" style={{ marginTop: '20px', textAlign: 'right' }}>
                                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>Update</button>
                                    <button type="button" onClick={handleCloseEditDialog} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add User Dialog */}
                {isAddDialogOpen && (
                    <div className="add-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
                        <div className="add-dialog" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '600px' }}>
                            <h2>Add New User</h2>
                            <form onSubmit={handleAddNewUser}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="addName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                                    <input type="text" id="addName" name="name" value={addFormData.name || ''} onChange={handleInputChangeForAdd} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="addEmail" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                                    <input type="email" id="addEmail" name="email" value={addFormData.email || ''} onChange={handleInputChangeForAdd} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="addPhone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
                                    <input type="text" id="addPhone" name="phone" value={addFormData.phone || ''} onChange={handleInputChangeForAdd} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="addPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
                                    <input type="password" id="addPassword" name="password" value={addFormData.password || ''} onChange={handleInputChangeForAdd} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="addRole" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
                                    <select id="addRole" name="role" value={addFormData.role} onChange={handleInputChangeForAdd} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required>
                                        <option value="Job Seeker">Job Seeker</option>
                                        <option value="Employer">Employer</option>
                                    </select>
                                </div>

                                <div className="buttons" style={{ marginTop: '20px', textAlign: 'right' }}>
                                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>Add User</button>
                                    <button type="button" onClick={handleCloseAddDialog} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default AllUsers;