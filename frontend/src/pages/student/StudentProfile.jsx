import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import ProfileCard from '../../components/users/ProfileCard';
import userService from '../../services/userService';

const StudentProfile = () => {
  // Destructuring the secure local state sync updater instead of the direct login payload router
  const { user, updateUser } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Local state holding forms inputs
  const [formData, setFormData] = useState({ name: '', phone: '', bio: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const fileInputRef = useRef(null);
  const backendBaseUrl = 'http://localhost:5000/';

  // Sync state whenever asynchronous auth hooks populate user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
      if (user.profilePicture) {
        setPreviewUrl(`${backendBaseUrl}${user.profilePicture}`);
      }
    }
  }, [user]);

  // Handle textual fields changing state updates
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate local temporary runtime URL link to visualize selected image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

 const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('phone', formData.phone);
      dataPayload.append('bio', formData.bio);
      
      if (selectedFile) {
        dataPayload.append('profilePicture', selectedFile);
      }

      const result = await userService.updateProfile(dataPayload);

      if (result.success) {
        setMessage({ type: 'success', text: 'Your profile has been modified and saved successfully!' });
        setIsEditing(false);
        
        
        if (result.data) {

          const existingSessionUser = sessionStorage.getItem('user') 
            ? JSON.parse(sessionStorage.getItem('user')) 
            : {};
          
          const updatedSessionData = { ...existingSessionUser, ...result.data };
   
          sessionStorage.setItem('user', JSON.stringify(updatedSessionData));
          
          if (updateUser) {
            updateUser(updatedSessionData);
          }
        }
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || err.message || 'An error occurred during updating records.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="container py-4">
        
        {/* Dynamic Responsive Page Layout Header section */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Profile</h2>
            <p className="text-muted small mb-0">Manage your student user profile credentials and metadata parameters.</p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary px-4 shadow-sm w-100 w-sm-auto" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil-square me-2"></i>Edit Profile
            </button>
          )}
        </div>

        {/* Dynamic operational system alerts feedback */}
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show border-0 shadow-sm`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4">
          
          {/* Reusable Clean Layout Left Profile card column */}
          <div className="col-lg-4">
            <ProfileCard user={user} />
          </div>

          {/* Dynamic Profile Management / Form Layout Right block panel */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">
                {isEditing ? 'Modify Personal Records' : 'Detailed Profile Portfolio'}
              </h5>

              <form onSubmit={handleFormSubmit}>
                
                {/* File input uploading preview structure inside editing mode context */}
                {isEditing && (
                  <div className="d-flex flex-column flex-sm-row align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                    <div className="d-flex justify-content-center align-items-center flex-shrink-0" style={{ width: '90px', height: '90px' }}>
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Profile Preview File Allocation" 
                          className="rounded-circle object-fit-cover border border-3 border-white shadow-sm"
                          style={{ width: '90px', height: '90px', display: 'block' }}
                        />
                      ) : (
                        /* Failsafe Local Fallback to maintain absolute round aspect-ratio without server errors */
                        <div 
                          className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center border border-3 border-white shadow-sm fw-bold"
                          style={{ width: '90px', height: '90px', fontSize: '2rem', lineHeight: '1' }}
                        >
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="w-100">
                      <label className="form-label small fw-bold text-muted mb-1">Choose Profile Image File</label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="form-control form-control-sm shadow-none" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <span className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>Accepted: PNG, JPG, JPEG or WEBP (Maximum size capacity 2MB)</span>
                    </div>
                  </div>
                )}

                <div className="row g-3">
                  
                  {/* Account Identity user name block configuration */}
                  <div className="col-md-6">
                    <div className={isEditing ? 'form-group' : 'p-3 bg-light rounded-3 h-100'}>
                      <label className="text-muted small d-block mb-1 fw-medium">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control py-2 shadow-none"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      ) : (
                        <span className="fw-semibold text-dark d-block pt-1">{user?.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Registered System Email address parameter configuration (Strictly Read Only) */}
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <label className="text-muted small d-block mb-1 fw-medium">Primary Email Address (Disabled)</label>
                      <span className="fw-semibold text-muted d-block pt-1">{user?.email}</span>
                    </div>
                  </div>

                  {/* Telephone identity contact record values setup */}
                  <div className="col-md-6">
                    <div className={isEditing ? 'form-group' : 'p-3 bg-light rounded-3 h-100'}>
                      <label className="text-muted small d-block mb-1 fw-medium">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control py-2 shadow-none"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="No phone record registered"
                        />
                      ) : (
                        <span className="fw-semibold text-dark d-block pt-1">{user?.phone || 'Not provided'}</span>
                      )}
                    </div>
                  </div>

                  {/* Authorization domain framework status element (Strictly Read Only) */}
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <label className="text-muted small d-block mb-1 fw-medium">Role Privilege Tier Level</label>
                      <span className="fw-bold text-uppercase text-muted d-block pt-1" style={{ letterSpacing: '0.5px' }}>
                        {user?.role} Portal Scope
                      </span>
                    </div>
                  </div>

                  {/* Long narrative biography string field mapping */}
                  <div className="col-12">
                    <div className={isEditing ? 'form-group' : 'p-3 bg-light rounded-3'}>
                      <label className="text-muted small d-block mb-1 fw-medium">Personal Profile Biography</label>
                      {isEditing ? (
                        <textarea
                          className="form-control shadow-none"
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Share structural notes detailing your background expertise levels..."
                        ></textarea>
                      ) : (
                        <span className="fw-semibold text-dark d-block pt-1" style={{ whiteSpace: 'pre-line' }}>
                          {user?.bio || 'No structural custom biographical statement appended inside the registry.'}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Interactive system management submission buttons row inside state changes flow */}
                {isEditing && (
                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          bio: user?.bio || ''
                        });
                        setPreviewUrl(user?.profilePicture ? `${backendBaseUrl}${user.profilePicture}` : '');
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success px-4" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving Data...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;