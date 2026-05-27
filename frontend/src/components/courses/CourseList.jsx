import React, { useState } from 'react';
import CourseCard from './CourseCard';

/**
 * @component CourseList
 * @description Displays a searchable and filterable list of courses driven entirely by database taxonomy matrices.
 */
export const CourseList = ({ courses = [], enrolledCourses = [], dbCategories = [] }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /**
   * Filters courses based on search keyword and selected dynamic category.
   */
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());

    // Clean match validation ensuring casing discrepancies don't drop target records
    const matchesCategory =
      selectedCategory === '' || (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="card shadow-sm border-0 mb-4 bg-white p-3">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-md-6 col-lg-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search courses by keyword, framework, concepts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Database-Driven Category Filter */}
          <div className="col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-filter text-muted"></i>
              </span>
              <select
                className="form-select bg-light border-start-0 fw-semibold text-secondary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {/* Iterating exclusively over live system records extracted straight from MongoDB */}
                {dbCategories.map((cat, i) => (
                  <option key={cat._id || i} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Results */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-5 my-3 bg-white border rounded">
          <i
            className="bi bi-database-exclamation text-danger"
            style={{ fontSize: '3.5rem' }}
          ></i>
          <h4 className="fw-bold text-dark mt-3">No matching courses found</h4>
          <p className="text-muted small">
            Try refining your filter preferences or exploring other categories.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((course) => {
            const matchedEnroll = enrolledCourses.find(
              (ec) => ec.course?._id === course._id
            );

            const status = matchedEnroll?.status || null;
            const progress = matchedEnroll?.progress || 0;

            return (
              <div key={course._id} className="col-md-6 col-lg-4">
                <CourseCard course={course} status={status} progress={progress} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;