import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { getAvatarUrl } from "../../services/api";
import ImageCropModal from "./ImageCropModal";
import styles from "./ProfilePage.module.css";

// Constants for file upload
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

// Particle component
const Particle = ({ delay }) => (
  <div
    className={styles.particle}
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
    }}
  />
);

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Photo upload states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    avatar: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    bio: "",
    dailyCalorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatsGoal: 65,
    waterGoal: 8,
  });

  // Format phone number to US format: +1 (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 11 digits (1 + 10 digit US number)
    const limitedDigits = digits.slice(0, 11);
    
    // Format based on length
    if (limitedDigits.length === 0) {
      return '';
    } else if (limitedDigits.length <= 1) {
      return `+${limitedDigits}`;
    } else if (limitedDigits.length <= 4) {
      return `+${limitedDigits[0]} (${limitedDigits.slice(1)}`;
    } else if (limitedDigits.length <= 7) {
      return `+${limitedDigits[0]} (${limitedDigits.slice(1, 4)}) ${limitedDigits.slice(4)}`;
    } else {
      return `+${limitedDigits[0]} (${limitedDigits.slice(1, 4)}) ${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7)}`;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.user.getProfile();

        // Keep auth context in sync with latest profile
        updateUser(response);

        // Format date if it exists
        const dateOfBirth = response.dateOfBirth 
          ? new Date(response.dateOfBirth).toISOString().split('T')[0]
          : "";

        // Format phone number if exists
        const formattedPhone = response.phone ? formatPhoneNumber(response.phone) : "";
        
        setFormData({
          avatar: response.avatar || "",
          fullName: response.fullName || "",
          email: response.email || "",
          phone: formattedPhone,
          dateOfBirth,
          gender: response.gender || "",
          heightCm: response.heightCm || "",
          weightKg: response.weightKg || "",
          address: response.address || "",
          city: response.city || "",
          state: response.state || "",
          country: response.country || "",
          zipCode: response.zipCode || "",
          bio: response.bio || "",
          dailyCalorieGoal: response.dailyCalorieGoal || 2000,
          proteinGoal: response.proteinGoal || 150,
          carbsGoal: response.carbsGoal || 200,
          fatsGoal: response.fatsGoal || 65,
          waterGoal: response.waterGoal || 8,
        });
        
        // Set photo preview if avatar exists
        if (response.avatar) {
          setPhotoPreview(response.avatar);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        phone: formatPhoneNumber(value)
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Build profile update payload: backend expects dateOfBirth as "yyyy-MM-dd'T'HH:mm:ss" (no Z)
  const buildProfileUpdatePayload = (data) => {
    const dateStr = data.dateOfBirth && String(data.dateOfBirth).trim();
    const dateOfBirth = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
      ? `${dateStr}T00:00:00`
      : null;
    return {
      fullName: data.fullName || null,
      avatar: data.avatar || null,
      phone: data.phone || null,
      dateOfBirth,
      gender: data.gender || null,
      heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
      weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      zipCode: data.zipCode || null,
      bio: data.bio || null,
      dailyCalorieGoal: parseInt(data.dailyCalorieGoal, 10) || 2000,
      proteinGoal: parseInt(data.proteinGoal, 10) || 150,
      carbsGoal: parseInt(data.carbsGoal, 10) || 200,
      fatsGoal: parseInt(data.fatsGoal, 10) || 65,
      waterGoal: parseInt(data.waterGoal, 10) || 8,
    };
  };

  // Trigger file input click
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Open crop modal when user selects a file
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setPhotoError('Please upload a valid image file (PNG, JPG, GIF, or WebP)');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // After user crops, upload the cropped blob and update profile
  const handleCropComplete = async (croppedBlob) => {
    setCropImageSrc(null);
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });

    setUploadingPhoto(true);
    try {
      const uploadResponse = await api.user.uploadProfilePhoto(file);
      const avatarUrl = uploadResponse.url;

      const updateData = buildProfileUpdatePayload({ ...formData, avatar: avatarUrl });
      const profileResponse = await api.user.updateProfile(updateData);

      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setPhotoPreview(avatarUrl);
      updateUser(profileResponse);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setPhotoError(err.message || 'Failed to upload photo');
      setPhotoPreview(formData.avatar || null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData = buildProfileUpdatePayload(formData);
      const response = await api.user.updateProfile(updateData);

      // Update auth context
      updateUser(response);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    if (formData.heightCm && formData.weightKg) {
      const heightM = formData.heightCm / 100;
      const bmi = formData.weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return "N/A";
  };

  const getBMICategory = (bmi) => {
    if (bmi === "N/A") return "Unknown";
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        {[...Array(25)].map((_, i) => (
          <Particle key={i} delay={i * 0.4} />
        ))}
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className={styles.wrapper}>
      {/* Crop modal: when user selects a photo, they crop it to fit profile icon */}
      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Particles */}
      {[...Array(25)].map((_, i) => (
        <Particle key={i} delay={i * 0.4} />
      ))}

      {/* Header */}
      <div className={styles.header}>
        <h1>USER PROFILE</h1>
        <p>Manage your personal information and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={styles.successMessage}>
          <span>✓</span> Profile updated successfully!
        </div>
      )}
      {error && (
        <div className={styles.errorMessage}>
          <span>✕</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Profile Card with Avatar */}
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              style={{ display: 'none' }}
            />
            
            <div className={`${styles.avatar} ${uploadingPhoto ? styles.uploading : ''}`}>
              {photoPreview ? (
                <img
                  src={photoPreview.startsWith('data:') ? photoPreview : getAvatarUrl(photoPreview)}
                  alt="Profile"
                  className={styles.avatarImage}
                />
              ) : (
                <span>{formData.fullName.charAt(0).toUpperCase() || "U"}</span>
              )}
              {uploadingPhoto && (
                <div className={styles.uploadOverlay}>
                  <div className={styles.uploadSpinner}></div>
                </div>
              )}
            </div>
            
            <button 
              type="button" 
              className={styles.changeAvatarBtn}
              onClick={handleChangePhotoClick}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
            </button>
            
            {photoError && (
              <div className={styles.photoError}>{photoError}</div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h2>{formData.fullName || "User"}</h2>
            <p className={styles.email}>{formData.email}</p>
            {bmi !== "N/A" && (
              <div className={styles.bmiCard}>
                <div className={styles.bmiValue}>{bmi}</div>
                <div className={styles.bmiLabel}>BMI</div>
                <div className={`${styles.bmiCategory} ${styles[bmiCategory.toLowerCase()]}`}>
                  {bmiCategory}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>👤</span>
            Personal Information
          </h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Metrics Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>📊</span>
            Physical Metrics
          </h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Height (cm)</label>
              <input
                type="number"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleChange}
                placeholder="170"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                placeholder="70"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>📍</span>
            Address Information
          </h3>
          <div className={styles.grid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </div>

            <div className={styles.formGroup}>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
              />
            </div>

            <div className={styles.formGroup}>
              <label>State/Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
              />
            </div>

            <div className={styles.formGroup}>
              <label>ZIP/Postal Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>✍️</span>
            About Me
          </h3>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
              maxLength="500"
            />
            <div className={styles.charCount}>
              {formData.bio.length}/500 characters
            </div>
          </div>
        </div>

        {/* Nutrition Goals Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>🎯</span>
            Daily Nutrition Goals
          </h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Calorie Goal (kcal)</label>
              <input
                type="number"
                name="dailyCalorieGoal"
                value={formData.dailyCalorieGoal}
                onChange={handleChange}
                min="1000"
                max="5000"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Protein Goal (g)</label>
              <input
                type="number"
                name="proteinGoal"
                value={formData.proteinGoal}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Carbs Goal (g)</label>
              <input
                type="number"
                name="carbsGoal"
                value={formData.carbsGoal}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fats Goal (g)</label>
              <input
                type="number"
                name="fatsGoal"
                value={formData.fatsGoal}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Water Goal (glasses)</label>
              <input
                type="number"
                name="waterGoal"
                value={formData.waterGoal}
                onChange={handleChange}
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

