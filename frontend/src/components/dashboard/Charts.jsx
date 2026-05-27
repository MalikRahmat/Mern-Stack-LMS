import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

/**
 * @component Charts
 * @description Fully responsive, production-ready visualization charts tailored for LMS dashboards.
 */
export const Charts = ({ stats }) => {
  if (!stats) return null;

  // Safe extraction of datasets via fallback arrays
  const categoryData = stats.coursesSummary?.categoryBreakdown || [];
  const popularCourses = stats.enrollmentsSummary?.popularCourses || [];

  // Modern corporate color palette for institutional asset categorizations
  const COLORS = [
    '#4f46e5', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Rose
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#6366f1', // Light Indigo
  ];

  /**
   * Truncates exceptionally long course titles on the X-axis 
   * to guarantee pristine responsive breathing space.
   */
  const formatXAxisLabel = (label) => {
    if (typeof label === 'string' && label.length > 14) {
      return `${label.substring(0, 12)}...`;
    }
    return label;
  };

  return (
    <div className="d-flex flex-column gap-4 w-100">

      {/* 📊 SECTION 1: Course Popularity Analytics (Bar Chart Framework) */}
      <div className="col-12">
        <div className="card shadow-sm border-0 bg-white p-3 p-md-4" style={{ borderRadius: '12px' }}>
          <div className="mb-3">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-bar-chart-fill text-success me-2"></i>
              Platform Metric: Course Popularity Spectrum
            </h5>
            <p className="text-muted small mb-0">
              Cross-referencing organic student enrollment counts across dynamic syllabus listings.
            </p>
          </div>
          <hr className="text-muted opacity-25" />

          {popularCourses.length === 0 ? (
            <div className="text-center py-5 text-muted small">
              No enrollment metrics captured inside database registers to parse.
            </div>
          ) : (
            /* Responsive container block: Increased bottom padding dynamically 
              via margin configuration to safely accommodate rotated angled labels.
            */
            <div style={{ width: '100%', height: 380, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularCourses}
                  margin={{ top: 20, right: 10, left: -20, bottom: 35 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  
                  
                  <XAxis 
                    dataKey="title" 
                    tickFormatter={formatXAxisLabel}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: '500' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  
                  <Legend wrapperStyle={{ paddingTop: '25px', fontSize: '12px' }} />

                  <Bar
                    dataKey="enrollmentCount"
                    name="Enrolled Cohorts Count"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarThickness={35}
                  >
                    {popularCourses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#10b981" opacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 🍕 SECTION 2: Course Category Distribution (Pie/Donut Chart Framework) */}
      <div className="col-12">
        <div className="card shadow-sm border-0 bg-white p-3 p-md-4" style={{ borderRadius: '12px' }}>
          <div className="mb-3">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-pie-chart-fill text-primary me-2"></i>
              System Catalog Taxonomy Share
            </h5>
            <p className="text-muted small mb-0">
              Structural analysis of inventory saturation grouped by academic classifications.
            </p>
          </div>
          <hr className="text-muted opacity-25" />

          {categoryData.length === 0 ? (
            <div className="text-center py-5 text-muted small">
              No category data recorded in current catalog.
            </div>
          ) : (
            /* Fixed Pie Chart Cut-off:
              Stabilized container rendering context, customized outer radius dynamically 
              to match screen scaling benchmarks cleanly.
            */
            <div style={{ width: '100%', height: 360, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%" // Centered perfectly to mitigate vertical overflow creeping
                    labelLine={false} // Disabled outer string lines to protect mobile margins
                    
                    // Display percentage context values safely directly inside tooltip/slices
                    outerRadius={110}
                    innerRadius={60} // Donut configuration
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Courses`, name]} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Charts;