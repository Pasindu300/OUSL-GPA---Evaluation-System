const express = require('express');
const router = express.Router();
const courseData = require('../models/courseData');

// Get grade point value based on grade
const getGradePointValue = (grade) => {
  const gradeMap = {
    'A+': 4.00,
    'A': 4.00,
    'A-': 3.70,
    'B+': 3.30, 
    'B': 3.00,
    'B-': 2.70,
    'C+': 2.30,
    'C': 2.00,
    'C-': 1.70,
    'D+': 1.30,
    'D': 1.00,
    'E': 0.00
  };
  return gradeMap[grade] || 0;
};

// Get credit value from course code
const getCreditValue = (courseCode) => {
  if (!courseCode || courseCode.length < 6) return 0;
  const creditDigit = courseCode.charAt(5);
  return parseInt(creditDigit);
};

// Get course level from course code
const getCourseLevel = (courseCode) => {
  if (!courseCode || courseCode.length < 4) return 0;
  const levelDigit = courseCode.charAt(3);
  return parseInt(levelDigit);
};

// Get courses for a specific specialization
router.get('/courses/:specialization', (req, res) => {
  const { specialization } = req.params;
  
  if (!courseData[specialization]) {
    return res.status(404).json({ error: 'Specialization not found' });
  }
  
  // Transform course data to match frontend expectations
  const transformedCourses = courseData[specialization].map(course => {
    return {
      code: course.code,
      name: course.name,
      level: course.level,
      credits: parseInt(course.code.charAt(4)) || 0, // Extract credit value from code
      isCompulsory: course.isCompulsory
    };
  });
  
  res.json(transformedCourses);
});

// Calculate GPA
router.post('/calculate-gpa', (req, res) => {
  const { courses } = req.body;
  
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ error: 'Invalid courses data' });
  }
  
  // Filter courses to include only levels 4, 5, and 6
  const eligibleCourses = courses.filter(course => {
    const level = getCourseLevel(course.courseCode);
    return level >= 4 && level <= 6;
  });
  
  // Sort courses according to the specified sequence
  eligibleCourses.sort((a, b) => {
    const levelA = getCourseLevel(a.courseCode);
    const levelB = getCourseLevel(b.courseCode);
    
    // Sort by level (highest first for levels 5 and 6)
    if (levelA >= 5 && levelB >= 5) {
      if (levelA !== levelB) return levelB - levelA;
      
      // For same levels 5 or 6, compulsory courses first
      const isCompulsoryA = a.isCompulsory !== false;
      const isCompulsoryB = b.isCompulsory !== false;
      if (isCompulsoryA !== isCompulsoryB) {
        return isCompulsoryA ? -1 : 1;
      }
    } 
    // Level 4 comes last
    else if (levelA == 4 && levelB > 4) return 1;
    else if (levelA > 4 && levelB == 4) return -1;
    
    // Within level 4, sort by credit (highest first)
    if (levelA === 4 && levelB === 4) {
      const creditA = getCreditValue(a.courseCode);
      const creditB = getCreditValue(b.courseCode);
      return creditB - creditA;
    }
    
    return 0;
  });
  
  // Select courses up to 74 credits
  let selectedCourses = [];
  let totalCredits = 0;
  let lastCoursePartCredit = 0;
  let lastCourseIndex = -1;
  
  for (let i = 0; i < eligibleCourses.length; i++) {
    const course = eligibleCourses[i];
    const credits = getCreditValue(course.courseCode);
    
    if (totalCredits + credits <= 74) {
      selectedCourses.push(course);
      totalCredits += credits;
      lastCourseIndex = i;
    } else {
      // Calculate part credit for the next course if needed
      if (totalCredits < 74) {
        lastCoursePartCredit = 74 - totalCredits;
        lastCourseIndex = i;
        break;
      }
    }
  }
  
  // If we still haven't reached 74 credits and there are more courses,
  // add part credit for the next course
  if (totalCredits < 74 && lastCourseIndex < eligibleCourses.length - 1) {
    lastCourseIndex++;
    lastCoursePartCredit = 74 - totalCredits;
  }
  
  // Calculate GPA
  let totalGradePoints = 0;
  
  // Calculate grade points for fully counted courses
  selectedCourses.forEach(course => {
    const credits = getCreditValue(course.courseCode);
    const gpv = getGradePointValue(course.grade);
    totalGradePoints += credits * gpv;
  });
  
  // Add grade points for part credit course if exists
  if (lastCoursePartCredit > 0 && lastCourseIndex >= 0 && lastCourseIndex < eligibleCourses.length) {
    const partCourse = eligibleCourses[lastCourseIndex];
    const gpv = getGradePointValue(partCourse.grade);
    totalGradePoints += lastCoursePartCredit * gpv;
  }
  
  // Calculate final GPA
  const gpa = totalGradePoints / 74;
  
  res.json({ 
    gpa,
    totalCredits: totalCredits + lastCoursePartCredit,
    selectedCourses,
    partCreditCourse: lastCoursePartCredit > 0 ? {
      course: eligibleCourses[lastCourseIndex],
      partCredit: lastCoursePartCredit
    } : null
  });
});

module.exports = router;