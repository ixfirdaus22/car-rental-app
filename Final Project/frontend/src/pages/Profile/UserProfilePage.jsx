import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { updateProfile, deleteProfile } from '../../services/api';

export default function UserProfilePage() {
  // 1. Get user and logout 
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Initialize State with user data if available

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    licenseNo: '',
    aadharNo: '',
    houseNo: '',
    buildingName: '',
    streetName: '',
    area: '',
    pincode: '',
    gender: '',
    password: '',
    currentPassword: '',
  });

  // Sync state when 'user' loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNo: user.phoneNo || '',
        licenseNo: user.licenseNo || '',
        aadharNo: user.aadharNo || '',
        houseNo: user.houseNo || '',
        buildingName: user.buildingName || '',
        streetName: user.streetName || '',
        area: user.area || '',
        pincode: user.pincode || '',
        gender: user.gender || '',
        password: '',
        currentPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Prepare update data - only include fields that have values (partial update)
      const updateData = {};
      
      // Only include fields that are being updated
      if (formData.name && formData.name !== user.name) updateData.name = formData.name;
      if (formData.phoneNo && formData.phoneNo !== user.phoneNo) updateData.phoneNo = formData.phoneNo;
      if (formData.licenseNo && formData.licenseNo !== user.licenseNo) updateData.licenseNo = formData.licenseNo;
      if (formData.aadharNo && formData.aadharNo !== user.aadharNo) updateData.aadharNo = formData.aadharNo;
      if (formData.houseNo !== user.houseNo) updateData.houseNo = formData.houseNo || null;
      if (formData.buildingName !== user.buildingName) updateData.buildingName = formData.buildingName || null;
      if (formData.streetName !== user.streetName) updateData.streetName = formData.streetName || null;
      if (formData.area !== user.area) updateData.area = formData.area || null;
      if (formData.pincode !== user.pincode) updateData.pincode = formData.pincode || null;
      if (formData.gender && formData.gender !== user.gender) updateData.gender = formData.gender;
      
      // Handle password update
      if (formData.password && formData.password.trim() !== '') {
        if (!formData.currentPassword || formData.currentPassword.trim() === '') {
          setErrorMessage('Current password is required to update password');
          setIsLoading(false);
          return;
        }
        updateData.password = formData.password;
        updateData.currentPassword = formData.currentPassword;
      }

      const response = await updateProfile(updateData);
      // Backend returns a string message, not user object
      setSuccessMessage(response.data || 'Profile updated successfully!');
      
      // Update local user state with new values
      const updatedUser = { ...user, ...updateData };
      // Remove password fields from user object
      delete updatedUser.password;
      delete updatedUser.currentPassword;
      updateUser(updatedUser);
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', currentPassword: '' }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      // Backend returns error message as string in response.data
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      setErrorMessage('');
      try {
        await deleteProfile();
        // Backend returns success message
        logout(); // Clear session and redirect
        navigate('/login');
      } catch (error) {
        console.error("Failed to delete profile", error);
        const errorMsg = typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || 'Failed to delete profile.';
        setErrorMessage(errorMsg);
        setIsLoading(false);
      }
    }
  };


  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <main className="profile-page py-5 bg-light">
      <div className="container">

        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex align-items-center gap-3">
            {/* Back to Dashboard button for vendors and admins */}
            {(user?.role?.toUpperCase() === 'VENDOR' || user?.role?.toUpperCase() === 'ADMIN') && (
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  if (user?.role?.toUpperCase() === 'VENDOR') {
                    navigate('/vendor/dashboard')
                  } else if (user?.role?.toUpperCase() === 'ADMIN') {
                    navigate('/admin/dashboard')
                  }
                }}
              >
                ← Back to Dashboard
              </button>
            )}
            <h2 className="mb-0">My Profile</h2>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="row">
          {/* LEFT: Profile Card */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm text-center p-4">
              <div className="mb-3">
                {/* Placeholder for Image */}
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <h4>{formData.name}</h4>
              <p className="text-muted">{user.role}</p>

              {!isEditing && (
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                  <button className="btn btn-outline-danger" onClick={handleDeleteProfile} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Delete Account'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="col-lg-8">
            <div className="card shadow-sm p-4">
              <form onSubmit={(e) => e.preventDefault()}>

                {/* Personal Info */}
                <h5 className="mb-3 text-primary">Personal Information</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} disabled /> {/* Email usually cannot be changed */}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select className="form-control" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!isEditing}>
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {/* Password Update Section */}
                {isEditing && (
                  <>
                    <h5 className="mb-3 mt-3 text-primary">Change Password (Optional)</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-control" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} placeholder="Enter current password" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter new password" />
                        <small className="form-text text-muted">Leave blank if you don't want to change password</small>
                      </div>
                    </div>
                  </>
                )}

                {/* Identity Info */}
                <h5 className="mb-3 mt-3 text-primary">Identity Details</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Aadhar Number</label>
                    <input type="text" className="form-control" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Driving License</label>
                    <input type="text" className="form-control" name="licenseNo" value={formData.licenseNo} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                </div>

                {/* Address Info */}
                <h5 className="mb-3 mt-3 text-primary">Address Details</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">House No</label>
                    <input type="text" className="form-control" name="houseNo" value={formData.houseNo} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Building Name</label>
                    <input type="text" className="form-control" name="buildingName" value={formData.buildingName} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Street</label>
                    <input type="text" className="form-control" name="streetName" value={formData.streetName} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Area</label>
                    <input type="text" className="form-control" name="area" value={formData.area} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-success" onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => {
                      setIsEditing(false);
                      // Reset form data to original user data
                      if (user) {
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phoneNo: user.phoneNo || '',
                          licenseNo: user.licenseNo || '',
                          aadharNo: user.aadharNo || '',
                          houseNo: user.houseNo || '',
                          buildingName: user.buildingName || '',
                          streetName: user.streetName || '',
                          area: user.area || '',
                          pincode: user.pincode || '',
                          gender: user.gender || '',
                          password: '',
                          currentPassword: '',
                        });
                      }
                      setErrorMessage('');
                      setSuccessMessage('');
                    }} disabled={isLoading}>Cancel</button>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}