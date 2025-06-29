"use client"
import React, { useState } from 'react';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import styles from './CreateListingModal.module.css';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { cld, getOptimizedImageUrl } from '@/utils/cloudinary';

const CreateListingModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    category: '',
    condition: '',
    location: '',
    photo_urls: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (formData.photo_urls.length === 0) {
      setError('Please upload at least one photo');
      setLoading(false);
      return;
    }

    // Validate other required fields (description is optional)
    const requiredFields = ['title', 'price', 'category', 'condition', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // Format the data according to API expectations
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        listing_status: 'active',
        photo_urls: formData.photo_urls.map(photo => photo.photo_url)
      };

      // Log the data being sent for debugging
      console.log('Submitting listing data:', submissionData);

      await onSubmit(submissionData);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create listing';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setLoading(false);
    }
  }; const handleUploadSuccess = (result) => {
    const newImage = {
      photo_url: result.secure_url,
      public_id: result.public_id,
      optimized_url: getOptimizedImageUrl(result.public_id)
    };

    setFormData(prev => ({
      ...prev,
      photo_urls: [...prev.photo_urls, newImage]
    }));
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    setError('Failed to upload image. Please try again.');
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      photo_urls: prev.photo_urls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <h2>Create New Listing</h2>

        {error && (
          <div className={styles.error}>
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Arduino Uno R3"
            />
          </div>          
          <div className={`${styles.formGroup} ${styles.optional}`}>
            <label htmlFor="description">Description </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item's features and condition"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Bulawayo, Harare"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price (USD)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="microcontrollers">Microcontrollers</option>
                <option value="development_boards">Development Boards</option>
                <option value="displays">Displays</option>
                <option value="sensors">Sensors</option>
                <option value="motors">Motors</option>
                <option value="motor_drivers">Motor Drivers</option>
                <option value="power_supply">Power Supply</option>
                <option value="electronic_components">Electronic Components</option>
                <option value="communication">Communication</option>
                <option value="connectors">Connectors</option>
                <option value="cables">Cables</option>
                <option value="mechanical">Mechanical</option>
                <option value="tools">Tools</option>
                <option value="robotics">Robotics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="condition">Condition </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="like_new">Used - Like New</option>
                <option value="good">Used - Good</option>
                <option value="fair">Used - Fair</option>
                <option value="poor">Poor</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>          <div className={styles.formGroup}>
            <label>Photos </label>          <div className={styles.uploadContainer}>
              <CloudinaryUploadWidget
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
              {formData.photo_urls.length > 0 && (
                <div className={styles.previewImages}>
                  {formData.photo_urls.map((photo, index) => (
                    <div key={photo.public_id} className={styles.previewImage}>
                      <AdvancedImage
                        cldImg={cld.image(photo.public_id)}
                        plugins={[responsive(), placeholder()]}
                      />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Create Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;