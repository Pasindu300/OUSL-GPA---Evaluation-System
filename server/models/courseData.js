
const coursesData = {
    agriculture: [
      // Level 3
      { code: 'MHZ3458', name: 'Mathematics for Agriculture', isCompulsory: true, level: 3 },
      { code: 'AGI3450', name: 'Land and Soil Tillage Management', isCompulsory: true, level: 3 },
      { code: 'AGI3551', name: 'Agricultural Biology', isCompulsory: true, level: 3 },
      { code: 'AGI3552', name: 'Crop Production and Technology', isCompulsory: true, level: 3 },
      { code: 'AGI3553', name: 'Plant Protection', isCompulsory: true, level: 3 },
      { code: 'AGM3354', name: 'Principles of Economics', isCompulsory: true, level: 3 },
      { code: 'TAK3237', name: 'Introduction to Computer Applications', isCompulsory: true, level: 3 },
      { code: 'AGM3203', name: 'Communication Skills', isCompulsory: true, level: 3 },
      
      // Level 4
      { code: 'MHZ4357', name: 'Applied Statistics', isCompulsory: true, level: 4 },
      { code: 'AGI4555', name: 'Irrigation and Drainage Engineering', isCompulsory: true, level: 4 },
      { code: 'AGI4559', name: 'Food and Nutrition', isCompulsory: true, level: 4 },
      { code: 'AGI4460', name: 'Animal Husbandry & Production', isCompulsory: true, level: 4 },
      { code: 'AGI4561', name: 'Postharvest Biology and Technology', isCompulsory: true, level: 4 },
      { code: 'AGI4362', name: 'Environmental Agriculture', isCompulsory: true, level: 4 },
      { code: 'AGX4356', name: 'Soil Science', isCompulsory: true, level: 4 },
      { code: 'AGM4363', name: 'Agricultural Marketing', isCompulsory: true, level: 4 },
      { code: 'AGW4401', name: 'Industrial Training I (Agriculture)', isCompulsory: true, level: 4 },
      
      // Level 5
      { code: 'AGZ5367', name: 'Experimental Design', isCompulsory: true, level: 5 },
      { code: 'AGM5364', name: 'Farm Power and Machinery', isCompulsory: true, level: 5 },
      { code: 'AGI5166', name: 'Research Methodology', isCompulsory: true, level: 5 },
      { code: 'AGX5565', name: 'Soil Plant and Water Relationship', isCompulsory: true, level: 5 },
      { code: 'AGJ5368', name: 'Indigenous Knowledge of Herbal Products', isCompulsory: true, level: 5 },
      { code: 'AGW5401', name: 'Industrial Training II (Agriculture)', isCompulsory: true, level: 5 },
      { code: 'AGI5569', name: 'Molecular Biology and Biotechnology', isCompulsory: false, level: 5 },
      { code: 'AGI5470', name: 'Food Microbiology', isCompulsory: false, level: 5 },
      { code: 'AGI5471', name: 'Animal Biology', isCompulsory: false, level: 5 },
      { code: 'AGI5572', name: 'Fisheries and Aquaculture', isCompulsory: false, level: 5 },
      { code: 'AGI5373', name: 'Agro-Forestry', isCompulsory: false, level: 5 },
      { code: 'AGI5274', name: 'Fruit Crops and Cut Flower Production', isCompulsory: false, level: 5 },
      { code: 'AGX5415', name: 'Horticulture and Landscape Technology', isCompulsory: false, level: 5 },
      { code: 'AGX5376', name: 'Crop Processing', isCompulsory: false, level: 5 },
      { code: 'AGX5277', name: 'Food Safety and Quality Management Systems', isCompulsory: false, level: 5 },
      { code: 'AGM5475', name: 'Economics and Management', isCompulsory: false, level: 5 },
      
      // Level 6
      { code: 'AGI6478', name: 'Hydrology and Water Resources', isCompulsory: true, level: 6 },
      { code: 'AGM6379', name: 'Agricultural Extension', isCompulsory: true, level: 6 },
      { code: 'AGJ6381', name: 'Rural Sociology', isCompulsory: true, level: 6 },
      { code: 'AGY6880', name: 'Individual Project (Agriculture)', isCompulsory: true, level: 6 },
      { code: 'AGI6582', name: 'Food Processing', isCompulsory: false, level: 6 },
      { code: 'AGI6585', name: 'Applications in Biotechnology', isCompulsory: false, level: 6 },
      { code: 'AGI6486', name: 'Field and Laboratory Techniques in Plant Protection', isCompulsory: false, level: 6 },
      { code: 'AGX6283', name: 'Ground Water and Resource Management', isCompulsory: false, level: 6 },
      { code: 'AGX6284', name: 'Impacts of Climate Change on Water Resources', isCompulsory: false, level: 6 },
      { code: 'AGX6387', name: 'Plantation Crop Technology', isCompulsory: false, level: 6 },
      { code: 'AGX6490', name: 'Soil and Water Conservation', isCompulsory: false, level: 6 }
    ],
    apparel: [
      // Level 3
      { code: 'TAX3530', name: 'Fibre to Fabric', isCompulsory: true, level: 3 },
      { code: 'TAX3331', name: 'Garment Analysis and Sewing Machinery', isCompulsory: true, level: 3 },
      { code: 'TAI3332', name: 'Garment Accessories', isCompulsory: true, level: 3 },
      { code: 'TAI3533', name: 'Pattern Construction', isCompulsory: true, level: 3 },
      { code: 'TAM3234', name: 'Basics of Human Resource Management', isCompulsory: true, level: 3 },
      { code: 'TAM3535', name: 'Management Studies', isCompulsory: true, level: 3 },
      { code: 'MHZ3576', name: 'Statistics for Industrial Studies', isCompulsory: true, level: 3 },
      { code: 'TAK3237', name: 'Introduction to Computer Applications', isCompulsory: true, level: 3 },
      
      // Level 4
      { code: 'TAX4438', name: 'Production Planning and Organization', isCompulsory: true, level: 4 },
      { code: 'TAX4539', name: 'Quality Assurance for Textile and Clothing', isCompulsory: true, level: 4 },
      { code: 'TAX4540', name: 'Garment Manufacture', isCompulsory: true, level: 4 },
      { code: 'TAX4441', name: 'Knitted Garment Technology', isCompulsory: true, level: 4 },
      { code: 'TAI4442', name: 'Advanced Pattern Construction', isCompulsory: true, level: 4 },
      { code: 'TAI4243', name: 'Foundation Garments', isCompulsory: true, level: 4 },
      { code: 'TAI4344', name: 'Industrial Garment Washing and Finishing', isCompulsory: true, level: 4 },
      { code: 'TAM4445', name: 'Apparel Merchandising', isCompulsory: true, level: 4 },
      { code: 'TAW4401', name: 'Industrial Training I (Apparel)', isCompulsory: true, level: 4 },
      
      // Level 5
      { code: 'TAI5246', name: 'Current Topics in Textile and Clothing', isCompulsory: true, level: 5 },
      { code: 'TAX5547', name: 'Plant Utilities', isCompulsory: true, level: 5 },
      { code: 'TAX5648', name: 'Fabric Structure and Analysis', isCompulsory: true, level: 5 },
      { code: 'TAX5349', name: 'Nonwoven Textiles', isCompulsory: true, level: 5 },
      { code: 'MHZ5570', name: 'Quantitative Techniques', isCompulsory: true, level: 5 },
      { code: 'TAW5401', name: 'Industrial Training II (Apparel)', isCompulsory: true, level: 5 },
      { code: 'TAX5551', name: 'Textile Colouration', isCompulsory: false, level: 5 },
      { code: 'TAI5552', name: 'Principles of Fashion Design', isCompulsory: false, level: 5 },
      { code: 'MHJ5343', name: 'Nature of Science', isCompulsory: false, level: 5 },
      { code: 'MHJ5342', name: 'Technology, Society and Environment', isCompulsory: false, level: 5 },
      { code: 'TAJ5353', name: 'History and Traditions of Clothing', isCompulsory: false, level: 5 },
      
      // Level 6
      { code: 'TAX6455', name: 'Fabric Technology', isCompulsory: true, level: 6 },
      { code: 'TAX6556', name: 'Ergonomics', isCompulsory: true, level: 6 },
      { code: 'TAX6454', name: 'Technical Textiles', isCompulsory: true, level: 6 },
      { code: 'TAX6263', name: 'Textile Product Engineering', isCompulsory: true, level: 6 },
      { code: 'TAM6457', name: 'Fashion Marketing', isCompulsory: true, level: 6 },
      { code: 'TAY6882', name: 'Research Project (Apparel Production)', isCompulsory: true, level: 6 },
      { code: 'TAX6367', name: 'Advanced Colouration', isCompulsory: false, level: 6 }
    ],
    fashion: [
      // Level 3
      { code: 'TAX3530', name: 'Fibre to Fabric', isCompulsory: true, level: 3 },
      { code: 'TAX3331', name: 'Garment Analysis and Sewing Machinery', isCompulsory: true, level: 3 },
      { code: 'TAI3332', name: 'Garment Accessories', isCompulsory: true, level: 3 },
      { code: 'TAI3533', name: 'Pattern Construction', isCompulsory: true, level: 3 },
      { code: 'TAM3234', name: 'Basics of Human Resource Management', isCompulsory: true, level: 3 },
      { code: 'TAM3535', name: 'Management Studies', isCompulsory: true, level: 3 },
      { code: 'MHZ3576', name: 'Statistics for Industrial Studies', isCompulsory: true, level: 3 },
      { code: 'TAI3270', name: 'Fashion Illustration I', isCompulsory: true, level: 3 },
      { code: 'TAK3237', name: 'Introduction to Computer Applications', isCompulsory: true, level: 3 },
      
      // Level 4
      { code: 'TAX4539', name: 'Quality Assurance for Textile and Clothing', isCompulsory: true, level: 4 },
      { code: 'TAX4540', name: 'Garment Manufacture', isCompulsory: true, level: 4 },
      { code: 'TAI4371', name: 'Concepts of Fashion', isCompulsory: true, level: 4 },
      { code: 'TAI4472', name: 'Concepts of Fashion Designing', isCompulsory: true, level: 4 },
      { code: 'TAI4373', name: 'Fashion Illustration II', isCompulsory: true, level: 4 },
      { code: 'TAI4474', name: 'Process of Fashion Designing', isCompulsory: true, level: 4 },
      { code: 'TAI4442', name: 'Advanced Pattern Construction', isCompulsory: true, level: 4 },
      { code: 'TAI4243', name: 'Foundation Garments', isCompulsory: true, level: 4 },
      { code: 'TAW4402', name: 'Industrial Training I (Fashion)', isCompulsory: true, level: 4 },
      
      // Level 5
      { code: 'TAI5375', name: 'Design Through Draping', isCompulsory: true, level: 5 },
      { code: 'TAI5478', name: 'Fashion Design Development', isCompulsory: true, level: 5 },
      { code: 'TAI5579', name: 'Theoretical aspects of visual presentation and exhibition design', isCompulsory: true, level: 5 },
      { code: 'MHZ5570', name: 'Quantitative Techniques', isCompulsory: true, level: 5 },
      { code: 'TAY5384', name: 'Inspiration of Fashion Designing', isCompulsory: true, level: 5 },
      { code: 'TAW5402', name: 'Industrial Training II (Fashion Design & Product Development)', isCompulsory: true, level: 5 },
      { code: 'TAX5551', name: 'Textile Colouration', isCompulsory: false, level: 5 },
      { code: 'TAI5376', name: 'Computer Aided Pattern Drafting', isCompulsory: false, level: 5 },
      { code: 'TAI5277', name: 'Computer Aided Fashion Illustration', isCompulsory: false, level: 5 },
      { code: 'MHJ5343', name: 'Nature of Science', isCompulsory: false, level: 5 },
      { code: 'MHJ5342', name: 'Technology, Society and Environment', isCompulsory: false, level: 5 },
      { code: 'TAJ5353', name: 'History and Traditions of Clothing', isCompulsory: false, level: 5 },
      
      // Level 6
      { code: 'TAM6457', name: 'Fashion Marketing', isCompulsory: true, level: 6 },
      { code: 'TAX6556', name: 'Ergonomics', isCompulsory: true, level: 6 },
      { code: 'TAY6885', name: 'Creating and exhibiting fashion products', isCompulsory: true, level: 6 },
      { code: 'TAI6580', name: 'Fashion Show Production', isCompulsory: true, level: 6 },
      { code: 'TAX6455', name: 'Fabric Technology', isCompulsory: false, level: 6 },
      { code: 'TAX6454', name: 'Technical Textiles', isCompulsory: false, level: 6 },
      { code: 'TAX6263', name: 'Textile Product Engineering', isCompulsory: false, level: 6 },
      { code: 'TAX6367', name: 'Advanced Colouration', isCompulsory: false, level: 6 }
    ],
    textile: [
      // Level 3
      { code: 'TAX3458', name: 'Fibre Science & Technology', isCompulsory: true, level: 3 },
      { code: 'TAX3459', name: 'Yarn Manufacture I', isCompulsory: true, level: 3 },
      { code: 'TAX3370', name: 'Textile Preparation', isCompulsory: true, level: 3 },
      { code: 'TAX3331', name: 'Garment Analysis and Sewing Machinery', isCompulsory: true, level: 3 },
      { code: 'TAI3332', name: 'Garment Accessories', isCompulsory: true, level: 3 },
      { code: 'MHZ3576', name: 'Statistics for Industrial Studies', isCompulsory: true, level: 3 },
      { code: 'TAM3234', name: 'Basics of Human Resource Management', isCompulsory: true, level: 3 },
      { code: 'TAM3535', name: 'Management Studies', isCompulsory: true, level: 3 },
      { code: 'TAK3237', name: 'Introduction to Computer Applications', isCompulsory: true, level: 3 },
      
      // Level 4
      { code: 'TAX4539', name: 'Quality Assurance for Textile and Clothing', isCompulsory: true, level: 4 },
      { code: 'TAX4540', name: 'Garment Manufacture', isCompulsory: true, level: 4 },
      { code: 'TAX4560', name: 'Woven Fabric Technology', isCompulsory: true, level: 4 },
      { code: 'TAX4361', name: 'Knitting Technology', isCompulsory: true, level: 4 },
      { code: 'TAX4571', name: 'Textile Colouration and Finishing', isCompulsory: true, level: 4 },
      { code: 'TAI4344', name: 'Industrial Garment Washing and Finishing', isCompulsory: true, level: 4 },
      { code: 'TAM4445', name: 'Apparel Merchandising', isCompulsory: true, level: 4 },
      { code: 'TAW4401', name: 'Industrial Training I (Apparel)', isCompulsory: true, level: 4 },
      
      // Level 5
      { code: 'TAX5648', name: 'Fabric Structure and Analysis', isCompulsory: true, level: 5 },
      { code: 'TAX5349', name: 'Nonwoven Textiles', isCompulsory: true, level: 5 },
      { code: 'TAX5547', name: 'Plant Utilities', isCompulsory: true, level: 5 },
      { code: 'TAI5246', name: 'Current topics in Textile and Clothing', isCompulsory: true, level: 5 },
      { code: 'TAI5552', name: 'Principles of Fashion Design', isCompulsory: true, level: 5 },
      { code: 'MHZ5570', name: 'Quantitative Techniques', isCompulsory: true, level: 5 },
      { code: 'TAW5403', name: 'Industrial Training II (Yarn Manufacture)', isCompulsory: true, level: 5 },
      { code: 'TAW5404', name: 'Industrial Training II (Weaving)', isCompulsory: true, level: 5 },
      { code: 'TAW5405', name: 'Industrial Training II (Chemical Processing)', isCompulsory: true, level: 5 },
      { code: 'TAW5406', name: 'Industrial Training II (Knitting)', isCompulsory: true, level: 5 },
      { code: 'MHJ5343', name: 'Nature of Science', isCompulsory: false, level: 5 },
      { code: 'MHJ5342', name: 'Technology, Society and Environment', isCompulsory: false, level: 5 },
      { code: 'TAJ5353', name: 'History and Traditions of Clothing', isCompulsory: false, level: 5 },
      
      // Level 6
      { code: 'TAX6556', name: 'Ergonomics', isCompulsory: true, level: 6 },
      { code: 'TAX6263', name: 'Textile Product Engineering', isCompulsory: true, level: 6 },
      { code: 'TAY6883', name: 'Research Project (Textile Manufacture)', isCompulsory: true, level: 6 },
      { code: 'TAM6457', name: 'Fashion Marketing', isCompulsory: false, level: 6 },
      { code: 'TAX6454', name: 'Technical Textiles', isCompulsory: false, level: 6 },
      { code: 'TAX6265', name: 'Advanced Weaving Preparation and Machinery', isCompulsory: false, level: 6 },
      { code: 'TAX6366', name: 'Yarn Manufacture II', isCompulsory: false, level: 6 },
      { code: 'TAX6367', name: 'Advanced Colouration', isCompulsory: false, level: 6 }
    ]
  };
  
  module.exports = coursesData;