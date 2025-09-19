import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';
import axios from 'axios'; // Make sure this import is at the top with the others
import SplashScreen from './SplashScreen.jsx';
// --- API HELPER ---
// A centralized place to configure axios, especially for our backend URL.
const api = axios.create({
    baseURL: 'https://nextstep-guide.onrender.com/api', // The base URL for all our backend requests
});

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
        { id: 'q1', text: "Are you more interested in the theoretical 'why' or the practical 'how'?", options: [{ text: "Theoretical 'why'", field: "Scientific & Data Research" }, { text: "Practical 'how'", field: "Engineering & Technology" }] },
        { id: 'q2', text: "Do you enjoy building things with your hands or with code?", options: [{ text: "With my hands", field: "Science & Engineering / Applied Sciences" }, { text: "With code", field: "Software Development & IT" }] },
        { id: 'q3', text: "Are you fascinated by the human body and medicine?", options: [{ text: "Yes, deeply", field: "Medicine & Pharmacy" }, { text: "Not particularly", field: "Engineering & Technology" }] },
        { id: 'q4', text: "Do you prefer working on large-scale projects or intricate systems?", options: [{ text: "Large-scale projects", field: "Engineering & Technology" }, { text: "Intricate systems", field: "Software Development & IT" }] },
        { id: 'q5', text: "Do you enjoy solving abstract problems or tangible real-world issues?", options: [{ text: "Abstract problems", field: "Mathematics & Physics" }, { text: "Real-world issues", field: "Science & Engineering / Applied Sciences" }] },
        { id: 'q6', text: "Would you rather analyze data or design user experiences?",options: [{text: "Analyze data", field: "Data Science & Analytics" }, { text: "Design user experiences", field: "Design & Human-Computer Interaction" }]},
        { id: "q7", text: "Do you like experimenting in a lab or conducting research through reading and writing?",options: [{ text: "Experimenting in a lab", field: "Chemistry & Life Sciences" },{ text: "Reading and writing research",  field:"Scientific & Data Research" }]},
        { id: "q8", text: "Are you more interested in studying weather patterns or investigating chemical reactions?",options: [{ text: "Studying weather patterns", field: "Earth & Atmospheric Sciences" },{ text: "Investigating chemical reactions", field: "Chemical & Process Engineering" }]},
        { id: "q9",  text: "Do you prefer working with machines or living organisms?", options: [{ text: "Machines", field: "Robotics & Automation" }, { text: "Living organisms", field: "Biotechnology & Life Sciences" }] },
        { id: "q10", text: "Would you rather invent new technologies or improve existing ones?", options: [{ text: "Invent new technologies", field: "Innovation & Technology Development" }, { text: "Improve existing ones", field: "Industrial & Manufacturing Engineering" }] },
        { id: "q12", text: "Do you enjoy working with numbers and detailed data?",options: [ { text: "Yes, I like analyzing and interpreting data", field: "Scientific & Data Research" }, { text: "No, I prefer tasks that involve communication or leadership", field: "Communication & Media Technologies" } ]},
        { id: "q12", text: "Would you enjoy exploring space or exploring the ocean?", options: [{ text: "Space", field: "Space Science & Aerospace" }, { text: "Ocean", field: "Marine & Environmental Sciences" }] },
        { id: "q13", text: "Do you prefer working with numbers or with people?", options: [{ text: "Numbers", field: "Quantitative & Data Analytics" }, { text: "People", field: "Healthcare & Education" }] },
        { id: "q14", text: "Do you enjoy debugging code or diagnosing biological symptoms?", options: [{ text: "Debugging code", field: "Software Development & IT" }, { text: "Diagnosing symptoms", field: "Medicine & Pharmacy" }] },
        { id: "q15", text: "Would you rather develop sustainable technologies or treat diseases?", options: [{ text: "Sustainable technologies", field: "Environmental & Renewable Technologies" }, { text: "Treat diseases", field: "Medicine & Pharmacy" }] },
     ]},
    'Commerce': {
        title: "Class 12 Commerce - Career Mapping Quiz",
        questions: [
            { id: 'q1', text: "Are you more interested in managing money or managing people?", options: [{ text: "Managing money", field: "Accounting & Financial Analysis" }, { text: "Managing people", field: "HR & Organizational Development" }] },
            { id: 'q2', text: "Do you enjoy analyzing data to find trends or persuading people?", options: [{ text: "Analyzing data", field: "Financial Risk & Analysis" }, { text: "Persuading people", field: "Sales & Business Growth" }] },
            {id: "q3",text: "Would you prefer working in a corporate office or running your own business?", options: [{ text: "Corporate office", field: "Corporate & Business Management" },{ text: "Own business", field: "Startups & Entrepreneurship" }]},
            {id: "q4",text: "Are you more comfortable with numbers or words?", options: [{ text: "Numbers", field: "Accounting & Financial Analysis" },{ text: "Words", field: "Marketing & Corporate Communication" }]},
            {id: "q5",text: "Would you rather audit financial statements or recruit new employees?", options: [{ text: "Audit financial statements", field: "Auditing & Financial Compliance" },{ text: "Recruit employees", field: "HR & Organizational Development" }]},
            {id: "q6",text: "Do you enjoy understanding laws and regulations or developing creative brand ideas?", options: [{ text: "Laws and regulations", field: "Law & Corporate Governance" },{ text: "Creative brand ideas", field: "Marketing & Brand Strategy" }]},
            {id: "q7",text: "Are you more drawn to national business or international business?", options: [ { text: "National business", field: "Entrepreneurship & Small Business" },{ text: "International business", field: "International Business & Trade" }]},
            {id: "q8",text: "Which excites you more: stock market trends or company leadership styles?", options: [{ text: "Stock market trends", field: "Investment & Capital Markets" },{ text: "Leadership styles", field: "Management & Leadership Studies" }]},
            {id: "q9",text: "Would you rather prepare tax returns or design marketing campaigns?",options: [{ text: "Prepare tax returns", field: "Taxation & Accounting" },{ text: "Design marketing campaigns", field: "Marketing & Brand Strategy" } ]},
            {id: "q10",text: "Do you enjoy negotiating deals or managing company finances?",options: [ { text: "Negotiating deals", field: "Sales & Business Growth" },{ text: "Managing company finances", field: "Finance & Management" }]},
            {id: "q11",text: "Are you interested in studying consumer behavior or financial risk assessment?", options: [{ text: "Consumer behavior", field: "Marketing Analytics & Research" },{ text: "Financial risk assessment", field: "Financial Risk & Analysis" }]},
            {id: "q12",text: "Would you prefer to work in a startup environment or a well-established corporation?",options: [{ text: "Startup environment", field: "Startups & Entrepreneurship" },{ text: "Well-established corporation", field: "Corporate & Business Management" }]},
            {id: "q13",text: "Do you like working with spreadsheets and budgets or organizing company events?",options: [{ text: "Spreadsheets and budgets", field: "Accounting & Financial Analysis" },{ text: "Organizing events", field: "HR & Communication" }]},
            {id: "q14", text: "Are you more interested in stock market investing or brand strategy?",options: [ { text: "Stock market investing", field: "Finance & Investment" }, { text: "Brand strategy", field: "Marketing & Brand Strategy" }]},
            {id: "q15",text: "Would you enjoy conducting market research or auditing company finances?",options: [{ text: "Conducting market research", field: "Marketing Analytics & Insights" },{ text: "Auditing company finances", field: "Auditing & Financial Compliance" } ]},
        ]},
    'Arts': {
        title: "Class 12 Arts - Career Mapping Quiz",
        questions: [
            { id: 'q1', text: "Are you more drawn to visual expression or written expression?", options: [{ text: "Visual expression", field: "Visual Arts & Crafts" }, { text: "Written expression", field: "Literature & Writing" }] },
            { id: 'q2', text: "Do you want to understand societal structures or individual human behavior?", options: [{ text: "Societal structures", field: "Politics & International Studies" }, { text: "Individual behavior", field: "Social Work & Counseling" }] },
            {id: "q3",text: "Are you interested in studying history and cultures or exploringphilosophy and ideas?", options: [{ text: "History and cultures", field: "History & Archaeology" },{ text: "Philosophy and ideas", field: "Philosophy & Political Studies" }]},
            {id: "q4",text: "Do you enjoy performing on stage or working behind the scenes in production?",options: [{ text: "Performing on stage", field: "Performing Arts & Theatre" },{ text: "Behind the scenes", field: "Film & Media Production" }]},
            {id: "q5",text: "Would you rather create art with your hands or direct others in creative projects?",options: [{ text: "Create art", field: "Visual Arts & Crafts" },{ text: "Direct creative projects", field: "Creative & Media Management" }]},
            { id: "q6", text: "Are you more passionate about storytelling through words or through images?", options: [ { text: "Words", field: "Literature & Creative Writing" }, { text: "Images", field: "Visual Media & Design" } ] },
            {id: "q7",text: "Do you enjoy debating ideas or organizing community events?",options: [{ text: "Debating ideas", field: "Law & Political Studies" },{ text: "Organizing events", field: "PR & Event Management" }]},
            {id: "q8",text: "Would you prefer researching cultural traditions or analyzing human communication?",options: [{ text: "Researching cultural traditions", field: "Anthropology & Culture" },{ text: "Analyzing communication", field: "Linguistics & Communication Studies" }]},
            {id: "q9",text: "Are you interested in working with music or writing scripts for films and plays?",options: [{ text: "Working with music", field: "Music & Performing Arts" },{ text: "Writing scripts", field: "Writing & Script Development" }]},
            {id: "q10",text: "Do you prefer analyzing political systems or helping people with social services?",options: [{ text: "Analyzing political systems", field: "Politics & International Studies" },{ text: "Helping people", field: "Social Work & Counseling" }]},
            {id: "q11",text: "Would you enjoy creating digital art or researching historical texts?",options: [{ text: "Creating digital art", field: "Digital Media & Design" },{ text: "Researching historical texts", field: "History & Archival Research" }]},
            {id: "q12",text: "Are you more interested in philosophy or in studying languages?",options: [{ text: "Philosophy", field: "Philosophy & Ethics" },{ text: "Languages", field: "Linguistics & Language Studies" }]},
            {id: "q13",text: "Do you enjoy writing poetry or organizing social campaigns?",options: [{ text: "Writing poetry", field: "Literature & Creative Writing" },{ text: "Organizing campaigns", field: "Social Activism & NGO Work" }]},
            {id: "q14",text: "Would you rather study media trends or explore classical literature?",options: [{ text: "Media trends", field: "Media & Communication Studies" },{ text: "Classical literature", field: "Literature & Classical Studies" }]},
            {id: "q15",text: "Are you more interested in fashion design or in cultural anthropology?",options: [{ text: "Fashion design", field: "Fashion & Textile Design" },{ text: "Cultural anthropology", field: "Anthropology & Culture" }]},
        ]
    }
  }
};

const mockMindMapData = {
    Science: {
        title: 'Science Stream',
        description: 'The Science stream opens doors to careers in engineering, medicine, research, and technology. It is ideal for students with strong analytical and problem-solving skills.',
        children: [
            { title: 'PCM (Physics, Chemistry, Maths)', description: 'Focuses on non-medical sciences, primarily for engineering, architecture, and technology fields.', children: [
                { title: 'B.Tech/B.E.', description: 'The primary undergraduate degree for becoming an engineer across various specializations.', children: [{title: 'Software Engineer', description: 'Creates software applications for computers and mobile devices.'}, {title: 'Mechanical Engineer', description: 'Designs and builds machines and mechanical systems.'}, {title: 'Civil Engineer', description: 'Designs and oversees construction of infrastructure like roads and buildings.'}] },
                { title: 'B.Arch', description: 'A 5-year undergraduate degree to become a licensed architect.', children: [{title: 'Architect', description: 'Designs buildings and urban landscapes.'}] },
                { title: 'B.Sc in Physics/Maths', description: 'A 3-year degree focusing on fundamental scientific principles.', children: [{title: 'Researcher', description: 'Conducts experiments and analysis to advance knowledge.'}, {title: 'Data Scientist', description: 'Uses statistical methods to analyze and interpret complex data.'}] }
            ]},
            { title: 'PCB (Physics, Chemistry, Biology)', description: 'Focuses on medical and biological sciences, preparing for careers in healthcare and life sciences.', children: [
                { title: 'MBBS/BDS', description: 'Professional degrees required to become a doctor or dentist.', children: [{title: 'Doctor', description: 'Diagnoses and treats illnesses and injuries.'}, {title: 'Dentist', description: 'Focuses on oral health, diagnosing and treating dental issues.'}] },
                { title: 'B.Pharm', description: 'A degree focused on the science of medicines and their effects.', children: [{title: 'Pharmacist', description: 'Dispenses medications and advises on their safe use.'}] },
                { title: 'B.Sc in Biology/Zoology', description: 'A foundational degree in life sciences.', children: [{title: 'Biotechnologist', description: 'Uses biological systems to develop products and technologies.'}] }
            ]},
            { title: 'PCMB', description: 'A versatile combination for students keeping options open in both engineering and medical fields.', children: [{title: 'Versatile options in both Engineering and Medical', description: 'Allows eligibility for both JEE and NEET, offering a wide range of career choices.'}]}
        ]
    },
    Commerce: {
        title: 'Commerce Stream',
        description: 'The Commerce stream is for students interested in business, finance, and economics. It builds a strong foundation for careers in the corporate world.',
        children: [
            { title: 'With Maths', description: 'Combining Commerce with Maths opens up analytical and finance-heavy career paths like economics and investment banking.', children: [
                { title: 'B.Com (Hons.)', description: 'A specialized commerce degree, often a prerequisite for professional courses.', children: [{title: 'CA/CS', description: 'Professional certifications for Chartered Accountancy and Company Secretary roles.'}, {title: 'Investment Banker', description: 'Manages financial assets and raises capital for corporations.'}] },
                { title: 'Economics (Hons.)', description: 'A rigorous degree focusing on economic theory and analysis.', children: [{title: 'Economist', description: 'Studies the production and distribution of resources, goods, and services.'}, {title: 'Policy Analyst', description: 'Researches and analyzes policies for governments and organizations.'}] },
                { title: 'BBA/BMS', description: 'A degree focused on business administration and management principles.', children: [{title: 'Business Manager', description: 'Oversees operations and makes strategic decisions for a company.'}] }
            ]},
            { title: 'Without Maths', description: 'Focuses on theoretical aspects of commerce, business, and law.', children: [
                { title: 'B.Com (Prog.)', description: 'A general commerce degree suitable for accounting and administrative roles.', children: [{title: 'Accountant', description: 'Manages financial records for businesses.'}] },
                { title: 'Company Secretary', description: 'A professional course focusing on corporate law and governance.', children: [{title: 'Corporate Lawyer', description: 'Specializes in legal matters related to business and commerce.'}] }
            ]}
        ]
    },
    Arts: {
        title: 'Arts/Humanities Stream',
        description: 'The Arts stream offers a diverse range of subjects, focusing on human society, culture, and expression. It is ideal for creative and analytical minds.',
        children: [
            { title: 'Core Subjects', description: 'These subjects explore history, society, and human behavior, leading to careers in civil services, journalism, and academia.', children: [
                { title: 'BA in History/Pol Science', description: 'Degrees that provide a deep understanding of the past and political systems.', children: [{title: 'Civil Services (IAS/IPS)', description: 'Prestigious government roles responsible for public administration and law enforcement.'}, {title: 'Journalist', description: 'Gathers, writes, and reports news for various media.'}] },
                { title: 'BA in Psychology/Sociology', description: 'Degrees focused on understanding individual and group behavior.', children: [{title: 'Psychologist', description: 'Studies the human mind and behavior, providing counseling and therapy.'}, {title: 'Social Worker', description: 'Works to improve the lives of individuals and communities.'}] },
                { title: 'BA in Fine Arts', description: 'A degree for aspiring artists and designers to hone their creative skills.', children: [{title: 'Designer', description: 'Creates visual concepts for various industries.'}, {title: 'Artist', description: 'Creates works of art through painting, sculpture, or other media.'}] }
            ]},
            { title: 'Vocational Subjects', description: 'These are skill-oriented courses that prepare students for specific professions like law and hospitality.', children: [
                { title: 'Law (Integrated BA-LLB)', description: 'A 5-year program combining Arts and Law degrees.', children: [{title: 'Lawyer', description: 'Represents clients in legal matters and provides legal advice.'}] },
                { title: 'Hotel Management', description: 'A course that prepares students for careers in the hospitality industry.', children: [{title: 'Hospitality Manager', description: 'Manages operations in hotels, resorts, and restaurants.'}] }
            ]}
        ]
    }
};

// NEW: Detailed mind map data for Class 12 fields from user
const mindMapData = {
    sci_eng_applied: {
        title: 'Science & Engineering / Applied Sciences',
        description: 'This broad field focuses on applying scientific principles to design, build, and maintain structures, machines, and systems.',
        children: [
            { title: 'Key Disciplines', description: 'Core areas within this field.', children: [
                { title: 'Mechanical Engineering', description: 'Deals with machinery and mechanical systems.' },
                { title: 'Civil Engineering', description: 'Focuses on infrastructure like buildings and bridges.' },
                { title: 'Electrical Engineering', description: 'Works with electricity and electronics.' }
            ]}
        ]
    },
    eng_tech: {
        title: 'Engineering & Technology',
        description: 'A vast area that encompasses the creation and application of technological solutions to real-world problems.',
         children: [
            { title: 'Key Disciplines', description: 'Core areas within this field.', children: [
                { title: 'Computer Science', description: 'Focuses on software and computation.' },
                { title: 'Information Technology', description: 'Manages and supports IT infrastructure.' },
                { title: 'Electronics & Communication', description: 'Deals with electronic circuits and communication systems.' }
            ]}
        ]
    },
    sw_dev_it: {
        title: 'Software Development & IT',
        description: 'Covers the creation, maintenance, and management of software and information systems.',
        children: [
            {
                title: 'Academics',
                description: 'Educational paths to enter the field of software and IT.',
                children: [
                    {
                        title: 'B.Tech in CS/IT',
                        description: 'A 4-year engineering degree focused on core computer science principles.',
                        children: [
                            { title: 'Core Subjects', description: 'The foundational courses in a computer science degree.', children: [ { title: 'Data Structures & Algorithms', description: 'Fundamental concepts for organizing and processing data efficiently.' }, { title: 'Database Management Systems', description: 'Software for creating and managing databases to ensure data is accessible.' }, { title: 'Operating Systems', description: 'Core software that manages all hardware and software resources on a computer.' } ] },
                            { title: 'Job Roles', description: 'Common careers for graduates with a B.Tech in CS/IT.', children: [ { title: 'Software Engineer', description: 'Designs, develops, tests, and maintains software applications.' }, { title: 'Backend Developer', description: 'Focuses on the server-side of applications, including databases and APIs.' }, { title: 'Systems Engineer', description: 'Manages and supports an organization\'s IT infrastructure.' } ] }
                        ]
                    },
                    {
                        title: 'BCA (Bachelor of Computer Applications)',
                        description: 'A 3-year degree focused on software application development.',
                        children: [
                             { title: 'Core Subjects', description: 'Key courses in a BCA program.', children: [{ title: 'Web Development', description: 'The process of building and maintaining websites and web applications.' }, {title: 'Object-Oriented Programming', description: 'A programming style based on the concept of "objects" containing data and code.'}] },
                             { title: 'Job Roles', description: 'Typical entry-level jobs for BCA graduates.', children: [{ title: 'Web Developer', description: 'Builds and maintains the front-end and back-end of websites.' }, { title: 'Application Support Specialist', description: 'Provides technical support for software applications.' }] }
                        ]
                    },
                ]
            },
            {
                title: 'Skills',
                description: 'Essential technical and soft skills for a successful career.',
                children: [
                    { title: 'Technical Skills', description: 'Practical, hands-on abilities required for the job.', children: [ { title: 'Programming Languages (Python, Java, JS)', description: 'Core tools for writing instructions for computers to execute.' }, { title: 'Frameworks & Libraries (React, Node.js)', description: 'Pre-written code that helps developers build applications faster.' }, { title: 'Databases (SQL, NoSQL)', description: 'Systems for storing, managing, and retrieving organized information.' } ] },
                    { title: 'Soft Skills', description: 'Interpersonal qualities that help you succeed in the workplace.', children: [ { title: 'Problem-Solving', description: 'The ability to identify issues and implement effective solutions.' }, { title: 'Team Collaboration', description: 'Working effectively with others to achieve a common goal.' }, { title: 'Communication', description: 'Clearly conveying ideas and information to others.' } ] }
                ]
            },
            {
                title: 'Future Scope',
                description: 'Paths for career advancement and growth.',
                children: [
                    { title: 'Higher Studies', description: 'Advanced degrees to deepen your expertise.', children: [ { title: 'M.Tech in CS/IT', description: 'A master\'s degree focused on advanced technical specialization.' }, { title: 'MS in Computer Science', description: 'A research-oriented master\'s program, often pursued internationally.' }, { title: 'MBA in IT Management', description: 'Combines technical knowledge with business leadership skills.' } ] },
                    { title: 'Emerging Trends', description: 'The next wave of technologies shaping the future of IT.', children: [ { title: 'Artificial Intelligence & Generative AI', description: 'Creating systems that can learn, reason, and generate new content.' }, { title: 'Quantum Computing', description: 'Using quantum mechanics to solve problems too complex for classical computers.' }, { title: 'DevSecOps', description: 'Integrating security practices into the software development lifecycle.' } ] }
                ]
            }
        ]
    },
    data_science: {
        title: 'Data Science & Analytics',
        description: 'Extracting insights and knowledge from data using scientific methods, processes, algorithms, and systems.',
        children: [
            {
                title: 'Academics',
                description: 'Educational pathways for a career in data science.',
                children: [
                    { title: 'B.Tech in Data Science/AI', description: 'An engineering degree focused on data science principles.', children: [ { title: 'Core Subjects', description: 'Fundamental courses for a data science degree.', children: [ { title: 'Statistics & Probability', description: 'The mathematical foundation for understanding data and uncertainty.' }, { title: 'Machine Learning', description: 'Algorithms that allow computers to learn from data without being explicitly programmed.' }, { title: 'Big Data Tech', description: 'Technologies for handling massive datasets that are too large for traditional software.' } ] }, { title: 'Job Roles', description: 'Common careers for data science graduates.', children: [ { title: 'Data Scientist', description: 'Uses data to solve complex problems and build predictive models.' }, { title: 'ML Engineer', description: 'Builds and deploys machine learning models at scale.' } ] } ] },
                    { title: 'B.Sc. in Statistics', description: 'A degree focused on the collection, analysis, and interpretation of data.', children: [ { title: 'Core Subjects', description: 'Key courses in a statistics program.', children: [{title: 'Probability Theory', description: 'The branch of mathematics concerning numerical descriptions of how likely an event is to occur.'}, {title: 'Statistical Inference', description: 'The process of using data analysis to infer properties of an underlying probability distribution.'}] }, { title: 'Job Roles', description: 'Typical entry-level jobs for statistics graduates.', children: [ { title: 'Data Analyst', description: 'Examines data sets to identify trends and draw conclusions.' }, { title: 'BI Analyst', description: 'Focuses on using data to help businesses make better decisions.' } ] } ] }
                ]
            },
            {
                title: 'Skills',
                description: 'Essential capabilities for a data science professional.',
                children: [
                    { title: 'Technical Skills', description: 'The tools and technologies used in data science.', children: [ { title: 'Python (Pandas, Scikit-learn)', description: 'A versatile programming language with powerful libraries for data analysis.' }, { title: 'R Programming', description: 'A language specifically designed for statistical computing and graphics.' }, { title: 'SQL', description: 'The standard language for managing and querying relational databases.' }, { title: 'Data Visualization (Tableau)', description: 'Tools for creating visual representations of data to communicate insights.' } ] },
                    { title: 'Soft Skills', description: 'Personal attributes that are key to success in data science.', children: [ { title: 'Analytical Mindset', description: 'The ability to deconstruct problems and think in a structured way.' }, { title: 'Business Acumen', description: 'Understanding how a business operates and makes money.' }, { title: 'Storytelling', description: 'The ability to communicate complex data insights in a clear and compelling narrative.' } ] }
                ]
            },
            {
                title: 'Future Scope',
                description: 'Opportunities for growth and specialization in data science.',
                children: [
                    { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Sc./M.Tech in Data Science', description: 'A master\'s program focused on advanced data science techniques.' }, { title: 'PhD in a specialized domain', description: 'The highest academic degree, focused on original research in an area like AI or bioinformatics.' } ] },
                    { title: 'Emerging Trends', description: 'Future directions of the data science field.', children: [ { title: 'Deep Learning', description: 'A subfield of machine learning based on artificial neural networks.' }, { title: 'Explainable AI (XAI)', description: 'AI models whose decisions can be easily understood by humans.' }, { title: 'MLOps', description: 'Practices for the deployment and maintenance of machine learning models in production.' } ] }
                ]
            }
        ]
    },
    design_hci: {
        title: 'Design & Human-Computer Interaction',
        description: 'Focuses on designing interfaces between people (users) and computers.',
        children: [
            { title: 'Academics', description: 'Educational routes into the HCI and design field.', children: [ { title: 'B.Des in UX/UI', description: 'A bachelor\'s degree in design focused on User Experience and User Interface.', children: [ { title: 'Core Subjects', description: 'Key topics in a UX/UI design curriculum.', children: [ { title: 'User Research', description: 'Understanding user behaviors, needs, and motivations through observation and feedback.' }, { title: 'Interaction Design', description: 'Designing the interaction between users and products.' }, { title: 'Information Architecture', description: 'Organizing and structuring content in an effective and sustainable way.' } ] }, { title: 'Job Roles', description: 'Common careers for design graduates.', children: [ { title: 'UX Designer', description: 'Focuses on the overall feel and experience of a product.' }, { title: 'UI Designer', description: 'Focuses on the visual layout and look of a product\'s interface.' }, { title: 'Product Designer', description: 'A broad role covering both UX and UI, often with a focus on business goals.' } ] } ] } ] },
            { title: 'Skills', description: 'The key abilities required for a design professional.', children: [ { title: 'Technical Skills', description: 'Software and tools of the trade for designers.', children: [ { title: 'Figma, Sketch, Adobe XD', description: 'Industry-standard software for designing and prototyping user interfaces.' }, { title: 'Prototyping Tools (InVision, Marvel)', description: 'Tools to create interactive mockups of a product before development.' }, { title: 'HTML/CSS Basics', description: 'Fundamental understanding of web technologies to design effectively.' } ] }, { title: 'Soft Skills', description: 'Essential interpersonal skills for designers.', children: [ { title: 'Empathy', description: 'The ability to understand and share the feelings of the user.' }, { title: 'Visual Communication', description: 'Effectively conveying ideas and information through visual elements.' }, { title: 'User Feedback Analysis', description: 'The ability to interpret and act on feedback from users.' } ] } ] },
            { title: 'Future Scope', description: 'Where the field of design and HCI is heading.', children: [ { title: 'Higher Studies', description: 'Advanced education in design.', children: [ { title: 'M.Des in Interaction Design', description: 'A master\'s degree focused on the theory and practice of interaction design.' } ] }, { title: 'Emerging Trends', description: 'The future of human-computer interaction.', children: [ { title: 'Voice User Interfaces (VUI)', description: 'Designing interactions based on voice commands, like for Alexa or Siri.' }, { title: 'AR/VR Design', description: 'Designing immersive experiences for Augmented and Virtual Reality.' }, { title: 'Inclusive Design', description: 'Designing products that are accessible to and usable by as many people as possible.' } ] } ] }
        ]
    },
    industrial_manufacturing: {
        title: 'Industrial & Manufacturing Engineering',
        description: 'Deals with the optimization of complex processes, systems, or organizations.',
        children: [
            { title: 'Academics', description: 'The educational foundation for this field.', children: [ { title: 'B.E./B.Tech in Industrial/Manufacturing Eng.', description: 'An engineering degree focused on optimizing complex processes.', children: [ { title: 'Core Subjects', description: 'Key courses in an industrial engineering program.', children: [ { title: 'Operations Research', description: 'Using mathematical models to optimize business processes.' }, { title: 'Supply Chain Management', description: 'Managing the flow of goods and services from source to customer.' }, { title: 'Quality Control', description: 'Ensuring products meet a defined set of quality criteria.' } ] }, { title: 'Job Roles', description: 'Potential careers for graduates.', children: [ { title: 'Process Engineer', description: 'Designs and implements processes to improve efficiency.' }, { title: 'Supply Chain Analyst', description: 'Analyzes and optimizes a company\'s supply chain.' }, { title: 'Quality Assurance Manager', description: 'Ensures products consistently meet quality standards.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for industrial and manufacturing engineers.', children: [ { title: 'Technical Skills', description: 'Key technical competencies.', children: [ { title: 'Six Sigma, Lean Manufacturing', description: 'Methodologies for process improvement and waste reduction.' }, { title: 'CAD/CAM Software', description: 'Software for designing and manufacturing products.' }, { title: 'ERP Systems', description: 'Software that manages a company\'s main business processes.' } ] }, { title: 'Soft Skills', description: 'Important interpersonal attributes.', children: [ { title: 'Systems Thinking', description: 'Understanding how different parts of a system interact.' }, { title: 'Project Management', description: 'Planning and executing projects to meet specific goals.' }, { title: 'Analytical Skills', description: 'The ability to collect and analyze information to solve problems.' } ] } ] },
            { title: 'Future Scope', description: 'The future of industrial and manufacturing engineering.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for career progression.', children: [ { title: 'M.Tech in Industrial Eng.', description: 'A master\'s focused on advanced industrial engineering topics.' }, { title: 'MBA in Operations', description: 'Combines engineering knowledge with business management.' } ] }, { title: 'Emerging Trends', description: 'Upcoming technologies in the field.', children: [ { title: 'Smart Manufacturing (Industry 4.0)', description: 'The integration of digital technology into manufacturing.' }, { title: 'Digital Twins', description: 'A virtual model of a physical object or system.' }, { title: '3D Printing', description: 'Creating three-dimensional objects from a digital file.' } ] } ] }
        ]
    },
    marine_environmental: {
        title: 'Marine & Environmental Sciences',
        description: 'The study of the ocean, its ecosystems, and the impact of human activities on the environment.',
        children: [
            { title: 'Academics', description: 'How to get into marine and environmental sciences.', children: [ { title: 'B.Sc in Marine Biology/Environmental Sci.', description: 'A science degree focused on marine or environmental systems.', children: [ { title: 'Core Subjects', description: 'Key subjects in the curriculum.', children: [ { title: 'Oceanography', description: 'The study of the physical and biological properties of the sea.' }, { title: 'Ecology', description: 'The study of how organisms interact with each other and their environment.' }, { title: 'Conservation Biology', description: 'The science of protecting and managing biodiversity.' } ] }, { title: 'Job Roles', description: 'Careers in this field.', children: [ { title: 'Marine Biologist', description: 'Studies marine organisms and their environment.' }, { title: 'Environmental Consultant', description: 'Advises organizations on environmental policies.' }, { title: 'Conservation Scientist', description: 'Manages and protects natural resources.' } ] } ] } ] },
            { title: 'Skills', description: 'Necessary skills for a career in this field.', children: [ { title: 'Technical Skills', description: 'Practical skills needed for the job.', children: [ { title: 'Field Research & Data Collection', description: 'Gathering data from natural environments.' }, { title: 'GIS Software', description: 'Software for analyzing and visualizing geographical data.' }, { title: 'Statistical Analysis', description: 'Using statistics to interpret experimental data.' } ] }, { title: 'Soft Skills', description: 'Personal qualities for success.', children: [ { title: 'Observation', description: 'The ability to notice details in the environment.' }, { title: 'Analytical Skills', description: 'Interpreting data and drawing logical conclusions.' }, { title: 'Patience & Perseverance', description: 'Essential qualities for long-term research projects.' } ] } ] },
            { title: 'Future Scope', description: 'Future directions in marine and environmental science.', children: [ { title: 'Higher Studies', description: 'Advanced academic paths.', children: [ { title: 'M.Sc. in relevant fields', description: 'A master\'s degree for specialization.' }, { title: 'PhD', description: 'The highest academic degree for a career in research.' } ] }, { title: 'Emerging Trends', description: 'New areas of focus in the field.', children: [ { title: 'Climate Change Research', description: 'Studying the impacts of climate change on ecosystems.' }, { title: 'Deep-Sea Exploration', description: 'Exploring the largely unknown deep-sea environment.' }, { title: 'Blue Economy', description: 'Sustainable use of ocean resources for economic growth.' } ] } ] }
        ]
    },
    renewable_tech: {
        title: 'Environmental & Renewable Technologies',
        description: 'Focuses on sustainable energy generation and environmental protection technologies.',
        children: [
            { title: 'Academics', description: 'Educational routes to a career in green tech.', children: [ { title: 'B.Tech in Energy/Environmental Eng.', description: 'An engineering degree focused on sustainable technologies.', children: [ { title: 'Core Subjects', description: 'Key courses in the program.', children: [ { title: 'Solar/Wind Energy Systems', description: 'The technology behind solar and wind power generation.' }, { title: 'Waste Management', description: 'Techniques for managing and recycling waste.' }, { title: 'Energy Policy', description: 'The laws and regulations governing energy use.' } ] }, { title: 'Job Roles', description: 'Careers in the renewable sector.', children: [ { title: 'Renewable Energy Engineer', description: 'Designs and implements renewable energy projects.' }, { title: 'Sustainability Analyst', description: 'Helps organizations become more environmentally sustainable.' }, { title: 'Environmental Engineer', description: 'Uses engineering principles to solve environmental problems.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for a career in renewable technologies.', children: [ { title: 'Technical Skills', description: 'The practical abilities required.', children: [ { title: 'Energy Modeling Software (HOMER, PVSyst)', description: 'Software for simulating and optimizing energy systems.' }, { title: 'Environmental Impact Assessment', description: 'Evaluating the environmental consequences of a project.' }, { title: 'Project Management', description: 'Managing renewable energy projects from start to finish.' } ] }, { title: 'Soft Skills', description: 'Key interpersonal skills.', children: [ { title: 'Problem Solving', description: 'Finding solutions to complex technical challenges.' }, { title: 'Policy Awareness', description: 'Understanding the regulatory landscape for renewable energy.' }, { title: 'Interdisciplinary Collaboration', description: 'Working with experts from different fields.' } ] } ] },
            { title: 'Future Scope', description: 'What\'s next for renewable and environmental tech.', children: [ { title: 'Higher Studies', description: 'Advanced degrees in the field.', children: [ { title: 'M.Tech in Renewable Energy', description: 'A master\'s degree focused on renewable energy technologies.' } ] }, { title: 'Emerging Trends', description: 'The future of green technology.', children: [ { title: 'Green Hydrogen', description: 'Producing hydrogen using renewable energy.' }, { title: 'Energy Storage Solutions', description: 'Technologies like batteries for storing renewable energy.' }, { title: 'Circular Economy', description: 'An economic model based on minimizing waste.' } ] } ] }
        ]
    },
    space_aerospace: {
        title: 'Space Science & Aerospace',
        description: 'The science and engineering of aircraft and spacecraft.',
        children: [
            { title: 'Academics', description: 'Educational pathways to a career in space and aerospace.', children: [ { title: 'B.Tech in Aerospace/Aeronautical Eng.', description: 'An engineering degree focused on aircraft and spacecraft.', children: [ { title: 'Core Subjects', description: 'Fundamental courses in the curriculum.', children: [ { title: 'Aerodynamics', description: 'The study of how air flows around objects.' }, { title: 'Propulsion', description: 'The science of creating thrust to move aircraft and rockets.' }, { title: 'Orbital Mechanics', description: 'The study of the motion of objects in orbit.' } ] }, { title: 'Job Roles', description: 'Careers in the aerospace industry.', children: [ { title: 'Aerospace Engineer', description: 'Designs and builds aircraft and spacecraft.' }, { title: 'Avionics Engineer', description: 'Works on the electronic systems of aircraft.' }, { title: 'Systems Engineer at ISRO/NASA', description: 'Integrates complex aerospace systems.' } ] } ] } ] },
            { title: 'Skills', description: 'Key skills for aerospace professionals.', children: [ { title: 'Technical Skills', description: 'The technical tools and knowledge required.', children: [ { title: 'MATLAB, Simulink', description: 'Software for mathematical modeling and simulation.' }, { title: 'CFD Software', description: 'Software for simulating fluid dynamics.' }, { title: 'CATIA/SolidWorks', description: 'CAD software for designing complex parts.' } ] }, { title: 'Soft Skills', description: 'Essential personal attributes.', children: [ { title: 'Precision', description: 'A high degree of accuracy and attention to detail.' }, { title: 'Analytical Skills', description: 'The ability to solve complex engineering problems.' }, { title: 'Teamwork', description: 'Collaborating effectively on large-scale projects.' } ] } ] },
            { title: 'Future Scope', description: 'The future of the space and aerospace industry.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Tech/MS in Aerospace', description: 'A master\'s degree for advanced study in aerospace engineering.' } ] }, { title: 'Emerging Trends', description: 'New frontiers in aerospace.', children: [ { title: 'Satellite Technology (SmallSats)', description: 'The development of small, low-cost satellites.' }, { title: 'Space Exploration (Privatization)', description: 'The growing role of private companies in space.' }, { title: 'Hypersonic Travel', description: 'Developing aircraft that can travel at extreme speeds.' } ] } ] }
        ]
    },
    innovation_tech: {
        title: 'Innovation & Technology Development',
        description: 'Focuses on creating new products, services, or processes and bringing them to market.',
        children: [
            { title: 'Academics', description: 'Education for a career in innovation.', children: [ { title: 'B.Tech/BBA with specialization in Innovation', description: 'A degree combining technology or business with innovation principles.', children: [ { title: 'Core Subjects', description: 'Key areas of study.', children: [ { title: 'Product Management', description: 'Managing a product throughout its lifecycle.' }, { title: 'Design Thinking', description: 'A user-centered approach to problem-solving.' }, { title: 'Entrepreneurship', description: 'The process of starting and running a business.' } ] }, { title: 'Job Roles', description: 'Careers focused on innovation.', children: [ { title: 'Product Manager', description: 'Defines the vision and strategy for a product.' }, { title: 'Innovation Consultant', description: 'Helps organizations develop new products and services.' }, { title: 'Venture Analyst', description: 'Evaluates startups for investment potential.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for innovation professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities for innovation.', children: [ { title: 'Market Research', description: 'Understanding customer needs and market trends.' }, { title: 'Prototyping', description: 'Creating early models of a product to test ideas.' }, { title: 'Agile Methodologies', description: 'An iterative approach to project management.' } ] }, { title: 'Soft Skills', description: 'Personal qualities that drive innovation.', children: [ { title: 'Creativity', description: 'The ability to generate new and valuable ideas.' }, { title: 'Strategic Thinking', description: 'Seeing the big picture and planning for the future.' }, { title: 'Communication', description: 'Articulating ideas and inspiring others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of innovation and technology.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for leadership roles.', children: [ { title: 'MBA', description: 'A Master of Business Administration to develop leadership skills.' } ] }, { title: 'Emerging Trends', description: 'New approaches to innovation.', children: [ { title: 'Lean Startup Methodologies', description: 'A process for building businesses with minimal waste.' }, { title: 'Open Innovation', description: 'Collaborating with external partners to innovate.' }, { title: 'Corporate Venturing', description: 'Large companies investing in or acquiring startups.' } ] } ] }
        ]
    },
    robotics_automation: {
        title: 'Robotics & Automation',
        description: 'Design, construction, operation, and use of robots and automated systems.',
        children: [
            { title: 'Academics', description: 'Education in robotics and automation.', children: [ { title: 'B.Tech in Mechatronics/Robotics', description: 'An engineering degree combining mechanics, electronics, and computing.', children: [ { title: 'Core Subjects', description: 'Key courses in a robotics program.', children: [ { title: 'Control Systems', description: 'The theory of how to control dynamic systems.' }, { title: 'Kinematics & Dynamics', description: 'The study of motion in robotic systems.' }, { title: 'Machine Vision', description: 'Allowing computers to "see" and interpret images.' } ] }, { title: 'Job Roles', description: 'Careers in the robotics industry.', children: [ { title: 'Robotics Engineer', description: 'Designs, builds, and tests robots.' }, { title: 'Automation Specialist', description: 'Implements automated systems in factories and warehouses.' }, { title: 'Controls Engineer', description: 'Develops the control systems for robots and machines.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for robotics professionals.', children: [ { title: 'Technical Skills', description: 'The hands-on abilities required.', children: [ { title: 'ROS (Robot Operating System)', description: 'A flexible framework for writing robot software.' }, { title: 'PLC Programming', description: 'Programming controllers for industrial automation.' }, { title: 'Python/C++', description: 'Common programming languages used in robotics.' } ] }, { title: 'Soft Skills', description: 'Key interpersonal skills.', children: [ { title: 'Systems Integration', description: 'Making different technical systems work together.' }, { title: 'Problem Solving', description: 'Diagnosing and fixing issues with complex systems.' }, { title: 'Mechanical Aptitude', description: 'An intuitive understanding of how machines work.' } ] } ] },
            { title: 'Future Scope', description: 'The future of robotics and automation.', children: [ { title: 'Higher Studies', description: 'Advanced degrees in the field.', children: [ { title: 'M.Tech in Robotics', description: 'A master\'s degree for specialization in robotics.' } ] }, { title: 'Emerging Trends', description: 'The next generation of robotics.', children: [ { title: 'Collaborative Robots (Cobots)', description: 'Robots designed to work alongside humans.' }, { title: 'AI in Robotics', description: 'Making robots smarter and more autonomous.' }, { title: 'Autonomous Systems', description: 'Robots and vehicles that can operate without human intervention.' } ] } ] }
        ]
    },
    comm_media_tech: {
        title: 'Communication & Media Technologies',
        description: 'Focuses on the technology behind media, broadcasting, and digital communication.',
        children: [
            { title: 'Academics', description: 'Education in media technology.', children: [ { title: 'B.Tech in ECE / B.A. in Mass Comm.', description: 'Degrees combining engineering with communication.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Signal Processing', description: 'The manipulation of signals like audio and video.' }, { title: 'Broadcasting Tech', description: 'The technology behind radio and television broadcasting.' }, { title: 'Digital Media', description: 'The study of media in a digital format.' } ] }, { title: 'Job Roles', description: 'Careers in media technology.', children: [ { title: 'Broadcast Engineer', description: 'Manages the technical aspects of broadcasting.' }, { title: 'Media Technologist', description: 'Works with the technology behind media production.' }, { title: 'Network Engineer', description: 'Manages the networks that deliver media content.' } ] } ] } ] },
            { title: 'Skills', description: 'Key skills for media tech professionals.', children: [ { title: 'Technical Skills', description: 'The practical abilities needed.', children: [ { title: 'Video/Audio Editing Software', description: 'Tools like Adobe Premiere and Audition.' }, { title: 'Network Protocols', description: 'The rules that govern how data is transmitted over networks.' }, { title: 'Content Delivery Networks (CDNs)', description: 'Systems for delivering web content quickly to users.' } ] }, { title: 'Soft Skills', description: 'Important interpersonal skills.', children: [ { title: 'Communication', description: 'Effectively conveying technical information.' }, { title: 'Troubleshooting', description: 'Diagnosing and solving technical problems.' }, { title: 'Adaptability', description: 'Keeping up with rapidly changing technology.' } ] } ] },
            { title: 'Future Scope', description: 'The future of media technology.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Sc. in Media Technology', description: 'A master\'s focused on the tech behind media.' } ] }, { title: 'Emerging Trends', description: 'New frontiers in media delivery.', children: [ { title: '5G Broadcasting', description: 'Using 5G networks for broadcasting.' }, { title: 'Streaming Technologies', description: 'The technology behind services like Netflix and YouTube.' }, { title: 'Immersive Media (AR/VR)', description: 'Creating immersive media experiences.' } ] } ] }
        ]
    },
    chem_process_eng: {
        title: 'Chemical & Process Engineering',
        description: 'Branch of engineering that uses principles of chemistry, physics, mathematics, and economics to efficiently use, produce, and transport chemicals, materials, and energy.',
        children: [
            { title: 'Academics', description: 'Education in chemical engineering.', children: [ { title: 'B.Tech in Chemical Eng.', description: 'An engineering degree focused on chemical processes.', children: [ { title: 'Core Subjects', description: 'Key courses in the program.', children: [ { title: 'Thermodynamics', description: 'The study of heat and energy.' }, { title: 'Fluid Mechanics', description: 'The study of fluids in motion.' }, { title: 'Mass Transfer', description: 'The movement of mass from one location to another.' } ] }, { title: 'Job Roles', description: 'Careers for chemical engineers.', children: [ { title: 'Process Engineer', description: 'Designs and manages chemical processes.' }, { title: 'Chemical Engineer', description: 'Works on the production of chemicals and materials.' }, { title: 'Plant Manager', description: 'Oversees the operations of a chemical plant.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for chemical engineers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Process Simulation (ASPEN, HYSYS)', description: 'Software for modeling chemical processes.' }, { title: 'Plant Design', description: 'Designing the layout and equipment for chemical plants.' }, { title: 'Safety Engineering', description: 'Ensuring the safe operation of chemical processes.' } ] }, { title: 'Soft Skills', description: 'Key interpersonal skills.', children: [ { title: 'Analytical Skills', description: 'Solving complex engineering problems.' }, { title: 'Safety Consciousness', description: 'A strong commitment to safety.' }, { title: 'Problem Solving', description: 'Identifying and resolving issues in processes.' } ] } ] },
            { title: 'Future Scope', description: 'The future of chemical engineering.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Tech in Chemical Eng.', description: 'A master\'s degree for advanced study.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Green Chemistry', description: 'Designing chemical products and processes that are environmentally friendly.' }, { title: 'Nanotechnology', description: 'Working with materials at the molecular scale.' }, { title: 'Biochemical Engineering', description: 'Applying engineering principles to biological systems.' } ] } ] }
        ]
    },
    quant_data_analytics: {
        title: 'Quantitative & Data Analytics',
        description: 'Application of statistical and mathematical techniques to analyze business data.',
        children: [
            { title: 'Academics', description: 'Education for a career as a quant.', children: [ { title: 'B.Sc. in Statistics / B.Com (Hons)', description: 'Degrees with a strong mathematical focus.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Econometrics', description: 'The application of statistics to economic data.' }, { title: 'Statistical Modeling', description: 'Using statistical models to understand data.' }, { title: 'Time Series Analysis', description: 'Analyzing data points collected over time.' } ] }, { title: 'Job Roles', description: 'Careers for quantitative analysts.', children: [ { title: 'Quantitative Analyst (Quant)', description: 'Uses mathematical models to make financial decisions.' }, { title: 'Data Analyst', description: 'Analyzes data to find trends and insights.' }, { title: 'Financial Analyst', description: 'Evaluates investment opportunities.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for quantitative analysts.', children: [ { title: 'Technical Skills', description: 'The technical tools required.', children: [ { title: 'Python (NumPy, SciPy)', description: 'A programming language with powerful libraries for scientific computing.' }, { title: 'SQL', description: 'The standard language for database management.' }, { title: 'Advanced Excel', description: 'Using Excel for complex financial modeling.' }, { title: 'R', description: 'A programming language for statistical analysis.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Mathematical Aptitude', description: 'A strong ability in mathematics.' }, { title: 'Attention to Detail', description: 'A high level of accuracy and precision.' }, { title: 'Logical Reasoning', description: 'The ability to think logically and solve problems.' } ] } ] },
            { title: 'Future Scope', description: 'The future of quantitative analysis.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'Masters in Financial Engineering', description: 'A master\'s degree focused on quantitative finance.' }, { title: 'Masters in Quantitative Finance', description: 'Another specialized master\'s in the field.' } ] }, { title: 'Emerging Trends', description: 'New frontiers in quantitative finance.', children: [ { title: 'Algorithmic Trading', description: 'Using computer algorithms to trade stocks.' }, { title: 'Big Data Analytics in Finance', description: 'Applying big data techniques to financial markets.' }, { title: 'Risk Modeling', description: 'Developing models to manage financial risk.' } ] } ] }
        ]
    },
    sci_data_research: {
        title: 'Scientific & Data Research',
        description: 'Involves conducting research, analyzing data, and publishing findings in academic or industrial settings.',
        children: [
            { title: 'Academics', description: 'Education for a career in research.', children: [ { title: 'B.Sc/M.Sc in a specific science field', description: 'A science degree as a foundation for research.', children: [ { title: 'Core Path', description: 'The process of scientific research.', children: [ { title: 'Hypothesis Formulation', description: 'Developing a testable explanation for a phenomenon.' }, { title: 'Conducting Experiments', description: 'Testing a hypothesis through experimentation.' }, { title: 'Data Analysis & Interpretation', description: 'Analyzing experimental data to draw conclusions.' } ] }, { title: 'Job Roles', description: 'Careers in scientific research.', children: [ { title: 'Research Scientist', description: 'Conducts original research in a lab.' }, { title: 'Lab Technician', description: 'Assists with experiments and maintains lab equipment.' }, { title: 'Clinical Research Associate', description: 'Manages clinical trials for new drugs.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for researchers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Statistical Analysis Software (SPSS, R)', description: 'Software for analyzing research data.' }, { title: 'Lab Techniques (e.g., PCR, chromatography)', description: 'Specialized techniques used in a lab.' }, { title: 'Scientific Writing', description: 'Writing research papers for publication.' } ] }, { title: 'Soft Skills', description: 'Key personal qualities.', children: [ { title: 'Curiosity', description: 'A strong desire to learn and discover.' }, { title: 'Critical Thinking', description: 'Analyzing information objectively to form a judgment.' }, { title: 'Patience', description: 'The ability to persevere through long research projects.' } ] } ] },
            { title: 'Future Scope', description: 'The future of scientific research.', children: [ { title: 'Higher Studies', description: 'The ultimate academic achievement.', children: [ { title: 'PhD', description: 'The highest degree, required for a career as an independent researcher.' }, { title: 'Post-Doctoral Fellowship', description: 'A temporary research position after a PhD.' } ] }, { title: 'Emerging Trends', description: 'New directions in research.', children: [ { title: 'Interdisciplinary Research', description: 'Research that combines multiple academic disciplines.' }, { title: 'Open Science & Data Sharing', description: 'Making scientific research more transparent and accessible.' }, { title: 'AI in Scientific Discovery', description: 'Using AI to accelerate scientific research.' } ] } ] }
        ]
    },
    math_physics: {
        title: 'Mathematics & Physics',
        description: 'Fundamental sciences that form the basis for many other scientific and engineering fields.',
        children: [
            { title: 'Academics', description: 'Education in math and physics.', children: [ { title: 'B.Sc/M.Sc in Mathematics/Physics', description: 'A degree in these fundamental sciences.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Calculus, Linear Algebra', description: 'Fundamental branches of mathematics.' }, { title: 'Quantum Mechanics, Thermodynamics', description: 'Fundamental branches of physics.' }, { title: 'Classical Mechanics', description: 'The study of the motion of objects.' } ] }, { title: 'Job Roles', description: 'Careers for math and physics graduates.', children: [ { title: 'Teacher/Professor', description: 'Educating students in math and physics.' }, { title: 'Researcher', description: 'Conducting original research.' }, { title: 'Data Scientist', description: 'Applying mathematical skills to data analysis.' }, { title: 'Quantitative Analyst', description: 'Using math to solve financial problems.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for mathematicians and physicists.', children: [ { title: 'Technical Skills', description: 'The practical abilities required.', children: [ { title: 'Mathematical Modeling', description: 'Using math to represent real-world systems.' }, { title: 'Problem Solving', description: 'Solving complex abstract problems.' }, { title: 'Programming (Python, MATLAB)', description: 'Using code to solve mathematical problems.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Abstract Thinking', description: 'The ability to think about concepts that are not physically present.' }, { title: 'Logical Reasoning', description: 'The ability to think logically and systematically.' }, { title: 'Analytical Mindset', description: 'A structured approach to problem-solving.' } ] } ] },
            { title: 'Future Scope', description: 'The future of math and physics.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'Required for a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New frontiers in math and physics.', children: [ { title: 'Quantum Computing', description: 'A new type of computing based on quantum mechanics.' }, { title: 'Mathematical Finance', description: 'Applying math to financial markets.' }, { title: 'Theoretical Physics', description: 'Developing new theories to explain the universe.' } ] } ] }
        ]
    },
    earth_atmospheric: {
        title: 'Earth & Atmospheric Sciences',
        description: 'Study of the Earth, its oceans, atmosphere, and the processes that shape them.',
        children: [
            { title: 'Academics', description: 'Education in earth and atmospheric sciences.', children: [ { title: 'B.Sc in Geology/Meteorology', description: 'A science degree focused on the Earth\'s systems.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Geology', description: 'The study of the Earth\'s physical structure and substance.' }, { title: 'Climatology', description: 'The study of climate.' }, { title: 'Oceanography', description: 'The study of the ocean.' } ] }, { title: 'Job Roles', description: 'Careers in this field.', children: [ { title: 'Geologist', description: 'Studies the Earth\'s rocks and minerals.' }, { title: 'Meteorologist', description: 'Studies the atmosphere and forecasts weather.' }, { title: 'Environmental Scientist', description: 'Works to protect the environment.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for earth and atmospheric scientists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'GIS, Remote Sensing', description: 'Tools for analyzing geographic data.' }, { title: 'Data Analysis', description: 'Interpreting data from observations and models.' }, { title: 'Fieldwork Techniques', description: 'Collecting data in the field.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Fieldwork', description: 'The ability to work outdoors in various conditions.' }, { title: 'Observation', description: 'Noticing details in the natural world.' }, { title: 'Data Interpretation', description: 'Making sense of complex data.' } ] } ] },
            { title: 'Future Scope', description: 'The future of earth and atmospheric sciences.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Sc/PhD', description: 'For a career in research or specialized roles.' } ] }, { title: 'Emerging Trends', description: 'New areas of focus.', children: [ { title: 'Climate Modeling', description: 'Using computers to simulate the climate.' }, { title: 'Natural Hazard Prediction', description: 'Forecasting events like earthquakes and hurricanes.' }, { title: 'Sustainable Resource Management', description: 'Managing natural resources in a sustainable way.' } ] } ] }
        ]
    },

    // --- BIOTECHNOLOGY & LIFE SCIENCES ---
    biotech_life_sci: {
        title: 'Biotechnology & Life Sciences',
        description: 'Using biological systems to develop products and technologies.',
        children: [
            { title: 'Academics', description: 'Education in biotechnology.', children: [ { title: 'B.Tech/B.Sc in Biotechnology', description: 'A degree focused on the application of biology.', children: [ { title: 'Core Subjects', description: 'Key courses in the program.', children: [ { title: 'Genetics', description: 'The study of genes and heredity.' }, { title: 'Microbiology', description: 'The study of microorganisms.' }, { title: 'Immunology', description: 'The study of the immune system.' } ] }, { title: 'Job Roles', description: 'Careers in the biotech industry.', children: [ { title: 'Biotechnologist', description: 'Uses biological systems to create products.' }, { title: 'Research Scientist', description: 'Conducts research in a biotech lab.' }, { title: 'Quality Control Analyst', description: 'Ensures the quality of biotech products.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for biotech professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'PCR, Electrophoresis', description: 'Common techniques in molecular biology.' }, { title: 'Cell Culture', description: 'Growing cells in a lab.' }, { title: 'Bioinformatics Tools', description: 'Using software to analyze biological data.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Interpreting experimental data.' }, { title: 'Patience', description: 'The ability to persevere through long experiments.' }, { title: 'Ethical Judgement', description: 'Understanding the ethical implications of biotech.' } ] } ] },
            { title: 'Future Scope', description: 'The future of biotechnology.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Tech/M.Sc in Biotechnology', description: 'A master\'s degree for advanced study.' } ] }, { title: 'Emerging Trends', description: 'New frontiers in biotech.', children: [ { title: 'CRISPR Gene Editing', description: 'A powerful tool for editing DNA.' }, { title: 'Synthetic Biology', description: 'Designing and building new biological systems.' }, { title: 'Personalized Medicine', description: 'Tailoring medical treatment to individual patients.' } ] } ] }
        ]
    },
    healthcare_edu: {
        title: 'Healthcare & Education',
        description: 'Involves providing medical services and educating future healthcare professionals.',
        children: [
            { title: 'Academics', description: 'Education in healthcare and education.', children: [ { title: 'MBBS, B.Sc Nursing, B.Ed', description: 'Degrees for careers as doctors, nurses, and teachers.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Anatomy', description: 'The study of the human body.' }, { title: 'Physiology', description: 'The study of how the body works.' }, { title: 'Pedagogy', description: 'The theory and practice of teaching.' } ] }, { title: 'Job Roles', description: 'Careers in healthcare and education.', children: [ { title: 'Doctor', description: 'Diagnoses and treats illnesses.' }, { title: 'Nurse', description: 'Provides patient care.' }, { title: 'Medical Professor', description: 'Teaches at a medical school.' }, { title: 'Health Educator', description: 'Teaches people about health and wellness.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Clinical Skills', description: 'The skills needed to provide patient care.' }, { title: 'Diagnosis', description: 'Identifying diseases from symptoms.' }, { title: 'Curriculum Design', description: 'Creating educational programs.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Empathy', description: 'Understanding and sharing the feelings of others.' }, { title: 'Communication', description: 'Clearly communicating with patients and students.' }, { title: 'Patience', description: 'The ability to remain calm in stressful situations.' } ] } ] },
            { title: 'Future Scope', description: 'The future of healthcare and education.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'MD/MS Specialization', description: 'Advanced training for doctors in a specific area.' }, { title: 'PhD in Education', description: 'The highest degree for a career in education research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Telemedicine', description: 'Providing healthcare remotely using technology.' }, { title: 'Personalized Medicine', description: 'Tailoring treatment to individual patients.' }, { title: 'EdTech in Healthcare', description: 'Using technology to improve healthcare education.' } ] } ] }
        ]
    },
    medicine_pharmacy: {
        title: 'Medicine & Pharmacy',
        description: 'The science and practice of the diagnosis, treatment, and prevention of disease, and the discovery and manufacturing of drugs.',
        children: [
            { title: 'Academics', description: 'Education in medicine and pharmacy.', children: [ { title: 'MBBS / B.Pharm/Pharm.D', description: 'Degrees for careers as doctors and pharmacists.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Pharmacology', description: 'The study of drugs and their effects.' }, { title: 'Human Anatomy', description: 'The study of the human body.' }, { title: 'Medicinal Chemistry', description: 'The chemistry of medicines.' } ] }, { title: 'Job Roles', description: 'Careers in medicine and pharmacy.', children: [ { title: 'Physician', description: 'A medical doctor.' }, { title: 'Pharmacist', description: 'Dispenses medications and advises patients.' }, { title: 'Clinical Researcher', description: 'Conducts clinical trials for new drugs.' }, { title: 'Drug Safety Associate', description: 'Monitors the safety of drugs.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Diagnosis', description: 'Identifying diseases.' }, { title: 'Drug Dispensing', description: 'Preparing and giving out medications.' }, { title: 'Clinical Trials Management', description: 'Managing the process of testing new drugs.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Attention to Detail', description: 'A high level of accuracy.' }, { title: 'Ethical Practice', description: 'Adhering to ethical principles.' }, { title: 'Patient Counseling', description: 'Advising patients on their medications.' } ] } ] },
            { title: 'Future Scope', description: 'The future of medicine and pharmacy.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'MD/MS, M.Pharm', description: 'Advanced degrees for doctors and pharmacists.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Pharmacogenomics', description: 'The study of how genes affect a person\'s response to drugs.' }, { title: 'Biopharmaceuticals', description: 'Drugs produced using biotechnology.' }, { title: 'Digital Therapeutics', description: 'Using software to treat diseases.' } ] } ] }
        ]
    },
    chem_life_sci: {
        title: 'Chemistry & Life Sciences',
        description: 'The study of matter, its properties, and the scientific study of life.',
        children: [
            { title: 'Academics', description: 'Education in chemistry and life sciences.', children: [ { title: 'B.Sc/M.Sc in Chemistry/Biology/Biochemistry', description: 'A science degree in these fundamental fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Organic Chemistry', description: 'The study of carbon-containing compounds.' }, { title: 'Molecular Biology', description: 'The study of biology at the molecular level.' }, { title: 'Cell Biology', description: 'The study of cells.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'Chemist', description: 'Studies the properties of matter.' }, { title: 'Biologist', description: 'Studies living organisms.' }, { title: 'Lab Analyst', description: 'Analyzes samples in a lab.' }, { title: 'Research Assistant', description: 'Assists with research projects.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Spectroscopy, Chromatography', description: 'Techniques for analyzing substances.' }, { title: 'Microscopy', description: 'Using microscopes to view small objects.' }, { title: 'DNA Sequencing', description: 'Determining the order of DNA nucleotides.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Interpreting data and solving problems.' }, { title: 'Methodical Approach', description: 'A systematic way of working.' }, { title: 'Data Interpretation', description: 'Making sense of scientific data.' } ] } ] },
            { title: 'Future Scope', description: 'The future of chemistry and life sciences.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Drug Discovery', description: 'The process of finding new medicines.' }, { title: 'Materials Science', description: 'Developing new materials with desired properties.' }, { title: 'Environmental Science', description: 'Studying the environment and solving its problems.' } ] } ] }
        ]
    },

    // --- COMMERCE / BUSINESS ---
    corp_biz_mgmt: {
        title: 'Corporate & Business Management',
        description: 'Overseeing and supervising business operations.',
        children: [
            { title: 'Academics', description: 'Education for a career in business management.', children: [ { title: 'BBA/BMS/MBA', description: 'Degrees in business administration and management.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Organizational Behavior', description: 'The study of how people behave in organizations.' }, { title: 'Business Strategy', description: 'Planning to achieve business goals.' }, { title: 'Operations Management', description: 'Managing the production of goods and services.' } ] }, { title: 'Job Roles', description: 'Careers in business management.', children: [ { title: 'Manager', description: 'Leads a team or department.' }, { title: 'Business Consultant', description: 'Advises companies on how to improve.' }, { title: 'Operations Head', description: 'Manages a company\'s daily operations.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for managers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Project Management', description: 'Planning and executing projects.' }, { title: 'Financial Literacy', description: 'Understanding financial statements.' }, { title: 'Data Analysis', description: 'Using data to make decisions.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Leadership', description: 'Inspiring and guiding a team.' }, { title: 'Decision Making', description: 'Making effective choices.' }, { title: 'Negotiation', description: 'Reaching agreements with others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of business management.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for leadership roles.', children: [ { title: 'Executive MBA', description: 'An MBA for experienced professionals.' }, { title: 'PhD in Management', description: 'For a career in management research.' } ] }, { title: 'Emerging Trends', description: 'New directions in management.', children: [ { title: 'Digital Transformation', description: 'Using digital technology to change business processes.' }, { title: 'Sustainable Business Practices', description: 'Operating a business in an environmentally and socially responsible way.' }, { title: 'Agile Management', description: 'An iterative approach to managing projects.' } ] } ] }
        ]
    },
    startups_entrepreneurship: {
        title: 'Startups & Entrepreneurship',
        description: 'The activity of setting up a business or businesses, taking on financial risks in the hope of profit.',
        children: [
            { title: 'Academics', description: 'Education for entrepreneurs.', children: [ { title: 'BBA in Entrepreneurship / Any Degree', description: 'A business degree or any degree combined with entrepreneurial skills.', children: [ { title: 'Core Concepts', description: 'Key ideas in entrepreneurship.', children: [ { title: 'Business Model Canvas', description: 'A tool for developing business models.' }, { title: 'Venture Capital Funding', description: 'Funding for startups from investors.' }, { title: 'Lean Startup', description: 'A methodology for building businesses with minimal waste.' } ] }, { title: 'Job Roles', description: 'Careers in the startup world.', children: [ { title: 'Founder/Co-founder', description: 'Starts a new business.' }, { title: 'Product Manager', description: 'Manages a product in a startup.' }, { title: 'Business Development Manager', description: 'Finds new business opportunities.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for entrepreneurs.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Fundraising', description: 'Raising money for a startup.' }, { title: 'Digital Marketing', description: 'Marketing online.' }, { title: 'Financial Projections', description: 'Forecasting a company\'s financial future.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Resilience', description: 'Bouncing back from setbacks.' }, { title: 'Risk-taking', description: 'Willingness to take calculated risks.' }, { title: 'Networking', description: 'Building relationships with other people.' } ] } ] },
            { title: 'Future Scope', description: 'The future of entrepreneurship.', children: [ { title: 'Growth', description: 'Paths for entrepreneurial growth.', children: [ { title: 'Scaling the Business', description: 'Growing a startup into a large company.' }, { title: 'Serial Entrepreneurship', description: 'Starting multiple businesses.' }, { title: 'Angel Investing', description: 'Investing in other startups.' } ] }, { title: 'Emerging Trends', description: 'New types of startups.', children: [ { title: 'Tech Startups (SaaS, FinTech)', description: 'Startups in technology sectors.' }, { title: 'Social Entrepreneurship', description: 'Businesses with a social mission.' }, { title: 'D2C Brands', description: 'Brands that sell directly to consumers online.' } ] } ] }
        ]
    },
    accounting_financial: {
        title: 'Accounting & Financial Analysis',
        description: 'Recording, summarizing, analyzing, and reporting financial transactions.',
        children: [
            { title: 'Academics', description: 'Education for a career in accounting and finance.', children: [ { title: 'B.Com/M.Com/CA/CFA', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Financial Accounting', description: 'Recording and reporting financial transactions.' }, { title: 'Investment Analysis', description: 'Evaluating investment opportunities.' }, { title: 'Corporate Finance', description: 'Managing the finances of a corporation.' } ] }, { title: 'Job Roles', description: 'Careers in accounting and finance.', children: [ { title: 'Accountant', description: 'Manages financial records.' }, { title: 'Financial Analyst', description: 'Analyzes financial data to make recommendations.' }, { title: 'Auditor', description: 'Examines financial records for accuracy.' }, { title: 'Investment Banker', description: 'Helps companies raise money.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Financial Modeling (Excel)', description: 'Using Excel to build financial models.' }, { title: 'Accounting Software (Tally, QuickBooks)', description: 'Software for managing financial records.' }, { title: 'Valuation Methods', description: 'Techniques for determining the value of a company.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Attention to Detail', description: 'A high level of accuracy.' }, { title: 'Ethical Judgement', description: 'Making ethical decisions.' }, { title: 'Analytical Skills', description: 'Analyzing complex financial data.' } ] } ] },
            { title: 'Future Scope', description: 'The future of accounting and finance.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'MBA in Finance', description: 'A master\'s degree focused on finance.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'FinTech', description: 'The use of technology in finance.' }, { title: 'Forensic Accounting', description: 'Investigating financial fraud.' }, { title: 'Robotic Process Automation (RPA) in Accounting', description: 'Using software robots to automate accounting tasks.' } ] } ] }
        ]
    },
    marketing_corp_comm: {
        title: 'Marketing & Corporate Communication',
        description: 'Managing a company\'s internal and external communications and promoting products/services.',
        children: [
            { title: 'Academics', description: 'Education for a career in marketing and communications.', children: [ { title: 'BBA/MBA in Marketing', description: 'Business degrees with a focus on marketing.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Brand Management', description: 'Managing a company\'s brand.' }, { title: 'Public Relations', description: 'Managing a company\'s public image.' }, { title: 'Digital Marketing', description: 'Marketing online.' } ] }, { title: 'Job Roles', description: 'Careers in marketing and communications.', children: [ { title: 'Marketing Manager', description: 'Manages a company\'s marketing efforts.' }, { title: 'Corporate Comms Specialist', description: 'Manages a company\'s communications.' }, { title: 'Public Relations Officer', description: 'Works with the media to promote a company.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'SEO/SEM', description: 'Optimizing websites for search engines.' }, { title: 'Content Creation', description: 'Creating marketing content.' }, { title: 'Social Media Management', description: 'Managing a company\'s social media presence.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Communication', description: 'Clearly conveying messages.' }, { title: 'Creativity', description: 'Generating new ideas.' }, { title: 'Storytelling', description: 'Creating compelling narratives.' } ] } ] },
            { title: 'Future Scope', description: 'The future of marketing and communications.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'Masters in Mass Communication', description: 'An advanced degree in communications.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Influencer Marketing', description: 'Using social media influencers to promote products.' }, { title: 'AI in Marketing', description: 'Using AI to personalize marketing.' }, { title: 'Video Marketing', description: 'Using video to promote products.' } ] } ] }
        ]
    },
    accounting_compliance: {
        title: 'Accounting & Compliance',
        description: 'Ensuring a company adheres to outside rules and internal policies related to finance.',
        children: [
            { title: 'Academics', description: 'Education for a career in accounting and compliance.', children: [ { title: 'B.Com / M.Com / CA / CS', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Auditing', description: 'Examining financial records.' }, { title: 'Corporate Law', description: 'The laws governing corporations.' }, { title: 'Taxation', description: 'The laws related to taxes.' } ] }, { title: 'Job Roles', description: 'Careers in accounting and compliance.', children: [ { title: 'Compliance Officer', description: 'Ensures a company follows the law.' }, { title: 'Internal Auditor', description: 'Examines a company\'s internal controls.' }, { title: 'Risk Manager', description: 'Manages a company\'s risks.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Regulatory Knowledge (e.g., SEBI, RBI)', description: 'Understanding financial regulations.' }, { title: 'Risk Assessment', description: 'Identifying and evaluating risks.' }, { title: 'Legal Interpretation', description: 'Understanding and applying laws.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Meticulousness', description: 'A high level of attention to detail.' }, { title: 'Integrity', description: 'Honesty and strong moral principles.' }, { title: 'Analytical Skills', description: 'Analyzing complex information.' } ] } ] },
            { title: 'Future Scope', description: 'The future of accounting and compliance.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'Certified Compliance & Ethics Professional (CCEP)', description: 'A certification for compliance professionals.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'RegTech (Regulatory Technology)', description: 'Using technology to improve compliance.' }, { title: 'Data Privacy Laws (GDPR, etc.)', description: 'Laws protecting personal data.' }, { title: 'ESG Reporting', description: 'Reporting on environmental, social, and governance factors.' } ] } ] }
        ]
    },
    hr_org_dev: {
        title: 'HR & Organizational Development',
        description: 'Managing employee lifecycle and improving an organization\'s effectiveness.',
        children: [
            { title: 'Academics', description: 'Education for a career in HR.', children: [ { title: 'BBA/MBA in HR', description: 'Business degrees with a focus on human resources.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Talent Management', description: 'Attracting and retaining talented employees.' }, { title: 'Change Management', description: 'Managing organizational change.' }, { title: 'Industrial Relations', description: 'Managing relationships with unions.' } ] }, { title: 'Job Roles', description: 'Careers in HR.', children: [ { title: 'HR Manager', description: 'Manages a company\'s HR functions.' }, { title: 'OD Consultant', description: 'Helps organizations improve their effectiveness.' }, { title: 'Talent Acquisition Specialist', description: 'Recruits new employees.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for HR professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'HRIS Software (e.g., Workday)', description: 'Software for managing HR data.' }, { title: 'Performance Management Systems', description: 'Systems for evaluating employee performance.' }, { title: 'Labor Law Knowledge', description: 'Understanding employment laws.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Interpersonal Skills', description: 'The ability to interact effectively with others.' }, { title: 'Empathy', description: 'Understanding the feelings of others.' }, { title: 'Conflict Resolution', description: 'Resolving disputes between people.' } ] } ] },
            { title: 'Future Scope', description: 'The future of HR.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'Specialized HR Certifications (e.g., SHRM)', description: 'Certifications for HR professionals.' } ] }, { title: 'Emerging Trends', description: 'New directions in HR.', children: [ { title: 'People Analytics', description: 'Using data to make HR decisions.' }, { title: 'Future of Work (Remote/Hybrid)', description: 'The changing nature of work.' }, { title: 'Employee Experience', description: 'Creating a positive experience for employees.' } ] } ] }
        ]
    },
    law_corp_gov: {
        title: 'Law & Corporate Governance',
        description: 'Legal aspects of business and the system of rules, practices, and processes by which a company is directed and controlled.',
        children: [
            { title: 'Academics', description: 'Education for a career in corporate law.', children: [ { title: 'LLB / Company Secretary (CS)', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Company Law', description: 'The laws governing companies.' }, { title: 'Securities Law', description: 'The laws governing stocks and bonds.' }, { title: 'Contract Law', description: 'The laws governing agreements.' } ] }, { title: 'Job Roles', description: 'Careers in corporate law.', children: [ { title: 'Corporate Lawyer', description: 'Advises companies on legal matters.' }, { title: 'Company Secretary', description: 'Ensures a company complies with the law.' }, { title: 'Legal Advisor', description: 'Provides legal advice to a company.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for corporate lawyers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Legal Drafting', description: 'Writing legal documents.' }, { title: 'Regulatory Filings', description: 'Filing documents with government agencies.' }, { title: 'Litigation Research', description: 'Researching legal issues for lawsuits.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Ability', description: 'Analyzing complex legal issues.' }, { title: 'Integrity', description: 'Honesty and strong moral principles.' }, { title: 'Negotiation', description: 'Reaching agreements with others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of corporate law.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'LLM in Corporate Law', description: 'A master\'s degree in corporate law.' } ] }, { title: 'Emerging Trends', description: 'New directions in corporate law.', children: [ { title: 'ESG (Environmental, Social, Governance)', description: 'Considering ESG factors in business decisions.' }, { title: 'Data Privacy & Cybersecurity Law', description: 'Laws protecting data and computer systems.' }, { title: 'Insolvency & Bankruptcy Code', description: 'The laws governing bankruptcy.' } ] } ] }
        ]
    },
    marketing_brand_strategy: {
        title: 'Marketing & Brand Strategy',
        description: 'Developing long-term plans for a brand to achieve specific goals.',
        children: [
            { title: 'Academics', description: 'Education for a career in brand strategy.', children: [ { title: 'BBA/MBA in Marketing', description: 'Business degrees with a focus on marketing.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Brand Management', description: 'Managing a company\'s brand.' }, { title: 'Consumer Behavior', description: 'The study of how people make purchasing decisions.' }, { title: 'Marketing Research', description: 'Gathering information about customers.' } ] }, { title: 'Job Roles', description: 'Careers in brand strategy.', children: [ { title: 'Brand Manager', description: 'Manages a company\'s brand.' }, { title: 'Marketing Strategist', description: 'Develops marketing plans.' }, { title: 'Product Marketing Manager', description: 'Markets a specific product.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for brand strategists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Market Research Analysis', description: 'Analyzing market data.' }, { title: 'Digital Marketing Analytics', description: 'Analyzing online marketing data.' }, { title: 'Competitive Analysis', description: 'Analyzing competitors.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Strategic Thinking', description: 'Thinking long-term.' }, { title: 'Creativity', description: 'Generating new ideas.' }, { title: 'Leadership', description: 'Leading a marketing team.' } ] } ] },
            { title: 'Future Scope', description: 'The future of brand strategy.', children: [ { title: 'Higher Studies', description: 'Advanced courses.', children: [ { title: 'Specialized courses in branding', description: 'Courses focused on specific aspects of branding.' } ] }, { title: 'Emerging Trends', description: 'New directions in branding.', children: [ { title: 'Personalized Marketing', description: 'Tailoring marketing to individual customers.' }, { title: 'Purpose-driven Branding', description: 'Brands that have a social mission.' }, { title: 'MarTech', description: 'The use of technology in marketing.' } ] } ] }
        ]
    },
    entrepreneurship_small_biz: {
        title: 'Entrepreneurship & Small Business',
        description: 'Focuses on building and managing a small-scale business venture.',
        children: [
            { title: 'Academics', description: 'Education for small business owners.', children: [ { title: 'BBA/Diploma in Entrepreneurship', description: 'Degrees and diplomas focused on starting a business.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Business Plan Development', description: 'Creating a plan for a new business.' }, { title: 'Small Business Finance', description: 'Managing the finances of a small business.' } ] }, { title: 'Job Roles', description: 'Careers in small business.', children: [ { title: 'Small Business Owner', description: 'Runs their own business.' }, { title: 'Franchisee', description: 'Owns a franchise of a larger company.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for small business owners.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Bookkeeping', description: 'Keeping financial records.' }, { title: 'Sales & Customer Service', description: 'Selling products and helping customers.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Multitasking', description: 'Handling multiple tasks at once.' }, { title: 'Adaptability', description: 'Adjusting to changing circumstances.' } ] } ] },
            { title: 'Future Scope', description: 'The future of small business.', children: [ { title: 'Growth', description: 'Paths for growing a small business.', children: [ { title: 'Scaling Operations', description: 'Expanding a business.' }, { title: 'Exploring New Markets', description: 'Selling products in new places.' } ] }, { title: 'Emerging Trends', description: 'New opportunities for small businesses.', children: [ { title: 'E-commerce for Small Business', description: 'Selling products online.' }, { title: 'Local Sourcing', description: 'Buying products from local suppliers.' } ] } ] }
        ]
    },
     intl_biz_trade: {
        title: 'International Business & Trade',
        description: 'Business activities that take place across national borders.',
        children: [
            { title: 'Academics', description: 'Education for a career in international business.', children: [ { title: 'BBA/MBA in International Business', description: 'Business degrees with a global focus.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Export-Import Management', description: 'Managing the process of exporting and importing goods.' }, { title: 'Foreign Exchange', description: 'The exchange of one currency for another.' } ] }, { title: 'Job Roles', description: 'Careers in international business.', children: [ { title: 'Export Manager', description: 'Manages a company\'s exports.' }, { title: 'Global Supply Chain Manager', description: 'Manages a company\'s global supply chain.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for international business professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Knowledge of Incoterms', description: 'International rules for the interpretation of trade terms.' }, { title: 'Trade Finance', description: 'Financing for international trade.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Cross-cultural Communication', description: 'Communicating effectively with people from different cultures.' }, { title: 'Negotiation', description: 'Reaching agreements with international partners.' } ] } ] },
            { title: 'Future Scope', description: 'The future of international business.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'Masters in International Trade', description: 'A master\'s degree focused on international trade.' } ] }, { title: 'Emerging Trends', description: 'New directions in international business.', children: [ { title: 'Geopolitical Risk Analysis', description: 'Analyzing political risks in different countries.' }, { title: 'Blockchain in Supply Chain', description: 'Using blockchain to improve supply chain transparency.' } ] } ] }
        ]
    },
    finance_investment: {
        title: 'Finance & Investment',
        description: 'Managing money and the process of investing it in various assets.',
        children: [
            { title: 'Academics', description: 'Education for a career in finance and investment.', children: [ { title: 'B.Com/MBA Finance/CFA', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Portfolio Management', description: 'Managing a portfolio of investments.' }, { title: 'Financial Derivatives', description: 'Financial instruments whose value is derived from other assets.' } ] }, { title: 'Job Roles', description: 'Careers in finance and investment.', children: [ { title: 'Investment Analyst', description: 'Analyzes investments.' }, { title: 'Portfolio Manager', description: 'Manages an investment portfolio.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for investment professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Financial Modeling', description: 'Building financial models.' }, { title: 'Equity Research', description: 'Researching stocks.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Analyzing financial data.' }, { title: 'Risk Assessment', description: 'Evaluating investment risks.' } ] } ] },
            { title: 'Future Scope', description: 'The future of finance and investment.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'FRM/CAIA Certifications', description: 'Certifications for risk and alternative investment professionals.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Robo-advisors', description: 'Automated investment advice.' }, { title: 'Impact Investing', description: 'Investing to create social and environmental impact.' } ] } ] }
        ]
    },
    mgmt_leadership: {
        title: 'Management & Leadership Studies',
        description: 'The study of how to organize and lead teams and organizations effectively.',
        children: [
            { title: 'Academics', description: 'Education in management and leadership.', children: [ { title: 'BBA/MBA', description: 'Business degrees that teach leadership skills.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Leadership Theories', description: 'Different approaches to leadership.' }, { title: 'Strategic Management', description: 'Planning to achieve organizational goals.' } ] }, { title: 'Job Roles', description: 'Careers in management and leadership.', children: [ { title: 'Team Lead', description: 'Leads a team of employees.' }, { title: 'Management Consultant', description: 'Advises companies on management issues.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for leaders.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Performance Management', description: 'Managing employee performance.' }, { title: 'Strategic Planning', description: 'Developing long-term plans.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Motivation', description: 'Inspiring others to do their best.' }, { title: 'Communication', description: 'Clearly communicating a vision.' }, { title: 'Decision Making', description: 'Making effective decisions.' } ] } ] },
            { title: 'Future Scope', description: 'The future of leadership.', children: [ { title: 'Higher Studies', description: 'Continuing education for leaders.', children: [ { title: 'Executive Education Programs', description: 'Programs for experienced managers.' } ] }, { title: 'Emerging Trends', description: 'New approaches to leadership.', children: [ { title: 'Agile Leadership', description: 'A flexible and adaptive leadership style.' }, { title: 'Leading Remote Teams', description: 'Managing teams that work remotely.' } ] } ] }
        ]
    },
    tax_accounting: {
        title: 'Taxation & Accounting',
        description: 'Focuses on tax laws and compliance alongside general accounting practices.',
        children: [
            { title: 'Academics', description: 'Education for a career in tax and accounting.', children: [ { title: 'B.Com/M.Com/CA', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Direct & Indirect Taxation', description: 'The different types of taxes.' }, { title: 'Financial Accounting', description: 'Recording and reporting financial transactions.' } ] }, { title: 'Job Roles', description: 'Careers in tax and accounting.', children: [ { title: 'Tax Consultant', description: 'Advises on tax matters.' }, { title: 'Accountant', description: 'Manages financial records.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for tax and accounting professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Tax Software', description: 'Software for preparing tax returns.' }, { title: 'Statutory Compliance', description: 'Complying with tax laws.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Attention to Detail', description: 'A high level of accuracy.' }, { title: 'Ethical Conduct', description: 'Acting with integrity.' } ] } ] },
            { title: 'Future Scope', description: 'The future of tax and accounting.', children: [ { title: 'Higher Studies', description: 'Advanced qualifications.', children: [ { title: 'Diploma in Taxation Law', description: 'A specialized diploma in tax law.' } ] }, { title: 'Emerging Trends', description: 'New developments in the field.', children: [ { title: 'GST Regulations', description: 'The Goods and Services Tax in India.' }, { title: 'International Taxation', description: 'Tax laws that apply across borders.' } ] } ] }
        ]
    },
    sales_growth: {
        title: 'Sales & Business Growth',
        description: 'Driving revenue by selling products or services and expanding the business.',
        children: [
            { title: 'Academics', description: 'Education for a career in sales.', children: [ { title: 'BBA/MBA in Sales & Marketing', description: 'Business degrees with a focus on sales.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Sales Techniques', description: 'Methods for selling products effectively.' }, { title: 'Customer Relationship Management', description: 'Managing relationships with customers.' } ] }, { title: 'Job Roles', description: 'Careers in sales.', children: [ { title: 'Sales Executive', description: 'Sells products to customers.' }, { title: 'Business Development Manager', description: 'Finds new business opportunities.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for sales professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'CRM Software (Salesforce)', description: 'Software for managing customer relationships.' }, { title: 'Lead Generation', description: 'Finding potential customers.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Persuasion', description: 'Convincing people to buy products.' }, { title: 'Negotiation', description: 'Reaching agreements with customers.' }, { title: 'Resilience', description: 'Bouncing back from rejection.' } ] } ] },
            { title: 'Future Scope', description: 'The future of sales.', children: [ { title: 'Career Growth', description: 'Paths for advancement in sales.', children: [ { title: 'Sales Manager', description: 'Manages a team of sales people.' }, { title: 'Head of Sales', description: 'Leads a company\'s sales department.' } ] }, { title: 'Emerging Trends', description: 'New approaches to sales.', children: [ { title: 'Social Selling', description: 'Using social media to sell products.' }, { title: 'AI in Sales', description: 'Using AI to improve sales.' } ] } ] }
        ]
    },
    finance_mgmt: {
        title: 'Finance & Management',
        description: 'An integrated field combining financial expertise with management principles.',
        children: [
            { title: 'Academics', description: 'Education for a career in finance and management.', children: [ { title: 'MBA in Finance', description: 'A business degree with a focus on finance.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Corporate Finance', description: 'Managing the finances of a corporation.' }, { title: 'Strategic Management', description: 'Planning to achieve organizational goals.' } ] }, { title: 'Job Roles', description: 'Careers in finance and management.', children: [ { title: 'Finance Manager', description: 'Manages a company\'s finances.' }, { title: 'Management Consultant', description: 'Advises companies on financial and management issues.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Financial Planning & Analysis (FP&A)', description: 'Planning and analyzing a company\'s finances.' }, { title: 'Budgeting', description: 'Creating and managing a budget.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Leadership', description: 'Leading a team.' }, { title: 'Strategic Thinking', description: 'Thinking long-term.' } ] } ] },
            { title: 'Future Scope', description: 'The future of finance and management.', children: [ { title: 'Career Paths', description: 'Paths for advancement.', children: [ { title: 'Chief Financial Officer (CFO)', description: 'The top financial position in a company.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'FinTech Integration', description: 'Integrating new financial technologies.' }, { title: 'Data-Driven Financial Decisions', description: 'Using data to make financial decisions.' } ] } ] }
        ]
    },
    marketing_analytics_research: {
        title: 'Marketing Analytics & Research',
        description: 'Analyzing marketing data to understand performance and inform strategy.',
        children: [
            { title: 'Academics', description: 'Education for a career in marketing analytics.', children: [ { title: 'MBA in Marketing / B.Sc Statistics', description: 'Degrees with a focus on data and marketing.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Market Research', description: 'Gathering information about customers.' }, { title: 'Data Analytics', description: 'Analyzing data to find insights.' } ] }, { title: 'Job Roles', description: 'Careers in marketing analytics.', children: [ { title: 'Market Research Analyst', description: 'Analyzes market data.' }, { title: 'Marketing Analyst', description: 'Analyzes marketing campaign data.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for marketing analysts.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Google Analytics, SQL', description: 'Tools for analyzing web and database data.' }, { title: 'Statistical Software (R, Python)', description: 'Software for statistical analysis.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Mindset', description: 'A structured approach to problem-solving.' }, { title: 'Data Storytelling', description: 'Communicating data insights in a compelling way.' } ] } ] },
            { title: 'Future Scope', description: 'The future of marketing analytics.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'Certifications in Digital Marketing Analytics', description: 'Certifications to demonstrate expertise.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Predictive Analytics for Marketing', description: 'Using data to predict future marketing outcomes.' }, { title: 'Customer Lifetime Value Analysis', description: 'Analyzing the value of a customer over time.' } ] } ] }
        ]
    },
    financial_risk: {
        title: 'Financial Risk & Analysis',
        description: 'Identifying, analyzing, and mitigating financial risks within an organization.',
        children: [
            { title: 'Academics', description: 'Education for a career in financial risk.', children: [ { title: 'MBA Finance / FRM Certification', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Risk Management', description: 'Managing financial risks.' }, { title: 'Financial Derivatives', description: 'Financial instruments used to manage risk.' } ] }, { title: 'Job Roles', description: 'Careers in financial risk.', children: [ { title: 'Risk Analyst', description: 'Analyzes financial risks.' }, { title: 'Credit Risk Manager', description: 'Manages the risk of customers not paying back loans.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for risk professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Risk Modeling', description: 'Building models to quantify risk.' }, { title: 'Value at Risk (VaR) analysis', description: 'A technique to measure financial risk.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Analyzing complex financial data.' }, { title: 'Prudence', description: 'Acting with caution and good judgment.' } ] } ] },
            { title: 'Future Scope', description: 'The future of financial risk management.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'PRM Certification', description: 'A certification for professional risk managers.' } ] }, { title: 'Emerging Trends', description: 'New types of financial risks.', children: [ { title: 'Cybersecurity Risk', description: 'The risk of financial loss from cyberattacks.' }, { title: 'Climate Risk Analysis', description: 'The risk of financial loss from climate change.' } ] } ] }
        ]
    },
    hr_comm: {
        title: 'HR & Communication',
        description: 'Focuses on the communication aspect within Human Resources.',
        children: [
            { title: 'Academics', description: 'Education for a career in HR communications.', children: [ { title: 'MBA in HR / MA in Communication', description: 'Degrees combining HR and communication.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Internal Communication', description: 'Communicating with employees.' }, { title: 'Employee Engagement', description: 'Keeping employees motivated and engaged.' } ] }, { title: 'Job Roles', description: 'Careers in HR communications.', children: [ { title: 'Internal Communications Manager', description: 'Manages a company\'s internal communications.' }, { title: 'HR Business Partner', description: 'Works with business leaders on HR issues.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Content Creation', description: 'Creating communications materials.' }, { title: 'Survey Tools', description: 'Using surveys to gather employee feedback.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Interpersonal Skills', description: 'The ability to interact effectively with others.' }, { title: 'Clarity in Communication', description: 'Communicating clearly and concisely.' } ] } ] },
            { title: 'Future Scope', description: 'The future of HR communications.', children: [ { title: 'Career Growth', description: 'Paths for advancement.', children: [ { title: 'Head of HR Communication', description: 'Leads a company\'s HR communications function.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digital Employee Experience Platforms', description: 'Platforms for improving the employee experience.' }, { title: 'Change Management Communication', description: 'Communicating about organizational change.' } ] } ] }
        ]
    },
    investment_capital: {
        title: 'Investment & Capital Markets',
        description: 'Deals with the functioning of capital markets and investment strategies.',
        children: [
            { title: 'Academics', description: 'Education for a career in this field.', children: [ { title: 'MBA Finance / CFA', description: 'Degrees and certifications for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Capital Markets', description: 'The markets where stocks and bonds are traded.' }, { title: 'Securities Analysis', description: 'Analyzing stocks and bonds.' } ] }, { title: 'Job Roles', description: 'Careers in this field.', children: [ { title: 'Equity Research Analyst', description: 'Researches stocks.' }, { title: 'Investment Banker', description: 'Helps companies raise money.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Financial Modeling', description: 'Building financial models.' }, { title: 'Valuation', description: 'Determining the value of a company.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Market Awareness', description: 'Understanding what is happening in the markets.' }, { title: 'Analytical Skills', description: 'Analyzing financial data.' } ] } ] },
            { title: 'Future Scope', description: 'The future of investment and capital markets.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'NISM Certifications', description: 'Certifications from the National Institute of Securities Markets.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Algorithmic Trading', description: 'Using computer algorithms to trade stocks.' }, { title: 'FinTech', description: 'The use of technology in finance.' } ] } ] }
        ]
    },
    marketing_analytics_insights: {
        title: 'Marketing Analytics & Insights',
        description: 'Goes beyond data to provide actionable insights for marketing decisions.',
        children: [
            { title: 'Academics', description: 'Education for a career in marketing insights.', children: [ { title: 'MBA Marketing', description: 'A business degree with a focus on marketing.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Consumer Behavior', description: 'The study of how people make purchasing decisions.' }, { title: 'Marketing Analytics', description: 'Analyzing marketing data.' } ] }, { title: 'Job Roles', description: 'Careers in marketing insights.', children: [ { title: 'Consumer Insights Manager', description: 'Manages research into consumer behavior.' }, { title: 'Marketing Strategist', description: 'Develops marketing plans based on insights.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Qualitative & Quantitative Research', description: 'Different methods for gathering data.' }, { title: 'Data Visualization', description: 'Creating visual representations of data.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Curiosity', description: 'A strong desire to learn and understand.' }, { title: 'Business Acumen', description: 'Understanding how a business works.' } ] } ] },
            { title: 'Future Scope', description: 'The future of marketing insights.', children: [ { title: 'Career Growth', description: 'Paths for advancement.', children: [ { title: 'Head of Marketing Insights', description: 'Leads a company\'s marketing insights function.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Neuromarketing', description: 'Using neuroscience to study marketing.' }, { title: 'AI for Insight Generation', description: 'Using AI to find insights in data.' } ] } ] }
        ]
    },
    auditing_compliance: {
        title: 'Auditing & Financial Compliance',
        description: 'Examines financial records to ensure fairness and compliance with regulations.',
        children: [
            { title: 'Academics', description: 'Education for a career in auditing and compliance.', children: [ { title: 'CA/ACCA', description: 'Certifications for accountants and auditors.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Auditing Standards', description: 'The rules for conducting an audit.' }, { title: 'Corporate Law', description: 'The laws governing corporations.' } ] }, { title: 'Job Roles', description: 'Careers in auditing and compliance.', children: [ { title: 'Auditor', description: 'Examines financial records.' }, { title: 'Forensic Accountant', description: 'Investigates financial fraud.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Statutory Audit', description: 'An audit required by law.' }, { title: 'Internal Controls', description: 'The processes used to prevent fraud.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Skepticism', description: 'A questioning attitude.' }, { title: 'Integrity', description: 'Honesty and strong moral principles.' }, { title: 'Attention to Detail', description: 'A high level of accuracy.' } ] } ] },
            { title: 'Future Scope', description: 'The future of auditing and compliance.', children: [ { title: 'Higher Studies', description: 'Advanced certifications.', children: [ { title: 'CISA/DISA certifications', description: 'Certifications for information systems auditors.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Data Analytics in Auditing', description: 'Using data analytics to improve audits.' }, { title: 'Continuous Auditing', description: 'Auditing in real-time.' } ] } ] }
        ]
    },


    // --- ARTS / HUMANITIES ---
    history_archaeology: {
        title: 'History & Archaeology',
        description: 'The study of the human past through written documents and material remains.',
        children: [
            { title: 'Academics', description: 'Education for a career in history and archaeology.', children: [ { title: 'B.A./M.A. in History/Archaeology', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Historiography', description: 'The study of how history is written.' }, { title: 'Excavation Techniques', description: 'The methods used to excavate archaeological sites.' }, { title: 'Epigraphy', description: 'The study of ancient inscriptions.' } ] }, { title: 'Job Roles', description: 'Careers in history and archaeology.', children: [ { title: 'Historian', description: 'Studies and writes about the past.' }, { title: 'Archaeologist', description: 'Studies the past through material remains.' }, { title: 'Museum Curator', description: 'Manages a museum\'s collection.' }, { title: 'Archivist', description: 'Manages historical records.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Archival Research', description: 'Researching in historical archives.' }, { title: 'Artifact Analysis', description: 'Analyzing historical objects.' }, { title: 'Dating Techniques', description: 'Methods for determining the age of objects.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Research Skills', description: 'The ability to find and evaluate information.' }, { title: 'Critical Analysis', description: 'Analyzing information objectively.' }, { title: 'Patience', description: 'The ability to persevere through long research projects.' } ] } ] },
            { title: 'Future Scope', description: 'The future of history and archaeology.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Digital Humanities', description: 'Using digital tools to study the humanities.' }, { title: 'Computational Archaeology', description: 'Using computers to analyze archaeological data.' }, { title: 'Public History', description: 'Making history accessible to the public.' } ] } ] }
        ]
    },
    philosophy_politics: {
        title: 'Philosophy & Political Studies',
        description: 'Examines fundamental questions about existence, knowledge, values, reason, mind, and language, and the theory and practice of politics.',
        children: [
            { title: 'Academics', description: 'Education for a career in philosophy and politics.', children: [ { title: 'B.A./M.A. in Philosophy/Political Science', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Ethics', description: 'The study of moral principles.' }, { title: 'Political Theory', description: 'The study of political ideas.' }, { title: 'International Relations', description: 'The study of relationships between countries.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'Policy Analyst', description: 'Analyzes public policy.' }, { title: 'Civil Servant (UPSC)', description: 'Works for the government.' }, { title: 'Journalist', description: 'Writes about politics and current events.' }, { title: 'Academic', description: 'Teaches and researches at a university.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Logical Reasoning', description: 'The ability to think logically.' }, { title: 'Argumentation', description: 'The ability to make a convincing argument.' }, { title: 'Qualitative Research', description: 'Research based on non-numerical data.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Critical Thinking', description: 'Analyzing information objectively.' }, { title: 'Persuasive Writing', description: 'Writing in a way that convinces others.' }, { title: 'Debating', description: 'Arguing a point of view.' } ] } ] },
            { title: 'Future Scope', description: 'The future of philosophy and politics.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'PhD, Law School (LLB)', description: 'Advanced degrees for careers in academia or law.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'AI Ethics', description: 'The ethical implications of artificial intelligence.' }, { title: 'Global Governance', description: 'The way the world is governed.' }, { title: 'Public Policy', description: 'The study of how governments make decisions.' } ] } ] }
        ]
    },
    performing_arts: {
        title: 'Performing Arts & Theatre',
        description: 'Art forms in which artists use their voices, bodies or inanimate objects to convey artistic expression.',
        children: [
            { title: 'Academics', description: 'Education in the performing arts.', children: [ { title: 'B.A./M.A. in Theatre Arts/Drama (e.g., National School of Drama)', description: 'Degrees from prestigious drama schools.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Acting', description: 'The art of performing a role.' }, { title: 'Directing', description: 'The art of guiding a performance.' }, { title: 'Stagecraft', description: 'The technical aspects of a theatrical production.' } ] }, { title: 'Job Roles', description: 'Careers in the performing arts.', children: [ { title: 'Actor', description: 'Performs a role in a play or film.' }, { title: 'Director', description: 'Leads the creative vision of a production.' }, { title: 'Stage Manager', description: 'Manages the production process.' }, { title: 'Set Designer', description: 'Designs the scenery for a production.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for performers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Voice Modulation', description: 'Controlling the sound of your voice.' }, { title: 'Body Language', description: 'Communicating non-verbally.' }, { title: 'Improvisation', description: 'Acting without a script.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Collaboration', description: 'Working effectively with others.' }, { title: 'Empathy', description: 'Understanding and sharing the feelings of others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of the performing arts.', children: [ { title: 'Career Paths', description: 'Paths for a career in the performing arts.', children: [ { title: 'Film & Television', description: 'Acting in films and television shows.' }, { title: 'Theatre Production', description: 'Working on theatrical productions.' }, { title: 'Voice Acting', description: 'Providing voices for animated characters and commercials.' } ] }, { title: 'Emerging Trends', description: 'New directions in the performing arts.', children: [ { title: 'Immersive Theatre', description: 'Theatre that involves the audience.' }, { title: 'Digital Performance', description: 'Performing online.' }, { title: 'Site-specific Theatre', description: 'Theatre that is performed in a specific location.' } ] } ] }
        ]
    },
    film_media_prod: {
        title: 'Film & Media Production',
        description: 'The process of creating video content for television, social media, corporate marketing, and other platforms.',
        children: [
            { title: 'Academics', description: 'Education in film and media production.', children: [ { title: 'B.A. in Film Making/Mass Media (e.g., FTII, SRFTI)', description: 'Degrees from top film schools in India.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Screenwriting', description: 'Writing scripts for films.' }, { title: 'Cinematography', description: 'The art of filmmaking.' }, { title: 'Editing', description: 'Putting a film together.' } ] }, { title: 'Job Roles', description: 'Careers in film and media production.', children: [ { title: 'Director', description: 'Leads the creative vision of a film.' }, { title: 'Cinematographer', description: 'The person in charge of the camera and lighting.' }, { title: 'Video Editor', description: 'Edits the film.' }, { title: 'Screenwriter', description: 'Writes the script.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for filmmakers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve', description: 'Software for editing films.' }, { title: 'Camera Operation', description: 'Knowing how to use a camera.' }, { title: 'Lighting', description: 'Knowing how to light a scene.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Storytelling', description: 'The ability to tell a compelling story.' }, { title: 'Visual Aesthetics', description: 'A good sense of what looks good on screen.' }, { title: 'Project Management', description: 'Managing a film production.' } ] } ] },
            { title: 'Future Scope', description: 'The future of film and media production.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.A. in Film Production', description: 'A master\'s degree in film production.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'OTT Content Creation', description: 'Creating content for streaming services like Netflix.' }, { title: 'Virtual Production', description: 'Using virtual reality to create films.' }, { title: 'Documentary Filmmaking', description: 'Making non-fiction films.' } ] } ] }
        ]
    },
    visual_arts: {
        title: 'Visual Arts & Crafts',
        description: 'Art forms such as painting, drawing, printmaking, sculpture, ceramics, photography, video, filmmaking, design, crafts, and architecture.',
        children: [
            { title: 'Academics', description: 'Education in the visual arts.', children: [ { title: 'BFA/MFA (Bachelor/Master of Fine Arts)', description: 'Degrees in the fine arts.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Painting', description: 'The art of painting.' }, { title: 'Sculpture', description: 'The art of creating three-dimensional objects.' }, { title: 'Art History', description: 'The study of the history of art.' } ] }, { title: 'Job Roles', description: 'Careers in the visual arts.', children: [ { title: 'Fine Artist', description: 'Creates original works of art.' }, { title: 'Illustrator', description: 'Creates images for books, magazines, etc.' }, { title: 'Art Teacher', description: 'Teaches art to students.' }, { title: 'Animator', description: 'Creates animated films and videos.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for artists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Drawing & Composition', description: 'The ability to draw and arrange elements in a picture.' }, { title: 'Color Theory', description: 'The science of color.' }, { title: 'Digital Art Software (Photoshop, Procreate)', description: 'Software for creating digital art.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Patience', description: 'The ability to persevere through long projects.' }, { title: 'Attention to Detail', description: 'A high level of accuracy.' } ] } ] },
            { title: 'Future Scope', description: 'The future of the visual arts.', children: [ { title: 'Career Paths', description: 'Paths for a career in the visual arts.', children: [ { title: 'Gallery Exhibitions', description: 'Showing your work in art galleries.' }, { title: 'Commercial Art & Illustration', description: 'Creating art for businesses.' }, { title: 'Art Curation', description: 'Organizing art exhibitions.' } ] }, { title: 'Emerging Trends', description: 'New directions in the visual arts.', children: [ { title: 'Digital Art & NFTs', description: 'Creating and selling digital art.' }, { title: 'Installation Art', description: 'Art that is created for a specific space.' }, { title: 'AR Art', description: 'Art that is viewed through augmented reality.' } ] } ] }
        ]
    },
     literature_writing: {
        title: 'Literature & Writing',
        description: 'The study of written works and the practice of creating them.',
        children: [
            { title: 'Academics', description: 'Education for a career in writing.', children: [ { title: 'B.A./M.A. in English/Literature/Journalism', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Literary Theory', description: 'The study of the principles of literary criticism.' }, { title: 'Creative Writing', description: 'The practice of writing fiction, poetry, etc.' }, { title: 'Editing and Proofreading', description: 'Correcting and improving written work.' } ] }, { title: 'Job Roles', description: 'Careers in writing.', children: [ { title: 'Author', description: 'Writes books.' }, { title: 'Editor', description: 'Edits written work.' }, { title: 'Content Writer/Strategist', description: 'Creates content for websites and other media.' }, { title: 'Copywriter', description: 'Writes advertising copy.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for writers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Grammar & Syntax', description: 'The rules of language.' }, { title: 'Storytelling', description: 'The ability to tell a compelling story.' }, { title: 'SEO Writing', description: 'Writing content that will rank high in search engines.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Critical Thinking', description: 'Analyzing information objectively.' }, { title: 'Research', description: 'Finding and evaluating information.' } ] } ] },
            { title: 'Future Scope', description: 'The future of writing.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'MFA in Creative Writing', description: 'A master\'s degree in creative writing.' } ] }, { title: 'Emerging Trends', description: 'New directions in writing.', children: [ { title: 'Digital Publishing', description: 'Publishing books and other content online.' }, { title: 'Podcast Scriptwriting', description: 'Writing scripts for podcasts.' }, { title: 'Technical Writing', description: 'Writing technical documents.' } ] } ] }
        ]
    },
    creative_media_mgmt: {
        title: 'Creative & Media Management',
        description: 'Managing the business side of creative industries like film, music, and publishing.',
        children: [
            { title: 'Academics', description: 'Education for a career in media management.', children: [ { title: 'BMS/MBA in Media Management', description: 'Business degrees with a focus on the media industry.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Media Economics', description: 'The economics of the media industry.' }, { title: 'Intellectual Property Rights', description: 'The laws protecting creative works.' } ] }, { title: 'Job Roles', description: 'Careers in media management.', children: [ { title: 'Producer', description: 'Manages a film or television production.' }, { title: 'Media Manager', description: 'Manages a media company.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for media managers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Budgeting', description: 'Creating and managing a budget.' }, { title: 'Project Management', description: 'Planning and executing projects.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Negotiation', description: 'Reaching agreements with others.' }, { title: 'Networking', description: 'Building relationships with people in the industry.' } ] } ] },
            { title: 'Future Scope', description: 'The future of media management.', children: [ { title: 'Career Paths', description: 'Paths for a career in media management.', children: [ { title: 'Production Houses', description: 'Companies that produce films and television shows.' }, { title: 'Broadcasting Companies', description: 'Companies that broadcast television and radio programs.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digital Media Monetization', description: 'Making money from digital media.' }, { title: 'Artist Management', description: 'Managing the careers of artists.' } ] } ] }
        ]
    },
    visual_media_design: {
        title: 'Visual Media & Design',
        description: 'Creating visual content to communicate messages, often combining art and technology.',
        children: [
            { title: 'Academics', description: 'Education for a career in visual design.', children: [ { title: 'B.Des/M.Des in Communication Design', description: 'Design degrees with a focus on communication.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Graphic Design', description: 'Creating visual content for communication.' }, { title: 'Typography', description: 'The art of arranging type.' }, { title: 'Illustration', description: 'Creating images for communication.' } ] }, { title: 'Job Roles', description: 'Careers in visual design.', children: [ { title: 'Graphic Designer', description: 'Creates visual concepts.' }, { title: 'UI/UX Designer', description: 'Designs user interfaces and experiences.' }, { title: 'Art Director', description: 'Leads the visual style of a project.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for visual designers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Adobe Creative Suite (Photoshop, Illustrator, InDesign)', description: 'Software for creating visual content.' }, { title: 'UI/UX Prototyping Tools', description: 'Tools for creating interactive mockups.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Visual Communication', description: 'Effectively conveying messages visually.' } ] } ] },
            { title: 'Future Scope', description: 'The future of visual design.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'Specialization in Motion Graphics or UI/UX', description: 'Focusing on a specific area of design.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Motion Graphics', description: 'Animated graphic design.' }, { title: 'AR Filters', description: 'Creating augmented reality filters for social media.' }, { title: 'Data Visualization Design', description: 'Creating visual representations of data.' } ] } ] }
        ]
    },
     law_political_studies: {
        title: 'Law & Political Studies',
        description: 'The study of legal systems and political behavior.',
        children: [
            { title: 'Academics', description: 'Education for a career in law and politics.', children: [ { title: 'B.A. LLB / M.A. in Political Science', description: 'Degrees in law and political science.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Constitutional Law', description: 'The laws of a country\'s constitution.' }, { title: 'International Relations', description: 'The study of relationships between countries.' } ] }, { title: 'Job Roles', description: 'Careers in law and politics.', children: [ { title: 'Lawyer', description: 'Represents clients in legal matters.' }, { title: 'Policy Analyst', description: 'Analyzes public policy.' }, { title: 'Diplomat', description: 'Represents a country abroad.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Legal Research', description: 'Researching legal issues.' }, { title: 'Policy Analysis', description: 'Analyzing public policy.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Argumentation', description: 'Making a convincing argument.' }, { title: 'Critical Thinking', description: 'Analyzing information objectively.' } ] } ] },
            { title: 'Future Scope', description: 'The future of law and politics.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'LLM, PhD', description: 'Advanced degrees in law and political science.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Cyber Law', description: 'The laws governing the internet.' }, { title: 'Public Policy Advocacy', description: 'Advocating for changes in public policy.' } ] } ] }
        ]
    },
    pr_event_mgmt: {
        title: 'PR & Event Management',
        description: 'Managing public image and organizing professional events.',
        children: [
            { title: 'Academics', description: 'Education for a career in PR and event management.', children: [ { title: 'B.A. in Mass Media / Diploma in Event Management', description: 'Degrees and diplomas for this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Public Relations', description: 'Managing a company\'s public image.' }, { title: 'Event Planning & Logistics', description: 'Planning and organizing events.' } ] }, { title: 'Job Roles', description: 'Careers in PR and event management.', children: [ { title: 'PR Executive', description: 'Works in a public relations agency.' }, { title: 'Event Manager', description: 'Manages events.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Media Relations', description: 'Working with the media.' }, { title: 'Budgeting & Vendor Management', description: 'Managing event budgets and vendors.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Organizational Skills', description: 'The ability to plan and organize.' }, { title: 'Communication', description: 'Communicating effectively with clients and vendors.' } ] } ] },
            { title: 'Future Scope', description: 'The future of PR and event management.', children: [ { title: 'Career Growth', description: 'Paths for advancement.', children: [ { title: 'PR Head', description: 'Leads a company\'s PR department.' }, { title: 'Owning an Event Agency', description: 'Starting your own event management company.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digital PR', description: 'Using digital channels for PR.' }, { title: 'Virtual & Hybrid Events', description: 'Events that are held online or in a combination of online and in-person.' } ] } ] }
        ]
    },
    anthropology_culture: {
        title: 'Anthropology & Culture',
        description: 'The study of human societies and their cultures.',
        children: [
            { title: 'Academics', description: 'Education for a career in anthropology.', children: [ { title: 'B.A./M.A. in Anthropology/Sociology', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Cultural Anthropology', description: 'The study of human cultures.' }, { title: 'Social Theory', description: 'The study of social behavior.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'User Researcher (UX)', description: 'Researches user behavior for product design.' }, { title: 'Policy Analyst', description: 'Analyzes public policy.' }, { title: 'CSR Manager', description: 'Manages a company\'s corporate social responsibility program.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for anthropologists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Ethnographic Research', description: 'The study of people in their own environment.' }, { title: 'Qualitative Data Analysis', description: 'Analyzing non-numerical data.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Observation', description: 'The ability to notice details.' }, { title: 'Empathy', description: 'Understanding and sharing the feelings of others.' }, { title: 'Cultural Sensitivity', description: 'Being aware of and respecting cultural differences.' } ] } ] },
            { title: 'Future Scope', description: 'The future of anthropology.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Corporate Anthropology', description: 'Applying anthropology to business.' }, { title: 'Digital Ethnography', description: 'Studying online communities.' } ] } ] }
        ]
    },
    linguistics_comm: {
        title: 'Linguistics & Communication Studies',
        description: 'The scientific study of language and human communication.',
        children: [
            { title: 'Academics', description: 'Education for a career in linguistics.', children: [ { title: 'B.A./M.A. in Linguistics/Communication', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Phonetics', description: 'The study of speech sounds.' }, { title: 'Syntax', description: 'The study of sentence structure.' }, { title: 'Interpersonal Communication', description: 'The study of how people communicate with each other.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'Computational Linguist', description: 'Works on computer programs that can understand language.' }, { title: 'Speech Therapist', description: 'Helps people with speech problems.' }, { title: 'Corporate Communications', description: 'Manages a company\'s communications.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for linguists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Language Analysis', description: 'Analyzing the structure of language.' }, { title: 'Discourse Analysis', description: 'Analyzing language in use.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Analyzing complex data.' }, { title: 'Communication', description: 'Communicating complex ideas clearly.' } ] } ] },
            { title: 'Future Scope', description: 'The future of linguistics.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Natural Language Processing (NLP)', description: 'The ability of computers to understand human language.' }, { title: 'Voice Assistant Development', description: 'Developing voice assistants like Alexa and Siri.' } ] } ] }
        ]
    },
    music_performing_arts: {
        title: 'Music & Performing Arts',
        description: 'Encompasses various forms of artistic expression including music, dance, and theatre.',
        children: [
            { title: 'Academics', description: 'Education in music and the performing arts.', children: [ { title: 'Bachelor/Master of Music/Performing Arts', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Music Theory', description: 'The study of the principles of music.' }, { title: 'Performance Practice', description: 'The study of how to perform music.' } ] }, { title: 'Job Roles', description: 'Careers in music and the performing arts.', children: [ { title: 'Musician', description: 'Plays a musical instrument or sings.' }, { title: 'Dancer', description: 'Dances professionally.' }, { title: 'Music Composer', description: 'Writes music.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for performers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Instrumental/Vocal Proficiency', description: 'The ability to play an instrument or sing well.' }, { title: 'Choreography', description: 'The art of creating dances.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Discipline', description: 'The ability to practice regularly.' }, { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Stage Presence', description: 'The ability to command the attention of an audience.' } ] } ] },
            { title: 'Future Scope', description: 'The future of music and the performing arts.', children: [ { title: 'Career Paths', description: 'Paths for a career in these fields.', children: [ { title: 'Live Performance', description: 'Performing for a live audience.' }, { title: 'Music Production', description: 'Producing music recordings.' }, { title: 'Teaching', description: 'Teaching music or dance.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Digital Music Production', description: 'Producing music using computers.' }, { title: 'Online Performances', description: 'Performing online for a virtual audience.' } ] } ] }
        ]
    },
    writing_script_dev: {
        title: 'Writing & Script Development',
        description: 'The art of writing scripts for film, television, and other media.',
        children: [
            { title: 'Academics', description: 'Education for a career in screenwriting.', children: [ { title: 'M.A. in Screenwriting / Film School Diploma', description: 'Advanced degrees and diplomas for screenwriters.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Screenplay Structure', description: 'The structure of a screenplay.' }, { title: 'Character Development', description: 'Creating believable characters.' } ] }, { title: 'Job Roles', description: 'Careers in screenwriting.', children: [ { title: 'Screenwriter', description: 'Writes scripts for films and television.' }, { title: 'Script Consultant', description: 'Helps writers improve their scripts.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for screenwriters.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Script Formatting Software (Final Draft)', description: 'Software for formatting screenplays.' }, { title: 'Storytelling', description: 'The ability to tell a compelling story.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Discipline', description: 'The ability to write regularly.' }, { title: 'Resilience', description: 'The ability to bounce back from rejection.' } ] } ] },
            { title: 'Future Scope', description: 'The future of screenwriting.', children: [ { title: 'Career Paths', description: 'Paths for a career in screenwriting.', children: [ { title: 'Writer\'s Rooms for TV Shows', description: 'Working as a writer on a television show.' }, { title: 'Feature Film Writing', description: 'Writing scripts for movies.' } ] }, { title: 'Emerging Trends', description: 'New directions in screenwriting.', children: [ { title: 'Writing for OTT Platforms', description: 'Writing for streaming services like Netflix.' }, { title: 'Interactive Narrative Writing', description: 'Writing stories where the audience can make choices.' } ] } ] }
        ]
    },
    politics_intl_studies: {
        title: 'Politics & International Studies',
        description: 'The study of political systems and relations between countries.',
        children: [
            { title: 'Academics', description: 'Education for a career in politics and international studies.', children: [ { title: 'B.A./M.A. in Political Science/International Relations', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Comparative Politics', description: 'The study of different political systems.' }, { title: 'International Law', description: 'The laws governing relationships between countries.' } ] }, { title: 'Job Roles', description: 'Careers in politics and international studies.', children: [ { title: 'Diplomat (IFS)', description: 'Represents India abroad.' }, { title: 'Foreign Policy Analyst', description: 'Analyzes foreign policy.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Policy Analysis', description: 'Analyzing public policy.' }, { title: 'Foreign Language Proficiency', description: 'The ability to speak a foreign language.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Cross-cultural Understanding', description: 'Understanding different cultures.' }, { title: 'Negotiation', description: 'Reaching agreements with others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of politics and international studies.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Cyber Diplomacy', description: 'Diplomacy in the digital age.' }, { title: 'Global Health Security', description: 'Protecting the world from health threats.' } ] } ] }
        ]
    },
    social_work_counseling: {
        title: 'Social Work & Counseling',
        description: 'A profession dedicated to helping individuals, families, and communities to enhance their well-being.',
        children: [
            { title: 'Academics', description: 'Education for a career in social work and counseling.', children: [ { title: 'BSW/MSW (Bachelor/Master of Social Work)', description: 'Degrees in social work.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Human Behavior', description: 'The study of how people behave.' }, { title: 'Counseling Theories', description: 'Different approaches to counseling.' } ] }, { title: 'Job Roles', description: 'Careers in social work and counseling.', children: [ { title: 'Social Worker', description: 'Helps people with problems.' }, { title: 'Counselor', description: 'Provides guidance to people.' }, { title: 'Therapist', description: 'Provides mental health treatment.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Case Management', description: 'Managing a client\'s case.' }, { title: 'Therapeutic Techniques', description: 'Different methods of therapy.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Empathy', description: 'Understanding and sharing the feelings of others.' }, { title: 'Active Listening', description: 'Listening carefully to what others are saying.' }, { title: 'Patience', description: 'The ability to remain calm in stressful situations.' } ] } ] },
            { title: 'Future Scope', description: 'The future of social work and counseling.', children: [ { title: 'Higher Studies', description: 'Advanced degrees for specialization.', children: [ { title: 'M.Phil/PhD', description: 'Advanced degrees for a career in research or academia.' } ] }, { title: 'Emerging Trends', description: 'New directions in the fields.', children: [ { title: 'Online Counseling', description: 'Providing counseling online.' }, { title: 'Trauma-informed Care', description: 'An approach to care that recognizes the impact of trauma.' } ] } ] }
        ]
    },
    digital_media_design: {
        title: 'Digital Media & Design',
        description: 'Creating content using digital tools, including graphics, animation, and video.',
        children: [
            { title: 'Academics', description: 'Education for a career in digital media.', children: [ { title: 'B.Des/M.Des in Digital Media', description: 'Design degrees with a focus on digital media.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Motion Graphics', description: 'Animated graphic design.' }, { title: '3D Modeling', description: 'Creating three-dimensional models.' }, { title: 'UI/UX Design', description: 'Designing user interfaces and experiences.' } ] }, { title: 'Job Roles', description: 'Careers in digital media.', children: [ { title: 'Motion Graphics Artist', description: 'Creates animated graphics.' }, { title: '3D Animator', description: 'Creates 3D animations.' }, { title: 'UI/UX Designer', description: 'Designs user interfaces and experiences.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for digital media designers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Adobe After Effects, Cinema 4D, Figma', description: 'Software for creating digital media.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Visual Storytelling', description: 'Telling stories visually.' } ] } ] },
            { title: 'Future Scope', description: 'The future of digital media.', children: [ { title: 'Career Growth', description: 'Paths for advancement.', children: [ { title: 'Art Director', description: 'Leads the visual style of a project.' }, { title: 'Creative Director', description: 'Leads the creative vision of a project.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Real-time 3D (Unreal Engine)', description: 'Creating 3D graphics in real time.' }, { title: 'Augmented Reality (AR) Design', description: 'Designing for augmented reality.' } ] } ] }
        ]
    },
    history_archival_research: {
        title: 'History & Archival Research',
        description: 'Focuses on the preservation and study of historical documents and records.',
        children: [
            { title: 'Academics', description: 'Education for a career in archival research.', children: [ { title: 'M.A. in History with specialization in Archival Studies', description: 'A master\'s degree focused on archival work.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Archival Management', description: 'Managing historical archives.' }, { title: 'Preservation Techniques', description: 'Preserving historical documents.' } ] }, { title: 'Job Roles', description: 'Careers in archival research.', children: [ { title: 'Archivist', description: 'Manages historical records.' }, { title: 'Records Manager', description: 'Manages a company\'s records.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for archivists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Cataloging Systems', description: 'Systems for organizing archival materials.' }, { title: 'Digital Archiving', description: 'Preserving digital records.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Meticulousness', description: 'A high level of attention to detail.' }, { title: 'Organizational Skills', description: 'The ability to plan and organize.' } ] } ] },
            { title: 'Future Scope', description: 'The future of archival research.', children: [ { title: 'Career Paths', description: 'Paths for a career in archival research.', children: [ { title: 'National Archives, Museums, Libraries', description: 'Working in these institutions.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digitization of Archives', description: 'Making archives available online.' }, { title: 'AI in Archival Research', description: 'Using AI to analyze archival materials.' } ] } ] }
        ]
    },
    philosophy_ethics: {
        title: 'Philosophy & Ethics',
        description: 'Concentrates on the moral principles that govern behavior and the fundamental nature of knowledge, reality, and existence.',
        children: [
            { title: 'Academics', description: 'Education for a career in philosophy and ethics.', children: [ { title: 'B.A./M.A. in Philosophy', description: 'Degrees in philosophy.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Moral Philosophy', description: 'The study of moral principles.' }, { title: 'Applied Ethics', description: 'The application of ethics to real-world problems.' }, { title: 'Logic', description: 'The study of reasoning.' } ] }, { title: 'Job Roles', description: 'Careers for philosophy graduates.', children: [ { title: 'Ethics Officer', description: 'Ensures a company acts ethically.' }, { title: 'Academic', description: 'Teaches and researches at a university.' }, { title: 'Policy Advisor', description: 'Advises on public policy.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for these professions.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Ethical Analysis Frameworks', description: 'Frameworks for analyzing ethical problems.' }, { title: 'Logical Reasoning', description: 'The ability to think logically.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Critical Thinking', description: 'Analyzing information objectively.' }, { title: 'Clear Communication', description: 'Communicating complex ideas clearly.' } ] } ] },
            { title: 'Future Scope', description: 'The future of philosophy and ethics.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'AI Ethics', description: 'The ethical implications of artificial intelligence.' }, { title: 'Bioethics', description: 'The ethical implications of biology and medicine.' }, { title: 'Environmental Ethics', description: 'The ethical relationship between humans and the environment.' } ] } ] }
        ]
    },
    linguistics_lang_studies: {
        title: 'Linguistics & Language Studies',
        description: 'The study of human language in all its aspects, including its structure, history, and social context.',
        children: [
            { title: 'Academics', description: 'Education for a career in linguistics.', children: [ { title: 'B.A./M.A. in Linguistics', description: 'Degrees in linguistics.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Phonology', description: 'The study of speech sounds.' }, { title: 'Sociolinguistics', description: 'The study of language in society.' } ] }, { title: 'Job Roles', description: 'Careers for linguists.', children: [ { title: 'Translator', description: 'Translates from one language to another.' }, { title: 'Computational Linguist', description: 'Works on computer programs that can understand language.' }, { title: 'Foreign Language Teacher', description: 'Teaches a foreign language.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for linguists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Language Proficiency', description: 'The ability to speak a language fluently.' }, { title: 'Corpus Linguistics', description: 'The study of large collections of text.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Analyzing complex data.' }, { title: 'Cultural Awareness', description: 'Understanding different cultures.' } ] } ] },
            { title: 'Future Scope', description: 'The future of linguistics.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Natural Language Processing (NLP)', description: 'The ability of computers to understand human language.' }, { title: 'Language Documentation', description: 'Preserving endangered languages.' } ] } ] }
        ]
    },
    literature_creative_writing: {
        title: 'Literature & Creative Writing',
        description: 'Focuses on the practice of imaginative writing and the critical analysis of literary works.',
        children: [
            { title: 'Academics', description: 'Education for a career in writing.', children: [ { title: 'MFA in Creative Writing / M.A. in Literature', description: 'Advanced degrees for writers.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Fiction/Poetry Workshops', description: 'Workshops where students critique each other\'s work.' }, { title: 'Literary Criticism', description: 'The study of literary works.' } ] }, { title: 'Job Roles', description: 'Careers for writers.', children: [ { title: 'Author', description: 'Writes books.' }, { title: 'Creative Writing Professor', description: 'Teaches creative writing at a university.' }, { title: 'Publisher', description: 'Publishes books.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for writers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Narrative Structure', description: 'The structure of a story.' }, { title: 'Editing & Revision', description: 'Improving written work.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Discipline', description: 'The ability to write regularly.' }, { title: 'Empathy', description: 'Understanding and sharing the feelings of others.' } ] } ] },
            { title: 'Future Scope', description: 'The future of writing.', children: [ { title: 'Career Paths', description: 'Paths for a career in writing.', children: [ { title: 'Publishing Novels', description: 'Publishing your own books.' }, { title: 'Teaching', description: 'Teaching writing to others.' } ] }, { title: 'Emerging Trends', description: 'New directions in writing.', children: [ { title: 'Self-publishing', description: 'Publishing your own books without a traditional publisher.' }, { title: 'Writing for Digital Platforms', description: 'Writing for websites, blogs, etc.' } ] } ] }
        ]
    },
    social_activism_ngo: {
        title: 'Social Activism & NGO Work',
        description: 'Working for non-governmental organizations to bring about social or political change.',
        children: [
            { title: 'Academics', description: 'Education for a career in social activism.', children: [ { title: 'Master of Social Work (MSW)', description: 'A master\'s degree in social work.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Community Development', description: 'Working with communities to improve their lives.' }, { title: 'Social Policy', description: 'The study of social problems and how to solve them.' } ] }, { title: 'Job Roles', description: 'Careers in social activism.', children: [ { title: 'Program Manager', description: 'Manages a program at an NGO.' }, { title: 'Advocacy Officer', description: 'Advocates for social change.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for social activists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Fundraising & Grant Writing', description: 'Raising money for an NGO.' }, { title: 'Community Mobilization', description: 'Getting people to take action.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Passion', description: 'A strong belief in a cause.' }, { title: 'Communication', description: 'Communicating effectively with others.' }, { title: 'Resilience', description: 'Bouncing back from setbacks.' } ] } ] },
            { title: 'Future Scope', description: 'The future of social activism.', children: [ { title: 'Career Growth', description: 'Paths for advancement.', children: [ { title: 'Leading an NGO', description: 'Becoming the head of an NGO.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Online Activism', description: 'Using the internet to promote social change.' }, { title: 'Corporate Social Responsibility (CSR) partnerships', description: 'Working with companies to promote social good.' } ] } ] }
        ]
    },
    media_comm_studies: {
        title: 'Media & Communication Studies',
        description: 'The academic study of the media, its institutions, and its effects on society.',
        children: [
            { title: 'Academics', description: 'Education for a career in media studies.', children: [ { title: 'B.A./M.A. in Mass Communication/Media Studies', description: 'Degrees in these fields.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Media Theory', description: 'The study of the principles of media.' }, { title: 'Journalism', description: 'The practice of gathering and reporting news.' }, { title: 'Public Relations', description: 'Managing a company\'s public image.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'Journalist', description: 'Reports the news.' }, { title: 'PR Specialist', description: 'Manages a company\'s public relations.' }, { title: 'Media Analyst', description: 'Analyzes media content.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for media professionals.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Writing & Reporting', description: 'The ability to write and report news.' }, { title: 'Video Production', description: 'The ability to create videos.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Critical Thinking', description: 'Analyzing information objectively.' }, { title: 'Communication', description: 'Communicating effectively with others.' }, { title: 'Ethical Judgement', description: 'Making ethical decisions.' } ] } ] },
            { title: 'Future Scope', description: 'The future of media studies.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digital Journalism', description: 'Journalism in the digital age.' }, { title: 'Fact-checking & Media Literacy', description: 'Helping people to identify fake news.' } ] } ] }
        ]
    },
    literature_classical: {
        title: 'Literature & Classical Studies',
        description: 'The study of the literature, languages, and cultures of ancient Greece and Rome.',
        children: [
            { title: 'Academics', description: 'Education for a career in classical studies.', children: [ { title: 'B.A./M.A. in Classical Studies', description: 'Degrees in this field.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Latin/Greek Language', description: 'The languages of ancient Rome and Greece.' }, { title: 'Classical Mythology', description: 'The myths of ancient Greece and Rome.' } ] }, { title: 'Job Roles', description: 'Careers for graduates.', children: [ { title: 'Academic/Professor', description: 'Teaches and researches at a university.' }, { title: 'Archivist', description: 'Manages historical records.' }, { title: 'Museum Curator', description: 'Manages a museum\'s collection.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for classicists.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Translation', description: 'Translating from Latin and Greek.' }, { title: 'Textual Analysis', description: 'Analyzing ancient texts.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Analytical Skills', description: 'Analyzing complex information.' }, { title: 'Historical Contextualization', description: 'Understanding the historical context of texts.' } ] } ] },
            { title: 'Future Scope', description: 'The future of classical studies.', children: [ { title: 'Higher Studies', description: 'The highest academic degree.', children: [ { title: 'PhD', description: 'For a career in academic research.' } ] }, { title: 'Emerging Trends', description: 'New directions in the field.', children: [ { title: 'Digital Classics', description: 'Using digital tools to study the classics.' }, { title: 'Reception Studies', description: 'The study of how classical texts have been received over time.' } ] } ] }
        ]
    },
    fashion_textile_design: {
        title: 'Fashion & Textile Design',
        description: 'The art of applying design, aesthetics, and natural beauty to clothing and textiles.',
        children: [
            { title: 'Academics', description: 'Education for a career in fashion design.', children: [ { title: 'B.Des/M.Des from NIFT, NID', description: 'Degrees from top design schools in India.', children: [ { title: 'Core Subjects', description: 'Key courses in the curriculum.', children: [ { title: 'Pattern Making', description: 'Creating patterns for clothing.' }, { title: 'Textile Science', description: 'The study of textiles.' }, { title: 'Fashion History', description: 'The study of the history of fashion.' } ] }, { title: 'Job Roles', description: 'Careers in fashion design.', children: [ { title: 'Fashion Designer', description: 'Designs clothing.' }, { title: 'Textile Designer', description: 'Designs textiles.' }, { title: 'Fashion Merchandiser', description: 'Buys and sells fashion.' } ] } ] } ] },
            { title: 'Skills', description: 'Essential skills for fashion designers.', children: [ { title: 'Technical Skills', description: 'Practical abilities required.', children: [ { title: 'Sketching & Illustration', description: 'The ability to draw and illustrate designs.' }, { title: 'Sewing & Garment Construction', description: 'The ability to sew and make clothes.' }, { title: 'CAD Software (Adobe Illustrator, Lectra)', description: 'Software for designing fashion.' } ] }, { title: 'Soft Skills', description: 'Key personal attributes.', children: [ { title: 'Creativity', description: 'The ability to generate new ideas.' }, { title: 'Trend Awareness', description: 'Knowing what is fashionable.' }, { title: 'Attention to Detail', description: 'A high level of accuracy.' } ] } ] },
            { title: 'Future Scope', description: 'The future of fashion design.', children: [ { title: 'Career Paths', description: 'Paths for a career in fashion design.', children: [ { title: 'Starting a Label', description: 'Starting your own fashion brand.' }, { title: 'Working for Design Houses', description: 'Working for an established fashion brand.' } ] }, { title: 'Emerging Trends', description: 'New directions in fashion design.', children: [ { title: 'Sustainable Fashion', description: 'Fashion that is environmentally friendly.' }, { title: '3D Fashion Design', description: 'Designing fashion in 3D.' }, { title: 'Wearable Technology', description: 'Fashion that incorporates technology.' } ] } ] }
        ]
    }
};

// NEW: Maps the long-form quiz result to the short key used in the mind map data object.
const quizResultToMindMapKey = {
    'Science & Engineering / Applied Sciences': 'sci_eng_applied',
    'Engineering & Technology': 'eng_tech',
    'Software Development & IT': 'sw_dev_it',
    'Data Science & Analytics': 'data_science',
    'Design & Human-Computer Interaction': 'design_hci',
    'Industrial & Manufacturing Engineering': 'industrial_manufacturing',
    'Marine & Environmental Sciences': 'marine_environmental',
    'Environmental & Renewable Technologies': 'renewable_tech',
    'Space Science & Aerospace': 'space_aerospace',
    'Innovation & Technology Development': 'innovation_tech',
    'Robotics & Automation': 'robotics_automation',
    'Communication & Media Technologies': 'comm_media_tech',
    'Chemical & Process Engineering': 'chem_process_eng',
    'Quantitative & Data Analytics': 'quant_data_analytics',
    'Scientific & Data Research': 'sci_data_research',
    'Mathematics & Physics': 'math_physics',
    'Earth & Atmospheric Sciences': 'earth_atmospheric',
    'Biotechnology & Life Sciences': 'biotech_life_sci',
    'Healthcare & Education': 'healthcare_edu',
    'Medicine & Pharmacy': 'medicine_pharmacy',
    'Chemistry & Life Sciences': 'chem_life_sci',
    'Corporate & Business Management': 'corp_biz_mgmt',
    'Startups & Entrepreneurship': 'startups_entrepreneurship',
    'Accounting & Financial Analysis': 'accounting_financial',
    'Marketing & Corporate Communication': 'marketing_corp_comm',
    'Accounting & Compliance': 'accounting_compliance',
    'HR & Organizational Development': 'hr_org_dev',
    'Law & Corporate Governance': 'law_corp_gov',
    'Marketing & Brand Strategy': 'marketing_brand_strategy',
    'Entrepreneurship & Small Business': 'entrepreneurship_small_biz',
    'International Business & Trade': 'intl_biz_trade',
    'Finance & Investment': 'finance_investment',
    'Management & Leadership Studies': 'mgmt_leadership',
    'Taxation & Accounting': 'tax_accounting',
    'Sales & Business Growth': 'sales_growth',
    'Finance & Management': 'finance_mgmt',
    'Marketing Analytics & Research': 'marketing_analytics_research',
    'Financial Risk & Analysis': 'financial_risk',
    'HR & Communication': 'hr_comm',
    'Investment & Capital Markets': 'investment_capital',
    'Marketing Analytics & Insights': 'marketing_analytics_insights',
    'Auditing & Financial Compliance': 'auditing_compliance',
    'History & Archaeology': 'history_archaeology',
    'Philosophy & Political Studies': 'philosophy_politics',
    'Performing Arts & Theatre': 'performing_arts',
    'Film & Media Production': 'film_media_prod',
    'Visual Arts & Crafts': 'visual_arts',
    'Literature & Writing': 'literature_writing',
    'Creative & Media Management': 'creative_media_mgmt',
    'Visual Media & Design': 'visual_media_design',
    'Law & Political Studies': 'law_political_studies',
    'PR & Event Management': 'pr_event_mgmt',
    'Anthropology & Culture': 'anthropology_culture',
    'Linguistics & Communication Studies': 'linguistics_comm',
    'Music & Performing Arts': 'music_performing_arts',
    'Writing & Script Development': 'writing_script_dev',
    'Politics & International Studies': 'politics_intl_studies',
    'Social Work & Counseling': 'social_work_counseling',
    'Digital Media & Design': 'digital_media_design',
    'History & Archival Research': 'history_archival_research',
    'Philosophy & Ethics': 'philosophy_ethics',
    'Linguistics & Language Studies': 'linguistics_lang_studies',
    'Literature & Creative Writing': 'literature_creative_writing',
    'Social Activism & NGO Work': 'social_activism_ngo',
    'Media & Communication Studies': 'media_comm_studies',
    'Literature & Classical Studies': 'literature_classical',
    'Fashion & Textile Design': 'fashion_textile_design',
};


const mockUpcomingEvents = [
    { date: "Oct 15, 2025", title: "JEE Advanced 2026 Registration Opens", description: "Registration for the next Joint Entrance Examination (Advanced) begins." },
    { date: "Nov 01, 2025", title: "CAT 2025 Admit Card Release", description: "Common Admission Test (CAT) admit cards will be available for download." },
    { date: "Nov 26, 2025", title: "CAT 2025 Exam Date", description: "The national-level management entrance examination will be conducted." },
    { date: "Dec 10, 2025", title: "NEET UG 2026 Counselling Round 1 Starts", description: "The first round of counselling for undergraduate medical seats begins." },
    { date: "Jan 05, 2026", title: "CLAT 2026 Application Deadline", description: "Last day to submit applications for the Common Law Admission Test." },
];

const mockExamDates = {
    'Science': [
        { date: "Oct 15, 2025", title: "JEE Advanced 2026 Registration Opens", description: "For admission to IITs for Engineering." },
        { date: "Dec 10, 2025", title: "NEET UG 2026 Counselling Starts", description: "For admission to Medical/Dental colleges." },
        { date: "Jan 15, 2026", title: "BITSAT 2026 Session 1 Application", description: "For admission to BITS Pilani campuses." }
    ],
    'Research/Academia': [
        { date: "Sep 30, 2025", title: "CSIR NET Application Opens", description: "For JRF and Lectureship in Sciences." },
        { date: "Oct 25, 2025", title: "GATE 2026 Registration Deadline", description: "For postgraduate engineering admissions and PSU recruitment." }
    ],
    'Engineering': [
        // JEE and BITSAT are covered by 'Science'
        { date: "Feb 01, 2026", title: "VITEEE 2026 Application Deadline", description: "For admission to VIT." }
    ],
    'Mechanical/Civil Engineering': [], // Covered by 'Science'
    'Computer Science': [], // Covered by 'Science'
    'Electronics/Software': [], // Covered by 'Science'
    'Medical Field': [
        // NEET is covered by 'Science'
        { date: "Jan 20, 2026", title: "AIIMS Paramedical Application", description: "For paramedical courses at AIIMS." }
    ],
    'Non-Medical Fields': [
        { date: "Apr 05, 2026", title: "NEST Application Deadline", description: "For admission to NISER and UM-DAE CEBS." },
        { date: "May 10, 2026", title: "IISER Aptitude Test (IAT)", description: "For admission to IISERs." }
    ],
    'Commerce': [
        { date: "Nov 01, 2025", title: "CAT 2025 Admit Card Release", description: "For admission to IIMs and other B-Schools." },
        { date: "Jan 05, 2026", title: "CLAT 2026 Application Deadline", description: "For integrated Law programs in NLUs." },
        { date: "Feb 10, 2026", title: "CA Foundation Exam Registration", description: "First step for Chartered Accountancy." }
    ],
    'Finance/Accounting': [], // Covered by 'Commerce'
    'Human Resources/Management': [
        // CAT is covered by 'Commerce'
        { date: "Dec 15, 2025", title: "XAT 2026 Registration Closes", description: "For admission to XLRI and other B-Schools." }
    ],
    'Data Analysis/Finance': [
        // CAT is covered by 'Commerce'
        { date: "Dec 20, 2025", title: "ACET Registration Deadline", description: "For becoming an Actuary." }
    ],
    'Marketing/Sales': [
        // CAT is covered by 'Commerce'
        { date: "Jan 10, 2026", title: "MICAT Application Deadline", description: "For MICA's strategic marketing programs." }
    ],
    'Arts': [
        { date: "Jan 05, 2026", title: "CLAT 2026 Application Deadline", description: "For integrated Law programs (B.A. LLB)." },
        { date: "Feb 20, 2026", title: "NIFT Entrance Exam", description: "For design and fashion technology courses." },
        { date: "Mar 01, 2026", title: "UPSC Civil Services Prelims Notification", description: "For IAS, IPS, and other civil services." }
    ],
    'Design/Fine Arts': [
        // NIFT is covered by 'Arts'
        { date: "Jan 03, 2026", title: "UCEED & CEED Exam Date", description: "For undergraduate/postgraduate design programs at IITs." },
    ],
    'Journalism/Writing': [
        { date: "Apr 15, 2026", title: "IIMC Entrance Exam Application", description: "For postgraduate diploma courses in journalism." },
        { date: "May 20, 2026", title: "XIC OET Application", description: "For mass communication courses at Xavier Institute." }
    ],
    'Sociology/Civil Services': [
        // UPSC is covered by 'Arts'
        { date: "Apr 10, 2026", title: "TISSNET Application for MA", description: "For social sciences at TISS." }
    ],
    'Psychology': [
        { date: "Apr 10, 2026", title: "TISSNET Application for MA", description: "For M.A. in Applied Psychology." },
        { date: "May 15, 2026", title: "CUET-PG for MA Psychology", description: "Central University Entrance Test for PG admissions." }
    ],
    'default': mockUpcomingEvents // A fallback
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
      id: 1, // Link to mockMentors
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
      id: 5, // Example of a review without a bookable mentor profile
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
      id: 2, // Link to mockMentors
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
      id: 6,
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
        id: null,
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
        id: 8,
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
      id: 3, // Link to mockMentors
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
      id: 9,
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
        id: 4, // Link to mockMentors
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
        id: 10,
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
        id: null,
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
        id: 12,
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
  { id: 1, name: "Ananya Sharma", college: "Indian Institute of Technology, Delhi", field: "Computer Science", rating: 4.9, reviews: 82, image: "https://i.pravatar.cc/150?u=ananya", availability: { days: ["Monday", "Wednesday", "Friday"], time: "5 PM - 8 PM IST" } },
  { id: 2, name: "Rohan Verma", college: "All India Institute of Medical Sciences, Delhi", field: "Medicine", rating: 4.8, reviews: 65, image: "https://i.pravatar.cc/150?u=rohan", availability: { days: ["Saturday", "Sunday"], time: "10 AM - 1 PM IST" } },
  { id: 3, name: "Priya Singh", college: "Indian Institute of Management, Ahmedabad", field: "Business Management", rating: 4.9, reviews: 95, image: "https://i.pravatar.cc/150?u=priya", availability: { days: ["Tuesday", "Thursday"], time: "7 PM - 9 PM IST" } },
  { id: 4, name: "Vikram Rathore", college: "National Law School of India University, Bangalore", field: "Law", rating: 4.7, reviews: 50, image: "https://i.pravatar.cc/150?u=vikram", availability: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], time: "6 PM - 7 PM IST" } },
  { id: 5, name: "Priya Sharma", college: "Indian Institute of Technology, Delhi", field: "Textile Technology", rating: 4.6, reviews: 15, image: "https://i.pravatar.cc/150?u=priyas", availability: { days: ["Tuesday", "Thursday"], time: "4 PM - 6 PM IST" } },
  { id: 6, name: "Anjali Menon", college: "All India Institute of Medical Sciences, Delhi", field: "MBBS", rating: 4.7, reviews: 25, image: "https://i.pravatar.cc/150?u=anjali", availability: { days: ["Weekend"], time: "Flexible" } },
  { id: 7, name: "Arjun Khanna", college: "St. Stephen's College, Delhi", field: "Economics", rating: 4.8, reviews: 30, image: "https://i.pravatar.cc/150?u=arjun", availability: { days: ["Friday"], time: "6 PM - 8 PM IST" } },
  { id: 8, name: "Meera Das", college: "St. Stephen's College, Delhi", field: "Physics", rating: 4.5, reviews: 10, image: "https://i.pravatar.cc/150?u=meera", availability: { days: ["Monday"], time: "5 PM - 6 PM IST" } },
  { id: 9, name: "Riya Desai", college: "Indian Institute of Management, Ahmedabad", field: "Management", rating: 4.7, reviews: 40, image: "https://i.pravatar.cc/150?u=riya", availability: { days: ["Wednesday"], time: "8 PM - 9 PM IST" } },
  { id: 10, name: "Sanjana Iyer", college: "National Law School of India University, Bangalore", field: "Law", rating: 4.6, reviews: 22, image: "https://i.pravatar.cc/150?u=sanjana", availability: { days: ["Thursday"], time: "7 PM - 8 PM IST" } },
  { id: 11, name: "David Mathews", college: "Christ University, Bangalore", field: "Computer Science", rating: 4.5, reviews: 18, image: "https://i.pravatar.cc/150?u=david", availability: { days: ["Saturday"], time: "11 AM - 1 PM IST" } },
  { id: 12, name: "Aisha Khan", college: "Christ University, Bangalore", field: "Journalism", rating: 4.4, reviews: 12, image: "https://i.pravatar.cc/150?u=aisha", availability: { days: ["Sunday"], time: "2 PM - 4 PM IST" } },
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

const mockEbooksData = {
    class10: [
        { subject: "Mathematics", name: "Mathematics Textbook", url: "https://ncert.nic.in/textbook.php?jemh1=0-15" },
        { subject: "Science", name: "Science Textbook", url: "https://ncert.nic.in/textbook.php?jesc1=0-16" },
        { subject: "Social Science", name: "History: India and the Contemporary World – II", url: "https://ncert.nic.in/textbook.php?jess3=0-8" },
        { subject: "Social Science", name: "Geography: Contemporary India – II", url: "https://ncert.nic.in/textbook.php?jess2=0-7" },
        { subject: "Social Science", name: "Political Science: Democratic Politics – II", url: "https://ncert.nic.in/textbook.php?jess4=0-8" },
        { subject: "Social Science", name: "Economics: Understanding Economic Development", url: "https://ncert.nic.in/textbook.php?jess1=0-5" },
        { subject: "English", name: "First Flight", url: "https://ncert.nic.in/textbook.php?jeen1=0-11" },
        { subject: "English", name: "Footprints Without Feet", url: "https://ncert.nic.in/textbook.php?jeft1=0-10" },
    ],
    class12: {
        "Science Stream": [
            { subject: "Physics", name: "Physics Part I", url: "https://ncert.nic.in/textbook.php?leph1=0-8" },
            { subject: "Physics", name: "Physics Part II", url: "https://ncert.nic.in/textbook.php?leph2=0-7" },
            { subject: "Chemistry", name: "Chemistry Part I", url: "https://ncert.nic.in/textbook.php?lech1=0-9" },
            { subject: "Chemistry", name: "Chemistry Part II", url: "https://ncert.nic.in/textbook.php?lech2=0-7" },
            { subject: "Biology", name: "Biology", url: "https://ncert.nic.in/textbook.php?lebo1=0-16" },
            { subject: "Mathematics", name: "Mathematics Part I", url: "https://ncert.nic.in/textbook.php?lemh1=0-6" },
            { subject: "Mathematics", name: "Mathematics Part II", url: "https://ncert.nic.in/textbook.php?lemh2=0-7" },
        ],
        "Commerce Stream": [
            { subject: "Accountancy", name: "Accountancy Part I", url: "https://ncert.nic.in/textbook.php?leac1=0-7" },
            { subject: "Accountancy", name: "Accountancy Part II", url: "https://ncert.nic.in/textbook.php?leac2=0-6" },
            { subject: "Business Studies", name: "Business Studies Part I", url: "https://ncert.nic.in/textbook.php?lebs1=0-8" },
            { subject: "Business Studies", name: "Business Studies Part II", url: "https://ncert.nic.in/textbook.php?lebs2=0-4" },
            { subject: "Economics", name: "Introductory Microeconomics", url: "https://ncert.nic.in/textbook.php?leec1=0-6" },
            { subject: "Economics", name: "Introductory Macroeconomics", url: "https://ncert.nic.in/textbook.php?leec2=0-6" },
        ],
        "Arts / Humanities Stream": [
            { subject: "History", name: "Themes in Indian History Part I", url: "https://ncert.nic.in/textbook.php?lehs1=0-4" },
            { subject: "History", name: "Themes in Indian History Part II", url: "https://ncert.nic.in/textbook.php?lehs2=0-5" },
            { subject: "History", name: "Themes in Indian History Part III", url: "https://ncert.nic.in/textbook.php?lehs3=0-6" },
            { subject: "Political Science", name: "Contemporary World Politics", url: "https://ncert.nic.in/textbook.php?leps1=0-9" },
            { subject: "Political Science", name: "Politics in India Since Independence", url: "https://ncert.nic.in/textbook.php?leps2=0-9" },
            { subject: "Geography", name: "Fundamentals of Human Geography", url: "https://ncert.nic.in/textbook.php?legy1=0-10" },
            { subject: "Geography", name: "India: People and Economy", url: "https://ncert.nic.in/textbook.php?legy2=0-12" },
            { subject: "Psychology", name: "Psychology", url: "https://ncert.nic.in/textbook.php?lepy1=0-9" },
            { subject: "English", name: "Flamingo", url: "https://ncert.nic.in/textbook.php?lefl1=0-14" },
            { subject: "English", name: "Vistas", url: "https://ncert.nic.in/textbook.php?levs1=0-8" },
        ]
    }
};

const mockScholarships = [
 {
 "name": "Prime Minister’s Special Scholarship Scheme (PM-USP/PMSSS)",
 "eligibility": "Class 12 pass-outs from J&K and Ladakh joining professional courses via AICTE counselling.",
 "category": ["General", "J&K", "UG", "Government", "Vocational/Skill-based"],
 "benefits": "Covers tuition fees + maintenance allowance for students studying outside J&K.",
 "application_link": "https://www.aicte-india.org/",
 "status_source": "https://scholarships.gov.in/"
 },
 {
 "name": "NSP Pre-Matric Scholarship (SC/ST/OBC/Minority)",
 "eligibility": "Students up to Class 10 belonging to SC/ST/OBC/Minority categories.",
 "category": ["Class 10", "SC", "ST", "OBC", "Minority", "Government", "General"],
 "benefits": "Covers admission fees, tuition, books, and maintenance.",
 "application_link": "https://scholarships.gov.in/",
 "status_source": "https://scholarships.gov.in/"
 },
 {
 "name": "NSP Post-Matric Scholarship (SC/ST/OBC/Minority)",
 "eligibility": "Students after Class 10 or 12 from SC/ST/OBC/Minority categories continuing higher education.",
 "category": ["Class 12", "SC", "ST", "OBC", "Minority", "Government", "General"],
 "benefits": "Tuition fees, maintenance allowance, and exam fees.",
 "application_link": "https://scholarships.gov.in/",
 "status_source": "https://scholarships.gov.in/"
 },
 {
 "name": "CBSE Single Girl Child Scholarship",
 "eligibility": "Class 10 pass CBSE school girl students meeting academic criteria.",
 "category": ["Girls", "Class 10", "Government", "General"],
 "benefits": "Scholarship to continue studies in Class 11 & 12.",
 "application_link": "https://www.cbse.gov.in/",
 "status_source": "https://www.cbse.gov.in/"
 },
 {
 "name": "AICTE Pragati Scholarship (for Girls)",
 "eligibility": "Girl students admitted in first year of technical diploma/degree courses; family income ≤ ₹8,00,000 p.a.",
 "category": ["Girls", "Technical", "UG", "Government", "STEM", "Vocational/Skill-based"],
 "benefits": "Up to ₹50,000 per annum for tuition, books, and other expenses.",
 "application_link": "https://www.aicte-india.org/",
 "status_source": "https://www.aicte-india.org/schemes/students-development-schemes"
 },
 {
 "name": "AICTE Saksham Scholarship (for Differently-abled)",
 "eligibility": "Differently-abled students with ≥40% disability entering technical diploma/degree; family income ≤ ₹8,00,000 p.a.",
 "category": ["Disabled", "Technical", "UG", "Government", "STEM", "Vocational/Skill-based"],
 "benefits": "Up to ₹50,000 per annum.",
 "application_link": "https://www.aicte-india.org/",
 "status_source": "https://www.aicte-india.org/schemes/students-development-schemes"
 },
 {
 "name": "J&K UT Special Scholarship Scheme (JKSSS)",
 "eligibility": "Students of J&K applying for UG programs within UT or outside.",
 "category": ["J&K", "UG", "Government", "General"],
 "benefits": "Supports tuition & hostel expenses for higher education.",
 "application_link": "https://scholarships.gov.in/",
 "status_source": "https://scholarships.gov.in/"
 },
 {
 "name": "JKBOSE NMMS Scholarship",
 "eligibility": "Class 8 students from Govt schools; continues through Class 12 for meritorious low-income students.",
 "category": ["Class 10", "Class 12", "Minority", "SC", "ST", "OBC", "Government", "General"],
 "benefits": "₹12,000 per year till Class 12.",
 "application_link": "https://jkbose.nic.in/",
 "status_source": "https://jkbose.nic.in/"
 },
 {
 "name": "Dr. Ambedkar Post-Matric Scholarship (EBC)",
 "eligibility": "Economically Backward Class students after Class 12.",
 "category": ["Class 12", "EBC", "Government", "General"],
 "benefits": "Covers tuition and maintenance allowance.",
 "application_link": "https://scholarships.gov.in/",
 "status_source": "https://scholarships.gov.in/"
 },
 {
 "name": "Begum Hazrat Mahal National Scholarship",
 "eligibility": "Minority girl students (Class 9 to 12 and beyond).",
 "category": ["Girls", "Minority", "Class 10", "Class 12", "Government", "General"],
 "benefits": "Financial support for girl students in higher education.",
 "application_link": "https://scholarships.gov.in/",
 "status_source": "https://maef.nic.in/"
 },
 {
 "name": "Dakshana Scholarship for IIT/NEET Coaching",
 "eligibility": "Meritorious but economically weak students aiming for IIT/NEET after Class 10 or 12.",
 "category": ["Class 10", "Class 12", "STEM"],
 "benefits": "Free one-year residential coaching, including lodging and food.",
 "application_link": "https://dakshana.org/",
 "status_source": "https://dakshana.org/"
 },
 {
    "name": "Tribal Affairs Department (J&K) — ST Student Scholarships",
    "eligibility": "Scheduled Tribe (ST) students in J&K (pre-matric & post-matric levels)",
    "category": ["ST", "J&K", "Class 10", "Class 12", "Government", "General"],
    "benefits": "Financial assistance for various educational expenses.",
    "application_link": "https://jktribals.nic.in/",
    "status_source": "https://jktribals.nic.in/"
  },
  {
    "name": "Dr. Ambedkar Pre & Post-Matric Scholarship for DNTs (J&K)",
    "eligibility": "Denotified, Nomadic & Semi-Nomadic Tribes (DNTs) of J&K; family income ≤ ₹2,50,000 p.a.",
    "category": ["J&K", "Class 10", "Class 12", "Government", "General"],
    "benefits": "Maintenance allowance, tuition fees, and other non-refundable fees.",
    "application_link": "https://socialwelfare.jk.gov.in/",
    "status_source": "https://socialwelfare.jk.gov.in/"
  },
  {
    "name": "EBC Post-Matric Scholarship (J&K)",
    "eligibility": "EBC category students of J&K; family income ≤ ₹2,50,000 p.a.",
    "category": ["EBC", "J&K", "Class 12", "Government", "General"],
    "benefits": "Reimbursement of non-refundable fees and maintenance allowance.",
    "application_link": "https://socialwelfare.jk.gov.in/",
    "status_source": "https://socialwelfare.jk.gov.in/"
  },
  {
    "name": "GCW Parade Jammu — College-level Scholarships",
    "eligibility": "Students at Govt College For Women Parade Jammu (Minorities, SC, ST, OBC, orphans, BPL, etc.)",
    "category": ["Minority", "SC", "ST", "OBC", "Girls", "J&K", "UG", "Government", "General"],
    "benefits": "Financial aid via NSP, Central Sponsored Schemes, and JK Govt Social Welfare.",
    "application_link": "https://gcwparade.in/",
    "status_source": "https://gcwparade.in/"
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
export const LogoIcon = () => <svg height="30" viewBox="0 0 41 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 0L41 19.5L20.5 39L0 19.5L20.5 0Z" fill="currentColor"/></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>;
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><path d="M12 5v6"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const AwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>;
const BookmarkIcon = ({ filled = false }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>;
// --- START OF NEW CODE TO PASTE ---



// --- END OF NEW CODE ---
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

  const login = (userData, userType = 'student') => {
    const fakeUser = {
      name: userData.name || "Student",
      email: userData.email,
      userType: userType, // 'student' or 'mentor'
      level: null, // 'class10' or 'class12'
      stream: null, // For class 12
      quizHistory: [],
      bookmarks: [],
      backgroundInfo: '',
      sessions: [],
      sessionRequests: userType === 'mentor' ? [
          { studentName: "Rohan Patel", studentImage: "https://i.pravatar.cc/150?u=rohanp", date: new Date().toLocaleDateString(), status: 'Pending' },
          { studentName: "Sneha Reddy", studentImage: "https://i.pravatar.cc/150?u=sneha", date: new Date().toLocaleDateString(), status: 'Pending' }
      ] : [],
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
            id: mockMentors.length + 1, // Create a new ID
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

        const newMentorProfile = {
            id: newMentorReview.id,
            name: reviewData.name,
            college: reviewData.college,
            field: reviewData.qualifications,
            rating: 5.0, // Default new mentor rating
            reviews: 1,
            image: newMentorReview.image,
            availability: {
                days: reviewData.availability.days,
                time: reviewData.availability.time
            }
        };

        // This is a mock update. In a real app, this would be an API call.
        mockMentors.push(newMentorProfile);

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
          <NavItem onClick={() => setPage('scholarships')}>Scholarships</NavItem>
          <NavItem onClick={() => setPage('ebooks')}>eBooks</NavItem>
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

const HowItWorksStep = ({ stepNumber, title, description, imageUrl, imageSide = 'right' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.4 });

    const textVariants = {
        hidden: { opacity: 0, x: imageSide === 'right' ? -50 : 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    
    const imageVariants = {
        hidden: { opacity: 0, x: imageSide === 'right' ? 50 : -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div ref={ref} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div 
                className={`flex flex-col justify-center ${imageSide === 'left' ? 'md:order-last' : ''}`}
                variants={textVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-teal-900/50 text-teal-300 font-bold rounded-full border border-teal-800">
                        Step {stepNumber}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-4">{title}</h3>
                <p className="text-lg text-gray-400">{description}</p>
            </motion.div>
            <motion.div 
                className="flex items-center justify-center"
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <img src={imageUrl} alt={title} className="rounded-lg shadow-2xl shadow-teal-950/20 w-full h-auto object-cover border-2 border-gray-800"/>
            </motion.div>
        </div>
    );
};

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
    { text: "Designer", top: "80%", duration: 20, delay: 5 },
    { text: "Pilot", top: "85%", duration: 25, delay: 1 },
    { text: "IAS", top: "22%", duration: 19, delay: 7 },
    { text: "Scientist", top: "90%", duration: 23, delay: 4 },
    { text: "Lawyer", top: "70%", duration: 26, delay: 8 },
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
           
            {/* How it works - NEW 3-STEP PROCESS */}
            <section className="bg-black py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-teal-400 mb-4">A Clear Path in 3 Simple Steps</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">We've streamlined the complex process of career discovery into a journey you can trust.</p>
                    </div>
                    <div className="space-y-20 md:space-y-28">
                        <HowItWorksStep
                            stepNumber={1}
                            title="Discover Your Aptitude"
                            description="Take our quick, insightful quiz to understand your unique strengths and interests. We analyze your responses to recommend the stream that best fits your personality and skills."
                            imageUrl="https://placehold.co/600x400/131314/ffffff?text=Aptitude+Quiz"
                            imageSide="right"
                        />
                        <HowItWorksStep
                            stepNumber={2}
                            title="Explore Your Pathways"
                            description="Receive a personalized roadmap of streams, courses, and potential careers. Our AI-powered insights and visual mind maps make complex information easy to understand."
                            imageUrl="https://placehold.co/600x400/131314/ffffff?text=Career+Roadmap"
                            imageSide="left"
                        />
                        <HowItWorksStep
                            stepNumber={3}
                            title="Connect with Mentors & Colleges"
                            description="Chat with our AI mentor, book one-on-one sessions with experienced seniors, and browse our detailed college directory to find your perfect fit."
                            imageUrl="https://placehold.co/600x400/131314/ffffff?text=Mentors+%26+Colleges"
                            imageSide="right"
                        />
                    </div>
                </div>
            </section>
           
             {/* Mentors Section */}
            <AnimatedSection className="py-20 bg-gray-950">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-teal-400 mb-4">Meet Our Mentors</h2>
                    <p className="text-lg text-center text-gray-500 mb-12 max-w-2xl mx-auto">Get guidance from students who've walked the path before you.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockMentors.slice(0, 4).map((mentor, index) => (
                            <MentorProfileCard key={mentor.id} mentor={mentor} index={index} />
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Scholarships Section */}
            <AnimatedSection className="py-20 bg-black">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-teal-400 mb-4">Find Scholarships</h2>
                    <p className="text-lg text-center text-gray-500 mb-12 max-w-2xl mx-auto">Explore funding opportunities to support your educational journey.</p>
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/50">
                             <div className="text-center md:text-left">
                                <h3 className="font-bold text-2xl text-teal-300 flex items-center gap-3 justify-center md:justify-start"><AwardIcon/>Dont Dropout!</h3>
                                <p className="text-gray-400 mt-2">Browse a curated list of national and regional scholarships to help fund your studies.</p>
                            </div>
                            <Button onClick={() => setPage('scholarships')} className="w-full md:w-auto flex-shrink-0">
                                View Scholarships <ArrowRightIcon/>
                            </Button>
                        </Card>
                    </div>
                </div>
            </AnimatedSection>
           
             {/* Testimonials */}
            <AnimatedSection className="py-20 bg-gray-950">
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
                        <BriefcaseIcon className="w-16 h-16 text-teal-400 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-100 mb-4">I'm a Mentor</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Share your valuable college experiences and career insights to guide the next generation of students.
                        </p>
                        <Button>
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
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', college: '', qualifications: '',
        job: '', cgpa: '', reviewTitle: '', reviewText: '',
        availability: { days: [], time: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvailabilityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newAvailability = { ...prev.availability };
            if (type === 'checkbox') {
                if (checked) {
                    newAvailability.days.push(name);
                } else {
                    newAvailability.days = newAvailability.days.filter(day => day !== name);
                }
            } else {
                newAvailability.time = value;
            }
            return { ...prev, availability: newAvailability };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = addMentorReview({ ...formData, academicYear: mentorFlowState.academicYear });
        if (success) {
            // Automatically log the new mentor in and redirect to their dashboard
            login({ name: formData.name, email: `${formData.name.split(' ')[0].toLowerCase()}@mentor.com` }, 'mentor');
            setPage('dashboard');
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
                             <h2 className="text-xl font-semibold text-gray-200 mb-4">Set Your Availability</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Available Days</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                        <label key={day} className={`block text-center p-2 border-2 rounded-lg cursor-pointer transition-colors ${formData.availability.days.includes(day) ? 'bg-teal-600 border-teal-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                            <input type="checkbox" name={day} checked={formData.availability.days.includes(day)} onChange={handleAvailabilityChange} className="hidden" />
                                            {day.substring(0,3)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <InputField name="time" label="Available Time Slot" value={formData.availability.time} onChange={handleAvailabilityChange} placeholder="e.g., 5 PM - 7 PM IST" required className="mt-4" />
                        </div>


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

const EbooksPage = () => {
    const { setPage } = useNavigation();
    const { class10, class12 } = mockEbooksData;

    const EbookCard = ({ book }) => (
        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
                <p className="text-xs text-teal-400 font-semibold">{book.subject}</p>
                <h4 className="font-bold text-gray-100">{book.name}</h4>
            </div>
            <Button 
                onClick={() => window.open(book.url, '_blank')} 
                variant="outline" 
                className="w-full sm:w-auto flex-shrink-0 px-4 py-2 text-sm"
            >
                Download Page
            </Button>
        </Card>
    );

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('home')} variant="secondary" className="mb-8">
                    &larr; Back to Home
                </Button>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-teal-400 mb-4">Free NCERT e-Books</h1>
                    <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                        Click on any book to go to the official NCERT download page where you can get the full PDF.
                    </p>
                </div>

                {/* Class 10 eBooks */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b-2 border-teal-800 pb-2">📘 Class 10 Books</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {class10.map(book => <EbookCard key={book.name} book={book} />)}
                    </div>
                </div>

                {/* Class 12 eBooks */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b-2 border-teal-800 pb-2">📗 Class 12 Books</h2>
                    <div className="space-y-12">
                        {Object.entries(class12).map(([streamName, books]) => (
                            <div key={streamName}>
                                <h3 className="text-2xl font-semibold text-teal-400 mb-4">{streamName}</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {books.map(book => <EbookCard key={book.name} book={book} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScholarshipsPage = () => {
    const { setPage } = useNavigation();
    const [scholarships, setScholarships] = useState(mockScholarships);
    const [filteredScholarships, setFilteredScholarships] = useState(mockScholarships);
    const [filters, setFilters] = useState({
        class: 'All',
        category: 'All',
        courseType: 'All',
    });

    const filterOptions = {
        class: ['All', 'Class 10', 'Class 12'],
        category: ['All', 'SC', 'ST', 'OBC', 'Minority', 'Girls', 'Disabled', 'General', 'EBC'],
        courseType: ['All', 'STEM', 'Commerce', 'Government', 'Arts & Humanities', 'Vocational/Skill-based', 'General'],
    };

    useEffect(() => {
        let result = scholarships.filter(scholarship => {
            const classMatch = filters.class === 'All' || scholarship.category.includes(filters.class);
            const categoryMatch = filters.category === 'All' || scholarship.category.includes(filters.category);
            const courseTypeMatch = filters.courseType === 'All' || scholarship.category.includes(filters.courseType);
            return classMatch && categoryMatch && courseTypeMatch;
        });
        setFilteredScholarships(result);
    }, [filters, scholarships]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const FilterDropdown = ({ name, label, options }) => (
        <div className="flex-1 min-w-[150px]">
            <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <select
                id={name}
                name={name}
                value={filters[name]}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                 <Button onClick={() => setPage('home')} variant="secondary" className="mb-8">
                    &larr; Back to Home
                </Button>
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Find Scholarships</h1>
                <p className="text-lg text-center text-gray-400 mb-8 max-w-3xl mx-auto">Use the filters below to find financial aid opportunities tailored to your needs.</p>

                {/* Filters */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 flex flex-wrap gap-4">
                    <FilterDropdown name="class" label="Class" options={filterOptions.class} />
                    <FilterDropdown name="category" label="Category" options={filterOptions.category} />
                    <FilterDropdown name="courseType" label="Course Type" options={filterOptions.courseType} />
                </div>

                {/* Scholarship Listings */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {filteredScholarships.length > 0 ? (
                        filteredScholarships.map((scholarship, index) => (
                            <ScholarshipCard key={index} scholarship={scholarship} />
                        ))
                    ) : (
                        <p className="text-center lg:col-span-2 text-gray-500 py-10">
                            No scholarships match your current filter criteria. Try adjusting your selections.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ScholarshipCard = ({ scholarship }) => {
    return (
        <Card className="p-6 flex flex-col h-full">
            <div>
                <h3 className="text-xl font-bold text-teal-400 mb-3">{scholarship.name}</h3>
                <div className="mb-4">
                    <p className="font-semibold text-gray-300 mb-1">Eligibility:</p>
                    <p className="text-gray-400 text-sm">{scholarship.eligibility}</p>
                </div>
                <div className="mb-4">
                    <p className="font-semibold text-gray-300 mb-1">Benefits:</p>
                    <p className="text-gray-400 text-sm">{scholarship.benefits}</p>
                </div>
                <div className="mb-4">
                    <p className="font-semibold text-gray-300 mb-2">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                        {scholarship.category.map(cat => (
                            <span key={cat} className="bg-gray-800 text-teal-300 text-xs font-medium px-2.5 py-1 rounded-full">{cat}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="text-sm text-gray-500">
                    Status: <span className="font-semibold text-gray-400">Check official site</span>
                </div>
                <Button
                    onClick={() => window.open(scholarship.application_link, '_blank')}
                    className="w-full sm:w-auto px-4 py-2"
                >
                    Apply Now
                </Button>
            </div>
        </Card>
    );
};


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
    const { quizResult, quizType, setPage, setSelectedMindMapKey } = useNavigation();
    const [aiContent, setAiContent] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // State to toggle visibility of other stream options
    const [showOtherStreams, setShowOtherStreams] = useState(false);
    // State to toggle visibility of other career options for class 12
    const [showOtherCareers, setShowOtherCareers] = useState(false);

    const relevantDates = mockExamDates[quizResult] || mockExamDates[quizType.stream] || mockExamDates['default'];


    // Function to open the mind map modal with specific data
    const openMapForStream = (streamKey) => {
        if (quizType.level === 'class10') {
            setSelectedMindMapKey(streamKey); // Uses 'Science', 'Commerce', etc.
        } else { // For Class 12
            const mindMapKey = quizResultToMindMapKey[streamKey];
            setSelectedMindMapKey(mindMapKey);
        }
       setPage('mindMap');
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
           
             <div className="mb-12 flex justify-start">
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
                                {Object.keys(quizResultToMindMapKey)
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

            {quizType.level === 'class12' && (
            <div className="text-center mb-12">
                <Button onClick={() => setPage('colleges')}>Explore Colleges for {quizResult}</Button>
            </div>
            )}

            <Card className="p-8 text-center bg-gray-900/50">
                <h2 className="text-3xl font-bold text-teal-400 mb-4">Go Deeper with AI</h2>
                <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">Get a detailed, personalized explanation of your recommended path, including career options, key skills, and more.</p>
                <Button onClick={getAiInsights} disabled={isLoadingAi}>
                    <SparkleIcon/> {isLoadingAi ? 'Generating...' : 'Get AI-Powered Career Insights'}
                </Button>
                {isLoadingAi && <div className="mt-6"><LoadingSpinner size="sm" /></div>}
                {aiContent && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-left p-6 bg-gray-900 border border-gray-800 rounded-lg whitespace-pre-wrap leading-relaxed"
                    >
                         {/* Simple Markdown Parser */}
                        {aiContent.split('\n').map((line, index) => {
                             if (line.startsWith('**') && line.endsWith('**')) {
                                return <h3 key={index} className="text-xl font-bold text-teal-300 mt-4 mb-2">{line.slice(2, -2)}</h3>;
                            }
                             if (line.startsWith('* ')) {
                                return <p key={index} className="ml-4 list-item list-disc">{line.slice(2)}</p>;
                            }
                            return <p key={index} className="mb-2">{line}</p>;
                        })}
                    </motion.div>
                )}
            </Card>
        </div>
        </>
    );
};


// --- NEW: INTERACTIVE MIND MAP COMPONENTS ---
const MindMapNode = ({ node, onToggle, openNodes, path }) => {
    const { title, children, description } = node;
    const isExpanded = openNodes.has(path);
    const hasChildren = children && children.length > 0;

    const handleToggle = () => {
        if (hasChildren) {
            onToggle(path);
        }
    };

    const nodeColors = [
        "bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500", // Level 0
        "bg-gradient-to-br from-sky-600 to-sky-800 border-sky-500",     // Level 1
        "bg-gradient-to-br from-teal-600 to-teal-800 border-teal-500",    // Level 2
        "bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-500",// Level 3
        "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500" // Level 4
    ];
    const level = path.split('>').length - 1;
    const colorClass = nodeColors[level % nodeColors.length];

    return (
        <div className="flex items-start">
            {/* --- Node and toggle button --- */}
            <div className="flex-shrink-0 flex items-center">
                 <div
                    className={`group relative text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl ${colorClass} ${hasChildren ? 'cursor-pointer' : ''}`}
                    onClick={handleToggle}
                >
                    {title}
                     {description && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-3 bg-slate-900 border border-slate-600 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                            {description}
                        </div>
                    )}
                </div>
                {hasChildren && (
                    <button onClick={handleToggle} className="ml-3 p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all duration-300" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                )}
            </div>

            {/* --- Children --- */}
            {isExpanded && hasChildren && (
                <div className="ml-10 pl-10 border-l-2 border-slate-700 space-y-6">
                    {children.map((child, index) => (
                         <MindMapNode
                            key={index}
                            node={child}
                            onToggle={onToggle}
                            openNodes={openNodes}
                            path={`${path}>${child.title}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MindMapPage = () => {
    const { selectedMindMapKey, setPage, quizType } = useNavigation();
    const [selectedField, setSelectedField] = useState(selectedMindMapKey);
    const [openNodes, setOpenNodes] = useState(new Set());
    
    // Determine which dataset to use
    const isClass10 = quizType?.level === 'class10';
    const currentDataSet = isClass10 ? mockMindMapData : mindMapData;
    
    useEffect(() => {
        // When the page loads with a key, open the first level
        const currentMindMap = currentDataSet[selectedField];
        if (currentMindMap) {
            setOpenNodes(new Set([currentMindMap.title]));
        }
    }, [selectedField, currentDataSet]);


    const handleToggleNode = (path) => {
        setOpenNodes(prevOpenNodes => {
            const newOpenNodes = new Set(prevOpenNodes);
            if (newOpenNodes.has(path)) {
                // If the node is already open, close it and all its children
                newOpenNodes.forEach(openPath => {
                    if (openPath.startsWith(path)) {
                        newOpenNodes.delete(openPath);
                    }
                });
            } else {
                // If the node is closed, open it
                newOpenNodes.add(path);
            }
            return newOpenNodes;
        });
    };
    
    const fullFieldsByCategory = {
      "Engineering & Technology": ["sw_dev_it", "data_science", "design_hci", "industrial_manufacturing", "marine_environmental", "renewable_tech", "space_aerospace", "innovation_tech", "robotics_automation", "comm_media_tech", "chem_process_eng", "quant_data_analytics", "sci_data_research", "math_physics", "earth_atmospheric"],
      "Biotechnology & Life Sciences": ["biotech_life_sci", "healthcare_edu", "medicine_pharmacy", "chem_life_sci"],
      "Commerce / Business": ["corp_biz_mgmt", "startups_entrepreneurship", "accounting_financial", "marketing_corp_comm", "accounting_compliance", "hr_org_dev", "law_corp_gov", "marketing_brand_strategy", "entrepreneurship_small_biz", "intl_biz_trade", "finance_investment", "mgmt_leadership", "tax_accounting", "sales_growth", "finance_mgmt", "marketing_analytics_research", "financial_risk", "hr_comm", "investment_capital", "marketing_analytics_insights", "auditing_compliance"],
      "Arts / Humanities": ["history_archaeology", "philosophy_politics", "performing_arts", "film_media_prod", "visual_arts", "literature_writing", "creative_media_mgmt", "visual_media_design", "law_political_studies", "pr_event_mgmt", "anthropology_culture", "linguistics_comm", "music_performing_arts", "writing_script_dev", "politics_intl_studies", "social_work_counseling", "digital_media_design", "history_archival_research", "philosophy_ethics", "linguistics_lang_studies", "literature_creative_writing", "social_activism_ngo", "media_comm_studies", "literature_classical", "fashion_textile_design"]
    };

    const currentMindMap = currentDataSet[selectedField];

    return (
        <div className="flex-grow bg-gradient-to-b from-slate-900 to-gray-900 min-h-screen font-sans text-slate-300">
             <div className="max-w-7xl mx-auto px-4 sm:px-8">
                 <header className="text-center pt-8 sm:pt-12 mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">Interactive Career Map</h1>
                     <p className="text-lg text-slate-400">
                         Click a node to expand/collapse. Hover for a brief description.
                     </p>
                 </header>

                <div className="mb-6 flex justify-start">
                    <Button onClick={() => setPage('results')} variant="secondary">
                        &larr; Back to Results
                    </Button>
                </div>

                 <div className="mb-10 max-w-2xl mx-auto">
                    {isClass10 ? (
                        <select
                            id="field-select"
                            className="w-full p-4 text-lg bg-slate-800 border-2 border-slate-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                        >
                            {Object.keys(currentDataSet).map(key => (
                                <option key={key} value={key}>{currentDataSet[key].title}</option>
                            ))}
                        </select>
                    ) : (
                         <select
                            id="field-select"
                            className="w-full p-4 text-lg bg-slate-800 border-2 border-slate-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                        >
                           {Object.entries(fullFieldsByCategory).map(([category, fields]) => (
                               <optgroup label={category} key={category} style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}>
                                   {fields.map(fieldKey => {
                                       if (mindMapData[fieldKey]) {
                                           return (
                                               <option key={fieldKey} value={fieldKey} style={{ backgroundColor: '#334155'}}>
                                                   {mindMapData[fieldKey].title}
                                               </option>
                                           )
                                       }
                                       return null;
                                   })}
                               </optgroup>
                           ))}
                        </select>
                    )}
                 </div>
             </div>

             <main className="w-full overflow-x-auto p-4 sm:p-8 pt-12">
                  <div className="inline-block min-w-full">
                      {currentMindMap ? (
                          <MindMapNode
                              node={currentMindMap}
                              onToggle={handleToggleNode}
                              openNodes={openNodes}
                              path={currentMindMap.title}
                          />
                      ) : (
                          <p className="text-center">Select a field to begin.</p>
                      )}
                  </div>
             </main>
        </div>
    );
};

// --- END: INTERACTIVE MIND MAP COMPONENTS ---

const CollegesPage = () => {
    const { setPage, setSelectedCollegeId } = useNavigation();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');

    const searchColleges = async (e) => {
        e.preventDefault();
        if (!location.trim()) {
            setError('Please enter a city name to search.');
            return;
        }
        setLoading(true);
        setError('');
        setColleges([]);
        try {
            const res = await api.get(`/places/colleges?location=${location}`);
            const formatted = res.data.map(c => ({...c, image: c.photoUrl, location: c.address, type: 'College'}));
            setColleges(formatted);
        } catch (err) {
            setError('Could not fetch colleges. Please try again.');
        }
        setLoading(false);
    };

    const handleCollegeSelect = (id) => {
        setSelectedCollegeId(id); // This will now be a Google Place ID
        setPage('collegeDetail');
    };

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Find Your College</h1>
                <p className="text-lg text-center text-gray-400 mb-8">Search for colleges in any city using live data from Google.</p>
                <form onSubmit={searchColleges} className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Enter a city name (e.g., Delhi, Mumbai...)"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50 flex-grow"
                    />
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </form>
                
                {error && <p className="text-center text-red-500 my-4">{error}</p>}
                {loading && <LoadingSpinner />}

                <div className="grid md:grid-cols-2 gap-8">
                    {colleges.length > 0 ? colleges.map(college => (
                        <CollegeCard key={college.id} college={college} onSelect={handleCollegeSelect} />
                    )) : !loading && !error && (
                        <p className="text-center col-span-2 text-gray-500">Your search results will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const CollegeCard = ({ college, onSelect }) => {
    const { user, updateUserProfile, isAuthenticated } = useAuth();
    const collegeId = college.id; // Google's Place ID
    const isBookmarked = user?.bookmarks?.includes(collegeId);

    const handleBookmark = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) { 
            alert('Please log in to bookmark colleges.');
            return;
        }
        const currentBookmarks = user.bookmarks || [];
        const newBookmarks = isBookmarked
            ? currentBookmarks.filter(id => id !== collegeId)
            : [...currentBookmarks, collegeId];
        updateUserProfile({ bookmarks: newBookmarks });
    };

    return (
        <Card className="cursor-pointer group relative" onClick={() => onSelect(collegeId)}>
            {isAuthenticated && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBookmark}
                    className={`absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full transition-colors ${isBookmarked ? 'text-teal-400' : 'text-white'}`}
                    aria-label="Bookmark college"
                >
                    <BookmarkIcon filled={isBookmarked} />
                </motion.button>
            )}
            <div className="h-48 bg-gray-950 flex items-center justify-center overflow-hidden">
                <img src={college.photoUrl || college.image || `https://placehold.co/600x400/131314/ffffff?text=${encodeURIComponent(college.name)}`} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-100">{college.name}</h3>
                <p className="text-gray-400 mb-2 text-sm">{college.location}</p>
                <div className="flex items-center mb-4">
                    <StarIcon/>
                    <span className="ml-1 text-yellow-400 font-bold">{college.rating || 'N/A'}</span>
                    {college.totalRatings && <span className="text-gray-500 text-sm ml-2">({college.totalRatings} reviews)</span>}
                </div>
            </div>
        </Card>
    );
};

const MentorReviewCard = ({ mentor }) => {
    const isPositive = mentor.reviewType === 'positive';
    const { setPage, setSelectedMentorId } = useNavigation();

    const handleBookSession = (e) => {
        e.stopPropagation(); // Prevent the main card click event if the button is clicked
        if (mentor.id) {
            setSelectedMentorId(mentor.id);
        } else {
            // Optionally, handle cases where there's no bookable mentor profile
            alert("This mentor profile is not available for booking sessions.");
        }
    };

    return (
        <div className={`bg-gray-900 border ${isPositive ? 'border-green-800/50' : 'border-red-800/50'} rounded-lg p-6 shadow-lg flex flex-col`}>
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
                <p className="text-gray-300 italic flex-grow">"{mentor.reviewText}"</p>
            </div>
             {mentor.id && (
                <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                    <Button onClick={handleBookSession} variant="outline" className="w-full sm:w-auto">
                        Book Session with {mentor.name.split(' ')[0]}
                    </Button>
                </div>
            )}
        </div>
    );
};

// --- PASTE THIS ENTIRE CORRECTED COMPONENT ---

const CollegeDetailPage = () => {
    const { selectedCollegeId, setPage } = useNavigation();
    const { user, updateUserProfile, isAuthenticated } = useAuth();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCollegeDetails = async () => {
            if (!selectedCollegeId) return;
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/places/details?placeId=${selectedCollegeId}`);
                setCollege(res.data);
            } catch (err) {
                setError('Failed to fetch college details.');
                console.error(err);
            }
            setLoading(false);
        };
        fetchCollegeDetails();
    }, [selectedCollegeId]);

    if (loading) {
        return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
    }
    if (error) {
        return <div className="flex-grow flex items-center justify-center text-red-500">{error}</div>;
    }
    if (!college) {
        return <div className="flex-grow flex items-center justify-center">College details could not be loaded.</div>;
    }

    const isBookmarked = user?.bookmarks?.includes(college.id);

    const handleBookmark = () => {
        if (!isAuthenticated) { 
            alert('Please log in to bookmark colleges.');
            return;
        }
        const currentBookmarks = user.bookmarks || [];
        const newBookmarks = isBookmarked
            ? currentBookmarks.filter(id => id !== college.id)
            : [...currentBookmarks, college.id];
        updateUserProfile({ bookmarks: newBookmarks });
    };

    return (
       <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('colleges')} variant="secondary" className="mb-8">
                    &larr; Back to Search
                </Button>

                {/* This grid now ONLY contains the top two columns */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <img src={college.photoUrl || college.image || `https://placehold.co/600x400/131314/ffffff?text=${encodeURIComponent(college.name)}`} alt={college.name} className="w-full h-auto object-cover rounded-lg mb-6 shadow-2xl"/>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-teal-400 mb-2">{college.name}</h1>
                                <p className="text-lg text-gray-400 mb-6">{college.location}</p>
                            </div>
                            {isAuthenticated && (
                                <Button onClick={handleBookmark} variant="secondary" className="flex-shrink-0">
                                    <BookmarkIcon filled={isBookmarked} />
                                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                </Button>
                            )}
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-100 mb-4">Courses & Speciality (Sample)</h2>
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
                            <h3 className="text-2xl font-bold text-gray-100 mb-4">Google Info</h3>
                            <div className="flex items-center mb-4 text-xl">
                                <StarIcon/>
                                <span className="ml-2 text-yellow-400 font-bold">{college.rating} / 5.0</span>
                            </div>
                            {college.website && <a href={college.website} target="_blank" rel="noopener noreferrer"><Button className="w-full">Visit Website</Button></a>}
                        </div>
                    </div>
                </div> {/* <-- KEY CHANGE: The grid layout for the top section ends here. */}

                {/* This "Reviews" section is now outside and below the grid, so it will be full-width. */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">Reviews from Google</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {college.reviews && college.reviews.length > 0 ? (
                            college.reviews.map(review => (
                                <Card key={review.time} className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={review.profile_photo_url} alt={review.author_name} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <h4 className="font-bold text-gray-100">{review.author_name}</h4>
                                            <p className="text-sm text-gray-400">{review.relative_time_description}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 italic">"{review.text}"</p>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center col-span-2 text-gray-500">No reviews available for this college on Google.</p>
                        )}
                    </div>
      _           </div>
            </div>
       </div>
    );
};

const MentorsPage = () => {
    const [mentors] = useState(mockMentors);
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const { user } = useAuth();
    const { selectedMentorId, setSelectedMentorId } = useNavigation();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [collegeSuggestions, setCollegeSuggestions] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);

    // Effect to open modal if navigated with a pre-selected mentor ID
    useEffect(() => {
        if (selectedMentorId) {
            const mentorToBook = mockMentors.find(m => m.id === selectedMentorId);
            if (mentorToBook) {
                // The modal opening is now handled globally in App.jsx
            }
        }
    }, [selectedMentorId]);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const suggestions = mockColleges.filter(college =>
                college.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setCollegeSuggestions(suggestions);
        } else {
            setCollegeSuggestions([]);
        }
    }, [searchQuery]);
   
    const openBookingModal = (mentor) => {
        if(!user) {
            alert("Please log in to book a session.");
            return;
        }
        setSelectedMentorId(mentor.id);
    };

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setSearchQuery(college.name);
        setCollegeSuggestions([]);
    };
    
    const clearFilter = () => {
        setSelectedCollege(null);
        setSearchQuery('');
    };

    const filteredMentors = selectedCollege
        ? mentors.filter(mentor => mentor.college === selectedCollege.name)
        : mentors;

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center text-teal-400 mb-4">Connect with Mentors</h1>
                <p className="text-lg text-center text-gray-400 mb-12 max-w-3xl mx-auto">Get one-on-one guidance from experienced students and alumni. Search for a college below to find mentors from that specific institution.</p>
                
                <div className="relative max-w-2xl mx-auto mb-12">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a college to find its mentors..."
                        className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
                    />
                    {collegeSuggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b-md z-10 max-h-60 overflow-y-auto shadow-lg">
                            {collegeSuggestions.map(college => (
                                <li
                                    key={college.id}
                                    onClick={() => handleCollegeSelect(college)}
                                    className="p-3 text-gray-300 hover:bg-gray-700 cursor-pointer"
                                >
                                    {college.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedCollege && (
                    <div className="text-center mb-8">
                        <p className="text-lg text-gray-400">Showing mentors for <span className="font-bold text-teal-400">{selectedCollege.name}</span></p>
                        <button onClick={clearFilter} className="text-sm text-teal-500 hover:underline mt-1">Clear Filter</button>
                    </div>
                )}

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
                    {filteredMentors.map(mentor => (
                        <MentorCard key={mentor.id} mentor={mentor} onBook={() => openBookingModal(mentor)} />
                    ))}
                    {filteredMentors.length === 0 && selectedCollege && (
                        <p className="sm:col-span-2 lg:col-span-4 text-center text-gray-400 py-8">
                            We don't have any mentors from {selectedCollege.name} yet. Be the first to <a onClick={() => setPage('mentorLogin')} className="text-teal-500 hover:underline cursor-pointer">join as a mentor</a>!
                        </p>
                    )}
                </div>
            </div>
           
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
    const { user, logout, updateUserProfile } = useAuth();
    const { setPage, setSelectedCollegeId } = useNavigation();
    const [bookmarkedCollegeData, setBookmarkedCollegeData] = useState([]);
    const [bookmarksLoading, setBookmarksLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarkedColleges = async () => {
            if (!user?.bookmarks || user.bookmarks.length === 0) {
                setBookmarksLoading(false);
                return;
            }
            try {
                const collegePromises = user.bookmarks.map(id =>
                    api.get(`/places/details?placeId=${id}`)
                );
                const responses = await Promise.all(collegePromises);
                const colleges = responses.map(res => res.data);
                setBookmarkedCollegeData(colleges);
            } catch (error) {
                console.error("Failed to fetch bookmarked colleges:", error);
            } finally {
                setBookmarksLoading(false);
            }
        };
        fetchBookmarkedColleges();
    }, [user?.bookmarks]);
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

    if (user.userType === 'mentor') {
        return <MentorDashboardPage />;
    }

    const allInterests = user.quizHistory.flatMap(q => {
        const interests = [q.result]; // Always include the specific result, e.g., "Engineering"
        if (q.type.startsWith('class12')) {
            // e.g., "class12 - Science"
            const stream = q.type.split(' - ')[1];
            if (stream) {
                interests.push(stream); // Also include the parent stream, e.g., "Science"
            }
        }
        return interests;
    });
    const uniqueInterests = [...new Set(allInterests)];

    const allRelevantDates = uniqueInterests.map(interest => ({
        interest,
        dates: mockExamDates[interest] || []
    })).filter(group => group.dates.length > 0);
    const bookmarkedColleges = mockColleges.filter(c => user.bookmarks?.includes(c.id));

    // --- REPLACE YOUR ENTIRE 'return' BLOCK WITH THIS ---

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-teal-400 mb-8">Welcome, {user.name}!</h1>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content (The larger left column) */}
                    <div className="lg:col-span-2 space-y-8">
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
                        
                        <DashboardSection title="Upcoming Mentorship Sessions">
                            {user.sessions && user.sessions.length > 0 ? (
                                <ul className="space-y-3">
                                {user.sessions.map((session, i) => (
                                    <li key={i} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-100">{session.mentorName} ({session.field})</p>
                                            <p className="text-sm text-gray-400">Booked on {session.date}</p>
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full ${session.status === 'Upcoming' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>{session.status}</span>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No upcoming sessions. <a onClick={() => setPage('mentors')} className="text-teal-500 cursor-pointer hover:underline">Find a mentor</a>.</p>
                            )}
                        </DashboardSection>

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

                    {/* Sidebar (The smaller right column) */}
                    <div className="space-y-8">
                        <DashboardSection title="Profile">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <button className="text-sm text-teal-500 hover:underline mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1">Edit Profile</button>
                            </div>
                        </DashboardSection>
                        
                        <DashboardSection title="Important Dates">
                            {/* ... This section for dates is unchanged ... */}
                        </DashboardSection>

                        {/* CORRECTLY PLACED BOOKMARKS SECTION */}
                        <DashboardSection title="My Bookmarked Colleges">
                            {bookmarksLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : bookmarkedCollegeData.length > 0 ? (
                                <div className="space-y-3">
                                    {bookmarkedCollegeData.map(college => (
                                        <div key={college.id} onClick={() => { setSelectedCollegeId(college.id); setPage('collegeDetail'); }} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                                            <p className="font-semibold text-gray-100">{college.name}</p>
                                            <ArrowRightIcon className="w-4 h-4 text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">You haven't bookmarked any colleges yet. <a onClick={() => setPage('colleges')} className="text-teal-500 cursor-pointer hover:underline">Explore colleges now</a>.</p>
                            )}
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

// --- NEW MENTOR DASHBOARD PAGE ---
const MentorDashboardPage = () => {
    const { user, updateUserProfile } = useAuth();
    const [requests, setRequests] = useState(user.sessionRequests);

    const handleRequest = (studentName, action) => {
        setRequests(prev => prev.map(req => 
            req.studentName === studentName ? { ...req, status: action } : req
        ));
        // In a real app, you'd also update the user object persistently
    };

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-teal-400 mb-8">Mentor Dashboard</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Session Requests */}
                    <div className="lg:col-span-2">
                        <DashboardSection title="Session Requests">
                           {requests.filter(r => r.status === 'Pending').length > 0 ? (
                                <ul className="space-y-4">
                                    {requests.filter(r => r.status === 'Pending').map((req, i) => (
                                        <li key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <img src={req.studentImage} alt={req.studentName} className="w-12 h-12 rounded-full" />
                                                <div>
                                                    <p className="font-semibold text-gray-100">{req.studentName}</p>
                                                    <p className="text-sm text-gray-400">Requested on {req.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button onClick={() => handleRequest(req.studentName, 'Accepted')} className="bg-green-600 hover:bg-green-500 focus-visible:ring-green-500 px-4 py-2 text-sm">Accept</Button>
                                                <Button onClick={() => handleRequest(req.studentName, 'Declined')} variant="secondary" className="bg-red-600 hover:bg-red-500 focus-visible:ring-red-500 px-4 py-2 text-sm">Decline</Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                           ) : (
                                <p className="text-gray-400">No pending session requests.</p>
                           )}
                        </DashboardSection>
                    </div>
                    {/* Sidebar */}
                     <div className="space-y-8">
                        <DashboardSection title="Profile">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        </DashboardSection>
                        <DashboardSection title="Request History">
                             <ul className="space-y-3">
                                {requests.filter(r => r.status !== 'Pending').map((req, i) => (
                                    <li key={i} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center border border-gray-700/50">
                                        <p className="font-medium text-gray-300">{req.studentName}</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.status === 'Accepted' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{req.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </DashboardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [selectedMentorId, setSelectedMentorId] = useState(null); // For booking from college page
    const [mentorFlowState, setMentorFlowState] = useState(null); // For mentor registration flow data
    const [selectedMindMapKey, setSelectedMindMapKey] = useState(null); // NEW for mind map page

    const contextValue = {
        page,
        setPage,
        quizType,
        setQuizType,
        quizResult,
        setQuizResult,
        selectedCollegeId,
        setSelectedCollegeId,
        selectedMentorId,
        setSelectedMentorId,
        mentorFlowState,
        setMentorFlowState,
        selectedMindMapKey, 
        setSelectedMindMapKey
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

const useNavigation = () => useContext(NavigationContext);

const App = () => {
    const [isAnimating, setIsAnimating] = useState(true);
    const { page } = useNavigation();
    const { loading, isAuthenticated } = useAuth();
   
    const { selectedMentorId, setSelectedMentorId } = useNavigation();
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [mentorReview, setMentorReview] = useState(null);
    const { user, updateUserProfile } = useAuth();

    useEffect(() => {
        if (selectedMentorId) {
            const mentorToBook = mockMentors.find(m => m.id === selectedMentorId);
            if (mentorToBook) {
                if(!user) {
                    alert("Please log in to book a session.");
                    setSelectedMentorId(null); // Reset
                    return;
                }
                setSelectedMentor(mentorToBook);

                // Find the review details for this mentor
                const college = mockColleges.find(c => c.name === mentorToBook.college);
                let reviewDetails = null;
                if (college) {
                    const reviewsForCollege = mockCollegeMentors[college.id];
                    if (reviewsForCollege) {
                        reviewDetails = reviewsForCollege.find(r => r.id === mentorToBook.id);
                    }
                }
                setMentorReview(reviewDetails);

                setIsBookingModalOpen(true);
            }
        }
    }, [selectedMentorId, user, setSelectedMentorId]);

    const handleBooking = () => {
        if (!selectedMentor) return;
        const newSession = {
            mentorName: selectedMentor.name,
            field: selectedMentor.field,
            date: new Date().toLocaleDateString(),
            status: 'Pending with Mentor'
        };
        updateUserProfile({ sessions: [...(user.sessions || []), newSession] });
        setIsBookingModalOpen(false);
        setSelectedMentorId(null);
        alert(`Session request sent to ${selectedMentor.name}! You'll be notified upon confirmation.`);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
        setSelectedMentorId(null);
        setMentorReview(null);
    }

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
            case 'mindMap': return <MindMapPage />;
            case 'colleges': return <CollegesPage />;
            case 'collegeDetail': return <CollegeDetailPage />;
            case 'mentors': return <MentorsPage />;
            case 'scholarships': return <ScholarshipsPage />;
            case 'ebooks': return <EbooksPage />;
            case 'dashboard': return <DashboardPage />;
            case 'admin': return <AdminPage />; // In a real app, this would be role-protected
            case 'home':
            default:
                return <HomePage />;
        }
    };

    // --- REPLACE the original 'return' block of the App component with THIS ---
return (
    <AnimatePresence mode="wait">
        {isAnimating ? (
            <SplashScreen key="splash" onAnimationComplete={() => setIsAnimating(false)} />
        ) : (
            <motion.div
                key="main-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                className="flex flex-col min-h-screen bg-gray-950 text-gray-300 font-sans custom-cursor-area"
            >
                <Header />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer />
                <Modal isOpen={isBookingModalOpen} onClose={closeBookingModal} title="Book a Session">
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
                            {mentorReview && (
                                <div className="text-gray-300 mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                   <p className="font-semibold text-gray-200 mb-2">Mentor's Review of {selectedMentor.college}:</p>
                                   <div className={`flex items-center mb-2 gap-2 font-bold ${mentorReview.reviewType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                                       {mentorReview.reviewType === 'positive' ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
                                       <h5>{mentorReview.reviewTitle}</h5>
                                   </div>
                                   <p className="italic text-gray-400">"{mentorReview.reviewText}"</p>
                                </div>
                            )}
                            <div className="text-gray-300 mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                               <p className="font-semibold text-gray-200 mb-2">Mentor's Availability:</p>
                               <p><strong>Days:</strong> {selectedMentor.availability.days.join(', ')}</p>
                               <p><strong>Time:</strong> {selectedMentor.availability.time}</p>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">You will be able to choose a specific time slot after the mentor confirms your request.</p>
                            <Button onClick={handleBooking} className="w-full">Send Session Request</Button>
                        </div>
                    )}
                </Modal>
            </motion.div>
        )}
    </AnimatePresence>
);
// --- END OF REPLACEMENT ---
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