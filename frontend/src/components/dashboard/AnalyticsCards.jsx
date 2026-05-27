import React from 'react';

/**
 * @component AnalyticsCards
 * @description Displays key dashboard statistics in card format for admin analytics overview
 */
export const AnalyticsCards = ({ stats }) => {
  if (!stats) return null;

  const { usersSummary, coursesSummary, enrollmentsSummary } = stats;

  // Dashboard cards configuration
  const cardsData = [
    {
      title: 'Total Enrollments',
      value: enrollmentsSummary?.total || 0,
      icon: 'bi-journal-bookmark-fill',
      bg: 'primary',
    },
    {
      title: 'Total Active Courses',
      value: coursesSummary?.total || 0,
      icon: 'bi-file-earmark-check-fill',
      bg: 'success',
    },
    {
      title: 'Registered Students',
      value: usersSummary?.students || 0,
      icon: 'bi-mortarboard-fill',
      bg: 'info',
    },
    {
      title: 'Active Instructors',
      value: usersSummary?.instructors || 0,
      icon: 'bi-person-badge-fill',
      bg: 'warning',
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {cardsData.map((card, idx) => (
        <div key={idx} className="col-sm-6 col-lg-3">
          <div
            className="card border-0 shadow-sm h-100 bg-white"
            style={{ borderRadius: '12px' }}
          >
            <div className="card-body d-flex align-items-center justify-content-between p-4">

              {/* Card text section */}
              <div>
                <p className="text-uppercase text-muted small fw-bold mb-1">
                  {card.title}
                </p>

                <h2 className="card-title fw-extrabold text-slate-800 mb-0">
                  {card.value}
                </h2>
              </div>

              {/* Icon section */}
              <div
                className={`stat-icon bg-${card.bg}-subtle text-${card.bg} rounded p-3`}
                style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                }}
              >
                <i className={`bi ${card.icon}`}></i>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;