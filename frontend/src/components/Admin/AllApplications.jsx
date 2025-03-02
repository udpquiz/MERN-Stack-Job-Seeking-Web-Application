import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/application/admin/applications", {
        withCredentials: true,
      });
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(`http://localhost:4000/api/v1/application/admin/delete/${id}`, {
          withCredentials: true,
        });
        setApplications(applications.filter((app) => app._id !== id));
        alert("Application deleted successfully!");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application.");
      }
    }
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setEditFormData({ ...application }); // Initialize form data with application details
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedApplication(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/v1/application/update/${selectedApplication._id}`, // Assuming you have application update route
        editFormData,
        {
          withCredentials: true,
        }
      );
      setIsEditDialogOpen(false);
      setSelectedApplication(null);
      setEditFormData({});
      fetchApplications(); // Refresh applications list
      alert("Application updated successfully!");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    }
  };

  return (
    <section style={{ padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
        <h1>Manage Applications</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Applicant Name</th>
              <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Job Title</th>
              <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Applied Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left", border: "1px solid #ddd", backgroundColor: "#f4f4f4", fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{app.name}</td>
                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{app.jobId ? app.jobId.title : 'N/A'}</td>
                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px 16px", border: "1px solid #ddd", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => handleEditClick(app)}
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
                    onClick={() => deleteApplication(app._id)}
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

        {/* Edit Application Dialog */}
        {isEditDialogOpen && selectedApplication && (
          <div className="edit-dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="edit-dialog" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '600px' }}>
              <h2>Edit Application</h2>
              <form onSubmit={handleUpdateApplication}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Applicant Name:</label>
                  <input type="text" id="name" name="name" value={editFormData.name || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} readOnly /> {/* Readonly - Name not editable */}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                  <input type="email" id="email" name="email" value={editFormData.email || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} readOnly /> {/* Readonly - Email not editable */}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="jobTitle" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Job Title:</label>
                  <input type="text" id="jobTitle" name="jobTitle" value={editFormData.jobId?.title || 'N/A'} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} readOnly /> {/* Readonly - Job Title not editable */}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="coverLetter" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cover Letter:</label>
                  <textarea id="coverLetter" name="coverLetter" value={editFormData.coverLetter || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} /> {/* Editable - Cover Letter */}
                </div>
                 {/* Add other application fields you might want to display/edit in the dialog */}

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

export default AllApplications;