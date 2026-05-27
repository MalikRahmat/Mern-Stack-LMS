import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

/**
 * @component CourseForm
 * @description Provides an interface for creating or editing academic courses with dynamic categories expansion driven entirely by the database.
 */
export const CourseForm = ({ initialData = null, onSubmit, submitting = false }) => {
  // Centralized course state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic system taxonomy handling states
  const [dbCategories, setDbCategories] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  /**
   * Initial data aggregation lifecycle hook.
   * Compiles live records straight from the remote database collection.
   */
  useEffect(() => {
    const synchronizeTaxonomies = async () => {
      try {
        let fetchedData = [];
        
        // Fetching real-time categories from backend endpoint
        if (categoryService && typeof categoryService.getCategories === 'function') {
          fetchedData = await categoryService.getCategories();
        }
        
        // Extract string arrays from database records array
        const extractedCategories = (fetchedData || []).map(c => c.name);
        setDbCategories(extractedCategories);
        
        // Form initialization routing matrix
        if (initialData) {
          setTitle(initialData.title || '');
          setDescription(initialData.description || '');
          setCategory(initialData.category || extractedCategories[0] || '');
          setPrice(initialData.price || 0);
        } else if (extractedCategories.length > 0 && !category) {
          // Auto-select first active database category for new items
          setCategory(extractedCategories[0]);
        }
      } catch (err) {
        setErrorMsg('Failed to establish taxonomy sync with the server database.');
      }
    };

    synchronizeTaxonomies();
  }, [initialData]);

  /**
   * Catches runtime select drop changes.
   * Redirects user flow if the special action tag execution key is matched.
   */
  const handleCategorySelectionChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'TRIGGER_NEW_TAXONOMY_FLOW') {
      setIsAddingNew(true);
    } else {
      setCategory(selectedValue);
    }
  };

  /**
   * Dispatches an asynchronous transactional post request to append a new custom entry.
   */
  const handleAddNewCategory = async (e) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    
    if (!cleanName) return;

    try {
      setCategoryLoading(true);
      setErrorMsg('');

      let successfullyCreatedNode = null;
      if (categoryService && typeof categoryService.createCategory === 'function') {
        successfullyCreatedNode = await categoryService.createCategory(cleanName);
      }

      // Read returned validation payload or fallback to localized structural object parsing
      const targetCategoryName = successfullyCreatedNode?.name || cleanName;

      // Update state matrix seamlessly without re-rendering or crashing target course metrics
      if (!dbCategories.includes(targetCategoryName)) {
        setDbCategories([...dbCategories, targetCategoryName]);
      }
      
      setCategory(targetCategoryName);
      setIsAddingNew(false);
      setNewCategoryName('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Database execution fault while creating custom category.');
    } finally {
      setCategoryLoading(false);
    }
  };

  /**
   * Validates form parameters and forwards secure payload schemas up to container layers.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !description || !category) {
      setErrorMsg('Please specify a title, description, and category classification.');
      return;
    }

    onSubmit({
      title,
      description,
      category,
      price: Number(price) || 0,
    });
  };

  return (
    <div className="card shadow border-0 p-4" style={{ borderRadius: '12px' }}>
      <div className="card-body">
        {/* Form Header */}
        <h4 className="card-title fw-bold text-dark mb-4">
          <i className="bi bi-journal-plus me-2 text-primary"></i>
          {initialData ? 'Edit Course Catalog' : 'Publish New Course'}
        </h4>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMsg}
          </div>
        )}

        {/* Main Application Execution Form */}
        <form onSubmit={handleSubmit}>
          {/* Title Input Field */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Course Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mastering Modern Frontend Frameworks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          {/* Dynamic Core Category Selector Node */}
          <div className="mb-3 p-3 bg-light rounded border border-light-subtle">
            <label className="form-label small fw-bold text-dark">Course Classification Category</label>
            
            {!isAddingNew ? (
              <div className="input-group">
                <select
                  className="form-select"
                  value={category}
                  onChange={handleCategorySelectionChange}
                  disabled={submitting}
                >
                  {dbCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="TRIGGER_NEW_TAXONOMY_FLOW" className="text-primary fw-bold">
                    ➕ + Add New Category...
                  </option>
                </select>
              </div>
            ) : (
              
              <div className="p-3 bg-white rounded-3 border border-light shadow-sm mt-2">
                <span className="text-primary d-block small fw-bold mb-2">Configure New Institutional Classification:</span>
                <div className="row g-2 align-items-center">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control shadow-none border-secondary-subtle"
                      style={{ borderRadius: '8px', padding: '0.55rem 0.75rem' }}
                      placeholder="Enter custom category name (e.g. Cloud Architecture)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      disabled={categoryLoading}
                      autoFocus
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-md-end" style={{ minWidth: '220px' }}>
                    <button
                      className="btn btn-primary fw-bold shadow-sm flex-grow-1 border-0"
                      style={{ borderRadius: '8px', height: '43px', background: 'linear-gradient(45deg, #0d6efd, #0a58ca)' }}
                      type="button"
                      onClick={handleAddNewCategory}
                      disabled={categoryLoading || !newCategoryName.trim()}
                    >
                      {categoryLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Track'
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary px-3"
                      style={{ borderRadius: '8px', height: '43px' }}
                      type="button"
                      onClick={() => { setIsAddingNew(false); setNewCategoryName(''); }}
                      disabled={categoryLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Config Node */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Fee (USD)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={submitting}
              required
            />
            <div className="form-text text-muted small">Specify 0 for open platform community access.</div>
          </div>

          {/* Description Textarea Control */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Syllabus Overview / Full Description</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Provide a comprehensive academic catalog summary of lessons, target outcomes, software dependencies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              required
            ></textarea>
          </div>

          {/* Action Submission Trigger */}
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center fw-bold shadow-sm"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Publishing Catalog logs...
              </>
            ) : (
              <>
                <i className="bi bi-journal-check me-2"></i>
                {initialData ? 'Save Changes' : 'Publish Course'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;