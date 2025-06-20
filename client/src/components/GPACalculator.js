import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GPACalculator = () => {
  const [specialization, setSpecialization] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [gpaResult, setGpaResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('form');
  const [degreeCompleted, setDegreeCompleted] = useState(false);

  
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
    const creditDigit = courseCode.charAt(4);
    const creditValue = parseInt(creditDigit);
    return isNaN(creditValue) ? 0 : creditValue;
  };

  // Helper function to get course level from course code
  const getCourseLevel = (courseCode) => {
    if (!courseCode || courseCode.length < 4) return 0;
    const levelDigit = courseCode.charAt(3);
    const levelValue = parseInt(levelDigit);
    return isNaN(levelValue) ? 0 : levelValue;
  };

  // Helper function to get course category from course code
  const getCourseCategory = (courseCode) => {
    if (!courseCode || courseCode.length < 2) return '';
    const categoryCode = courseCode.charAt(2);
    const categoryMap = {
      'X': 'Engineering',
      'I': 'Industrial', 
      'Y': 'Projects',
      'Z': 'Mathematics',
      'J': 'General',
      'M': 'Management',
      'W': 'Industrial Training',
      'K': 'Computer literacy'
    };
    return categoryMap[categoryCode] || '';
  };

  // Get already selected course codes to filter them out
  const getAlreadySelectedCourseCodes = () => {
    return selectedCourses
      .filter(course => course.courseCode)
      .map(course => course.courseCode);
  };

  // Validate degree completion requirements
  const validateDegreeCompletionRequirements = () => {
    if (!degreeCompleted) return { isValid: true, errors: [] };

    const errors = [];
    const categoryCounts = {};

    // Initialize category counts
    const categories = ['Engineering', 'Industrial', 'Projects', 'Mathematics', 'General', 'Management', 'Industrial Training', 'Computer literacy'];
    categories.forEach(cat => {
      categoryCounts[cat] = { level5Plus: 0, level6: 0, total: 0 };
    });

    // Count credits by category and level
    selectedCourses.forEach(course => {
      if (!course.courseCode) return;
      
      const category = getCourseCategory(course.courseCode);
      const level = getCourseLevel(course.courseCode);
      const credits = getCreditValue(course.courseCode);

      console.log(`Course: ${course.courseCode}, Category: ${category}, Level: ${level}, Credits: ${credits}`);

      if (categoryCounts[category]) {
        categoryCounts[category].total += credits;
        if (level >= 5) {
          categoryCounts[category].level5Plus += credits;
        }
        if (level === 6) {
          categoryCounts[category].level6 += credits;
        }
      }
    });

    console.log('Category counts:', categoryCounts);

    // Check Engineering/Industrial requirements (74-88 credits)
    const engineeringIndustrial = categoryCounts['Engineering'].total + categoryCounts['Industrial'].total;
    if (engineeringIndustrial < 74) {
      errors.push(`Engineering/Industrial: Need at least 74 credits, currently have ${engineeringIndustrial}`);
    }

    // Check Level 5+ requirement for Engineering/Industrial (minimum 30)
    const engIndLevel5Plus = categoryCounts['Engineering'].level5Plus + categoryCounts['Industrial'].level5Plus;
    if (engIndLevel5Plus < 30) {
      errors.push(`Engineering/Industrial Level 5+: Need at least 30 credits, currently have ${engIndLevel5Plus}`);
    }

    // Check Level 6 requirement for Engineering/Industrial (minimum 12)
    const engIndLevel6 = categoryCounts['Engineering'].level6 + categoryCounts['Industrial'].level6;
    if (engIndLevel6 < 12) {
      errors.push(`Engineering/Industrial Level 6: Need at least 12 credits, currently have ${engIndLevel6}`);
    }

    // Check Projects requirements (8-11 credits, minimum 8 at level 6)
    if (categoryCounts['Projects'].total < 8) {
      errors.push(`Projects: Need at least 8 credits, currently have ${categoryCounts['Projects'].total}`);
    }
    if (categoryCounts['Projects'].level6 < 8) {
      errors.push(`Projects Level 6: Need at least 8 credits, currently have ${categoryCounts['Projects'].level6}`);
    }

    // Check Mathematics requirements (8-10 credits)
    if (categoryCounts['Mathematics'].total < 8) {
      errors.push(`Mathematics: Need at least 8 credits, currently have ${categoryCounts['Mathematics'].total}`);
    }

    // Check General requirements (5-6 credits)
    if (categoryCounts['General'].total < 5) {
      errors.push(`General: Need at least 5 credits, currently have ${categoryCounts['General'].total}`);
    }

    // Check Management requirements (10-15 credits)
    if (categoryCounts['Management'].total < 10) {
      errors.push(`Management: Need at least 10 credits, currently have ${categoryCounts['Management'].total}`);
    }

    // Check Industrial Training requirements (8 credits)
    if (categoryCounts['Industrial Training'].total < 8) {
      errors.push(`Industrial Training: Need exactly 8 credits, currently have ${categoryCounts['Industrial Training'].total}`);
    }

    // Check Computer literacy requirements (2 credits)
    if (categoryCounts['Computer literacy'].total < 2) {
      errors.push(`Computer literacy: Need exactly 2 credits, currently have ${categoryCounts['Computer literacy'].total}`);
    }

    // Check total credits (minimum 130)
    const totalCredits = Object.values(categoryCounts).reduce((sum, cat) => sum + cat.total, 0);
    if (totalCredits < 130) {
      errors.push(`Total Credits: Need at least 130 credits, currently have ${totalCredits}`);
    }

    // Check overall Level 5+ requirement (minimum 60)
    const totalLevel5Plus = Object.values(categoryCounts).reduce((sum, cat) => sum + cat.level5Plus, 0);
    if (totalLevel5Plus < 60) {
      errors.push(`Total Level 5+: Need at least 60 credits, currently have ${totalLevel5Plus}`);
    }

    // Check overall Level 6 requirement (minimum 30)
    const totalLevel6 = Object.values(categoryCounts).reduce((sum, cat) => sum + cat.level6, 0);
    if (totalLevel6 < 30) {
      errors.push(`Total Level 6: Need at least 30 credits, currently have ${totalLevel6}`);
    }

    return { isValid: errors.length === 0, errors, categoryCounts };
  };


  // Helper function to get category-wise credit breakdown
const getCategoryWiseCredits = () => {
  const categoryCounts = {};
  
  // Initialize category counts
  const categories = ['Engineering', 'Industrial', 'Projects', 'Mathematics', 'General', 'Management', 'Industrial Training', 'Computer literacy'];
  categories.forEach(cat => {
    categoryCounts[cat] = { 
      level3: 0, 
      level4: 0, 
      level5: 0, 
      level6: 0, 
      total: 0,
      courses: []
    };
  });

  // Count credits by category and level
  selectedCourses.forEach(course => {
    if (!course.courseCode) return;
    
    const category = getCourseCategory(course.courseCode);
    const level = getCourseLevel(course.courseCode);
    const credits = getCreditValue(course.courseCode);
    
    // Find course details
    const courseDetails = courses.find(c => c.code === course.courseCode);
    const courseName = courseDetails ? courseDetails.name : 'Unknown Course';

    if (categoryCounts[category]) {
      categoryCounts[category].total += credits;
      categoryCounts[category][`level${level}`] += credits;
      categoryCounts[category].courses.push({
        code: course.courseCode,
        name: courseName,
        credits: credits,
        level: level,
        grade: course.grade
      });
    }
  });

  return categoryCounts;
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
    const eligibleCourses = selectedCourses.filter(course => {
      const level = getCourseLevel(course.courseCode);
      return level >= 4 && level <= 6;
    });
    
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

    // If degree completed is checked, validate additional requirements
    if (degreeCompleted) {
      const validation = validateDegreeCompletionRequirements();
      if (!validation.isValid) {
        setError(`Degree completion requirements not met:\n${validation.errors.join('\n')}`);
        return;
      }
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

                  {/* Degree Completed Checkbox */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="degreeCompleted"
                        checked={degreeCompleted}
                        onChange={(e) => setDegreeCompleted(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="degreeCompleted" className="ml-2 block text-sm text-gray-900 font-medium">
                        I have completed my degree (Apply degree completion validation rules)
                      </label>
                    </div>
                    {degreeCompleted && (
                      <div className="mt-2 text-sm text-yellow-800">
                        <p className="font-medium">Additional validation rules will be applied:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Minimum 130 total credits required</li>
                          <li>Engineering/Industrial: 74-88 credits (30+ at Level 5+, 12+ at Level 6)</li>
                          <li>Projects: 8-11 credits (minimum 8 at Level 6)</li>
                          <li>Mathematics: 8-10 credits</li>
                          <li>General: 5-6 credits</li>
                          <li>Management: 10-15 credits</li>
                          <li>Industrial Training: 8 credits</li>
                          <li>Computer literacy: 2 credits</li>
                        </ul>
                      </div>
                    )}
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
                              const alreadySelectedCodes = getAlreadySelectedCourseCodes().filter(
                                code => code !== course.courseCode
                              );
                              
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
                          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md whitespace-pre-line">
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
                            {degreeCompleted && (
                              <p className="text-sm text-green-600 font-medium">✓ Degree completion rules validated</p>
                            )}
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


{/* Category-wise Credit Display */}
<div className="mt-8">
  <h3 className="text-xl font-semibold mb-4">Category-wise Credit Breakdown</h3>
  
  {(() => {
    const categoryCredits = getCategoryWiseCredits();
    const totalCredits = Object.values(categoryCredits).reduce((sum, cat) => sum + cat.total, 0);
    
    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800">Total Credits</h4>
            <p className="text-2xl font-bold text-blue-600">{totalCredits}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800">Level 5+ Credits</h4>
            <p className="text-2xl font-bold text-green-600">
              {Object.values(categoryCredits).reduce((sum, cat) => sum + cat.level5 + cat.level6, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800">Level 6 Credits</h4>
            <p className="text-2xl font-bold text-purple-600">
              {Object.values(categoryCredits).reduce((sum, cat) => sum + cat.level6, 0)}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800">Total Courses</h4>
            <p className="text-2xl font-bold text-orange-600">{selectedCourses.length}</p>
          </div>
        </div>

        {/* Detailed Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(categoryCredits).map(([category, data]) => {
            if (data.total === 0) return null;
            
            return (
              <div key={category} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">{category}</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {data.total} credits
                  </span>
                </div>
                
                {/* Level breakdown */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">L3</div>
                    <div className="font-medium">{data.level3}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">L4</div>
                    <div className="font-medium">{data.level4}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">L5</div>
                    <div className="font-medium text-green-600">{data.level5}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">L6</div>
                    <div className="font-medium text-purple-600">{data.level6}</div>
                  </div>
                </div>
                
             {/* Course list */}
               <div className="space-y-2">
  {data.courses.map((course, index) => (
    <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
      <div className="flex-1 min-w-0 pr-2"> {/* Added min-w-0 and pr-2 */}
        <div className="font-medium truncate">{course.code}</div> {/* Added truncate */}
        <div className="text-gray-600 text-xs truncate" title={course.name}> {/* Added title attribute for tooltip */}
          {course.name}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
        <span className="bg-gray-200 px-2 py-1 rounded text-xs whitespace-nowrap"> {/* Added whitespace-nowrap */}
          L{course.level}
        </span>
        <span className="bg-blue-200 px-2 py-1 rounded text-xs whitespace-nowrap"> {/* Added whitespace-nowrap */}
          {course.credits}c
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${ /* Added whitespace-nowrap */
          ['A+', 'A'].includes(course.grade) ? 'bg-green-200 text-green-800' :
          ['A-', 'B+'].includes(course.grade) ? 'bg-blue-200 text-blue-800' :
          ['B', 'B-'].includes(course.grade) ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
                          {course.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
                

        {/* Degree Requirements Check (if degree completion is enabled) */}
        {degreeCompleted && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">Degree Requirements Status</h4>
            {(() => {
              const validation = validateDegreeCompletionRequirements();
              const engineeringIndustrial = categoryCredits['Engineering'].total + categoryCredits['Industrial'].total;
              const engIndLevel5Plus = categoryCredits['Engineering'].level5 + categoryCredits['Engineering'].level6 + 
                                     categoryCredits['Industrial'].level5 + categoryCredits['Industrial'].level6;
              const engIndLevel6 = categoryCredits['Engineering'].level6 + categoryCredits['Industrial'].level6;
              const totalLevel5Plus = Object.values(categoryCredits).reduce((sum, cat) => sum + cat.level5 + cat.level6, 0);
              const totalLevel6 = Object.values(categoryCredits).reduce((sum, cat) => sum + cat.level6, 0);
              
              const requirements = [
                { name: 'Total Credits', current: totalCredits, required: 130, status: totalCredits >= 130 },
                { name: 'Engineering/Industrial', current: engineeringIndustrial, required: 74, status: engineeringIndustrial >= 74 },
                { name: 'Eng/Ind Level 5+', current: engIndLevel5Plus, required: 30, status: engIndLevel5Plus >= 30 },
                { name: 'Eng/Ind Level 6', current: engIndLevel6, required: 12, status: engIndLevel6 >= 12 },
                { name: 'Projects', current: categoryCredits['Projects'].total, required: 8, status: categoryCredits['Projects'].total >= 8 },
                { name: 'Projects Level 6', current: categoryCredits['Projects'].level6, required: 8, status: categoryCredits['Projects'].level6 >= 8 },
                { name: 'Mathematics', current: categoryCredits['Mathematics'].total, required: 8, status: categoryCredits['Mathematics'].total >= 8 },
                { name: 'General', current: categoryCredits['General'].total, required: 5, status: categoryCredits['General'].total >= 5 },
                { name: 'Management', current: categoryCredits['Management'].total, required: 10, status: categoryCredits['Management'].total >= 10 },
                { name: 'Industrial Training', current: categoryCredits['Industrial Training'].total, required: 8, status: categoryCredits['Industrial Training'].total >= 8 },
                { name: 'Computer literacy', current: categoryCredits['Computer literacy'].total, required: 2, status: categoryCredits['Computer literacy'].total >= 2 },
                { name: 'Total Level 5+', current: totalLevel5Plus, required: 60, status: totalLevel5Plus >= 60 },
                { name: 'Total Level 6', current: totalLevel6, required: 30, status: totalLevel6 >= 30 }
              ];
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {requirements.map((req, index) => (
                    <div key={index} className={`p-3 rounded-md ${req.status ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{req.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${req.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {req.status ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">{req.current}</span>
                        <span className="text-gray-600">/{req.required}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  })()}
</div>



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