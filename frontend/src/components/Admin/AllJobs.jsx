import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main"; // Assuming context is still needed

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const navigateTo = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/job/admin/jobs", { // Admin route for all jobs
                withCredentials: true,
            });
            setJobs(res.data.jobs);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await axios.delete(`http://localhost:4000/api/v1/job/admin/delete/${id}`, { // Admin route for delete
                    withCredentials: true,
                });
                setJobs(jobs.filter((job) => job._id !== id));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleEditClick = (job) => {
        setSelectedJob(job);
        setEditFormData({ ...job }); // Initialize form data with job details
        setIsEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedJob(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:4000/api/v1/job/update/${selectedJob._id}`, // General update route - accessible by admin
                editFormData,
                {
                    withCredentials: true,
                }
            );
            setIsEditDialogOpen(false);
            setSelectedJob(null);
            setEditFormData({});
            fetchJobs(); // Refresh job list after update
            alert("Job updated successfully!"); // Or use react-hot-toast for notification
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job."); // Or use react-hot-toast for error notification
        }
    };

    return (
        <section style={{ padding: "20px" }}>
            <div style={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
                <h1>Manage Jobs</h1>
                <Link
                    to="/job/post" // Link to your PostJob component for creating new jobs
                    style={{
                        display: "inline-block",
                        marginBottom: "15px",
                        padding: "10px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "5px",
                    }}
                >
                    Add New Job
                </Link>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Title</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Category</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Country</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job._id} style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{job.title}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{job.category}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{job.country}</td>
                                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>
                                    <button
                                        onClick={() => handleEditClick(job)}
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
                                        onClick={() => handleDeleteJob(job._id)}
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

                {/* Edit Job Dialog */}
                {isEditDialogOpen && selectedJob && (
                    <div className="edit-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="edit-dialog" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '600px' }}>
                            <h2>Edit Job</h2>
                            <form onSubmit={handleUpdateJob}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                                    <input type="text" id="title" name="title" value={editFormData.title || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
                                    <textarea id="description" name="description" value={editFormData.description || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                                    <input type="text" id="category" name="category" value={editFormData.category || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="country" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country:</label>
                                    <input type="text" id="country" name="country" value={editFormData.country || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City:</label>
                                    <input type="text" id="city" name="city" value={editFormData.city || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location:</label>
                                    <input type="text" id="location" name="location" value={editFormData.location || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="fixedSalary" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fixed Salary:</label>
                                    <input type="number" id="fixedSalary" name="fixedSalary" value={editFormData.fixedSalary || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="salaryFrom" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Salary From:</label>
                                    <input type="number" id="salaryFrom" name="salaryFrom" value={editFormData.salaryFrom || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="salaryTo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Salary To:</label>
                                    <input type="number" id="salaryTo" name="salaryTo" value={editFormData.salaryTo || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>

                                <div className="buttons" style={{ marginTop: '20px', textAlign: 'right' }}>
                                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>Update</button>
                                    <button type="button" onClick={handleCloseDialog} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllJobs;