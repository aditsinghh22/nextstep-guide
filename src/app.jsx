import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';

// --- MOCK DATA ---
// In a real application, this data would come from a backend API.

const mockQuizData = {
  class10: {
    title: "Class 10 Aptitude & Interest Quiz",
    questions: [
      { id: 'q1', text: "Which activity do you enjoy the most?", options: [{ text: "Solving complex math problems", stream: "Science" }, { text: "Analyzing historical events", stream: "Arts" }, { text: "Understanding how businesses work", stream: "Commerce" }] },
      { id: 'q2', text: "What kind of TV shows or movies do you prefer?", options: [{ text: "Science fiction or documentaries", stream: "Science" }, { text: "Dramas or historical films", stream: "Arts" }, { text: "Shows about entrepreneurs or the stock market", stream: "Commerce" }] },
      { id: 'q3', text: "If you had to start a club, what would it be?", options: [{ text: "A robotics or coding club", stream: "Science" }, { text: "A debate or literature club", stream: "Arts" }, { text: "An investment or young entrepreneurs club", stream: "Commerce" }] },
      { id: 'q4', text: "Which subject combination sounds most interesting?", options: [{ text: "Physics, Chemistry, and Math", stream: "Science" }, { text: "History, Political Science, and Economics", stream: "Arts" }, { text: "Accountancy, Business Studies, and Economics", stream: "Commerce" }] },
      { id: 'q5', text: "How do you approach problem-solving?", options: [{ text: "Logically and systematically", stream: "Science" }, { text: "Creatively and with empathy", stream: "Arts" }, { text: "Strategically and with a focus on efficiency", stream: "Commerce" }] },
    ]
  },
  class12: {
    'Science': {
      title: "Class 12 Science - Career Mapping Quiz",
      questions: [
        { id: 'q1', text: "Are you more interested in the theoretical 'why' or the practical 'how'?", options: [{ text: "Theoretical 'why'", field: "Research/Academia" }, { text: "Practical 'how'", field: "Engineering" }] },
        { id: 'q2', text: "Do you enjoy building things with your hands or with code?", options: [{ text: "With my hands", field: "Mechanical/Civil Engineering" }, { text: "With code", field: "Computer Science" }] },
        { id: 'q3', text: "Are you fascinated by the human body and medicine?", options: [{ text: "Yes, deeply", field: "Medical Field" }, { text: "Not particularly", field: "Non-Medical Fields" }] },
        { id: 'q4', text: "Do you prefer working on large-scale projects or intricate systems?", options: [{ text: "Large-scale projects", field: "Civil Engineering" }, { text: "Intricate systems", field: "Electronics/Software" }] },
      { id: 'q5', text: "Do you enjoy solving abstract problems or tangible real-world issues?", options: [{ text: "Abstract problems", field: "Mathematics/Theoretical Physics" }, { text: "Real-world issues", field: "Engineering/Applied Sciences" }] },
      {  id: 'q6',text: "Would you rather analyze data or design user experiences?",options: [{text: "Analyze data", field: "Data Science/Statistics" }, { text: "Design user experiences", field: "UI/UX Design" }]},
      {id: "q7",text: "Do you like experimenting in a lab or conducting research through reading and writing?",options: [{ text: "Experimenting in a lab", field: "Chemistry/Biology" },{ text: "Reading and writing research",  field:"SocialSciences  Humanities" }]},
     {id: "q8",text: "Are you more interested in studying weather patterns or investigating chemical reactions?",options: [{ text: "Studying weather patterns", field: "Meteorology/Atmospheric Science" },{ text: "Investigating chemical reactions", field: "Chemical Engineering/Physical Chemistry" }]},
      { id: "q9",  text: "Do you prefer working with machines or living organisms?", options: [{ text: "Machines", field: "Robotics" }, { text: "Living organisms", field: "Biotechnology/Biology" }] },
      { id: "q10", text: "Would you rather invent new technologies or improve existing ones?", options: [{ text: "Invent new technologies", field: "R&D/Innovation" }, { text: "Improve existing ones", field: "Industrial Engineering/Quality Control" }] },
     {id: "q12",text: "Do you enjoy working with numbers and detailed data?",options: [ { text: "Yes, I like analyzing and interpreting data", field: "Research/Data Analysis" }, { text: "No, I prefer tasks that involve communication or leadership", field: "Communication field" } ]},

      { id: "q12", text: "Would you enjoy exploring space or exploring the ocean?", options: [{ text: "Space", field: "Astrophysics/Aerospace Engineering" }, { text: "Ocean", field: "Marine Biology/Oceanography" }] },
      { id: "q13", text: "Do you prefer working with numbers or with people?", options: [{ text: "Numbers", field: "Statistics/Data Science" }, { text: "People", field: "Healthcare/Teaching/Counseling" }] },
      { id: "q14", text: "Do you enjoy debugging code or diagnosing biological symptoms?", options: [{ text: "Debugging code", field: "Software Engineering" }, { text: "Diagnosing symptoms", field: "Medical Field" }] },
      { id: "q15", text: "Would you rather develop sustainable technologies or treat diseases?", options: [{ text: "Sustainable technologies", field: "Environmental Engineering/Renewable Energy" }, { text: "Treat diseases", field: "Medicine/Pharmaceutical Sciences" }] },
     ]},
    'Commerce': {
        title: "Class 12 Commerce - Career Mapping Quiz",
        questions: [
            { id: 'q1', text: "Are you more interested in managing money or managing people?", options: [{ text: "Managing money", field: "Finance/Accounting" }, { text: "Managing people", field: "Human Resources/Management" }] },
            { id: 'q2', text: "Do you enjoy analyzing data to find trends or persuading people?", options: [{ text: "Analyzing data", field: "Data Analysis/Finance" }, { text: "Persuading people", field: "Marketing/Sales" }] },
        {id: "q3",text: "Would you prefer working in a corporate office or running your own business?", options: [{ text: "Corporate office", field: "Corporate Jobs/Management" },{ text: "Own business", field: "Entrepreneurship" }]},
        {id: "q4",text: "Are you more comfortable with numbers or words?", options: [{ text: "Numbers", field: "Accounting/Finance/Economics" },{ text: "Words", field: "Marketing/Business Communication/Law" }]},
        {id: "q5",text: "Would you rather audit financial statements or recruit new employees?", options: [{ text: "Audit financial statements", field: "Chartered Accountancy/Auditing" },{ text: "Recruit employees", field: "Human Resources/Talent Management" }]},
         {id: "q6",text: "Do you enjoy understanding laws and regulations or developing creative brand ideas?", options: [{ text: "Laws and regulations", field: "Corporate Law/Compliance" },{ text: "Creative brand ideas", field: "Marketing/Advertising" }]},
         {id: "q7",text: "Are you more drawn to national business or international business?", options: [ { text: "National business", field: "Domestic Business/Startups" },{ text: "International business", field: "Global Trade/International Business" }]},
         {id: "q8",text: "Which excites you more: stock market trends or company leadership styles?", options: [{ text: "Stock market trends", field: "Stock Trading/Investment Banking" },{ text: "Leadership styles", field: "Organizational Behavior/Management" }]},
        {id: "q9",text: "Would you rather prepare tax returns or design marketing campaigns?",options: [{ text: "Prepare tax returns", field: "Taxation/Accounting" },{ text: "Design marketing campaigns", field: "Marketing/Advertising" } ]},
{id: "q10",text: "Do you enjoy negotiating deals or managing company finances?",options: [ { text: "Negotiating deals", field: "Sales/Business Development" },{ text: "Managing company finances", field: "Financial Management/Accounting" }]},
{id: "q11",text: "Are you interested in studying consumer behavior or financial risk assessment?", options: [{ text: "Consumer behavior", field: "Marketing/Consumer Research" },{ text: "Financial risk assessment", field: "Risk Management/Finance" }]},
{id: "q12",text: "Would you prefer to work in a startup environment or a well-established corporation?",options: [{ text: "Startup environment", field: "Entrepreneurship/Startups" },{ text: "Well-established corporation", field: "Corporate Jobs/Management" }]},
{id: "q13",text: "Do you like working with spreadsheets and budgets or organizing company events?",options: [{ text: "Spreadsheets and budgets", field: "Accounting/Finance" },{ text: "Organizing events", field: "Human Resources/Corporate Communication" }]},
{id: "q14", text: "Are you more interested in stock market investing or brand strategy?",options: [ { text: "Stock market investing", field: "Investment Banking/Stock Trading" }, { text: "Brand strategy", field: "Marketing/Brand Management" }]},
{id: "q15",text: "Would you enjoy conducting market research or auditing company finances?",options: [{ text: "Conducting market research", field: "Marketing Research/Analytics" },{ text: "Auditing company finances", field: "Auditing/Accounting" } ]},
]},
    'Arts': {
        title: "Class 12 Arts - Career Mapping Quiz",
        questions: [
            { id: 'q1', text: "Are you more drawn to visual expression or written expression?", options: [{ text: "Visual expression", field: "Design/Fine Arts" }, { text: "Written expression", field: "Journalism/Writing" }] },
            { id: 'q2', text: "Do you want to understand societal structures or individual human behavior?", options: [{ text: "Societal structures", field: "Sociology/Civil Services" }, { text: "Individual behavior", field: "Psychology" }] },
             {id: "q3",text: "Are you interested in studying history and cultures or exploringphilosophy and ideas?", options: [{ text: "History and cultures", field: "History/Archaeology" },{ text: "Philosophy and ideas", field: "Philosophy/Political Science" }]},
    {id: "q4",text: "Do you enjoy performing on stage or working behind the scenes in production?",options: [{ text: "Performing on stage", field: "Theatre/Performing Arts" },{ text: "Behind the scenes", field: "Film/Media Production" }]},
  {id: "q5",text: "Would you rather create art with your hands or direct others in creative projects?",options: [{ text: "Create art", field: "Fine Arts/Crafts" },{ text: "Direct creative projects", field: "Creative Direction/Media Management" }]},
  { id: "q6", text: "Are you more passionate about storytelling through words or through images?", options: [ { text: "Words", field: "Literature/Creative Writing" }, { text: "Images", field: "Photography/Graphic Design" } ] },
  {id: "q7",text: "Do you enjoy debating ideas or organizing community events?",options: [{ text: "Debating ideas", field: "Law/Political Science" },{ text: "Organizing events", field: "Public Relations/Event Management" }]},
  {id: "q8",text: "Would you prefer researching cultural traditions or analyzing human communication?",options: [{ text: "Researching cultural traditions", field: "Anthropology/Cultural Studies" },{ text: "Analyzing communication", field: "Linguistics/Mass Communication" }]},
  {id: "q9",text: "Are you interested in working with music or writing scripts for films and plays?",options: [{ text: "Working with music", field: "Music/Performing Arts" },{ text: "Writing scripts", field: "Screenwriting/Playwriting" }]},
  {id: "q10",text: "Do you prefer analyzing political systems or helping people with social services?",options: [{ text: "Analyzing political systems", field: "Political Science/International Relations" },{ text: "Helping people", field: "Social Work/Counseling" }]},
  {id: "q11",text: "Would you enjoy creating digital art or researching historical texts?",options: [{ text: "Creating digital art", field: "Digital Media/Graphic Design" },{ text: "Researching historical texts", field: "History/Archival Studies" }]},
  {id: "q12",text: "Are you more interested in philosophy or in studying languages?",options: [{ text: "Philosophy", field: "Philosophy/Ethics" },{ text: "Languages", field: "Linguistics/Foreign Languages" }]},
  {id: "q13",text: "Do you enjoy writing poetry or organizing social campaigns?",options: [{ text: "Writing poetry", field: "Creative Writing/Poetry" },{ text: "Organizing campaigns", field: "Social Activism/NGOs" }]},
  {id: "q14",text: "Would you rather study media trends or explore classical literature?",options: [{ text: "Media trends", field: "Mass Communication/Media Studies" },{ text: "Classical literature", field: "Literature/Classics" }]},
  {id: "q15",text: "Are you more interested in fashion design or in cultural anthropology?",options: [{ text: "Fashion design", field: "Fashion Design/Textiles" },{ text: "Cultural anthropology", field: "Anthropology/Cultural Studies" }]},
]
    }
  }
};

const mockMindMapData = {
    Science: {
        name: 'Science Stream',
        children: [
            { name: 'PCM (Physics, Chemistry, Maths)', children: [
                { name: 'B.Tech/B.E.', children: [{name: 'Software Engineer'}, {name: 'Mechanical Engineer'}, {name: 'Civil Engineer'}] },
                { name: 'B.Arch', children: [{name: 'Architect'}] },
                { name: 'B.Sc in Physics/Maths', children: [{name: 'Researcher'}, {name: 'Data Scientist'}] }
            ]},
            { name: 'PCB (Physics, Chemistry, Biology)', children: [
                { name: 'MBBS/BDS', children: [{name: 'Doctor'}, {name: 'Dentist'}] },
                { name: 'B.Pharm', children: [{name: 'Pharmacist'}] },
                { name: 'B.Sc in Biology/Zoology', children: [{name: 'Biotechnologist'}] }
            ]},
            { name: 'PCMB', children: [{name: 'Versatile options in both Engineering and Medical'}]}
        ]
    },
    Commerce: {
        name: 'Commerce Stream',
        children: [
            { name: 'With Maths', children: [
                { name: 'B.Com (Hons.)', children: [{name: 'CA/CS'}, {name: 'Investment Banker'}] },
                { name: 'Economics (Hons.)', children: [{name: 'Economist'}, {name: 'Policy Analyst'}] },
                { name: 'BBA/BMS', children: [{name: 'Business Manager'}] }
            ]},
            { name: 'Without Maths', children: [
                { name: 'B.Com (Prog.)', children: [{name: 'Accountant'}] },
                { name: 'Company Secretary', children: [{name: 'Corporate Lawyer'}] }
            ]}
        ]
    },
    Arts: {
        name: 'Arts/Humanities Stream',
        children: [
            { name: 'Core Subjects', children: [
                { name: 'BA in History/Pol Science', children: [{name: 'Civil Services (IAS/IPS)'}, {name: 'Journalist'}] },
                { name: 'BA in Psychology/Sociology', children: [{name: 'Psychologist'}, {name: 'Social Worker'}] },
                { name: 'BA in Fine Arts', children: [{name: 'Designer'}, {name: 'Artist'}] }
            ]},
            { name: 'Vocational Subjects', children: [
                { name: 'Law (Integrated BA-LLB)', children: [{name: 'Lawyer'}] },
                { name: 'Hotel Management', children: [{name: 'Hospitality Manager'}] }
            ]}
        ]
    }
};

// NEW: Detailed mind map data for Class 12 fields
const mockFieldMindMapData = {
    // --- SCIENCE FIELDS ---
    'Research/Academia': {
        name: 'Research & Academia',
        children: [
            { name: 'Educational Path', children: [
                { name: 'B.Sc. (Physics, Chemistry, Maths, etc.)' },
                { name: 'M.Sc. in Specialization' },
                { name: 'Ph.D. (Doctorate)', children: [
                    { name: 'Post-Doctoral Fellowship' }
                ]}
            ]},
            { name: 'Career Roles', children: [
                { name: 'University Professor' },
                { name: 'Research Scientist (ISRO, DRDO, CSIR)' },
                { name: 'Data Scientist' },
                { name: 'Product R&D Specialist' }
            ]},
            { name: 'Key Skills', children: [{name: 'Analytical Thinking'}, {name: 'Patience & Persistence'}, {name: 'Publication Writing'}] }
        ]
    },
    'Engineering': {
        name: 'General Engineering',
        children: [
            { name: 'Core Branches', children: [
                { name: 'Computer Science', children: [{name: 'Software Dev'}, {name: 'AI/ML'}] },
                { name: 'Mechanical Engineering', children: [{name: 'Automotive'}, {name: 'Robotics'}] },
                { name: 'Civil Engineering', children: [{name: 'Infrastructure'}, {name: 'Environmental'}] },
                { name: 'Electrical & Electronics', children: [{name: 'VLSI Design'}, {name: 'Power Systems'}] },
            ]},
            { name: 'Top Entrance Exams', children: [{name: 'JEE Main & Advanced'}, {name: 'BITSAT'}, {name: 'VITEEE'}, {name: 'State CETs'}] },
            { name: 'Top Colleges', children: [{name: 'IITs'}, {name: 'NITs'}, {name: 'BITS Pilani'}] }
        ]
    },
    'Mechanical/Civil Engineering': {
        name: 'Mechanical & Civil Engineering',
        children: [
            { name: 'Mechanical', children: [
                { name: 'Specializations', children: [{name: 'Automobile Engg.'}, {name: 'Aerospace Engg.'}, {name: 'Robotics'}, {name: 'Mechatronics'}] },
                { name: 'Job Roles', children: [{name: 'Design Engineer'}, {name: 'Manufacturing Engineer'}, {name: 'Project Manager'}] }
            ]},
            { name: 'Civil', children: [
                { name: 'Specializations', children: [{name: 'Structural Engg.'}, {name: 'Transportation Engg.'}, {name: 'Urban Planning'}] },
                { name: 'Job Roles', children: [{name: 'Site Engineer'}, {name: 'Consultant'}, {name: 'Government Contracts (PWD, NHAI)'}] }
            ]}
        ]
    },
    'Computer Science': {
        name: 'Computer Science',
        children: [
            { name: 'Domains', children: [
                { name: 'Software Development', children: [{name: 'Frontend'}, {name: 'Backend'}, {name: 'Full Stack'}] },
                { name: 'AI & Machine Learning', children: [{name: 'Data Scientist'}, {name: 'ML Engineer'}] },
                { name: 'Cybersecurity', children: [{name: 'Ethical Hacker'}, {name: 'Security Analyst'}] },
                { name: 'Cloud Computing', children: [{name: 'DevOps Engineer'}, {name: 'Cloud Architect'}] }
            ]},
            { name: 'Top Skills', children: [{name: 'Programming (Python, Java, JS)'}, {name: 'Data Structures & Algorithms'}, {name: 'System Design'}] },
            { name: 'Career Path', children: [{name: 'SDE-1'}, {name: 'SDE-2'}, {name: 'Lead Engineer'}, {name: 'Engineering Manager'}] }
        ]
    },
    'Medical Field': {
        name: 'Medical Field',
        children: [
            { name: 'Core Degrees', children: [
                { name: 'MBBS (Doctor)', children: [{name: 'MD/MS (Specialization)'}, {name: 'Surgeon'}, {name: 'General Physician'}] },
                { name: 'BDS (Dentist)' },
                { name: 'BAMS (Ayurveda)' },
                { name: 'BHMS (Homeopathy)' },
            ]},
            { name: 'Allied Fields', children: [
                { name: 'B.Pharm (Pharmacist)' },
                { name: 'B.Sc. Nursing' },
                { name: 'Physiotherapy (BPT)' }
            ]},
            { name: 'Entrance Exam', children: [{name: 'NEET (National Eligibility cum Entrance Test)'}] }
        ]
    },
     'Non-Medical Fields': {
        name: 'Non-Medical Science Fields',
        children: [
            { name: 'Pure Sciences', children: [
                { name: 'B.Sc. Physics', children: [{name: 'Astrophysicist'}, {name: 'Researcher'}] },
                { name: 'B.Sc. Chemistry', children: [{name: 'Pharmaceuticals'}, {name: 'Quality Control'}] },
                { name: 'B.Sc. Mathematics', children: [{name: 'Data Analyst'}, {name: 'Actuarial Science'}] }
            ]},
            { name: 'Other Options', children: [
                { name: 'B.Arch (Architecture)' },
                { name: 'BCA (Computer Applications)' },
                { name: 'Merchant Navy' }
            ]}
        ]
    },
    'Civil Engineering': {
        name: 'Civil Engineering',
        children: [
            { name: 'Specializations', children: [
                { name: 'Structural Engineering', children: [{name: 'Building Design'}, {name: 'Bridge Design'}] },
                { name: 'Geotechnical Engineering', children: [{name: 'Soil & Foundation Analysis'}] },
                { name: 'Transportation Engineering', children: [{name: 'Highway Design'}, {name: 'Traffic Management'}] },
                { name: 'Environmental Engineering', children: [{name: 'Water Treatment'}, {name: 'Waste Management'}] }
            ]},
            { name: 'Job Roles', children: [{name: 'Site Engineer'}, {name: 'Project Manager'}, {name: 'Urban Planner'}, {name: 'Govt. Engineer (PWD, CPWD)'}] }
        ]
    },
    'Electronics/Software': {
        name: 'Electronics & Software',
        children: [
            { name: 'Electronics Core', children: [
                { name: 'B.Tech in ECE', children: [{name: 'VLSI Design'}, {name: 'Embedded Systems'}, {name: 'Telecommunications'}] },
                { name: 'Job Roles', children: [{name: 'Hardware Engineer'}, {name: 'Network Engineer'}] }
            ]},
            { name: 'Software Core', children: [
                 { name: 'B.Tech in CSE/IT', children: [{name: 'Software Development'}, {name: 'Data Science'}, {name: 'Cybersecurity'}] },
                 { name: 'Job Roles', children: [{name: 'Software Engineer'}, {name: 'DevOps Engineer'}, {name: 'QA Engineer'}] }
            ]},
            { name: 'Intersection', children: [{name: 'IoT (Internet of Things)'}, {name: 'Robotics & Automation'}] }
        ]
    },
    // --- COMMERCE FIELDS ---
    'Finance/Accounting': {
        name: 'Finance & Accounting',
        children: [
            { name: 'Professional Courses', children: [
                { name: 'Chartered Accountancy (CA)', children: [{name: 'Auditing'}, {name: 'Taxation'}] },
                { name: 'Company Secretary (CS)', children: [{name: 'Corporate Law'}] },
                { name: 'CFA (Chartered Financial Analyst)', children: [{name: 'Investment Management'}] }
            ]},
            { name: 'Degree Courses', children: [
                { name: 'B.Com (Hons.)' },
                { name: 'BBA in Finance' }
            ]},
            { name: 'Job Roles', children: [{name: 'Accountant'}, {name: 'Financial Advisor'}, {name: 'Investment Banker'}] }
        ]
    },
    'Human Resources/Management': {
        name: 'HR & Management',
        children: [
            { name: 'Educational Path', children: [
                { name: 'BBA / BMS' },
                { name: 'MBA (HR/General Mgmt)', children: [{name: 'CAT'}, {name: 'XAT'}] }
            ]},
            { name: 'HR Roles', children: [{name: 'Talent Acquisition'}, {name: 'HR Business Partner'}, {name: 'Compensation Analyst'}] },
            { name: 'Management Roles', children: [{name: 'Management Consultant'}, {name: 'Project Manager'}, {name: 'Business Operations Manager'}] }
        ]
    },
    'Data Analysis/Finance': {
        name: 'Data Analysis & Finance',
        children: [
            { name: 'Educational Path', children: [
                { name: 'B.Com (Hons.)' },
                { name: 'B.Sc. Statistics' },
                { name: 'Economics (Hons.)' }
            ]},
            { name: 'Key Skills', children: [{name: 'SQL'}, {name: 'Python/R'}, {name: 'Excel'}, {name: 'Financial Modeling'}] },
            { name: 'Job Roles', children: [{name: 'Data Analyst'}, {name: 'Financial Analyst'}, {name: 'Business Analyst'}, {name: 'Market Research Analyst'}] }
        ]
    },
    'Marketing/Sales': {
        name: 'Marketing & Sales',
        children: [
            { name: 'Educational Path', children: [
                { name: 'BBA (Marketing)' },
                { name: 'MBA (Marketing)' }
            ]},
            { name: 'Marketing', children: [
                { name: 'Digital Marketing', children: [{name: 'SEO/SEM'}, {name: 'Social Media Marketing'}] },
                { name: 'Brand Management' },
                { name: 'Market Research' }
            ]},
            { name: 'Sales', children: [{name: 'Business Development'}, {name: 'Key Account Management'}, {name: 'Sales Strategy'}] }
        ]
    },
    // --- ARTS FIELDS ---
    'Design/Fine Arts': {
        name: 'Design & Fine Arts',
        children: [
            { name: 'Educational Path', children: [
                { name: 'B.Des (Bachelor of Design)', children: [{name: 'NID'}, {name: 'NIFT'}, {name: 'UCEED'}] },
                { name: 'BFA (Bachelor of Fine Arts)' }
            ]},
            { name: 'Design Fields', children: [
                { name: 'Graphic Design' },
                { name: 'UI/UX Design' },
                { name: 'Fashion Design' },
                { name: 'Product Design' }
            ]},
            { name: 'Fine Arts', children: [{name: 'Painting'}, {name: 'Sculpture'}, {name: 'Animator'}] }
        ]
    },
    'Journalism/Writing': {
        name: 'Journalism & Writing',
        children: [
            { name: 'Educational Path', children: [
                { name: 'BAJMC (Journalism & Mass Comm.)' },
                { name: 'BA in English Literature' }
            ]},
            { name: 'Journalism', children: [{name: 'Print Media'}, {name: 'Broadcast Media (TV/Radio)'}, {name: 'Digital Media'}] },
            { name: 'Writing', children: [{name: 'Content Writer'}, {name: 'Copywriter'}, {name: 'Technical Writer'}, {name: 'Author'}] }
        ]
    },
    'Sociology/Civil Services': {
        name: 'Sociology & Civil Services',
        children: [
            { name: 'Civil Services (UPSC)', children: [
                { name: 'Core Services', children: [{name: 'IAS (Admin)'}, {name: 'IPS (Police)'}, {name: 'IFS (Foreign)'}] },
                { name: 'Exam Stages', children: [{name: 'Prelims'}, {name: 'Mains'}, {name: 'Interview'}] }
            ]},
            { name: 'Sociology & Social Work', children: [
                { name: 'BA/MA in Sociology' },
                { name: 'MSW (Master of Social Work)' },
                { name: 'Job Roles', children: [{name: 'NGO Worker'}, {name: 'Policy Analyst'}, {name: 'CSR Manager'}] }
            ]}
        ]
    },
    'Psychology': {
        name: 'Psychology',
        children: [
            { name: 'Educational Path', children: [
                { name: 'BA/B.Sc. in Psychology' },
                { name: 'MA/M.Sc. in Psychology' },
                { name: 'M.Phil / Ph.D. for specialization' }
            ]},
            { name: 'Specializations', children: [
                { name: 'Clinical Psychology', children: [{name: 'Therapist'}] },
                { name: 'Organizational Psychology', children: [{name: 'Corporate Trainer'}] },
                { name: 'Counselling Psychology', children: [{name: 'School Counselor'}, {name: 'Career Counselor'}] }
            ]}
        ]
    }
};


const mockColleges = [
  { id: 1, name: "Indian Institute of Technology, Delhi", location: "Delhi", exams: ["JEE Advanced"], rating: 4.9, type: "Government", image: "https://placehold.co/600x400/131314/ffffff?text=IIT+Delhi", specialty: "Engineering & Research", courses: ["Computer Science", "Mechanical Eng.", "Electrical Eng.", "Civil Eng.", "Chemical Eng."] },
  { id: 2, name: "All India Institute of Medical Sciences, Delhi", location: "Delhi", exams: ["NEET"], rating: 4.8, type: "Government", image: "https://placehold.co/600x400/131314/ffffff?text=AIIMS+Delhi", specialty: "Medical Sciences", courses: ["MBBS", "B.Sc. Nursing", "B.Sc. Paramedical", "MD", "MS"] },
  { id: 3, name: "St. Stephen's College, Delhi", location: "Delhi", exams: ["CUET"], rating: 4.7, type: "Government", image: "https://placehold.co/600x400/131314/ffffff?text=St.+Stephen's", specialty: "Arts & Sciences", courses: ["B.A. Economics", "B.A. History", "B.Sc. Physics", "B.Sc. Chemistry", "B.A. English"] },
  { id: 4, name: "Indian Institute of Management, Ahmedabad", location: "Ahmedabad", exams: ["CAT"], rating: 4.9, type: "Government", image: "https://placehold.co/600x400/131314/ffffff?text=IIM+Ahmedabad", specialty: "Business Management", courses: ["PGP in Management", "PGP in Food & Agri-Business", "ePGP", "Ph.D. in Management"] },
  { id: 5, name: "National Law School of India University, Bangalore", location: "Bangalore", exams: ["CLAT"], rating: 4.8, type: "Government", image: "https://placehold.co/600x400/131314/ffffff?text=NLSIU", specialty: "Law", courses: ["B.A. LL.B. (Hons.)", "LL.M.", "Master of Public Policy", "Ph.D. in Law"] },
  { id: 6, name: "Christ University, Bangalore", location: "Bangalore", exams: ["CUET"], rating: 4.5, type: "Private", image: "https://placehold.co/600x400/131314/ffffff?text=Christ+University", specialty: "Multidisciplinary", courses: ["B.B.A.", "B.Com", "B.A. Journalism", "B.Tech CSE", "B.A. LL.B."]},
];

const mockCollegeMentors = {
  1: [ // IIT Delhi
    {
      name: "Akash Singh",
      status: "Alumnus, Class of 2021",
      branch: "Mechanical Engineering",
      qualifications: "Currently a Design Engineer at Tesla.",
      achievements: "Led the college's Formula Student team to a national victory.",
      reviewType: 'positive',
      reviewTitle: "Incredible Opportunities & Peer Group",
      reviewText: "IIT Delhi is a world of its own. The exposure you get is unparalleled. The curriculum is rigorous, but the hands-on projects and competitions are where you truly learn. The alumni network is incredibly strong and has helped me immensely in my career.",
      image: "https://i.pravatar.cc/150?u=akash"
    },
    {
      name: "Priya Sharma",
      status: "4th Year Student",
      branch: "Textile Technology",
      qualifications: "Interned with a leading fashion export house.",
      achievements: "Organized the department's annual tech fest.",
      reviewType: 'negative',
      reviewTitle: "Can Feel Overwhelming & Impersonal",
      reviewText: "The 'IIT' tag comes with immense pressure. It's a highly competitive environment which can be draining. Some of the core engineering branches have theoretical teaching methods that could use an update. It's easy to feel lost in the crowd if you're not proactive.",
      image: "https://i.pravatar.cc/150?u=priyas"
    }
  ],
  2: [ // AIIMS Delhi
    {
      name: "Dr. Sameer Joshi",
      status: "Alumnus, Class of 2018",
      branch: "MBBS",
      qualifications: "MD in Cardiology, practicing at a top hospital.",
      achievements: "Co-authored a paper on preventive cardiology during residency.",
      reviewType: 'positive',
      reviewTitle: "The Best Medical Training in India",
      reviewText: "AIIMS provides the best clinical exposure, period. You see a variety of cases you wouldn't see anywhere else. The faculty are legends in their fields. The training is intense but it prepares you for anything. Proud to be an AIIMS graduate.",
      image: "https://i.pravatar.cc/150?u=sameer"
    },
    {
      name: "Anjali Menon",
      status: "4th Year Student",
      branch: "MBBS",
      qualifications: "Research assistant in the neurology department.",
      achievements: "Volunteers for health camps in rural areas.",
      reviewType: 'negative',
      reviewTitle: "Extremely Stressful with No Work-Life Balance",
      reviewText: "The life of a student here is incredibly tough. The workload is immense, and there's virtually no time for personal hobbies or relaxation. The infrastructure, especially hostels, is old and needs significant upgrades. The administration can be slow to respond to student needs.",
      image: "https://i.pravatar.cc/150?u=anjali"
    }
  ],
  3: [ // St. Stephen's College
    {
        name: "Arjun Khanna",
        status: "Alumnus, Class of 2020",
        branch: "B.A. Economics",
        qualifications: "Post-graduate from London School of Economics.",
        achievements: "President of the Debating Society.",
        reviewType: 'positive',
        reviewTitle: "Intellectually Stimulating & Holistic",
        reviewText: "Stephen's is more than a college; it's an institution that shapes your thinking. The tutorials, the class discussions, and the brilliant faculty foster a unique intellectual environment. The traditions and campus life are something I'll cherish forever.",
        image: "https://i.pravatar.cc/150?u=arjun"
    },
    {
        name: "Meera Das",
        status: "3rd Year Student",
        branch: "B.Sc. Physics",
        qualifications: "Working on a research project with a faculty member.",
        achievements: "Member of the college's photography club.",
        reviewType: 'negative',
        reviewTitle: "Can Feel Elitist and Under-resourced",
        reviewText: "The college has a reputation for being elitist, and at times, it feels that way. The science labs and equipment could be better for a college of its stature. There's a lot of focus on humanities, and science students sometimes feel a bit neglected.",
        image: "https://i.pravatar.cc/150?u=meera"
    }
  ],
    4: [ // IIM Ahmedabad
    {
      name: "Nikhil Batra",
      status: "Alumnus, Class of 2019",
      branch: "PGP in Management",
      qualifications: "Working as a consultant at McKinsey & Company.",
      achievements: "Case competition winner at the national level.",
      reviewType: 'positive',
      reviewTitle: "The Ultimate Launchpad for a Business Career",
      reviewText: "IIM-A is a pressure cooker that forges you into a top-tier professional. The case-based methodology is brilliant, and the professors are a mix of academic and industry experts. The brand opens doors that few other institutions can.",
      image: "https://i.pravatar.cc/150?u=nikhil"
    },
    {
      name: "Riya Desai",
      status: "2nd Year Student",
      branch: "PGP in Management",
      qualifications: "Summer intern at a major FMCG company.",
      achievements: "Coordinator for the annual business conclave.",
      reviewType: 'negative',
      reviewTitle: "Hyper-Competitive and Mentally Taxing",
      reviewText: "The competition here is relentless, both in academics and placements. It can take a toll on your mental health. The 'IIM-A' tag brings a lot of expectations and pressure to constantly perform, which can lead to burnout for some.",
      image: "https://i.pravatar.cc/150?u=riya"
    }
  ],
  5: [ // NLSIU Bangalore
    {
        name: "Aditya Verma",
        status: "5th Year Student",
        branch: "B.A. LL.B. (Hons.)",
        qualifications: "Interned at a top corporate law firm.",
        achievements: "Editor of the Student Bar Review.",
        reviewType: 'positive',
        reviewTitle: "The Best Legal Education in the Country",
        reviewText: "NLSIU's trimester system is intense but it prepares you for the rigors of the legal profession. The faculty is exceptional, and moot court culture is very strong. You are surrounded by the brightest future lawyers of the country.",
        image: "https://i.pravatar.cc/150?u=aditya"
    },
    {
        name: "Sanjana Iyer",
        status: "Alumna, Class of 2022",
        branch: "B.A. LL.B. (Hons.)",
        qualifications: "Working with a human rights NGO.",
        achievements: "Led a legal aid clinic for underprivileged communities.",
        reviewType: 'negative',
        reviewTitle: "Isolated Campus and High Pressure",
        reviewText: "The campus is quite far from the main city, making it feel isolated. The academic pressure is immense, and it can become a 'bubble' where your entire life revolves around law school, which can be unhealthy.",
        image: "https://i.pravatar.cc/150?u=sanjana"
    }
  ],
  6: [ // Christ University
    {
        name: "David Mathews",
        status: "4th Year Student",
        branch: "B.Tech CSE",
        qualifications: "Built a mobile app for the university's fest.",
        achievements: "Won a hackathon organized by a major tech company.",
        reviewType: 'positive',
        reviewTitle: "Vibrant Campus Life and Great Exposure",
        reviewText: "Christ University has a very lively and diverse campus culture. There are countless clubs and events, so you'll never be bored. The faculty is supportive, and the university emphasizes holistic development, not just academics.",
        image: "https://i.pravatar.cc/150?u=david"
    },
    {
        name: "Aisha Khan",
        status: "Alumna, Class of 2023",
        branch: "B.A. Journalism",
        qualifications: "Working as a reporter for a digital news platform.",
        achievements: "Managed the student-run newspaper.",
        reviewType: 'negative',
        reviewTitle: "Strict Rules and Large Batch Sizes",
        reviewText: "The university is known for its strict rules on attendance and dress code, which can feel restrictive. The batch sizes are quite large, so you don't get a lot of personal attention from professors. The administration can be a bit rigid.",
        image: "https://i.pravatar.cc/150?u=aisha"
    }
  ]
};

const mockMentors = [
  { id: 1, name: "Ananya Sharma", college: "IIT Delhi", field: "Computer Science", rating: 4.9, reviews: 82, image: "https://i.pravatar.cc/150?u=ananya" },
  { id: 2, name: "Rohan Verma", college: "AIIMS Delhi", field: "Medicine", rating: 4.8, reviews: 65, image: "https://i.pravatar.cc/150?u=rohan" },
  { id: 3, name: "Priya Singh", college: "IIM Ahmedabad", field: "Business Management", rating: 4.9, reviews: 95, image: "https://i.pravatar.cc/150?u=priya" },
  { id: 4, name: "Vikram Rathore", college: "NLSIU Bangalore", field: "Law", rating: 4.7, reviews: 50, image: "https://i.pravatar.cc/150?u=vikram" },
];

const mockTestimonials = [
    { quote: "NextStepGuide was a game-changer for me. I was so confused after my 10th boards, but the quiz pointed me towards Commerce, and I've never looked back!", name: "Aarav Gupta", class: "Class 11, Mumbai" },
    { quote: "The AI Mentor is surprisingly helpful for quick questions. For deeper doubts, booking a session with a senior from my dream college was invaluable.", name: "Sneha Reddy", class: "Class 12, Hyderabad" },
    { quote: "I thought I knew I wanted to do engineering, but the Class 12 quiz helped me narrow it down to Computer Science. The detailed career path info was excellent.", name: "Rohan Patel", class: "First Year B.Tech Student" },
];

const whyGraduationData = [
    {
        title: "Access to Government Jobs & Schemes",
        description: "A degree is often the minimum requirement for prestigious government jobs in J&K like KAS, positions in banking (J&K Bank), and teaching. It also makes you eligible for special government schemes for educated youth, like entrepreneurship support and skill development programs."
    },
    {
        title: "Unlocking Professional Careers",
        description: "Fields like engineering, medicine, law, and IT are only accessible with a graduate degree. In a developing region like J&K, these professionals are crucial for building modern infrastructure, improving healthcare, and driving the digital economy."
    },
    {
        title: "Boosting Local Economy & Tourism",
        description: "Graduates in fields like business, hospitality, and management can start their own ventures, modernizing the local tourism industry—a cornerstone of J&K's economy. A degree gives you the skills to create jobs, not just seek them."
    },
    {
        title: "Empowerment and Broader Perspectives",
        description: "Higher education exposes you to new ideas and critical thinking. It empowers you to become a leader in your community, make informed decisions, and contribute positively to the social and cultural fabric of Jammu and Kashmir."
    },
    {
        title: "Eligibility for Higher Studies (Masters/PhD)",
        description: "Graduation is the first step towards specialization. If you dream of becoming a researcher, a professor, or an expert in a specific field, a Bachelor's degree is your essential ticket to pursuing a Master's or PhD in India or abroad."
    }
];


// --- ICONS (as React Components) ---
// Using inline SVGs to avoid external dependencies.
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CompassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const LogInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const StarIcon = ({ filled = true }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={filled ? "text-yellow-400" : "text-gray-300"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const LogoIcon = () => <svg height="30" viewBox="0 0 41 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 0L41 19.5L20.5 39L0 19.5L20.5 0Z" fill="currentColor"/></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>;
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><path d="M12 5v6"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;

// --- CUSTOM CURSOR COMPONENT ---
const CustomCursor = () => {
    const cursorDotRef = useRef(null);
    const cursorOutlineRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            if (cursorDotRef.current && cursorOutlineRef.current) {
                cursorDotRef.current.style.left = `${clientX}px`;
                cursorDotRef.current.style.top = `${clientY}px`;

                cursorOutlineRef.current.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 300, fill: "forwards" });
            }
        };

        const handleMouseDown = () => {
             if (cursorOutlineRef.current) {
                 cursorOutlineRef.current.style.transform = 'translate(-50%, -50%) scale(0.8)';
             }
        }
        const handleMouseUp = () => {
            if (cursorOutlineRef.current) {
                cursorOutlineRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }

        const handleMouseEnter = (e) => {
            if (e.target.closest('button, a, .cursor-pointer')) {
                if (cursorOutlineRef.current) {
                    cursorOutlineRef.current.style.transform = 'translate(-50%, -50%) scale(1.3)';
                    cursorOutlineRef.current.style.borderColor = 'rgba(20, 184, 166, 0.5)';
                }
            }
        }

        const handleMouseLeave = (e) => {
            if (e.target.closest('button, a, .cursor-pointer')) {
                if (cursorOutlineRef.current) {
                    cursorOutlineRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutlineRef.current.style.borderColor = 'currentColor';
                }
            }
        }

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);


        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, []);

    return (
        <div className="hidden md:block">
            <div ref={cursorOutlineRef} className="fixed text-teal-600 top-0 left-0 rounded-full w-8 h-8 border pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"></div>
            <div ref={cursorDotRef} className="fixed top-0 left-0 rounded-full w-2 h-2 bg-teal-500 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    );
};


// --- AUTHENTICATION CONTEXT ---
// Manages user state throughout the application.

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('careerPathUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const login = (userData) => {
    const fakeUser = {
      name: userData.name || "Student",
      email: userData.email,
      level: null, // 'class10' or 'class12'
      stream: null, // For class 12
      quizHistory: [],
      bookmarks: [],
      sessions: []
    };
    setUser(fakeUser);
    localStorage.setItem('careerPathUser', JSON.stringify(fakeUser));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('careerPathUser');
  };
 
  const updateUserProfile = (updatedData) => {
      if (user) {
          const updatedUser = { ...user, ...updatedData };
          setUser(updatedUser);
          localStorage.setItem('careerPathUser', JSON.stringify(updatedUser));
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- NEW DATA CONTEXT ---
// Manages shared application data like mentor reviews.

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [collegeMentors, setCollegeMentors] = useState(mockCollegeMentors);

    const addMentorReview = (reviewData) => {
        // Find the college by name (case-insensitive)
        const college = mockColleges.find(c => c.name.toLowerCase() === reviewData.college.toLowerCase());
        
        if (!college) {
            // In a real app, provide user feedback for an invalid college name
            console.error("College not found:", reviewData.college);
            alert("Sorry, we couldn't find that college in our database. Please check the spelling.");
            return false;
        }

        const newMentorReview = {
            name: reviewData.name,
            status: reviewData.academicYear === 'Pass Out' ? `Alumnus` : `${reviewData.academicYear} Year Student`,
            branch: reviewData.qualifications,
            qualifications: reviewData.job ? `Working as a ${reviewData.job}.` : 'Currently pursuing higher studies.',
            achievements: `CGPA: ${reviewData.cgpa}`,
            reviewType: 'positive', // Defaulting new reviews to 'positive' for this example
            reviewTitle: reviewData.reviewTitle,
            reviewText: reviewData.reviewText,
            image: `https://i.pravatar.cc/150?u=${reviewData.name.replace(/\s+/g, '')}` // Generate a unique avatar
        };

        setCollegeMentors(prevMentors => {
            const updatedMentors = { ...prevMentors };
            // Ensure there's an array for the college ID
            const collegeIdMentors = updatedMentors[college.id] ? [...updatedMentors[college.id]] : [];
            collegeIdMentors.push(newMentorReview);
            updatedMentors[college.id] = collegeIdMentors;
            return updatedMentors;
        });

        return true;
    };

    return (
        <DataContext.Provider value={{ collegeMentors, addMentorReview }}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => useContext(DataContext);


// --- REUSABLE UI COMPONENTS ---

const Card = ({ children, className = '', onClick }) => (
  <motion.div 
    className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/20 hover:border-teal-800 ${className}`}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, animate, transition, type = 'button' }) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950';
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-500 shadow-lg shadow-teal-900/20 hover:shadow-teal-800/40',
    secondary: 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 focus-visible:ring-gray-500',
    outline: 'border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white focus-visible:ring-teal-500'
  };
  return <motion.button type={type} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} animate={animate} transition={transition} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className} disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none`}>{children}</motion.button>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
      <AnimatePresence>
        {isOpen && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                <motion.div 
                  className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
                  exit={{ y: 20, opacity: 0 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-teal-400">{title}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">&times;</button>
                    </div>
                    <div>{children}</div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    );
};

const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-8 w-8 border-t-2 border-b-2',
        md: 'h-16 w-16 border-t-4 border-b-4',
    }
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className={`animate-spin rounded-full ${sizes[size]} border-teal-500`}></div>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { setPage } = useNavigation();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40"
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-teal-500 cursor-pointer flex items-center gap-3" onClick={() => setPage('home')}>
            <LogoIcon /> NextStepGuide
        </motion.div>
        <div className="hidden md:flex items-center space-x-8">
          <NavItem onClick={() => setPage('home')}>Home</NavItem>
          <NavItem onClick={() => setPage('pathways')}>Pathways</NavItem>
          <NavItem onClick={() => setPage('colleges')}>Colleges</NavItem>
          <NavItem onClick={() => setPage('mentors')}>Mentors</NavItem>
        </div>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold hidden sm:block text-gray-300">Welcome, {user.name}!</span>
              <Button onClick={() => setPage('dashboard')} variant="outline" className="py-2 px-4">Dashboard</Button>
              <Button onClick={() => { logout(); setPage('home'); }} variant="secondary" className="py-2 px-4"><LogOutIcon/></Button>
            </div>
          ) : (
             <Button onClick={() => setPage('login')} className="py-2 px-4">
               Login <LogInIcon className="w-5 h-5" />
             </Button>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

const NavItem = ({ onClick, children }) => (
    <motion.a 
      whileHover={{ y: -2, color: 'rgb(45 212 191)' }}
      onClick={onClick} className="text-gray-300 transition-colors duration-200 cursor-pointer font-medium text-base">
        {children}
    </motion.a>
);


const Footer = () => (
    <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
            <p className="font-bold text-xl mb-2 text-gray-200">NextStepGuide</p>
            <p>&copy; {new Date().getFullYear()} Your Digital Guidance Platform. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
                <a href="#" className="hover:text-teal-400">About Us</a>
                <a href="#" className="hover:text-teal-400">Contact</a>
                <a href="#" className="hover:text-teal-400">Privacy Policy</a>
            </div>
        </div>
    </footer>
);

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay } }
    };

    return (
        <motion.section
            ref={ref}
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
        >
            {children}
        </motion.section>
    );
};

// --- PAGE COMPONENTS ---

const featureSlides = [
    {
        title: "Discover Your Aptitude",
        description: "Take our quick, insightful quiz to understand your unique strengths and interests. We analyze your responses to recommend the stream that best fits your personality and skills.",
        visual: (
            <div className="w-full h-full bg-gray-800 rounded-lg p-4 border border-gray-700 text-sm">
                <div className="w-full h-8 bg-gray-900 rounded mb-4 flex items-center px-2 gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <h3 className="font-bold text-teal-300 text-lg mb-2">Aptitude & Interest Quiz</h3>
                <p className="text-gray-400 text-sm mb-4">Question 1 of 5</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{width: '20%'}}></div>
                </div>
                <p className="font-semibold text-gray-200 mb-4">Which activity do you enjoy the most?</p>
                <div className="space-y-2">
                    <div className="w-full p-2 bg-gray-900/50 rounded text-gray-300 border-2 border-teal-500">Solving complex math problems</div>
                    <div className="w-full p-2 bg-gray-900/50 rounded text-gray-300 border border-gray-700">Analyzing historical events</div>
                    <div className="w-full p-2 bg-gray-900/50 rounded text-gray-300 border border-gray-700">Understanding how businesses work</div>
                </div>
            </div>
        )
    },
    {
        title: "Explore Your Pathways",
        description: "Receive a personalized roadmap of streams, courses, and potential careers. Our AI-powered insights and visual mind maps make complex information easy to understand.",
        visual: (
             <div className="w-full h-full bg-gray-800 rounded-lg p-4 border border-gray-700 text-sm">
                 <div className="w-full h-8 bg-gray-900 rounded mb-4 flex items-center px-2 gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <h3 className="font-bold text-teal-300 text-lg mb-2">Your Recommended Path: Science</h3>
                <p className="text-gray-400 text-sm mb-4">Personalized Mind Map</p>
                 <div className="w-full p-2 bg-teal-600 text-white rounded text-center text-sm">Science Stream</div>
                 <div className="flex justify-around mt-2">
                           <div className="w-px h-4 bg-gray-700"></div>
                           <div className="w-px h-4 bg-gray-700"></div>
                 </div>
                 <div className="flex justify-around">
                           <div className="w-[80%] mx-auto border-t-2 border-gray-700"></div>
                 </div>
                 <div className="flex justify-around text-center text-xs mt-2">
                           <div className="p-1 bg-gray-900/50 rounded">PCM</div>
                           <div className="p-1 bg-gray-900/50 rounded">PCB</div>
                 </div>
            </div>
        )
    },
    {
        title: "Connect With Mentors",
        description: "Chat with our AI mentor for instant answers or book one-on-one sessions with experienced seniors from top universities to get real-world advice.",
        visual: (
             <div className="w-full h-full bg-gray-800 rounded-lg p-4 border border-gray-700 text-sm">
                 <div className="w-full h-8 bg-gray-900 rounded mb-4 flex items-center px-2 gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                 <h3 className="font-bold text-teal-300 text-lg mb-2">Find a Mentor</h3>
                 <div className="bg-gray-900/50 p-2 rounded-lg flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=ananya" alt="Ananya Sharma" className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold text-gray-200">Ananya Sharma</p>
                        <p className="text-sm text-gray-400">IIT Delhi</p>
                    </div>
                 </div>
                  <div className="bg-gray-900/50 p-2 rounded-lg flex items-center gap-3 mt-2 opacity-70">
                    <img src="https://i.pravatar.cc/150?u=rohan" alt="Rohan Verma" className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold text-gray-200">Rohan Verma</p>
                        <p className="text-sm text-gray-400">AIIMS Delhi</p>
                    </div>
                 </div>
            </div>
        )
    }
];

const ScrollingFeature = () => {
    const featureRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: featureRef, offset: ["start start", "end end"] });

    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        // Subscribe to scroll progress changes
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const slidesCount = featureSlides.length;
            const newActiveSlide = Math.min(slidesCount - 1, Math.floor(latest * slidesCount));
            if (newActiveSlide !== activeSlide) {
                setActiveSlide(newActiveSlide);
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [scrollYProgress, activeSlide]);

    return (
        <div ref={featureRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    {/* Left side: Text content */}
                    <div className="relative h-96">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide}
                                className="absolute inset-0 flex flex-col justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-2 text-teal-400 font-bold mb-3">
                                    <CheckCircleIcon />
                                    <span>STEP {activeSlide + 1}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-100 mb-4">{featureSlides[activeSlide].title}</h3>
                                <p className="text-lg text-gray-400">{featureSlides[activeSlide].description}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right side: Visuals */}
                    <div className="relative w-full h-[50vh] max-h-[500px] hidden md:block">
                        {featureSlides.map((slide, index) => (
                             <motion.div
                                 key={index}
                                 className="absolute inset-0"
                                 animate={{
                                     opacity: activeSlide === index ? 1 : 0.3,
                                     scale: activeSlide === index ? 1 : 0.95,
                                     y: (index - activeSlide) * 20
                                 }}
                                 transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                 {slide.visual}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const AnimatedWords = ({ text, el: Wrapper = "p", className, variants, stagger }) => {
    const words = text.split(" ");
    return (
        <Wrapper className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                variants={{
                    hidden: { opacity: 0 },
                    visible: (i = 1) => ({
                        opacity: 1,
                        transition: { staggerChildren: stagger || 0.1, delayChildren: i * 0.04 },
                    }),
                }}
                initial="hidden"
                animate="visible"
                aria-hidden
            >
                {words.map((word, i) => (
                    <motion.span variants={variants} key={i} className="inline-block">
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};


const careerTags = [
    { text: "Engineer", top: "15%", duration: 18, delay: 0 },
    { text: "Doctor", top: "30%", duration: 22, delay: 2 },
    { text: "Designer", top: "45%", duration: 20, delay: 5 },
    { text: "Pilot", top: "60%", duration: 25, delay: 1 },
    { text: "IAS", top: "22%", duration: 19, delay: 7 },
    { text: "Scientist", top: "55%", duration: 23, delay: 4 },
    { text: "Lawyer", top: "38%", duration: 26, delay: 8 },
    { text: "Architect", top: "65%", duration: 17, delay: 3 },
    { text: "CA", top: "10%", duration: 24, delay: 6 },
    { text: "Journalist", top: "75%", duration: 21, delay: 9 },
];

const FloatingCareerTags = () => {
    return (
        <div className="absolute inset-0 top-0 h-[85%] w-full overflow-hidden pointer-events-none z-0">
            {careerTags.map((tag) => (
                <motion.div
                    key={tag.text}
                    className="absolute bg-purple-900/40 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg border border-purple-700/50 whitespace-nowrap"
                    style={{ top: tag.top }}
                    initial={{ x: "100vw" }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: tag.duration,
                        delay: tag.delay,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    {tag.text}
                </motion.div>
            ))}
        </div>
    );
};


const HomePage = () => {
    const { setPage } = useNavigation();
    
    const subheadlineText = "Navigate from confusion to clarity. Personalized guidance for Class 10 & 12 students in India.";

    const textRevealVariant = {
        hidden: { y: "110%", opacity: 0.8 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    return (
        <div className="flex-grow overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-gray-950 text-center py-24 sm:py-32 overflow-hidden">
                <FloatingCareerTags />
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <motion.div 
                    className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-aurora-bg opacity-20 animate-aurora"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2, transition: { duration: 1.5, ease: 'easeOut' } }}
                ></motion.div>

                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-gray-100" style={{lineHeight: 1.2}}>
                        <span className="overflow-hidden inline-block"><motion.span className="inline-block" variants={textRevealVariant} initial="hidden" animate="visible">Your Compass for the</motion.span></span>
                        <br/>
                        <span className="overflow-hidden inline-block"><motion.span className="inline-block text-teal-400" variants={textRevealVariant} initial="hidden" animate="visible" transition={{delay: 0.15}}>Crossroads of Career.</motion.span></span>
                    </h1>
                    
                    <AnimatedWords 
                        text={subheadlineText} 
                        el="p" 
                        className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                        }}
                        stagger={0.03}
                    />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
                      <Button onClick={() => setPage('whyGraduation')} className="text-lg px-8 py-4">
                          Find Your Path <ArrowRightIcon/>
                      </Button>
                    </motion.div>
                </div>
            </section>
            
            {/* How it works - REBUILT */}
            <section className="bg-black">
                <div className="container mx-auto px-6 text-center pt-20">
                    <h2 className="text-4xl font-bold text-teal-400 mb-4">A Clear Path in 3 Simple Steps</h2>
                    <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">We've streamlined the complex process of career discovery into a journey you can trust.</p>
                </div>
                <ScrollingFeature />
            </section>
            
             {/* Mentors Section */}
            <AnimatedSection className="py-20 bg-gray-950">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-teal-400 mb-4">Meet Our Mentors</h2>
                    <p className="text-lg text-center text-gray-500 mb-12 max-w-2xl mx-auto">Get guidance from students who've walked the path before you.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockMentors.map((mentor, index) => (
                            <MentorProfileCard key={mentor.id} mentor={mentor} index={index} />
                        ))}
                    </div>
                </div>
            </AnimatedSection>
            
             {/* Testimonials */}
            <AnimatedSection className="py-20 bg-black">
                <div className="container mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center text-teal-400 mb-4">Trusted by Students Across India</h2>
                    <p className="text-lg text-center text-gray-500 mb-12 max-w-2xl mx-auto">Hear from students who found clarity and direction with NextStepGuide.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} index={index} />
                        ))}
                    </div>
                </div>
            </AnimatedSection>
            
            <div className="text-center py-10 bg-black text-teal-400 font-semibold">
                Built by Team Vision Coders at AKGEC
            </div>

        </div>
    );
};

const MentorProfileCard = ({ mentor, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: index * 0.15 } }
    };
    
    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, y: -8, boxShadow: "0px 15px 30px rgba(0,0,0,0.4)" }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center"
        >
            <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg border-2 border-gray-700" />
            <h3 className="font-bold text-lg text-gray-100">{mentor.name}</h3>
            <p className="text-sm text-teal-400">{mentor.field}</p>
            <p className="text-sm text-gray-500">{mentor.college}</p>
        </motion.div>
    );
};


const TestimonialCard = ({ quote, name, class: studentClass, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: index * 0.2 } }
    };
    
    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <Card className="p-6 flex flex-col h-full">
                <p className="text-gray-300 italic flex-grow">"{quote}"</p>
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="font-bold text-teal-400">{name}</p>
                    <p className="text-sm text-gray-500">{studentClass}</p>
                </div>
            </Card>
        </motion.div>
    );
};

const LoginPage = () => {
    const { login } = useAuth();
    const { setPage } = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, you'd call an API here.
        if(email && password) {
            login({ email });
            setPage('dashboard');
        } else {
            alert("Please enter email and password.");
        }
    };
    
    return (
        <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-teal-400">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md -space-y-px">
                        <div>
                            <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                        </div>
                        <div>
                            <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full">Sign in</Button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a onClick={() => setPage('signup')} className="font-medium text-teal-500 hover:underline cursor-pointer">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};


const SignupPage = () => {
    const { login } = useAuth();
    const { setPage } = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        if(name && email && password) {
            login({ name, email });
            setPage('dashboard');
        } else {
            alert("Please fill all fields.");
        }
    };
    
    return (
        <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-teal-400">Create a new account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="rounded-md -space-y-px">
                         <div>
                            <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Full Name" />
                        </div>
                        <div>
                            <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                        </div>
                        <div>
                            <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full">Sign up</Button>
                    </div>
                </form>
                 <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a onClick={() => setPage('login')} className="font-medium text-teal-500 hover:underline cursor-pointer">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

const WhyGraduationPage = () => {
    const { setPage } = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="flex-grow container mx-auto px-6 py-12 flex flex-col min-h-[calc(100vh-140px)]">
            <motion.h1 
                className="text-4xl font-bold text-teal-400 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                Why Graduation?
            </motion.h1>
            <div className="flex-grow space-y-4 max-w-4xl">
                {whyGraduationData.map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div 
                            className="bg-gray-900 border border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                            onClick={() => handleToggle(index)}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-100">{item.title}</h2>
                                <motion.div animate={{ rotate: expandedIndex === index ? 45 : 0 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </motion.div>
                            </div>
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-gray-400">{item.description}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-12 flex justify-end">
                <Button onClick={() => setPage('userTypeSelection')}>
                    Next <ArrowRightIcon />
                </Button>
            </div>
        </div>
    );
};

// --- NEW MENTOR FLOW COMPONENTS ---

const UserTypeSelectionPage = () => {
    const { setPage } = useNavigation();

    return (
        <div className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center">
            <div>
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Choose Your Role</h1>
                <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                    Are you a student looking for guidance, or an experienced mentor ready to share your knowledge?
                </p>
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <Card className="text-center p-8 flex flex-col items-center cursor-pointer" onClick={() => setPage('pathways')}>
                        <SchoolIcon className="w-16 h-16 text-teal-400 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-100 mb-4">I'm a Student</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Discover your ideal career path, explore colleges, and connect with mentors to make informed decisions about your future.
                        </p>
                        <Button>
                            Start as a Student <ArrowRightIcon />
                        </Button>
                    </Card>
                    
                    <Card className="text-center p-8 flex flex-col items-center cursor-pointer" onClick={() => setPage('mentorLogin')}>
                        <BriefcaseIcon className="w-16 h-16 text-purple-400 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-100 mb-4">I'm a Mentor</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Share your valuable college experiences and career insights to guide the next generation of students.
                        </p>
                        <Button className="bg-purple-600 hover:bg-purple-500 focus-visible:ring-purple-500 shadow-purple-900/20 hover:shadow-purple-800/40">
                            Join as a Mentor <ArrowRightIcon />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const MentorLoginPage = () => {
    const { setPage, setMentorFlowState } = useNavigation();
    const [year, setYear] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleProceed = () => {
        if (!year) {
            setModalMessage("Please select your current academic year to proceed.");
            setIsModalOpen(true);
            return;
        }
        
        if (['1st', '2nd', '3rd'].includes(year)) {
            setModalMessage("Thank you for your interest! Currently, we are only accepting mentors who are in their 4th year or have graduated, to ensure they have comprehensive experience to share. Please check back with us in the future!");
            setIsModalOpen(true);
        } else {
            setMentorFlowState({ academicYear: year });
            setPage('mentorRegistration');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-950 py-12 px-4">
            <Card className="max-w-xl w-full p-8 text-center">
                <h1 className="text-3xl font-bold text-teal-400 mb-4">Mentor Eligibility Check</h1>
                <p className="text-gray-400 mb-8">
                    To provide the best guidance, we require our mentors to be in their final year of college or to have graduated. Please select your current status.
                </p>
                <div className="space-y-4 max-w-sm mx-auto">
                    {['1st', '2nd', '3rd', '4th', 'Pass Out'].map(option => (
                        <label key={option} className={`block w-full text-left p-4 bg-gray-800 text-gray-200 border-2 rounded-lg cursor-pointer transition-all duration-200 ${year === option ? 'border-teal-500 bg-gray-700' : 'border-gray-700 hover:border-gray-600'}`}>
                            <input type="radio" name="year" value={option} checked={year === option} onChange={e => setYear(e.target.value)} className="hidden"/>
                            {option} Year {option === 'Pass Out' && '(Graduated)'}
                        </label>
                    ))}
                </div>
                <Button onClick={handleProceed} className="mt-8 px-8 py-3 text-lg">
                    Proceed
                </Button>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Eligibility Information">
                <p className="text-gray-300">{modalMessage}</p>
                <div className="text-right mt-6">
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

const MentorRegistrationPage = () => {
    const { addMentorReview } = useData();
    const { setPage, mentorFlowState } = useNavigation();
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', college: '', qualifications: '',
        job: '', cgpa: '', reviewTitle: '', reviewText: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = addMentorReview({ ...formData, academicYear: mentorFlowState.academicYear });
        if (success) {
            setPage('mentorSuccess');
        }
    };

    return (
        <div className="flex-grow bg-gray-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="p-8">
                    <h1 className="text-3xl font-bold text-teal-400 mb-2">Mentor Registration</h1>
                    <p className="text-gray-400 mb-8">Thank you for helping other students. Please fill out your details below.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                            <InputField name="age" label="Age" type="number" value={formData.age} onChange={handleChange} required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <SelectField name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['', 'Male', 'Female', 'Other', 'Prefer not to say']} required />
                            <InputField name="cgpa" label="Last Year's CGPA/Percentage" value={formData.cgpa} onChange={handleChange} placeholder="e.g., 8.5 or 85%" required />
                        </div>
                        
                        <InputField name="college" label="College Name" value={formData.college} onChange={handleChange} placeholder="e.g., Indian Institute of Technology, Delhi" required list="college-list" />
                        <datalist id="college-list">
                            {mockColleges.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>

                        <InputField name="qualifications" label="Your Degree/Qualifications" value={formData.qualifications} onChange={handleChange} placeholder="e.g., B.Tech in Computer Science" required />
                        
                        {mentorFlowState.academicYear === 'Pass Out' && (
                           <InputField name="job" label="Current Job (if any)" value={formData.job} onChange={handleChange} placeholder="e.g., Software Engineer at Google" />
                        )}

                        <div className="pt-6 border-t border-gray-800">
                             <h2 className="text-xl font-semibold text-gray-200 mb-4">Your College Review</h2>
                             <InputField name="reviewTitle" label="Review Title" value={formData.reviewTitle} onChange={handleChange} placeholder="e.g., A Hub of Innovation and Opportunities" required />
                             <TextAreaField name="reviewText" label="Your Detailed Review" value={formData.reviewText} onChange={handleChange} placeholder="Share what you liked, disliked, the best parts, and any advice for future students..." required />
                        </div>

                        <div className="text-right">
                            <Button type="submit" className="px-8 py-3">Submit Review</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input id={props.name} {...props} className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 sm:text-sm" />
    </div>
);
const SelectField = ({ label, options, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <select id={props.name} {...props} className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 sm:text-sm">
            {options.map(opt => <option key={opt} value={opt} disabled={opt === ''}>{opt || 'Select...'}</option>)}
        </select>
    </div>
);
const TextAreaField = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea id={props.name} {...props} rows="5" className="appearance-none block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 sm:text-sm"></textarea>
    </div>
);

const MentorSuccessPage = () => {
    const { setPage } = useNavigation();
    return (
        <div className="flex-grow flex items-center justify-center text-center bg-gray-950 py-12 px-4">
            <Card className="max-w-xl w-full p-12">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}>
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
                </motion.div>
                <h1 className="text-3xl font-bold text-teal-400 mt-6 mb-4">Submission Successful!</h1>
                <p className="text-lg text-gray-300 mb-8">
                    Thank you for sharing your valuable experience. Your review has been submitted and will help countless students make better career decisions.
                </p>
                <Button onClick={() => setPage('home')}>
                    Back to Home
                </Button>
            </Card>
        </div>
    );
};

// --- END OF MENTOR FLOW COMPONENTS ---

const PathwaysPage = () => {
    const { setPage, setQuizType } = useNavigation();
    const { user, updateUserProfile } = useAuth();

    const handleSelection = (level, stream = null) => {
        updateUserProfile({ level, stream });
        setQuizType({ level, stream });
        setPage('quiz');
    };

    return (
        <div className="flex-grow container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center text-teal-400 mb-12">Choose Your Journey</h1>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Class 10 Card */}
                <Card className="text-center p-8 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-gray-100 mb-4">Class 10 Students</h2>
                    <p className="text-gray-400 mb-6">Confused about which stream to choose? Take our aptitude quiz to discover your strengths and find the perfect path for you.</p>
                    <Button onClick={() => handleSelection('class10')}>
                        Start Class 10 Quiz
                    </Button>
                </Card>
                
                {/* Class 12 Card */}
                <Card className="p-8">
                    <h2 className="text-3xl font-bold text-gray-100 mb-4 text-center">Class 12 Students</h2>
                    <p className="text-gray-400 mb-6 text-center">You've chosen your stream. Now, let's map your skills to specific career fields and educational pathways.</p>
                    <div className="flex flex-col space-y-4">
                        <Button onClick={() => handleSelection('class12', 'Science')} variant="secondary" className="w-full">Science</Button>
                        <Button onClick={() => handleSelection('class12', 'Commerce')} variant="secondary" className="w-full">Commerce</Button>
                        <Button onClick={() => handleSelection('class12', 'Arts')} variant="secondary" className="w-full">Arts</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const QuizPage = () => {
    const { quizType, setPage, setQuizResult } = useNavigation();
    const { user, updateUserProfile } = useAuth();
    
    const quiz = quizType.level === 'class10' ? mockQuizData.class10 : mockQuizData.class12[quizType.stream];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (option) => {
        const newAnswers = { ...answers };
        if (quizType.level === 'class10') {
            newAnswers[quiz.questions[currentQuestionIndex].id] = option.stream;
        } else {
             newAnswers[quiz.questions[currentQuestionIndex].id] = option.field;
        }
        setAnswers(newAnswers);

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz finished
            calculateResults(newAnswers);
        }
    };

    const calculateResults = (finalAnswers) => {
        const counts = {};
        Object.values(finalAnswers).forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });

        const result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        const quizRecord = {
            date: new Date().toISOString(),
            type: `${quizType.level} - ${quizType.stream || ''}`,
            result: result
        };

        updateUserProfile({ quizHistory: [...user.quizHistory, quizRecord] });
        setQuizResult(result);
        setPage('results');
    };
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="flex-grow bg-gray-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8">
                <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">{quiz.title}</h1>
                <p className="text-center text-gray-400 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-200 mb-8 min-h-[56px]">{currentQuestion.text}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleAnswer(option)}
                                className="w-full text-left p-4 bg-gray-800 text-gray-200 border-2 border-gray-700 rounded-lg hover:bg-gray-700 hover:border-teal-500 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-900 focus-visible:ring-teal-500"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ResultsPage = () => {
    const { quizResult, quizType, setPage } = useNavigation();
    const [aiContent, setAiContent] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // State for the mind map modal
    const [isInteractiveMapOpen, setInteractiveMapOpen] = useState(false);
    const [currentMapData, setCurrentMapData] = useState(null);
    const [currentMapTitle, setCurrentMapTitle] = useState('');

    // State to toggle visibility of other stream options
    const [showOtherStreams, setShowOtherStreams] = useState(false);
    // State to toggle visibility of other career options for class 12
    const [showOtherCareers, setShowOtherCareers] = useState(false);


    // Function to open the mind map modal with specific data
    const openMapForStream = (streamKey) => {
        let data, title;
        if (quizType.level === 'class10') {
            data = mockMindMapData[streamKey];
            title = `Interactive Map for ${streamKey} Stream`;
        } else { // For Class 12
            data = mockFieldMindMapData[streamKey];
            title = `Interactive Map for ${streamKey}`;
        }
        
        setCurrentMapData(data);
        setCurrentMapTitle(title);
        setInteractiveMapOpen(true);
    };


    const getAiInsights = async () => {
        setIsLoadingAi(true);
        setAiContent('');

        const systemPrompt = "You are a friendly and encouraging career counselor for Indian students. Your goal is to provide clear, detailed, and inspiring information based on their aptitude test results. Structure your response clearly using headings (like **Heading**) and bullet points (like * item).";
        
        let userQuery = "";
        if (quizType.level === 'class10') {
            userQuery = `I am a Class 10 student in India, and my aptitude quiz suggests I should pursue the ${quizResult} stream. Please provide a comprehensive overview of this stream. Cover the following aspects:\n1. **Core Subjects**: What are the main subjects?\n2. **Subject Combinations**: What are the different groups (e.g., PCM, PCB for Science)?\n3. **Degree Courses**: What popular degrees can I pursue after 12th grade?\n4. **Career Paths**: What are some traditional and emerging career options?\n5. **Key Skills**: What skills should I focus on developing?`;
        } else { // class 12
            userQuery = `I am a Class 12 student in India from the ${quizType.stream} stream. My skill mapping quiz suggests I have an aptitude for the field of ${quizResult}. Please provide a detailed guide on this career path. Include:\n1. **Introduction to the Field**: What is this field about?\n2. **Educational Pathways**: What degrees, diplomas, or certifications are needed?\n3. **Top Entrance Exams**: Which major entrance exams should I prepare for?\n4. **Key Skills**: What skills are crucial for success in this field?\n5. **Job Prospects**: What are the job opportunities and potential roles in India?`;
        }

        const apiKey = ""; // This will be provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: userQuery }] }],
                })
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                setAiContent(text);
            } else {
                setAiContent("Sorry, I couldn't generate insights at this time. Please try again later.");
            }

        } catch (error) {
            console.error("Gemini API call error:", error);
            setAiContent("An error occurred while fetching insights. Please check your connection and try again.");
        } finally {
            setIsLoadingAi(false);
        }
    };

    return (
        <>
        <div className="flex-grow container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-teal-400">Your Quiz Results</h1>
                <p className="text-xl text-gray-400 mt-2">Based on your answers, we recommend the following path:</p>
                <div className="inline-block bg-gray-800 text-teal-300 text-2xl font-bold px-6 py-3 rounded-full my-6 border border-gray-700">
                    {quizResult}
                </div>
            </div>
            
             <div className="text-center mb-12">
                 <Button onClick={() => openMapForStream(quizResult)}>
                    <CompassIcon /> 
                    {quizType.level === 'class10' 
                        ? 'Explore Interactive Stream Map' 
                        : 'Explore Interactive Career Map'}
                 </Button>
            </div>

            {/* --- "Explore other options" for Class 10 --- */}
            {quizType.level === 'class10' && (
                <div className="text-center mb-12">
                    <Button
                        variant="secondary"
                        onClick={() => setShowOtherStreams(!showOtherStreams)}
                    >
                        Explore Other Options
                    </Button>
                    <AnimatePresence>
                        {showOtherStreams && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="flex justify-center flex-wrap gap-4"
                            >
                                {Object.keys(mockMindMapData)
                                    .map(stream => (
                                        <Button
                                            key={stream}
                                            variant="outline"
                                            onClick={() => openMapForStream(stream)}
                                        >
                                            {stream}
                                        </Button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            {/* --- NEW SECTION: "Explore other career options" for Class 12 --- */}
            {quizType.level === 'class12' && (
                <div className="text-center mb-12">
                    <Button
                        variant="secondary"
                        onClick={() => setShowOtherCareers(!showOtherCareers)}
                    >
                        Explore Other Career Options
                    </Button>
                    <AnimatePresence>
                        {showOtherCareers && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="flex justify-center flex-wrap gap-4"
                            >
                                {Object.keys(mockFieldMindMapData)
                                    .map(field => (
                                        <Button
                                            key={field}
                                            variant="outline"
                                            onClick={() => openMapForStream(field)}
                                        >
                                            {field}
                                        </Button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}


            <Card className="p-8 text-center bg-gray-900/50">
                <h2 className="text-3xl font-bold text-teal-400 mb-4">Go Deeper with AI</h2>
                <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">Get a detailed, personalized explanation of your recommended path, including career options, key skills, and more.</p>
                <Button onClick={getAiInsights} disabled={isLoadingAi}>
                    <SparkleIcon/> {isLoadingAi ? 'Generating...' : 'Get AI-Powered Career Insights'}
                </Button>

                {isLoadingAi && (
                    <div className="mt-8">
                        <LoadingSpinner size="sm"/>
                        <p className="text-gray-400 mt-2">Our AI is crafting your personalized guide...</p>
                    </div>
                )}
                
                {aiContent && !isLoadingAi && (
                    <div className="mt-8 p-6 bg-gray-950 rounded-lg border border-gray-800 text-left whitespace-pre-wrap font-sans text-gray-300">
                        {aiContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-teal-400">$1</strong>').split('* ').map((part, i) => i > 0 ? <p key={i} className="ml-4 before:content-[\'•\'] before:mr-2">{part}</p> : <div key={i} dangerouslySetInnerHTML={{__html: part.replace(/\n/g, '<br />')}} />)}
                    </div>
                )}
            </Card>

            <div className="text-center mt-12">
                <Button onClick={() => setPage('colleges')}>Explore Colleges for {quizResult}</Button>
            </div>
        </div>
        <InteractiveMindMap 
            isOpen={isInteractiveMapOpen} 
            onClose={() => setInteractiveMapOpen(false)}
            data={currentMapData}
            title={currentMapTitle}
        />
        </>
    );
};


const MindMapNode = ({ node, isRoot = false }) => {
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div className={`flex ${isRoot ? 'justify-center' : 'items-start'} my-2`}>
        {!isRoot && <div className="w-8 h-px bg-gray-700 mt-5 mr-2"></div>}
        <div className="flex flex-col items-start">
            <div className={`mindmap-node ${isRoot ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-200'} border border-gray-700 shadow-sm rounded-md px-4 py-2 text-center inline-block`}>
                {node.name}
            </div>
            {hasChildren && (
                <div className="pl-8 pt-4 border-l-2 border-gray-700 ml-4">
                    {node.children.map((child, index) => (
                        <MindMapNode key={index} node={child} />
                    ))}
                </div>
            )}
        </div>
      </div>
    );
};

// --- START: INTERACTIVE MIND MAP COMPONENTS ---

const InteractiveMindMapNode = ({ node, level = 0, parentId = 'root' }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2);
    const hasChildren = node.children && node.children.length > 0;
    const nodeId = `${parentId}-${node.name.replace(/\s+/g, '-')}`;

    const colors = [
        "bg-teal-600 border-teal-500",
        "bg-sky-600 border-sky-500",
        "bg-indigo-600 border-indigo-500",
        "bg-purple-600 border-purple-500",
        "bg-pink-600 border-pink-500",
    ];
    const nodeColor = colors[level % colors.length];

    const handleToggle = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };
    
    return (
        <motion.div 
            className="relative flex items-center my-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: level * 0.05 }}
        >
            <div className={`node-connector ${level > 0 ? 'border-l-2' : ''} border-gray-700 absolute h-full left-5 top-0`}></div>
            <motion.div
                id={nodeId}
                onClick={handleToggle}
                className={`${nodeColor} text-white rounded-lg px-4 py-2 z-10 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-white/10`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
            >
                {hasChildren && <span className="mr-2">{isExpanded ? '−' : '+'}</span>}
                {node.name}
            </motion.div>
            
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div 
                        className="pl-12 pt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {node.children.map((child, index) => (
                           <InteractiveMindMapNode key={index} node={child} level={level + 1} parentId={nodeId} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const InteractiveMindMap = ({ isOpen, onClose, data, title }) => {
    return (
        <AnimatePresence>
            {isOpen && data && (
                <motion.div
                    className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm z-[100] flex flex-col p-4 sm:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="flex-shrink-0 flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-2">{title}</h2>
                            <p className="text-sm text-gray-400 max-w-lg">
                                Welcome to your interactive map! Click on any node with a [+] icon to expand it and discover more detailed pathways. 
                                Click a node with a [−] icon to collapse it. This allows you to explore the various options at your own pace.
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-4xl ml-4 flex-shrink-0">&times;</button>
                    </div>

                    <div className="flex-grow bg-black/30 border border-gray-800 rounded-lg p-6 overflow-auto">
                        <InteractiveMindMapNode node={data} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
// --- END: INTERACTIVE MIND MAP COMPONENTS ---


const CollegesPage = () => {
    const { setPage, setSelectedCollegeId } = useNavigation();
    const [colleges] = useState(mockColleges);
    const [filteredColleges, setFilteredColleges] = useState(mockColleges);
    const [filters, setFilters] = useState({ search: '', location: '', exam: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const collegesPerPage = 4;
    
    useEffect(() => {
        let result = colleges.filter(college => 
            college.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            (filters.location === '' || college.location === filters.location) &&
            (filters.exam === '' || college.exams.includes(filters.exam))
        );
        setFilteredColleges(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [filters, colleges]);
    
    const uniqueLocations = [...new Set(mockColleges.map(c => c.location))];
    const uniqueExams = [...new Set(mockColleges.flatMap(c => c.exams))];
    
    // Pagination logic
    const indexOfLastCollege = currentPage * collegesPerPage;
    const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
    const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege);
    const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);
    
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleCollegeSelect = (id) => {
        setSelectedCollegeId(id);
        setPage('collegeDetail');
    };

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Find Your College</h1>
                <p className="text-lg text-center text-gray-400 mb-8">Filter through our directory of verified institutions.</p>
                
                {/* Filters */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 grid md:grid-cols-3 gap-4">
                    <input 
                        type="text" 
                        placeholder="Search by name..."
                        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
                        onChange={e => setFilters({...filters, search: e.target.value})}
                    />
                     <select className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50" onChange={e => setFilters({...filters, location: e.target.value})}>
                        <option value="">All Locations</option>
                        {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                     <select className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50" onChange={e => setFilters({...filters, exam: e.target.value})}>
                        <option value="">All Exams</option>
                        {uniqueExams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                    </select>
                </div>
                
                {/* College Listings */}
                <div className="grid md:grid-cols-2 gap-8">
                    {currentColleges.length > 0 ? currentColleges.map(college => (
                        <CollegeCard key={college.id} college={college} onSelect={handleCollegeSelect} />
                    )) : <p className="text-center col-span-2 text-gray-500">No colleges match your criteria.</p>}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`mx-1 px-4 py-2 rounded-md ${currentPage === number ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CollegeCard = ({ college, onSelect }) => (
    <Card className="cursor-pointer" onClick={() => onSelect(college.id)}>
        <div className="h-48 bg-gray-950 flex items-center justify-center">
            <img src={college.image} alt={college.name} className="w-full h-full object-cover"/>
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-100">{college.name}</h3>
            <p className="text-gray-400 mb-2">{college.location}</p>
            <div className="flex items-center mb-4">
                <StarIcon/>
                <span className="ml-1 text-yellow-400 font-bold">{college.rating}</span>
                <span className="ml-4 text-sm bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{college.type}</span>
            </div>
            <p className="text-sm text-gray-400"><strong>Exams:</strong> {college.exams.join(', ')}</p>
        </div>
    </Card>
);

const MentorReviewCard = ({ mentor }) => {
    const isPositive = mentor.reviewType === 'positive';
    return (
        <div className={`bg-gray-900 border ${isPositive ? 'border-green-800/50' : 'border-red-800/50'} rounded-lg p-6 shadow-lg`}>
            <div className="flex items-start gap-4 mb-4">
                <img src={mentor.image} alt={mentor.name} className="w-20 h-20 rounded-full border-2 border-gray-700"/>
                <div>
                    <h4 className="font-bold text-lg text-gray-100">{mentor.name}</h4>
                    <p className="text-sm text-gray-400">{mentor.status}</p>
                    <p className="text-sm text-gray-400">{mentor.branch}</p>
                </div>
            </div>
            <div className="mb-4 space-y-1 text-sm">
                <p className="text-gray-300"><strong className="text-gray-400">Qualifications:</strong> {mentor.qualifications}</p>
                <p className="text-gray-300"><strong className="text-gray-400">Achievements:</strong> {mentor.achievements}</p>
            </div>
            <div className="border-t border-gray-800 pt-4">
                 <h5 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
                    <span>{mentor.reviewTitle}</span>
                </h5>
                <p className="text-gray-300 italic">"{mentor.reviewText}"</p>
            </div>
        </div>
    );
};

const CollegeDetailPage = () => {
    const { selectedCollegeId, setPage } = useNavigation();
    const { collegeMentors } = useData(); // Use context to get potentially updated mentor data
    const college = mockColleges.find(c => c.id === selectedCollegeId);
    const mentors = collegeMentors[selectedCollegeId];

    if (!college) {
        return <div className="flex-grow flex items-center justify-center">College not found.</div>;
    }

    return (
       <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('colleges')} variant="secondary" className="mb-8">
                    &larr; Back to Colleges
                </Button>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <img src={college.image.replace('600x400', '1200x600')} alt={college.name} className="w-full h-auto object-cover rounded-lg mb-6 shadow-2xl"/>
                        <h1 className="text-4xl font-bold text-teal-400 mb-2">{college.name}</h1>
                        <p className="text-lg text-gray-400 mb-6">{college.location}</p>
                        
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-100 mb-4">Courses & Speciality</h2>
                            <p className="text-gray-300 mb-4"><strong>Speciality:</strong> {college.specialty}</p>
                            <div className="flex flex-wrap gap-2">
                                {college.courses.map(course => (
                                    <span key={course} className="bg-gray-800 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">{course}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-24">
                            <h3 className="text-2xl font-bold text-gray-100 mb-4">Key Info</h3>
                             <div className="flex items-center mb-4 text-xl">
                                <StarIcon/>
                                <span className="ml-2 text-yellow-400 font-bold">{college.rating} / 5.0</span>
                            </div>
                            <p className="text-gray-300 mb-2"><strong>Type:</strong> <span className="bg-gray-800 px-2 py-1 rounded-full text-sm">{college.type}</span></p>
                            <p className="text-gray-300"><strong>Exams:</strong> {college.exams.join(', ')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">Mentor Reviews</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {mentors && mentors.length > 0 ? (
                            mentors.map(mentor => <MentorReviewCard key={mentor.name} mentor={mentor}/>)
                        ) : (
                            <p className="text-center col-span-2 text-gray-500">No mentor reviews available for this college yet.</p>
                        )}
                    </div>
                </div>
            </div>
           </div>
    );
};

const MentorsPage = () => {
    const [mentors, setMentors] = useState(mockMentors);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const { user, updateUserProfile } = useAuth();
    
    const openBookingModal = (mentor) => {
        if(!user) {
            alert("Please log in to book a session.");
            return;
        }
        setSelectedMentor(mentor);
        setIsModalOpen(true);
    };

    const handleBooking = () => {
        const newSession = {
            mentorName: selectedMentor.name,
            field: selectedMentor.field,
            date: new Date().toLocaleDateString(),
            status: 'Upcoming'
        };
        updateUserProfile({ sessions: [...user.sessions, newSession] });
        setIsModalOpen(false);
        alert(`Session with ${selectedMentor.name} booked successfully!`);
    };

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Connect with Mentors</h1>
                <p className="text-lg text-center text-gray-400 mb-12">Get one-on-one guidance from experienced students and alumni.</p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="sm:col-span-2 lg:col-span-4 bg-teal-900/20 border-teal-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                           <h3 className="font-bold text-2xl text-teal-300 flex items-center gap-2"><SparkleIcon/> AI Career Mentor</h3>
                           <p className="text-gray-400 mt-2">Have a quick question? Get instant answers about career paths, colleges, and skills from our AI assistant.</p>
                        </div>
                        <Button onClick={() => setIsAiChatOpen(true)} className="w-full md:w-auto flex-shrink-0">
                            Chat Now <ArrowRightIcon/>
                        </Button>
                    </Card>
                    {mentors.map(mentor => (
                        <MentorCard key={mentor.id} mentor={mentor} onBook={() => openBookingModal(mentor)} />
                    ))}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book a Session">
                {selectedMentor && (
                    <div>
                        <p className="text-lg mb-4 text-gray-300">You are booking a one-on-one mentorship session with:</p>
                        <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg mb-6">
                            <img src={selectedMentor.image} alt={selectedMentor.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <h4 className="font-bold text-xl text-gray-100">{selectedMentor.name}</h4>
                                <p className="text-gray-400">{selectedMentor.field} @ {selectedMentor.college}</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">A confirmation email with available time slots will be sent to your registered email address.</p>
                        <Button onClick={handleBooking} className="w-full">Confirm Booking</Button>
                    </div>
                )}
            </Modal>
            <AiMentorChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
        </div>
    );
};

const MentorCard = ({ mentor, onBook }) => (
    <Card className="text-center p-6 flex flex-col items-center">
        <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full mb-4 shadow-lg" />
        <h3 className="font-bold text-lg text-gray-100">{mentor.name}</h3>
        <p className="text-sm text-gray-500">{mentor.college}</p>
        <p className="text-gray-300 font-semibold my-2">{mentor.field}</p>
        <div className="flex items-center text-yellow-400">
            <StarIcon/> <span className="ml-1 font-bold">{mentor.rating}</span>
            <span className="text-gray-500 text-sm ml-2">({mentor.reviews} reviews)</span>
        </div>
        <Button onClick={onBook} variant="outline" className="mt-4 w-full">Book Session</Button>
    </Card>
);

const AiMentorChatModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm your AI Mentor. Ask me anything about career paths, college selection, required skills, or entrance exams." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const systemPrompt = "You are a helpful, friendly, and expert AI Career Mentor for students in India. Your name is 'NextStep AI'. Keep your answers concise, encouraging, and easy to understand. If a question is outside the scope of career/education guidance, politely decline to answer. Always format your responses for readability in a chat interface (using newlines).";
        const userQuery = currentInput;

        const apiKey = ""; // Provided by environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: userQuery }] }],
                })
            });

            if (!response.ok) throw new Error("API response error");

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                setMessages(prev => [...prev, { sender: 'ai', text }]);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't process that. Could you try rephrasing?" }]);
            }
        } catch (error) {
            console.error("Gemini API call error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having a little trouble connecting. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chat with AI Mentor">
            <div className="flex flex-col h-[60vh]">
                <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0"><SparkleIcon className="w-5 h-5 text-teal-400"/></div>}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                           <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0"><SparkleIcon className="w-5 h-5 text-teal-400"/></div>
                            <div className="px-4 py-3 bg-gray-800 rounded-2xl rounded-bl-none">
                                <div className="flex items-center justify-center gap-1">
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-0"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex-shrink-0 flex gap-2 pt-4 border-t border-gray-800">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about careers, colleges..."
                        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const { setPage } = useNavigation();

    if (!user) {
        return (
            <div className="flex-grow flex items-center justify-center text-center bg-gray-950">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Please log in to view your dashboard.</h2>
                    <Button onClick={() => setPage('login')}>Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-teal-400 mb-8">Welcome, {user.name}!</h1>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recommendations */}
                        <DashboardSection title="Your Progress">
                            <div className="text-center bg-gray-900/50 p-6 rounded-lg">
                               <p className="text-lg text-gray-300">You are on the <span className="font-bold text-teal-400">{user.level === 'class10' ? 'Class 10' : `Class 12 - ${user.stream}`}</span> pathway.</p>
                               {user.quizHistory.length > 0 ? (
                                   <p className="mt-2 text-gray-300">Your latest quiz result suggests a focus on <span className="font-bold text-teal-400">{user.quizHistory[user.quizHistory.length - 1].result}</span>.</p>
                               ) : (
                                   <div className="mt-4">
                                       <p className="text-gray-400">You haven't taken a quiz yet. Find your path now!</p>
                                       <Button onClick={() => setPage('pathways')} className="mt-2">Take a Quiz</Button>
                                   </div>
                               )}
                            </div>
                        </DashboardSection>
                        
                        {/* Upcoming Sessions */}
                        <DashboardSection title="Upcoming Mentorship Sessions">
                            {user.sessions && user.sessions.length > 0 ? (
                                <ul className="space-y-3">
                                {user.sessions.map((session, i) => (
                                    <li key={i} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-100">{session.mentorName} ({session.field})</p>
                                            <p className="text-sm text-gray-400">Booked on {session.date}</p>
                                        </div>
                                        <span className="text-sm bg-green-900/50 text-green-300 px-3 py-1 rounded-full">{session.status}</span>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No upcoming sessions. <a onClick={() => setPage('mentors')} className="text-teal-500 cursor-pointer hover:underline">Find a mentor</a>.</p>
                            )}
                        </DashboardSection>

                         {/* Quiz History */}
                        <DashboardSection title="Quiz History">
                           {user.quizHistory && user.quizHistory.length > 0 ? (
                                <ul className="space-y-3">
                                {user.quizHistory.map((quiz, i) => (
                                    <li key={i} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-100">{quiz.type}</p>
                                            <p className="text-sm text-gray-400">Taken on {new Date(quiz.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-teal-400">{quiz.result}</span>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">You have no quiz history yet.</p>
                            )}
                        </DashboardSection>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <DashboardSection title="Profile">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <button className="text-sm text-teal-500 hover:underline mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1">Edit Profile</button>
                            </div>
                        </DashboardSection>
                        
                        {/* Bookmarked Colleges - Feature to be implemented */}
                        <DashboardSection title="Bookmarked Colleges">
                            <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">You haven't bookmarked any colleges yet.</p>
                        </DashboardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardSection = ({ title, children }) => (
    <Card className="p-6">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">{title}</h2>
        {children}
    </Card>
);

// This is a mock admin panel, in reality it would have robust controls.
const AdminPage = () => {
    return (
        <div className="flex-grow container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center text-teal-400 mb-12">Admin Panel</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AdminCard title="Manage Quizzes" description="Add, edit, or remove quiz questions and options."/>
                <AdminCard title="Manage Colleges" description="Update college listings, verify data, and manage reviews."/>
                <AdminCard title="Manage Mentors" description="Approve new mentors, view ratings, and manage profiles."/>
                <AdminCard title="User Management" description="View user data, handle support tickets, and manage roles."/>
                <AdminCard title="Analytics" description="View platform usage statistics and generate reports."/>
                <AdminCard title="Content Moderation" description="Review reported content and take necessary actions."/>
            </div>
        </div>
    );
};

const AdminCard = ({ title, description }) => (
    <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <Button variant="secondary">Manage</Button>
    </Card>
);


// --- MAIN APP COMPONENT & NAVIGATION ---

const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
    const [page, setPage] = useState('home');
    const [quizType, setQuizType] = useState(null); // { level: 'class10' } or { level: 'class12', stream: 'Science' }
    const [quizResult, setQuizResult] = useState(null);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const [mentorFlowState, setMentorFlowState] = useState(null); // For mentor registration flow data

    const contextValue = {
        page,
        setPage,
        quizType,
        setQuizType,
        quizResult,
        setQuizResult,
        selectedCollegeId,
        setSelectedCollegeId,
        mentorFlowState,
        setMentorFlowState,
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

const useNavigation = () => useContext(NavigationContext);

const App = () => {
    const { page } = useNavigation();
    const { loading, isAuthenticated } = useAuth();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);
    
    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-950"><LoadingSpinner/></div>
    }

    const renderPage = () => {
        // Unprotected mentor routes
        if (page === 'mentorLogin' || page === 'mentorRegistration' || page === 'mentorSuccess') {
             switch(page) {
                 case 'mentorLogin': return <MentorLoginPage />;
                 case 'mentorRegistration': return <MentorRegistrationPage />;
                 case 'mentorSuccess': return <MentorSuccessPage />;
                 default: return <HomePage />;
             }
        }
        
        // Protected routes (require login)
        const protectedRoutes = ['dashboard', 'pathways', 'quiz', 'results', 'collegeDetail'];
        if (protectedRoutes.includes(page) && !isAuthenticated) {
            return <LoginPage />;
        }
        
        switch (page) {
            case 'login': return <LoginPage />;
            case 'signup': return <SignupPage />;
            case 'whyGraduation': return <WhyGraduationPage />;
            case 'userTypeSelection': return <UserTypeSelectionPage />;
            case 'pathways': return <PathwaysPage />;
            case 'quiz': return <QuizPage />;
            case 'results': return <ResultsPage />;
            case 'colleges': return <CollegesPage />;
            case 'collegeDetail': return <CollegeDetailPage />;
            case 'mentors': return <MentorsPage />;
            case 'dashboard': return <DashboardPage />;
            case 'admin': return <AdminPage />; // In a real app, this would be role-protected
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-300 font-sans custom-cursor-area">
            <Header />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

// The root component that wraps the app in providers
export default function NextStepGuideApp() {
    return (
        <>
            <style>{`
                :root {
                    --background: #020617;
                }
                html {
                    scroll-behavior: smooth;
                }
                body {
                    background-color: var(--background);
                }
                .custom-cursor-area, .custom-cursor-area * {
                    cursor: none;
                }
                
                .bg-grid-pattern {
                    background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 2rem 2rem;
                }

                .bg-aurora-bg {
                    background: radial-gradient(ellipse at center, rgba(20, 184, 166, 0.3), transparent 70%);
                }

                @keyframes aurora {
                    0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
                    50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.2); }
                    100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
                }

                .animate-aurora {
                    animation: aurora 20s linear infinite;
                }
            `}</style>
            <AuthProvider>
                <DataProvider>
                    <NavigationProvider>
                        <CustomCursor />
                        <App />
                    </NavigationProvider>
                </DataProvider>
            </AuthProvider>
        </>
    );
};
