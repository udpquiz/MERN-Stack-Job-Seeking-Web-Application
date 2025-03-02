import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/feedback/admin/feedback", {
                withCredentials: true,
            });
            console.log("API Response Data:", res.data); // Keep this log
            console.log("API Response Feedbacks Array:", res.data.feedbacks); // Add this log for confirmation
            if (res.data && res.data.feedback) { // Change to res.data.feedbacks
                setFeedbackList(res.data.feedback); // Change to res.data.feedbacks
            } else {
                console.error("API response does not contain feedbacks array:", res.data); // Update error message
                setFeedbackList([]);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
            console.log("Error Object:", error);
            setFeedbackList([]);
            alert("Failed to load feedback. Please check console for details.");
        }
    };

    const deleteFeedback = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axios.delete(`http://localhost:4000/api/v1/feedback/admin/delete/${id}`, {
                    withCredentials: true,
                });
                setFeedbackList(feedbackList.filter((feedback) => feedback._id !== id));
                alert("Feedback deleted successfully!");
            } catch (error) {
                console.error("Error deleting feedback:", error);
                alert("Failed to delete feedback.");
            }
        }
    };

    const handleEditClick = (feedback) => {
        setSelectedFeedback(feedback);
        setEditFormData({ message: feedback.message });
        setIsEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedFeedback(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateFeedback = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:4000/api/v1/feedback/update/${selectedFeedback._id}`,
                editFormData,
                {
                    withCredentials: true,
                }
            );
            setIsEditDialogOpen(false);
            setSelectedFeedback(null);
            setEditFormData({});
            fetchFeedback();
            alert("Feedback updated successfully!");
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Failed to update feedback.");
        }
    };


    return (
        <section style={{ padding: "20px" }}>
            <div style={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
                <h1>Manage Feedback</h1>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>User</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Message</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Date</th>
                            <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(feedbackList) && feedbackList.length > 0 ? (
                            feedbackList.map((feedback) => (
                                <tr key={feedback._id} style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                                    <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{feedback.name }</td>
                                    <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "normal", wordBreak: 'break-word' }}>{feedback.message}</td>
                                    <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>
                                        <button
                                            onClick={() => handleEditClick(feedback)}
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
                                            onClick={() => deleteFeedback(feedback._id)}
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
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '12px 16px' }}>No feedback available.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* Edit Feedback Dialog */}
                {isEditDialogOpen && selectedFeedback && (
                    <div className="edit-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="edit-dialog" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '600px' }}>
                            <h2>Edit Feedback</h2>
                            <form onSubmit={handleUpdateFeedback}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message:</label>
                                    <textarea id="message" name="message" value={editFormData.message || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '150px' }} />
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

export default AllFeedback;