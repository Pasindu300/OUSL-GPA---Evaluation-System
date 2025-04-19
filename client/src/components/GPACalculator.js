import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// Don't use import for the background image

// GPA Calculator Component
const GPACalculator = () => {
  const [specialization, setSpecialization] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [gpaResult, setGpaResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('form');

  // Grade point values and other component logic remain the same
  // ... [existing code]

  // Grade point values for reference
  const gradePoints = [
    { grade: 'A+', value: '4.00' },
    { grade: 'A', value: '4.00' },
    { grade: 'A-', value: '3.70' },
    { grade: 'B+', value: '3.30' },
    { grade: 'B', value: '3.00' },
    { grade: 'B-', value: '2.70' },
    { grade: 'C+', value: '2.30' },
    { grade: 'C', value: '2.00' },
    { grade: 'C-', value: '1.70' },
    { grade: 'D+', value: '1.30' },
    { grade: 'D', value: '1.00' },
    { grade: 'E', value: '0.00' }
  ];

  // Class divisions for reference
  const classDivisions = [
    { class: 'First Class Honours', gpa: 'GPA 3.70 or above' },
    { class: 'Second Class Upper Division', gpa: 'GPA 3.30 to 3.69' },
    { class: 'Second Class Lower Division', gpa: 'GPA 3.00 to 3.29' },
    { class: 'Pass', gpa: 'GPA 2.00 or above' }
  ];

  // Helper function to get credit value from course code
  const getCreditValue = (courseCode) => {
    if (!courseCode || courseCode.length < 6) return 0;
    const creditDigit = courseCode.charAt(5);
    return parseInt(creditDigit);
  };

  // Helper function to get course level from course code
  const getCourseLevel = (courseCode) => {
    if (!courseCode || courseCode.length < 4) return 0;
    const levelDigit = courseCode.charAt(3);
    return parseInt(levelDigit);
  };

  // Get already selected course codes to filter them out
  const getAlreadySelectedCourseCodes = () => {
    return selectedCourses
      .filter(course => course.courseCode) // Only include courses that have been selected
      .map(course => course.courseCode);
  };

// Update the fetchCourses function in GPACalculator.js
const fetchCourses = (spec) => {
  setLoading(true);
  // Use the environment variable for API URL
  const apiUrl = process.env.REACT_APP_API_URL || '/api';
  
  fetch(`${apiUrl}/courses/${spec}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    })
    .then(data => {
      setCourses(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
      setLoading(false);
    });
};

  // Handle specialization change
  const handleSpecializationChange = (e) => {
    const newSpec = e.target.value;
    setSpecialization(newSpec);
    setSelectedCourses([]);
    setGpaResult(null);
    setError('');
    
    if (newSpec) {
      setLoading(true);
      fetchCourses(newSpec);
    }
  };

  // Add a course selection
  const addCourse = (level) => {
    setSelectedCourses([
      ...selectedCourses,
      { id: Date.now(), courseCode: '', grade: '', level }
    ]);
  };

  // Remove a course
  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== id));
  };

  // Update course details
  const updateCourse = (id, field, value) => {
    setSelectedCourses(selectedCourses.map(course => {
      if (course.id === id) {
        return { ...course, [field]: value };
      }
      return course;
    }));
  };

  // Calculate total eligible credits from selected courses
  const calculateTotalEligibleCredits = () => {
    // Filter courses to include only levels 4, 5, and 6
    const eligibleCourses = selectedCourses.filter(course => {
      const level = getCourseLevel(course.courseCode);
      return level >= 4 && level <= 6;
    });
    
    // Calculate total credits
    return eligibleCourses.reduce((total, course) => {
      return total + getCreditValue(course.courseCode);
    }, 0);
  };

  // Calculate GPA
  const calculateGPA = () => {
    // Validate input
    if (selectedCourses.length === 0) {
      setError('Please add at least one course.');
      return;
    }

    const emptyFields = selectedCourses.some(course => !course.courseCode || !course.grade);
    if (emptyFields) {
      setError('Please fill in all course and grade fields.');
      return;
    }

    // Calculate total eligible credits
    const totalCredits = calculateTotalEligibleCredits();
    
    // Check if we have enough credits (74)
    if (totalCredits < 74) {
      setError(`Not enough credits. You have selected ${totalCredits} credits from levels 4-6, but 74 credits are required.`);
      return;
    }

    // Now we can proceed with the actual GPA calculation
    setLoading(true);
    
    // Prepare data for API call
    const coursesData = {
      courses: selectedCourses.map(course => ({
        courseCode: course.courseCode,
        grade: course.grade,
        isCompulsory: courses.find(c => c.code === course.courseCode)?.isCompulsory || false
      }))
    };

    // Also update the calculateGPA function's fetch call
// Make API call to calculate GPA
fetch(`${process.env.REACT_APP_API_URL || '/api'}/calculate-gpa`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(coursesData),
})
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to calculate GPA');
      }
      return response.json();
    })
    .then(data => {
      // Create grade distribution data
      const gradeDistribution = {
        'A+/A': selectedCourses.filter(c => c.grade === 'A+' || c.grade === 'A').length,
        'A-': selectedCourses.filter(c => c.grade === 'A-').length,
        'B+': selectedCourses.filter(c => c.grade === 'B+').length,
        'B': selectedCourses.filter(c => c.grade === 'B').length,
        'B-': selectedCourses.filter(c => c.grade === 'B-').length,
        'C+': selectedCourses.filter(c => c.grade === 'C+').length,
        'C': selectedCourses.filter(c => c.grade === 'C').length,
        'C-/D+/D/E': selectedCourses.filter(c => ['C-', 'D+', 'D', 'E'].includes(c.grade)).length
      };

      setGpaResult({
        gpa: data.gpa,
        gradeDistribution,
        totalCredits: data.totalCredits,
        courses: selectedCourses.length,
        selectedCourses: data.selectedCourses,
        partCreditCourse: data.partCreditCourse
      });
      
      setActiveTab('result');
      setLoading(false);
    })
    .catch(err => {
      console.error('Error calculating GPA:', err);
      setError('Failed to calculate GPA. Please try again.');
      setLoading(false);
    });
  };

  // Convert grade distribution to chart data
  const getChartData = () => {
    if (!gpaResult) return [];
    
    const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#F44336'];
    
    return Object.entries(gpaResult.gradeDistribution).map(([grade, count], index) => ({
      name: grade,
      value: count,
      color: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);
  };

  // Get GPA class
  const getGPAClass = (gpa) => {
    if (gpa >= 3.70) return 'First Class Honours';
    if (gpa >= 3.30) return 'Second Class Upper Division';
    if (gpa >= 3.00) return 'Second Class Lower Division';
    if (gpa >= 2.00) return 'Pass';
    return 'Fail';
  };

  // Get color based on GPA
  const getGPAColor = (gpa) => {
    if (gpa >= 3.70) return 'text-emerald-600';
    if (gpa >= 3.30) return 'text-green-600';
    if (gpa >= 3.00) return 'text-amber-500';
    if (gpa >= 2.00) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <>
      {/* Full-page background wrapper - positioned fixed to cover entire viewport */}
      <div 
        className="fixed top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url('/assets/Background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      ></div>
      
      {/* Main content container */}
      <div className="w-full min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="p-6 bg-white bg-opacity-95 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              OUSL Bachelor of Industrial Studies Honours - GPA Calculator
            </h1>
            
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Grade Point Values */}
              <div className="lg:w-1/4 p-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">Grade Point Values</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="py-2 px-2 bg-blue-100 text-left text-sm font-medium text-blue-900 rounded-tl-md">Grade</th>
                        <th className="py-2 px-2 bg-blue-100 text-left text-sm font-medium text-blue-900 rounded-tr-md">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradePoints.map((grade, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                          <td className="py-2 px-2 text-sm">{grade.grade}</td>
                          <td className="py-2 px-2 text-sm font-medium">{grade.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-center">Did you know?</h3>
                  <div className="text-sm text-indigo-700">
                    <p className="mb-2">• GPA is calculated based on your top 74 credits</p>
                    <p className="mb-2">• Level 5 and 6 courses are prioritized</p>
                    <p className="mb-2">• Compulsory courses are given priority</p>
                    <p className="mb-2">• Both A+ and A carry the same value (4.0)</p>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:w-2/4">
                {/* Tabs */}
                <div className="flex border-b mb-6">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'form' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('form')}
                  >
                    GPA Calculator
                  </button>
                  {gpaResult && (
                    <button 
                      className={`px-4 py-2 font-medium ${activeTab === 'result' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('result')}
                    >
                      Results
                    </button>
                  )}
                </div>
                
                {activeTab === 'form' && (
                  <>
                    {/* Specialization Selection */}
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Specialization:</label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={specialization}
                        onChange={handleSpecializationChange}
                      >
                        <option value="">-- Select Your Specialization --</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="apparel">Apparel Production & Management</option>
                        <option value="fashion">Fashion Design & Product Development</option>
                        <option value="textile">Textile Manufacture</option>
                      </select>
                    </div>
                    
                    {specialization && (
                      <>
                        {/* Course Selection */}
                        <div className="mt-8">
                          <h2 className="text-xl font-semibold mb-4">Course Selection</h2>
                          
                          {/* Add a credit counter */}
                          <div className="p-3 bg-yellow-50 rounded-md mb-4">
                            <p className="text-gray-700">
                              Eligible Credits: <span className="font-bold">{calculateTotalEligibleCredits()}</span>/74 (from levels 4-6)
                            </p>
                          </div>
                          
                          {[3, 4, 5, 6].map(level => (
                            <div key={level} className="mb-6 p-4 bg-gray-50 rounded-md">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium">Level {level} Courses</h3>
                                <button 
                                  onClick={() => addCourse(level)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                >
                                  Add Course
                                </button>
                              </div>
                              
                              {selectedCourses.filter(c => c.level === level).length === 0 && (
                                <p className="text-gray-500 text-sm italic">No courses added for this level yet.</p>
                              )}
                              
                              {selectedCourses.filter(c => c.level === level).map(course => {
                                // Get already selected course codes excluding the current one
                                const alreadySelectedCodes = getAlreadySelectedCourseCodes().filter(
                                  code => code !== course.courseCode
                                );
                                
                                // Filter available courses for this dropdown
                                const availableCourses = courses
                                  .filter(c => c.level === level)
                                  .filter(c => !alreadySelectedCodes.includes(c.code));
                                
                                return (
                                  <div key={course.id} className="grid grid-cols-12 gap-2 mb-3">
                                    <select 
                                      className="col-span-7 p-2 border border-gray-300 rounded-md text-sm"
                                      value={course.courseCode}
                                      onChange={(e) => updateCourse(course.id, 'courseCode', e.target.value)}
                                    >
                                      <option value="">-- Select Course --</option>
                                      {availableCourses.map(c => (
                                        <option key={c.code} value={c.code}>
                                          {c.code} - {c.name} ({c.credits} credits)
                                        </option>
                                      ))}
                                    </select>
                                    
                                    <select 
                                      className="col-span-3 p-2 border border-gray-300 rounded-md text-sm"
                                      value={course.grade}
                                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                    >
                                      <option value="">Grade</option>
                                      <option value="A+">A+</option>
                                      <option value="A">A</option>
                                      <option value="A-">A-</option>
                                      <option value="B+">B+</option>
                                      <option value="B">B</option>
                                      <option value="B-">B-</option>
                                      <option value="C+">C+</option>
                                      <option value="C">C</option>
                                      <option value="C-">C-</option>
                                      <option value="D+">D+</option>
                                      <option value="D">D</option>
                                      <option value="E">E</option>
                                    </select>
                                    
                                    <button 
                                      onClick={() => removeCourse(course.id)}
                                      className="col-span-2 p-2 text-red-500 hover:text-red-700 flex justify-center items-center"
                                      aria-label="Remove course"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calculate Button */}
                        <div className="mt-6 flex justify-center">
                          <button 
                            onClick={calculateGPA}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={loading}
                          >
                            {loading ? 'Calculating...' : 'Calculate GPA'}
                          </button>
                        </div>
                        
                        {/* Error Message */}
                        {error && (
                          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                
                {activeTab === 'result' && gpaResult && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">GPA Results</h2>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                          <p className="text-gray-600 mb-1">Your GPA:</p>
                          <h3 className={`text-4xl font-bold ${getGPAColor(gpaResult.gpa)}`}>{gpaResult.gpa.toFixed(2)}</h3>
                          <p className="mt-2 text-lg font-medium">{getGPAClass(gpaResult.gpa)}</p>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">Based on {gpaResult.courses} courses</p>
                            <p className="text-sm text-gray-600">Total of {gpaResult.totalCredits} credits</p>
                          </div>
                        </div>
                        
                        <div className="w-64 h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {getChartData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Selected Courses</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b text-left">Level</th>
                              <th className="py-2 px-4 border-b text-left">Course Code</th>
                              <th className="py-2 px-4 border-b text-left">Grade</th>
                              <th className="py-2 px-4 border-b text-left">Grade Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCourses.map(course => {
                              const gpv = {
                                'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'E': 0.0
                              }[course.grade] || 0;
                              
                              return (
                                <tr key={course.id}>
                                  <td className="py-2 px-4 border-b">Level {course.level}</td>
                                  <td className="py-2 px-4 border-b">{course.courseCode}</td>
                                  <td className="py-2 px-4 border-b">{course.grade}</td>
                                  <td className="py-2 px-4 border-b">{gpv.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {gpaResult.partCreditCourse && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-800 mb-2">Part Credit Course</h4>
                        <p>Course: {gpaResult.partCreditCourse.course.courseCode}</p>
                        <p>Credits Used: {gpaResult.partCreditCourse.partCredit}</p>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => setActiveTab('form')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Back to Calculator
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Class Divisions */}
              <div className="lg:w-1/4 p-4">
                <div className="bg-green-50 p-4 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3 text-center">Honours Classification</h3>
                  
                  {classDivisions.map((division, index) => (
                    <div 
                      key={index} 
                      className={`mb-3 p-3 rounded-md ${
                        index === 0 ? 'bg-emerald-100 border-l-4 border-emerald-500' :
                        index === 1 ? 'bg-green-100 border-l-4 border-green-500' :
                        index === 2 ? 'bg-amber-100 border-l-4 border-amber-500' :
                        'bg-orange-100 border-l-4 border-orange-500'
                      }`}
                    >
                      <p className="font-medium text-gray-800">{division.class}</p>
                      <p className="text-sm mt-1">{division.gpa}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 text-center">GPA Tips</h3>
                  <div className="text-sm text-purple-700">
                    <p className="mb-2">• Focus on compulsory courses first</p>
                    <p className="mb-2">• Higher level courses have more impact</p>
                    <p className="mb-2">• Aim for consistency across all subjects</p>
                    <p className="mb-2">• Retake courses if you receive a low grade</p>
                    <p className="mb-2">• Seek help early if you're struggling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GPACalculator;