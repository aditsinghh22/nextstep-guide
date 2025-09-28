import React, { useState, useEffect, createContext, useContext, useRef, useLayoutEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';
import axios from 'axios'; // Make sure this import is at the top with the others
import SplashScreen from './SplashScreen.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoginPage } from './LoginPage.jsx';
import { SignupPage } from './SignupPage.jsx';
import { OtpPage } from "./OtpPage.jsx";
import { SkillsPage } from './SkillsPage.jsx';
import './i18n';
import { useTranslation } from 'react-i18next'; 
import LanguageSwitcher from './LanguageSwitcher.jsx';
// --- API HELPER ---
// ...
// --- API HELPER ---
// A centralized place to configure axios, especially for our backend URL.

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// --- MOCK DATA ---
// In a real application, this data would come from a backend API.

// --- [START] PASTE THIS ENTIRE BLOCK ---

// --- [START] PASTE THIS ENTIRE BLOCK ---

const careerFields = {
    Science: [
        { id: 'eng_tech', name: 'Engineering & Technology' },
        { id: 'comp_sci', name: 'Computer Science & Software Development' },
        { id: 'data_sci', name: 'Data Science, AI & Analytics' },
        { id: 'math_stats', name: 'Mathematics & Statistics' },
        { id: 'phy_sci', name: 'Physical Sciences (Physics, Chemistry)' },
        { id: 'chem_eng', name: 'Chemistry & Chemical Engineering' },
        { id: 'biotech', name: 'Biotechnology & Biomedical Sciences' },
        { id: 'medicine', name: 'Medicine & Healthcare' },
        { id: 'pharmacy', name: 'Pharmacy & Drug Development' },
        { id: 'earth_sci', name: 'Earth & Environmental Sciences' },
        { id: 'marine_sci', name: 'Marine & Ocean Sciences' },
        { id: 'space_aero', name: 'Space, Aerospace & Robotics' },
    ],
    Commerce: [
        { id: 'biz_mgmt', name: 'Business & Management' },
        { id: 'fin_acc', name: 'Finance, Accounting & Auditing' },
        { id: 'banking', name: 'Banking, Insurance & Financial Services' },
        { id: 'investment', name: 'Investment, Capital Markets & Risk Management' },
        { id: 'marketing', name: 'Marketing, Advertising & Brand Strategy' },
        { id: 'sales_ecom', name: 'Sales, E-Commerce & Digital Business' },
        { id: 'entrepreneur', name: 'Entrepreneurship & Startups' },
        { id: 'intl_biz', name: 'International Business & Trade' },
        { id: 'supply_chain', name: 'Supply Chain, Logistics & Operations' },
        { id: 'hospitality', name: 'Tourism, Hospitality & Event Management' },
        { id: 'law_gov', name: 'Law, Corporate Governance & Compliance' },
        { id: 'real_estate', name: 'Real Estate, Retail & Consumer Business' },
    ],
    Arts: [
        { id: 'poli_sci', name: 'Political Science, Public Policy & International Relations' },
        { id: 'history', name: 'History, Archaeology & Heritage Studies' },
        { id: 'philosophy', name: 'Philosophy, Ethics & Religion Studies' },
        { id: 'sociology', name: 'Sociology, Anthropology & Culture Studies' },
        { id: 'psychology', name: 'Psychology, Counseling & Human Behavior' },
        { id: 'literature', name: 'Literature, Creative Writing & Languages' },
        { id: 'media', name: 'Media, Journalism & Communication Studies' },
        { id: 'film_theatre', name: 'Film, Theatre & Performing Arts' },
        { id: 'visual_arts', name: 'Visual Arts, Design & Fashion' },
        { id: 'music_dance', name: 'Music, Dance & Fine Arts' },
        { id: 'social_work', name: 'Social Work, NGO & Activism' },
        { id: 'education', name: 'Education, Teaching & Learning Sciences' },
    ],
    // --- NEW UNCONVENTIONAL PATHWAY ---
    Unconventional: [ 
        { id: 'gaming_esports', name: 'Gaming & Esports' },
        { id: 'content_creation', name: 'Digital Content Creation' },
        { id: 'culinary_arts', name: 'Culinary Arts & Food Tech' },
        { id: 'sports_mgmt', name: 'Sports Management & Analytics' },
        { id: 'music_production', name: 'Music Production & Sound Design' },
        { id: 'social_entrepreneurship', name: 'Social Entrepreneurship & Impact' },
        { id: 'travel_tourism', name: 'Travel, Adventure & Tourism' },
        { id: 'animation_vfx', name: 'Animation, VFX & Motion Graphics' },
        { id: 'petroleum_mining', name: 'Petroleum, Mining & Geology' }, // Using a niche field for diversity
        { id: 'public_relations', name: 'Public Relations & Image Management' },
        { id: 'urban_planning', name: 'Urban Planning & Architecture' },
        { id: 'data_journalism', name: 'Data Journalism & Investigative Reporting' },
    ]
    
};

const adaptiveQuizData = {
    class10: {
        title: "Class 10 Aptitude & Interest Quiz",
        questions: [
            { id: 'q1', text: "Which activity do you enjoy the most?", options: [{ text: "Solving complex math problems", stream: "Science" }, { text: "Analyzing historical events", stream: "Arts" }, { text: "Understanding how businesses work", stream: "Commerce" }] },
            { id: 'q2', text: "What kind of TV shows or movies do you prefer?", options: [{ text: "Science fiction or documentaries", stream: "Science" }, { text: "Dramas or historical films", stream: "Arts" }, { text: "Shows about entrepreneurs or the stock market", stream: "Commerce" }] },
            { id: 'q3', text: "If you had to start a club, what would it be?", options: [{ text: "A robotics or coding club", stream: "Science" }, { text: "A debate or literature club", stream: "Arts" }, { text: "An investment or young entrepreneurs club", stream: "Commerce" }] },
            { id: 'q4', text: "Which subject combination sounds most interesting?", options: [{ text: "Physics, Chemistry, and Math", stream: "Science" }, { text: "History, Political Science, and Economics", stream: "Arts" }, { text: "Accountancy, Business Studies, and Economics", stream: "Commerce" }] },
            { id: 'q5', text: "How do you approach problem-solving?", options: [{ text: "Logically and systematically", stream: "Science" }, { text: "Creatively and with empathy", stream: "Arts" }, { text: "Strategically and with a focus on efficiency", stream: "Commerce" }] },
             { id: 'q6', text: "When facing a new challenge, do you focus more on technical tools, human impact, or resource management?", options: [{ text: "Technical Tools (Science)", stream: "Science" }, { text: "Human Impact (Arts)", stream: "Arts" }, { text: "Resource Management (Commerce)", stream: "Commerce" }] },
            { id: 'q7', text: "Which type of content do you spend most time consuming online?", options: [{ text: "Scientific blogs or engineering tutorials", stream: "Science" }, { text: "Current affairs, politics, or creative arts channels", stream: "Arts" }, { text: "Financial news, marketing trends, or investment advice", stream: "Commerce" }] },
            { id: 'q8', text: "Which historical figure's life story is most interesting to you?", options: [{ text: "A famous scientist (e.g., Einstein, Newton)", stream: "Science" }, { text: "A renowned writer or philosopher (e.g., Shakespeare, Plato)", stream: "Arts" }, { text: "A successful business leader (e.g., J.R.D. Tata, Steve Jobs)", stream: "Commerce" }] },
            { id: 'q9', text: "What do you enjoy doing during a school break?", options: [{ text: "Dismantling/building gadgets or solving logic puzzles", stream: "Science" }, { text: "Reading fiction, visiting museums, or learning a new language", stream: "Arts" }, { text: "Managing personal savings or planning a small venture/event", stream: "Commerce" }] },
            { id: 'q10', text: "Which best describes your career aspiration?", options: [{ text: "To create new technology or cure diseases", stream: "Science" }, { text: "To influence culture, law, or public opinion", stream: "Arts" }, { text: "To lead a company or manage large sums of money", stream: "Commerce" }] },
        ]
    },
    class12: {
        phase1: {
            'Science': {
                title: "Science: Broad Interest Screening",
                questions: [
                    { id: 'p1q1', text: "I'm fascinated by how machines and structures are designed and built.", fieldId: 'eng_tech' },
                    { id: 'p1q2', text: "I enjoy the logic of programming and building applications with code.", fieldId: 'comp_sci' },
                    { id: 'p1q3', text: "Finding hidden patterns in large sets of data is an exciting challenge for me.", fieldId: 'data_sci' },
                    { id: 'p1q4', text: "I appreciate the elegance of pure mathematics and logical proofs.", fieldId: 'math_stats' },
                    { id: 'p1q5', text: "I'm curious about the fundamental principles of the universe, like particles and energy.", fieldId: 'phy_sci' },
                    { id: 'p1q6', text: "I enjoy hands-on lab experiments that involve transforming substances.", fieldId: 'chem_eng' },
                    { id: 'p1q7', text: "The idea of manipulating DNA and cells to solve problems is inspiring.", fieldId: 'biotech' },
                    { id: 'p1q8', text: "I feel a strong desire to help and care for people who are sick or injured.", fieldId: 'medicine' },
                    { id: 'p1q9', text: "I'm interested in the precise science of how medicines are created and work in the body.", fieldId: 'pharmacy' },
                    { id: 'p1q10', text: "I feel a deep connection to nature and want to understand its systems (weather, geology).", fieldId: 'earth_sci' },
                    { id: 'p1q11', text: "I am drawn to exploring unknown environments, like the deep sea.", fieldId: 'marine_sci' },
                    { id: 'p1q12', text: "Building advanced autonomous systems like rovers or drones excites me.", fieldId: 'space_aero' },
                ]
            },
            'Commerce': {
                title: "Commerce: Broad Interest Screening",
                questions: [
                    { id: 'p1q1', text: "In a group, I naturally take charge to organize the team and plan strategy.", fieldId: 'biz_mgmt' },
                    { id: 'p1q2', text: "I enjoy working with numbers to ensure financial records are accurate and balanced.", fieldId: 'fin_acc' },
                    { id: 'p1q3', text: "I'm interested in how large financial systems like banks and insurance companies operate.", fieldId: 'banking' },
                    { id: 'p1q4', text: "I'm comfortable taking calculated risks with money for a potentially high reward.", fieldId: 'investment' },
                    { id: 'p1q5', text: "I'm fascinated by what makes people choose one brand over another.", fieldId: 'marketing' },
                    { id: 'p1q6', text: "The fast-paced world of online business and digital sales excites me.", fieldId: 'sales_ecom' },
                    { id: 'p1q7', text: "I would rather build something new from scratch than work in an established company.", fieldId: 'entrepreneur' },
                    { id: 'p1q8', text: "I enjoy learning about different cultures and how global events affect business.", fieldId: 'intl_biz' },
                    { id: 'p1q9', text: "I'm good at finding the most efficient way to get something from point A to point B.", fieldId: 'supply_chain' },
                    { id: 'p1q10', text: "I love the challenge of organizing large-scale events and creating great experiences.", fieldId: 'hospitality' },
                    { id: 'p1q11', text: "I believe having clear rules and ensuring everyone follows them is crucial.", fieldId: 'law_gov' },
                    { id: 'p1q12', text: "I have a good sense of a product or property's value and enjoy negotiation.", fieldId: 'real_estate' }
                ]
            },
            'Arts': {
                title: "Arts: Broad Interest Screening",
                questions: [
                    { id: 'p1q1', text: "I'm deeply interested in how governments work and how policies can improve society.", fieldId: 'poli_sci' },
                    { id: 'p1q2', text: "I believe understanding the past is the best way to understand the present.", fieldId: 'history' },
                    { id: 'p1q3', text: "I enjoy thinking about 'big questions' about life, morality, and purpose.", fieldId: 'philosophy' },
                    { id: 'p1q4', text: "I am very curious about why people in different cultures live the way they do.", fieldId: 'sociology' },
                    { id: 'p1q5', text: "I'm the person my friends come to for advice because I listen without judgment.", fieldId: 'psychology' },
                    { id: 'p1q6', text: "I feel a strong need to express my ideas and feelings through writing or storytelling.", fieldId: 'literature' },
                    { id: 'p1q7', text: "I believe in the power of truth and feel a duty to share important information with others.", fieldId: 'media' },
                    { id: 'p1q8', text: "I am captivated by powerful performances that make an audience feel strong emotions.", fieldId: 'film_theatre' },
                    { id: 'p1q9', text: "I have a strong sense of aesthetics and notice details of design, color, and composition.", fieldId: 'visual_arts' },
                    { id: 'p1q10', text: "I believe art, music, or dance can often communicate feelings better than words.", fieldId: 'music_dance' },
                    { id: 'p1q11', text: "When I see injustice, my first instinct is to take action and help those affected.", fieldId: 'social_work' },
                    { id: 'p1q12', text: "I find great satisfaction in helping someone understand a difficult concept for the first time.", fieldId: 'education' }
                ]
            },
                        'Unconventional': {
                title: "Unconventional: Broad Interest Screening",
                questions: [
                    { id: 'p1q1', text: "I enjoy the strategy and competitive challenge of video games/esports.", fieldId: 'gaming_esports' },
                    { id: 'p1q2', text: "I like sharing my life, skills, or stories through platforms like YouTube or Instagram.", fieldId: 'content_creation' },
                    { id: 'p1q3', text: "I have a passion for cooking, creating recipes, or understanding food science.", fieldId: 'culinary_arts' },
                    { id: 'p1q4', text: "I enjoy analyzing team performance data or the business side of major sports leagues.", fieldId: 'sports_mgmt' },
                    { id: 'p1q5', text: "I am fascinated by audio engineering, composing, mixing, or recording music.", fieldId: 'music_production' },
                    { id: 'p1q6', text: "I want to start a business that prioritizes solving a social problem over making profit.", fieldId: 'social_entrepreneurship' },
                    { id: 'p1q7', text: "I enjoy planning complex trips, learning survival skills, or exploring natural environments.", fieldId: 'travel_tourism' },
                    { id: 'p1q8', text: "I love bringing characters or visual concepts to life through animation or special effects (VFX).", fieldId: 'animation_vfx' },
                    { id: 'p1q9', text: "I'm interested in the extraction and management of natural resources (oil, gas, minerals).", fieldId: 'petroleum_mining' },
                    { id: 'p1q10', text: "I'm skilled at managing a public image, dealing with media, or building relationships with influencers.", fieldId: 'public_relations' },
                    { id: 'p1q11', text: "I'm interested in designing sustainable cities, public spaces, and housing developments.", fieldId: 'urban_planning' },
                    { id: 'p1q12', text: "I enjoy using data and statistics to uncover important stories or governmental truths.", fieldId: 'data_journalism' },
                ]
            }
        },


        
        phase2: {
            'Science': {
                questions: [
                    { id: 'p2q1', text: "I prefer working with abstract mathematical models over tangible, hands-on experiments." },
                    { id: 'p2q2', text: "My ideal work involves direct patient interaction and care rather than research in a lab." },
                    { id: 'p2q3', text: "I am more interested in the large-scale systems of our planet than the microscopic systems of life." },
                    { id: 'p2q4', text: "I would rather build a complex software algorithm than design a new chemical process." },
                    { id: 'p2q5', text: "The challenge of exploring extreme environments (like space or the deep sea) excites me most." },
                    { id: 'p2q6', text: "I'm more fascinated by creating new medicines than by creating intelligent machines." },
                    { id: 'p2q7', text: "I find the logic of computer networks more interesting than the structure of biological networks." },
                    { id: 'p2q8', text: "My goal is to use technology to solve engineering problems, not to discover fundamental scientific laws." }
                ],
                weights: {
                    'p2q1': { 'math_stats': 2, 'phy_sci': 1, 'eng_tech': -1, 'chem_eng': -2, 'biotech': -2 },
                    'p2q2': { 'medicine': 2, 'pharmacy': 1, 'biotech': -1, 'phy_sci': -2 },
                    'p2q3': { 'earth_sci': 2, 'marine_sci': 1, 'biotech': -2, 'medicine': -1 },
                    'p2q4': { 'comp_sci': 2, 'data_sci': 1, 'chem_eng': -2 },
                    'p2q5': { 'space_aero': 2, 'marine_sci': 1, 'eng_tech': 0.5 },
                    'p2q6': { 'pharmacy': 2, 'biotech': 1, 'medicine': 1, 'data_sci': -2, 'comp_sci': -2 },
                    'p2q7': { 'comp_sci': 2, 'biotech': -2, 'data_sci': -1 },
                    'p2q8': { 'eng_tech': 2, 'space_aero': 1, 'phy_sci': -2, 'math_stats': -2 }
                }
            },
            'Commerce': {
                questions: [
                    { id: 'p2q1', text: "I'm more drawn to the creative process of building a brand than the analytical process of auditing a company." },
                    { id: 'p2q2', text: "I would rather manage a high-risk investment portfolio than manage a hotel's day-to-day operations." },
                    { id: 'p2q3', text: "Understanding international trade regulations is more interesting to me than managing a local startup." },
                    { id: 'p2q4', text: "I prefer roles that require strong interpersonal skills (like sales) over roles that are purely analytical (like accounting)." },
                    { id: 'p2q5', text: "My main motivation in business is to create something entirely new and disruptive." },
                    { id: 'p2q6', text: "I find more security in working with established financial rules and systems than in the unpredictable world of marketing trends." },
                    { id: 'p2q7', text: "I enjoy the logistical challenge of moving goods across the globe more than managing a company's internal finances." },
                    { id: 'p2q8', text: "I am more interested in the legal framework of a business than its management structure." }
                ],
                weights: {
                    'p2q1': { 'marketing': 2, 'fin_acc': -2, 'banking': -1 },
                    'p2q2': { 'investment': 2, 'banking': 1, 'hospitality': -2, 'biz_mgmt': -1 },
                    'p2q3': { 'intl_biz': 2, 'law_gov': 1, 'entrepreneur': -2 },
                    'p2q4': { 'sales_ecom': 2, 'marketing': 1, 'fin_acc': -2, 'investment': -1 },
                    'p2q5': { 'entrepreneur': 2, 'biz_mgmt': -1, 'banking': -2 },
                    'p2q6': { 'fin_acc': 2, 'law_gov': 1, 'banking': 1, 'marketing': -2 },
                    'p2q7': { 'supply_chain': 2, 'intl_biz': 1, 'fin_acc': -2 },
                    'p2q8': { 'law_gov': 2, 'biz_mgmt': -2 }
                }
            },
            'Arts': {
                questions: [
                    { id: 'p2q1', text: "I'm more interested in analyzing societal structures and systems than individual human minds." },
                    { id: 'p2q2', text: "I would rather create a visual piece of art (like a painting or design) than write a long-form essay." },
                    { id: 'p2q3', text: "My passion is in factual storytelling (journalism) rather than fictional storytelling (literature)." },
                    { id: 'p2q4', text: "I am more drawn to activism and creating social change than to teaching in a classroom." },
                    { id: 'p2q5', text: "I prefer working behind the scenes in a creative project (directing, editing) over being the performer on stage." },
                    { id: 'p2q6', text: "I'm more fascinated by the ancient world than by contemporary global politics." },
                    { id: 'p2q7', text: "I believe a well-reasoned philosophical argument can be more powerful than an emotional piece of music." },
                    { id: 'p2q8', text: "I'm more interested in the practical application of psychology to help people directly, rather than studying it theoretically." }
                ],
                weights: {
                    'p2q1': { 'sociology': 2, 'poli_sci': 1, 'psychology': -2, 'social_work': -1 },
                    'p2q2': { 'visual_arts': 2, 'literature': -2, 'history': -1 },
                    'p2q3': { 'media': 2, 'literature': -2, 'film_theatre': -1 },
                    'p2q4': { 'social_work': 2, 'poli_sci': 1, 'education': -2 },
                    'p2q5': { 'film_theatre': 1, 'media': 1, 'music_dance': -2 },
                    'p2q6': { 'history': 2, 'poli_sci': -2, 'sociology': -1 },
                    'p2q7': { 'philosophy': 2, 'music_dance': -2, 'literature': -1 },
                    'p2q8': { 'psychology': 2, 'social_work': 1, 'philosophy': -2 }
                }
            },
              'Unconventional': {
                questions: [
                    { id: 'p2q1', text: "I prefer working on live content (streaming/esports) rather than highly polished, edited content (films/vfx)." },
                    { id: 'p2q2', text: "The business and logistics side of travel excites me more than personal creative expression (music/VFX)." },
                    { id: 'p2q3', text: "I'm more drawn to managing large physical resource projects than managing a digital marketing campaign." },
                    { id: 'p2q4', text: "I am more interested in the physical discipline of sports than the technical challenges of digital creation." },
                    { id: 'p2q5', text: "I would rather design a city's layout than plan a marketing strategy for a tourism company." },
                    { id: 'p2q6', text: "My goal is to expose truth through data and journalism rather than advocate for a specific cause." },
                ],
                weights: {
                    'p2q1': { 'gaming_esports': 2, 'content_creation': 1, 'animation_vfx': -2, 'music_production': -1 },
                    'p2q2': { 'travel_tourism': 2, 'sports_mgmt': 1, 'music_production': -2, 'animation_vfx': -1 },
                    'p2q3': { 'petroleum_mining': 2, 'urban_planning': 1, 'social_entrepreneurship': -2 },
                    'p2q4': { 'sports_mgmt': 2, 'culinary_arts': 1, 'gaming_esports': -2 },
                    'p2q5': { 'urban_planning': 2, 'travel_tourism': 1, 'public_relations': -2 },
                    'p2q6': { 'data_journalism': 2, 'public_relations': 1, 'social_entrepreneurship': -2 },
                }
            }
        }
    }
};
const mindMapData = {
    // =================================================================================
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SCIENCE STREAM <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // =================================================================================
    'eng_tech': {
        title: 'Engineering & Technology',
        description: 'Applying scientific principles to design, build, and maintain structures, machines, and systems.',
        children: [
            { 
                title: 'Academics',
                description: 'The typical educational journey for an aspiring engineer in India.',
                children: [
                    { title: 'B.Tech / B.E. (4 Years)', 
                      description: 'The foundational undergraduate degree for professional engineering roles.',
                      children: [
                        { title: 'Core Subjects', description: 'These subjects form the theoretical backbone of all engineering disciplines.', children: [{title: 'Engineering Mathematics', description: 'The language of engineering, covering calculus, linear algebra, and differential equations.'}, {title: 'Physics', description: 'Fundamental principles of mechanics, electricity, and thermodynamics.'}, {title: 'Chemistry', description: 'Understanding materials, reactions, and chemical properties.'}] },
                        { title: 'Additional Subjects', description: 'Practical and theoretical subjects that round out an engineering education.', children: [{title: 'Data Structures', description: 'Essential for understanding how to organize and manipulate data efficiently.'}, {title: 'Workshop Technology', description: 'Hands-on training with manufacturing and fabrication processes.'}] },
                        { title: 'Career Options Post-B.Tech', description: 'Common entry-level roles for engineering graduates.', children: [{title: 'Core Engineer', description: 'Works in a specific discipline like Mechanical, Civil, or Electrical engineering.'}, {title: 'IT Roles', description: 'Many engineers pivot to software development, data analysis, or IT consulting.'}, {title: 'Public Sector Units (PSUs)', description: 'Sought-after government jobs in companies like NTPC, ONGC, or BHEL.'}] },
                      ]
                    },
                    { title: 'M.Tech / M.S. (2 Years)', 
                      description: 'A postgraduate degree for specialization, research, and senior technical roles.',
                      children: [
                        { title: 'Core Subjects', description: 'Advanced studies focusing on a specific engineering niche.', children: [{title: 'Advanced Specialization Subjects', description: 'Deep dive into specific topics like robotics, thermal engineering, or structural design.'}, {title: 'Research Methodologies', description: 'Learning the process of conducting formal scientific research.'}, {title: 'Thesis Project', description: 'A mandatory research project to demonstrate expertise.'}] },
                        { title: 'Career Options Post-M.Tech', description: 'Senior roles available after a Master\'s degree.', children: [{title: 'R&D Engineer', description: 'Works in research and development to create new technologies.'}, {title: 'Specialist Roles', description: 'Becomes an expert in a niche area like VLSI design or robotics.'}, {title: 'Academician', description: 'Pursues a Ph.D. to become a professor at a university.'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The combination of hard and soft skills that make a successful engineer.',
                children: [
                    { title: 'Technical Skills', description: 'Specific software and technical knowledge required in the field.', children: [{title: 'CAD Software (AutoCAD, SolidWorks)', description: 'For creating 2D and 3D designs and models.'}, {title: 'MATLAB', description: 'A powerful tool for numerical computation and simulation.'}, {title: 'Programming (Python/C++)', description: 'Increasingly important for automation, data analysis, and simulation.'}] },
                    { title: 'Soft Skills', description: 'Professional attributes essential for working effectively in a team.', children: [{title: 'Problem-Solving', description: 'The core of engineering: identifying and solving complex challenges.'}, {title: 'Critical Thinking', description: 'Analyzing information objectively to form a judgment.'}, {title: 'Project Management', description: 'Planning, executing, and closing projects within time and budget.'}] },
                ]
            },
            { title: 'Future Scopes', description: 'Emerging trends and technologies shaping the future of engineering.', children: [{title: 'Sustainable Engineering', description: 'Designing solutions that are environmentally friendly and sustainable.'}, {title: 'AI in Design', description: 'Using artificial intelligence to automate and optimize the design process.'}, {title: 'Robotics & Automation', description: 'Developing robots and automated systems for manufacturing and services.'}] },
            { title: 'Top Industries', description: 'The primary sectors that employ engineers.', children: [{title: 'Automotive', description: 'Designing and manufacturing vehicles.'}, {title: 'Construction', description: 'Building infrastructure like roads, bridges, and buildings.'}, {title: 'Energy', description: 'Working in power generation, from traditional to renewable sources.'}, {title: 'Manufacturing', description: 'Operating in factories and production facilities for various goods.'}] }
        ]
    },
    'comp_sci': {
        title: 'Computer Science & Software Development',
        description: 'The study of computation, information, and automation, and its application in software systems.',
        children: [
             { 
                title: 'Academics',
                description: 'The educational foundation for a career in software.',
                children: [
                    { title: 'B.Tech in CS (4 Years)', 
                      description: 'The standard undergraduate degree for core software engineering roles.',
                      children: [
                        { title: 'Core Subjects', description: 'The fundamental pillars of a computer science education.', children: [{title: 'Data Structures & Algorithms', description: 'The single most important topic for problem-solving and technical interviews.'}, {title: 'Operating Systems', description: 'Understanding how software interacts with computer hardware.'}, {title: 'Database Management', description: 'Learning how to store, retrieve, and manage data efficiently.'}] },
                        { title: 'Additional Subjects', description: 'Advanced topics that build upon core concepts.', children: [{title: 'Compiler Design', description: 'Understanding how programming languages are translated into machine code.'}, {title: 'Software Engineering', description: 'Principles for building robust and maintainable software at scale.'}] },
                        { title: 'Career Options Post-B.Tech', description: 'Entry-level jobs for computer science graduates.', children: [{title: 'Software Development Engineer (SDE)', description: 'Writes, tests, and maintains code for applications and systems.'}, {title: 'DevOps Engineer', description: 'Manages the infrastructure and tools for software deployment.'}, {title: 'Systems Analyst', description: 'Analyzes and improves IT systems for business efficiency.'}] },
                      ]
                    },
                    { title: 'MCA / M.Tech in CS (2 Years)', 
                      description: 'Postgraduate degrees for specialization and advanced roles.',
                      children: [
                        { title: 'Core Subjects', description: 'Advanced topics for specialized careers.', children: [{title: 'Advanced Algorithms', description: 'Studying complex algorithms for optimization and efficiency.'}, {title: 'Machine Learning', description: 'An introduction to AI and building predictive models.'}, {title: 'Information Security', description: 'Learning the principles of cybersecurity and data protection.'}] },
                        { title: 'Career Options Post-M.Tech', description: 'Senior roles available after a Master\'s degree.', children: [{title: 'AI/ML Engineer', description: 'Specializes in building and deploying machine learning models.'}, {title: 'Cloud Architect', description: 'Designs and manages an organization\'s cloud computing strategy.'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies required to excel as a software professional.',
                children: [
                    { title: 'Technical Skills', description: 'Specific programming languages and tools used daily.', children: [{title: 'Programming Languages (Python, Java, JavaScript)', description: 'The building blocks for creating software.'}, {title: 'Git & GitHub', description: 'Essential for version control and collaboration in team environments.'}, {title: 'Cloud Platforms (AWS, Azure)', description: 'Knowledge of deploying and managing applications on the cloud.'}] },
                    { title: 'Soft Skills', description: 'Professional attributes vital for teamwork and career growth.', children: [{title: 'Logical Reasoning', description: 'The ability to think methodically and solve complex problems.'}, {title: 'Debugging', description: 'The patient process of finding and fixing errors in code.'}, {title: 'Collaboration (Agile/Scrum)', description: 'Working effectively in a team using modern development methodologies.'}] },
                ]
            },
            { title: 'Future Scopes', description: 'Emerging fields that are shaping the future of computer science.', children: [{title: 'Quantum Computing', description: 'A new paradigm of computing with the potential to solve currently impossible problems.'}, {title: 'Generative AI', description: 'Developing models like ChatGPT that can create new content.'}, {title: 'Blockchain Development', description: 'Building decentralized applications and systems.'}] },
            { title: 'Key Certifications', description: 'Valuable certifications to enhance a resume.', children: [{title: 'AWS Certified Developer', description: 'Validates skills in developing and maintaining applications on Amazon Web Services.'}, {title: 'Google Professional Cloud Architect', description: 'Certifies expertise in designing and managing robust solutions on Google Cloud.'}, {title: 'Certified Ethical Hacker (CEH)', description: 'A key certification for cybersecurity professionals.'}] }
        ]
    },
    'data_sci': {
        title: 'Data Science, AI & Analytics',
        description: 'Extracting knowledge and insights from data to make predictions and drive business decisions.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational foundation for a career in data.',
                children: [
                    { title: 'B.Tech in AI & DS (4 Years)', 
                      description: 'A specialized undergraduate degree focused on data-centric technologies.',
                      children: [
                        { title: 'Core Subjects', description: 'The mathematical and computational core of data science.', children: [{title: 'Statistics & Probability', description: 'The mathematical foundation for understanding data and uncertainty.'}, {title: 'Linear Algebra', description: 'Crucial for understanding how machine learning algorithms work.'}, {title: 'Machine Learning Algorithms', description: 'Learning various models like regression, classification, and clustering.'}] },
                        { title: 'Additional Subjects', description: 'Advanced topics in artificial intelligence.', children: [{title: 'Natural Language Processing (NLP)', description: 'Teaching computers to understand and process human language.'}, {title: 'Deep Learning', description: 'Using neural networks to solve complex problems like image recognition.'}] },
                        { title: 'Career Options Post-B.Tech', description: 'Entry-level roles in the data ecosystem.', children: [{title: 'Data Analyst', description: 'Interprets data and creates reports to help businesses make decisions.'}, {title: 'Junior Data Scientist', description: 'Assists senior scientists in building and testing predictive models.'}, {title: 'ML Engineer', description: 'Focuses on deploying machine learning models into production systems.'}] },
                      ]
                    },
                    { title: 'M.S. / M.Tech in Data Science (2 Years)', 
                      description: 'Postgraduate degrees for deep specialization and research.',
                      children: [
                        { title: 'Core Subjects', description: 'Advanced topics at the forefront of AI research.', children: [{title: 'Advanced Machine Learning', description: 'Studying complex models and techniques for higher accuracy.'}, {title: 'Reinforcement Learning', description: 'Training AI agents to make decisions through trial and error.'}, {title: 'AI Ethics', description: 'Understanding the societal impact and biases of AI models.'}] },
                        { title: 'Career Options Post-M.S.', description: 'Senior roles available after a Master\'s degree.', children: [{title: 'Senior Data Scientist', description: 'Leads data science projects and teams.'}, {title: 'AI Research Scientist', description: 'Works in R&D labs to create new AI algorithms and models.'}, {title: 'MLOps Engineer', description: 'Manages the entire lifecycle of machine learning models in production.'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies required to succeed in data-related roles.',
                children: [
                    { title: 'Technical Skills', description: 'The programming languages and tools essential for a data scientist.', children: [{title: 'Python (Pandas, Scikit-learn)', description: 'The dominant language for data science with powerful libraries.'}, {title: 'SQL', description: 'The standard language for querying and managing databases.'}, {title: 'Big Data (Spark)', description: 'Tools for processing massive datasets that don\'t fit on a single machine.'}, {title: 'Tableau', description: 'A popular tool for creating interactive data visualizations and dashboards.'}] },
                    { title: 'Soft Skills', description: 'The non-technical attributes that differentiate a great data scientist.', children: [{title: 'Analytical Mindset', description: 'A structured approach to thinking about and solving problems with data.'}, {title: 'Business Acumen', description: 'Understanding the business context to ensure data projects deliver real value.'}, {title: 'Storytelling with Data', description: 'The ability to communicate complex findings in a clear and compelling way.'}] },
                ]
            },
            { title: 'Future Scopes', description: 'Emerging trends that are defining the next generation of AI.', children: [{title: 'Generative AI (LLMs)', description: 'The technology behind models like ChatGPT, with vast applications.'}, {title: 'Explainable AI (XAI)', description: 'Methods for understanding and trusting the decisions made by complex AI models.'}, {title: 'Automated Machine Learning (AutoML)', description: 'Tools that automate the process of building machine learning models.'}] },
            { title: 'Top Industries', description: 'Sectors that heavily rely on data science.', children: [{title: 'E-commerce', description: 'For recommendation engines, demand forecasting, and customer analytics.'}, {title: 'FinTech', description: 'For credit scoring, fraud detection, and algorithmic trading.'}, {title: 'Healthcare', description: 'For disease prediction, drug discovery, and personalized medicine.'}] }
        ]
    },
    'math_stats': {
        title: 'Mathematics & Statistics',
        description: 'The abstract science of number, quantity, and space, and its application in data analysis.',
        children: [
            { 
                title: 'Academics',
                description: 'The rigorous academic path for mathematicians and statisticians.',
                children: [
                    { title: 'B.Sc. / B.Stat (3 Years)', 
                      description: 'An undergraduate degree focused on theoretical foundations.',
                      children: [
                        { title: 'Core Subjects', description: 'Foundational topics in pure and applied mathematics.', children: [{title: 'Real Analysis', description: 'The rigorous study of the real numbers and functions.'}, {title: 'Abstract Algebra', description: 'The study of algebraic structures like groups, rings, and fields.'}, {title: 'Probability Theory', description: 'The mathematical foundation of statistics and randomness.'}] },
                        { title: 'Additional Subjects', description: 'Specialized areas of study.', children: [{title: 'Operations Research', description: 'Using math to optimize complex decisions.'}, {title: 'Statistical Inference', description: 'Making conclusions about populations from sample data.'}] },
                        { title: 'Career Options Post-B.Sc.', description: 'Entry-level quantitative roles.', children: [{title: 'Data Analyst', description: 'Uses statistical methods to analyze data and generate insights.'}, {title: 'Actuarial Analyst', description: 'Assesses financial risks in the insurance and finance fields.'}, {title: 'Market Researcher', description: 'Analyzes consumer data and market trends.'}] },
                      ]
                    },
                    { title: 'M.Sc. / M.Stat (2 Years)', 
                      description: 'A postgraduate degree for deep specialization.',
                      children: [
                        { title: 'Core Subjects', description: 'Advanced topics for research and high-level roles.', children: [{title: 'Advanced Probability Theory', description: 'A deeper, measure-theoretic approach to probability.'}, {title: 'Measure Theory', description: 'A core part of modern mathematical analysis.'}, {title: 'Advanced Statistical Modeling', description: 'Studying complex models like generalized linear models.'}] },
                        { title: 'Career Options Post-M.Sc.', description: 'Senior roles requiring deep quantitative skills.', children: [{title: 'Data Scientist', description: 'Builds complex predictive models.'}, {title: 'Quantitative Analyst (Quant)', description: 'Develops mathematical models for financial markets.'}, {title: 'Professor', description: 'Teaches and conducts research in academia.'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a quantitative career.',
                children: [
                    { title: 'Technical Skills', description: 'Software and languages for mathematical and statistical work.', children: [{title: 'R', description: 'A language built for statistical computing and graphics.'}, {title: 'SAS', description: 'A software suite used for advanced analytics and business intelligence.'}, {title: 'Python', description: 'Versatile language with powerful libraries for data analysis.'}, {title: 'LaTeX', description: 'The standard for typesetting academic papers in mathematics.'}] },
                    { title: 'Soft Skills', description: 'The mental attributes of a mathematician.', children: [{title: 'Abstract Reasoning', description: 'The ability to understand and work with concepts and ideas.'}, {title: 'Logical Deduction', description: 'Forming conclusions based on premises through valid reasoning.'}, {title: 'Attention to Detail', description: 'Crucial for accuracy in proofs and calculations.'}] },
                ]
            },
            { title: 'Future Scopes', description: 'Where advanced mathematics is heading.', children: [{title: 'AI/ML Research', description: 'Developing the mathematical foundations for new AI algorithms.'}, {title: 'Computational Mathematics', description: 'Using computing to solve complex mathematical problems.'}, {title: 'Algorithmic Financial Modeling', description: 'Creating sophisticated trading and risk models.'}] },
            { title: 'Top Industries', description: 'Sectors that hire mathematics and statistics experts.', children: [{title: 'Finance & Banking', description: 'For quantitative analysis and risk management.'}, {title: 'Insurance (Actuarial)', description: 'To calculate risk and price insurance premiums.'}, {title: 'IT (Data Science)', description: 'Providing the mathematical backbone for data science teams.'}] },
        ]
    },
    'phy_sci': {
        title: 'Physical Sciences (Physics, Chemistry)',
        description: 'The study of non-living systems, matter, and energy, forming the basis of natural science.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for research and application in physical sciences.',
                children: [
                    { title: 'B.Sc. in Physics/Chemistry (3 Years)', 
                      description: 'A foundational degree in the core principles of physics and chemistry.',
                      children: [
                        { title: 'Core Subjects', description: 'Fundamental topics in physics and chemistry.', children: [{title: 'Quantum Mechanics', description: 'The physics of the very small (atoms, particles).'}, {title: 'Electrodynamics', description: 'The study of electric and magnetic fields.'}, {title: 'Organic Chemistry', description: 'The study of carbon-based compounds.'}, {title: 'Physical Chemistry', description: 'Applying physics to the study of chemistry.'}] },
                        { title: 'Additional Subjects', description: 'Specialized areas within the physical sciences.', children: [{title: 'Solid State Physics', description: 'The study of rigid matter, or solids.'}, {title: 'Nuclear Physics', description: 'The study of atomic nuclei.'}, {title: 'Analytical Chemistry', description: 'The science of obtaining and processing information about matter.'}] },
                        { title: 'Career Options Post-B.Sc.', description: 'Entry-level roles in scientific fields.', children: [{title: 'Lab Technician', description: 'Works in a lab, running experiments and maintaining equipment.'}, {title: 'Research Assistant', description: 'Assists senior scientists with their research projects.'}, {title: 'Quality Control Officer', description: 'Tests products to ensure they meet required standards.'}] },
                      ]
                    },
                    { title: 'M.Sc. in Physics/Chemistry (2 Years)', 
                      description: 'A postgraduate degree for specialization and research careers.',
                      children: [
                        { title: 'Core Subjects', description: 'Advanced topics for in-depth research.', children: [{title: 'Advanced Quantum Mechanics'}, {title: 'Statistical Mechanics'}, {title: 'Advanced Organic Synthesis'}] },
                        { title: 'Career Options Post-M.Sc.', description: 'Senior roles for science postgraduates.', children: [{title: 'Research Scientist (CSIR/DRDO)', description: 'Conducts research in government labs.'}, {title: 'Scientific Officer', description: 'Holds technical positions in government departments.'}, {title: 'Professor', description: 'Teaches and conducts research at universities.'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a career in science.',
                children: [
                    { title: 'Technical Skills', description: 'Hands-on and computational skills for scientific work.', children: [{title: 'Laboratory Techniques', description: 'Proficiency in handling lab equipment and conducting experiments.'}, {title: 'Data Analysis Software (Origin, MATLAB)', description: 'Tools for plotting and analyzing experimental data.'}, {title: 'Computational Modeling', description: 'Simulating physical or chemical systems on a computer.'}] },
                    { title: 'Soft Skills', description: 'The mindset and attributes of a good scientist.', children: [{title: 'Scientific Inquiry', description: 'A systematic approach to asking questions and finding answers.'}, {title: 'Patience', description: 'Research often involves long periods of experimentation with slow progress.'}, {title: 'Precision', description: 'Accuracy in measurements and procedures is critical.'}] },
                ]
            },
            { title: 'Future Scopes', description: 'Emerging fields at the intersection of physics and chemistry.', children: [{title: 'Quantum Computing'}, {title: 'Renewable Energy (Solar Cells)'}, {title: 'Nanotechnology'}, {title: 'Sustainable Chemistry'}] },
            { title: 'Top Industries', description: 'Sectors that employ physicists and chemists.', children: [{title: 'Research Institutions'}, {title: 'Pharmaceuticals'}, {title: 'Chemical Manufacturing'}, {title: 'Energy Sector'}] },
        ]
    },
    'chem_eng': {
        title: 'Chemical Engineering',
        description: 'Applying chemistry, physics, and math to convert raw materials into valuable products on an industrial scale.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for designing and operating chemical plants.',
                children: [
                    { title: 'B.Tech in Chemical Eng. (4 Years)', 
                      description: 'An undergraduate degree focused on large-scale chemical processes.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Fluid Mechanics'}, {title: 'Heat Transfer'}, {title: 'Mass Transfer'}, {title: 'Chemical Reaction Engineering'}] },
                        { title: 'Additional Subjects', children: [{title: 'Thermodynamics'}, {title: 'Plant Design'}, {title: 'Process Control'}] },
                        { title: 'Career Options Post-B.Tech', children: [{title: 'Process Engineer'}, {title: 'Production Engineer'}, {title: 'Safety Officer'}, {title: 'R&D Associate'}] },
                      ]
                    },
                    { title: 'M.Tech in Chemical Eng. (2 Years)', 
                      description: 'A postgraduate degree for specialization.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Process Control'}, {title: 'Catalysis'}, {title: 'Polymer Engineering'}] },
                        { title: 'Career Options Post-M.Tech', children: [{title: 'Senior Process Engineer'}, {title: 'R&D Scientist'}, {title: 'Consultant'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a chemical engineer.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Process Simulation Software (ASPEN)'}, {title: 'CAD'}, {title: 'Plant Design'}, {title: 'Thermodynamics'}] },
                    { title: 'Soft Skills', children: [{title: 'Process Optimization'}, {title: 'Safety Management'}, {title: 'Analytical Skills'}, {title: 'Problem-Solving'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Green Chemistry'}, {title: 'Sustainable Processes'}, {title: 'Carbon Capture'}, {title: 'Biofuels'}] },
            { title: 'Top Industries', children: [{title: 'Oil & Gas'}, {title: 'Petrochemicals'}, {title: 'Pharmaceuticals'}, {title: 'FMCG'}, {title: 'Fertilizers'}] },
        ]
    },
    'biotech': {
        title: 'Biotechnology & Biomedical Sciences',
        description: 'Using living organisms and biological systems to create products and technologies that improve human life.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for working with life sciences at a molecular level.',
                children: [
                    { title: 'B.Tech/B.Sc. in Biotechnology (4/3 Years)', 
                      description: 'A degree combining biology and engineering principles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Molecular Biology'}, {title: 'Genetic Engineering'}, {title: 'Immunology'}, {title: 'Bioinformatics'}] },
                        { title: 'Additional Subjects', children: [{title: 'Cell Biology'}, {title: 'Microbiology'}, {title: 'Bioprocess Engineering'}] },
                        { title: 'Career Options Post-Degree', children: [{title: 'Research Associate'}, {title: 'Lab Technician'}, {title: 'Quality Control Officer'}] },
                      ]
                    },
                    { title: 'M.Tech/M.Sc. in Biotechnology (2 Years)', 
                      description: 'A postgraduate degree essential for R&D roles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Genetic Engineering'}, {title: 'Genomics'}, {title: 'Proteomics'}, {title: 'Drug Discovery'}] },
                        { title: 'Career Options Post-M.Sc.', children: [{title: 'Research Scientist'}, {title: 'Bioinformatician'}, {title: 'Process Development Scientist'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a biotechnologist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'PCR'}, {title: 'DNA Sequencing'}, {title: 'Cell Culture'}, {title: 'Chromatography'}, {title: 'Bioinformatics tools (BLAST)'}] },
                    { title: 'Soft Skills', children: [{title: 'Research Acumen'}, {title: 'Analytical Skills'}, {title: 'Ethical Awareness'}, {title: 'Patience'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'CRISPR Gene Editing'}, {title: 'Personalized Medicine'}, {title: 'Synthetic Biology'}, {title: 'mRNA Vaccines'}] },
            { title: 'Top Industries', children: [{title: 'Pharmaceuticals'}, {title: 'Biopharma'}, {title: 'Agriculture'}, {title: 'Healthcare Diagnostics'}] },
        ]
    },
    'medicine': {
        title: 'Medicine & Healthcare',
        description: 'The science and practice of diagnosing, treating, and preventing disease to maintain human health.',
        children: [
            { 
                title: 'Academics',
                description: 'The long and dedicated academic journey to become a doctor.',
                children: [
                    { title: 'MBBS (5.5 Years)', 
                      description: 'The foundational undergraduate medical degree in India.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Anatomy'}, {title: 'Physiology'}, {title: 'Biochemistry'}, {title: 'Pharmacology'}, {title: 'Pathology'}] },
                        { title: 'Additional Subjects', children: [{title: 'Forensic Medicine'}, {title: 'Pediatrics'}, {title: 'Surgery'}, {title: 'Obstetrics & Gynecology'}] },
                        { title: 'Career Options Post-MBBS', children: [{title: 'Junior Resident Doctor'}, {title: 'Medical Officer'}, {title: 'General Practitioner'}, {title: 'Prep for PG Entrance'}] },
                      ]
                    },
                    { title: 'MD / MS (3 Years)', 
                      description: 'A postgraduate degree for specialization in a specific medical field.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Deep specialization in a chosen field (e.g., Cardiology, Neurology, Orthopedics)'}] },
                        { title: 'Career Options Post-MD/MS', children: [{title: 'Specialist Consultant'}, {title: 'Senior Resident'}, {title: 'Professor in Medical College'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The unique blend of scientific knowledge and human touch required in medicine.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Clinical Diagnosis'}, {title: 'Surgical Skills'}, {title: 'Interpreting Medical Reports'}, {title: 'Medical Procedures'}] },
                    { title: 'Soft Skills', children: [{title: 'Empathy'}, {title: 'Communication'}, {title: 'Resilience'}, {title: 'Ethical Practice'}, {title: 'Lifelong Learning'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Telemedicine'}, {title: 'AI in Diagnostics'}, {title: 'Robotic Surgery'}, {title: 'Personalized Medicine (Genomics)'}] },
            { title: 'Top Industries', children: [{title: 'Hospitals (Public & Private)'}, {title: 'Private Clinics'}, {title: 'Government Health Services'}, {title: 'Medical Research'}] },
        ]
    },
    'pharmacy': {
        title: 'Pharmacy & Drug Development',
        description: 'The science of preparing, dispensing, and reviewing drugs and providing additional clinical services.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for becoming a medication expert.',
                children: [
                    { title: 'B.Pharm (4 Years)', 
                      description: 'A comprehensive undergraduate degree for the pharmaceutical industry.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Pharmacology'}, {title: 'Pharmaceutics'}, {title: 'Medicinal Chemistry'}, {title: 'Pharmacognosy'}] },
                        { title: 'Additional Subjects', children: [{title: 'Biochemistry'}, {title: 'Pharmaceutical Analysis'}, {title: 'Regulatory Affairs'}] },
                        { title: 'Career Options Post-B.Pharm', children: [{title: 'Community Pharmacist'}, {title: 'Medical Representative'}, {title: 'Production Officer'}, {title: 'QA/QC Officer'}] },
                      ]
                    },
                    { title: 'M.Pharm (2 Years)', 
                      description: 'A postgraduate degree for specialization in pharmaceutical sciences.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Pharmacology'}, {title: 'Drug Delivery Systems'}, {title: 'Pharmacovigilance'}] },
                        { title: 'Career Options Post-M.Pharm', children: [{title: 'Research Scientist'}, {title: 'Regulatory Affairs Manager'}, {title: 'Hospital Pharmacist'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies required for a pharmacy professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Drug Dispensing'}, {title: 'Formulation'}, {title: 'Regulatory Knowledge'}, {title: 'High-Performance Liquid Chromatography (HPLC)'}] },
                    { title: 'Soft Skills', children: [{title: 'Attention to Detail'}, {title: 'Patient Counseling'}, {title: 'Ethical Practice'}, {title: 'Communication'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Biopharmaceuticals'}, {title: 'Personalized Medicine'}, {title: 'Clinical Pharmacy'}, {title: 'AI in Drug Discovery'}] },
            { title: 'Top Industries', children: [{title: 'Pharmaceutical Industry (R&D, Manufacturing)'}, {title: 'Hospitals'}, {title: 'Retail Pharmacy Chains'}, {title: 'Government (Drug Inspector)'}] },
        ]
    },
    'earth_sci': {
        title: 'Earth & Environmental Sciences',
        description: 'The study of the solid Earth, its waters, and the air that envelops it, including human impact.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for studying our planet\'s systems.',
                children: [
                    { title: 'B.Sc. in Geology/Earth Science (3 Years)', 
                      description: 'A foundational degree in the study of the Earth.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Physical Geology'}, {title: 'Mineralogy'}, {title: 'Petrology'}, {title: 'Structural Geology'}, {title: 'Paleontology'}] },
                        { title: 'Additional Subjects', children: [{title: 'Geophysics'}, {title: 'Hydrogeology'}, {title: 'Environmental Science'}] },
                        { title: 'Career Options Post-B.Sc.', children: [{title: 'Junior Geologist'}, {title: 'Lab Assistant'}, {title: 'Environmental Technician'}] },
                      ]
                    },
                    { title: 'M.Sc./M.Tech in Applied Geology (2 Years)', 
                      description: 'A postgraduate degree for specialization in resource exploration and management.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Remote Sensing & GIS'}, {title: 'Petroleum Geology'}, {title: 'Mineral Exploration'}] },
                        { title: 'Career Options Post-M.Sc.', children: [{title: 'Geologist in Mining/Oil companies'}, {title: 'Scientist (GSI, ISRO)'}, {title: 'Hydrologist'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for an earth scientist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'GIS & Remote Sensing (ArcGIS, QGIS)'}, {title: 'Geological Mapping'}, {title: 'Field Work'}, {title: 'Data Analysis'}] },
                    { title: 'Soft Skills', children: [{title: 'Observational Skills'}, {title: 'Data Interpretation'}, {title: 'Systems Thinking'}, {title: 'Physical Stamina'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Climate Change Modeling'}, {title: 'Sustainable Resource Management'}, {title: 'Carbon Sequestration'}, {title: 'Disaster Management'}] },
            { title: 'Top Industries', children: [{title: 'Oil & Gas'}, {title: 'Mining'}, {title: 'Environmental Consultancy'}, {title: 'Government (GSI, CGWB)'}] },
        ]
    },
    'marine_sci': {
        title: 'Marine & Ocean Sciences',
        description: 'The scientific study of the ocean, its ecosystems, life forms, and physical processes.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic path for exploring the world\'s oceans.',
                children: [
                    { title: 'B.Sc. in Marine Biology/Oceanography (3 Years)', 
                      description: 'An undergraduate degree focusing on coastal and ocean systems.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Marine Biology'}, {title: 'Physical Oceanography'}, {title: 'Chemical Oceanography'}, {title: 'Marine Geology'}] },
                        { title: 'Additional Subjects', children: [{title: 'Aquaculture'}, {title: 'Marine Microbiology'}, {title: 'Coastal Zone Management'}] },
                        { title: 'Career Options Post-B.Sc.', children: [{title: 'Research Assistant'}, {title: 'Aquarium Biologist'}, {title: 'Marine Tour Guide'}] },
                      ]
                    },
                    { title: 'M.Sc. in Marine Science (2 Years)', 
                      description: 'A postgraduate degree for specialized research.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Oceanography'}, {title: 'Marine Ecology'}, {title: 'Fisheries Science'}] },
                        { title: 'Career Options Post-M.Sc.', children: [{title: 'Marine Biologist'}, {title: 'Oceanographer'}, {title: 'Conservation Scientist'}, {title: 'Aquaculture Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a marine scientist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Scuba Diving Certification'}, {title: 'Boat Handling'}, {title: 'Sample Collection'}, {title: 'Data Analysis'}, {title: 'GIS'}] },
                    { title: 'Soft Skills', children: [{title: 'Field Research'}, {title: 'Patience'}, {title: 'Observational Skills'}, {title: 'Teamwork in remote locations'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Deep-Sea Exploration'}, {title: 'Impact of Climate Change on Oceans'}, {title: 'Marine Biotechnology'}, {title: 'Sustainable Fisheries'}] },
            { title: 'Top Industries', children: [{title: 'Research (NIO)'}, {title: 'Conservation (WWF)'}, {title: 'Fisheries'}, {title: 'Aquaculture'}] },
        ]
    },
    'space_aero': {
        title: 'Space, Aerospace & Robotics',
        description: 'Designing, building, and operating vehicles and automated systems for atmospheric and space travel.',
        children: [
            { 
                title: 'Academics',
                description: 'The academic journey for an aerospace professional.',
                children: [
                    { title: 'B.Tech in Aerospace/Aeronautical Eng. (4 Years)', 
                      description: 'A specialized engineering degree for aircraft and spacecraft.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Aerodynamics'}, {title: 'Flight Mechanics'}, {title: 'Propulsion'}, {title: 'Spacecraft Systems'}, {title: 'Control Systems'}] },
                        { title: 'Additional Subjects', children: [{title: 'Thermodynamics'}, {title: 'Fluid Mechanics'}, {title: 'Material Science'}] },
                        { title: 'Career Options Post-B.Tech', children: [{title: 'Aerospace Engineer'}, {title: 'Avionics Engineer'}, {title: 'Robotics Engineer'}] },
                      ]
                    },
                    { title: 'M.Tech/M.S. in Aerospace (2 Years)', 
                      description: 'A postgraduate degree for advanced R&D roles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Propulsion'}, {title: 'Computational Fluid Dynamics (CFD)'}, {title: 'Satellite Technology'}] },
                        { title: 'Career Options Post-M.Tech', children: [{title: 'Scientist (ISRO/DRDO)'}, {title: 'Senior Design Engineer'}, {title: 'Research Specialist'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for working on cutting-edge technology.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'CFD'}, {title: 'CAD (CATIA)'}, {title: 'Simulation Software (MATLAB/Simulink)'}, {title: 'Control Systems'}, {title: 'Robotics (ROS)'}] },
                    { title: 'Soft Skills', children: [{title: 'Systems Thinking'}, {title: 'Precision'}, {title: 'Innovation'}, {title: 'Collaboration in large teams'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Private Space industry (SpaceTech)'}, {title: 'Unmanned Aerial Vehicles (UAVs/Drones)'}, {title: 'AI in Autonomous Flight'}, {title: 'Interplanetary Missions'}] },
            { title: 'Top Industries', children: [{title: 'Space Agencies (ISRO, NASA)'}, {title: 'Defense Organizations (DRDO, HAL)'}, {title: 'Private Aerospace (SpaceX, Boeing)'}] },
        ]
    },
    
    // =================================================================================
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>> COMMERCE STREAM <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // =================================================================================

    'biz_mgmt': {
        title: 'Business & Management',
        description: 'The art of planning, organizing, and leading an organization\'s resources to achieve its goals.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path to becoming a business leader.',
                children: [
                    { title: 'BBA / BMS (3 Years)', 
                      description: 'A foundational undergraduate degree in business principles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Principles of Management'}, {title: 'Business Economics'}, {title: 'Marketing Management'}, {title: 'Financial Accounting'}] },
                        { title: 'Additional Subjects', children: [{title: 'Business Law'}, {title: 'Organizational Behavior'}, {title: 'Entrepreneurship'}] },
                        { title: 'Career Options Post-BBA', children: [{title: 'Management Trainee'}, {title: 'Sales Executive'}, {title: 'Business Development'}, {title: 'Operations Executive'}] },
                      ]
                    },
                    { title: 'MBA / PGDM (2 Years)', 
                      description: 'A postgraduate degree widely considered essential for leadership roles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Strategic Management'}, {title: 'Corporate Finance'}, {title: 'Advanced Marketing'}, {title: 'Operations'}] },
                        { title: 'Career Options Post-MBA', children: [{title: 'Management Consultant'}, {title: 'Brand Manager'}, {title: 'HR Manager'}, {title: 'Financial Analyst'}, {title: 'Product Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a successful manager.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'MS Office Suite (Excel, PowerPoint)'}, {title: 'Project Management Tools (Asana)'}, {title: 'Basic Financial Modeling'}] },
                    { title: 'Soft Skills', children: [{title: 'Leadership'}, {title: 'Strategic Thinking'}, {title: 'Communication'}, {title: 'Decision-Making'}, {title: 'Negotiation'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Digital Transformation Strategy'}, {title: 'ESG Consulting'}, {title: 'Data-Driven Management'}] },
            { title: 'Top Industries', children: [{title: 'Consulting'}, {title: 'FMCG'}, {title: 'IT'}, {title: 'Banking & Financial Services (BFSI)'}, {title: 'Manufacturing'}] }
        ]
    },
    'fin_acc': {
        title: 'Finance, Accounting & Auditing',
        description: 'The process of recording, summarizing, and reporting financial transactions for businesses.',
        children: [
            { 
                title: 'Academics',
                description: 'The rigorous academic and professional path for finance experts.',
                children: [
                    { title: 'B.Com (3 Years) + CA', 
                      description: 'The most prestigious professional qualification for accounting in India.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Financial Accounting'}, {title: 'Cost Accounting'}, {title: 'Corporate Law'}, {title: 'Taxation (Direct & Indirect)'}] },
                        { title: 'Additional Subjects', children: [{title: 'Auditing and Assurance'}, {title: 'Financial Management'}, {title: 'Information Systems Control'}] },
                        { title: 'Career Options Post-CA', children: [{title: 'Statutory Auditor'}, {title: 'Tax Consultant'}, {title: 'Internal Auditor'}, {title: 'Finance Manager'}] },
                      ]
                    },
                    { title: 'MBA in Finance (2 Years)', 
                      description: 'A postgraduate degree focused on corporate finance and investment.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Corporate Finance'}, {title: 'Mergers & Acquisitions'}, {title: 'Investment Management'}, {title: 'Financial Derivatives'}] },
                        { title: 'Career Options Post-MBA', children: [{title: 'Investment Banker'}, {title: 'Equity Research Analyst'}, {title: 'Corporate Finance Professional'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies required for handling financial data.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Tally'}, {title: 'SAP'}, {title: 'Advanced Excel'}, {title: 'Financial Modeling'}, {title: 'Knowledge of Ind AS'}] },
                    { title: 'Soft Skills', children: [{title: 'Attention to Detail'}, {title: 'Analytical Skills'}, {title: 'Ethical Integrity'}, {title: 'Numerical Ability'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Automation in Auditing'}, {title: 'Data Analytics in Financial Reporting'}, {title: 'Evolving Tax Regulations (GST)'}] },
            { title: 'Top Industries', children: [{title: 'Professional Services (Big 4 Audit Firms)'}, {title: 'Banking & Financial Services'}, {title: 'IT'}, {title: 'Manufacturing'}] },
        ]
    },
    'banking': {
        title: 'Banking, Insurance & Financial Services',
        description: 'The sector that manages money, credit, and investments for individuals and corporations.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in the BFSI sector.',
                children: [
                    { title: 'B.Com / BBA (3 Years)', 
                      description: 'A foundational undergraduate degree.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Financial Accounting'}, {title: 'Business Economics'}, {title: 'Principles of Insurance'}, {title: 'Banking Law'}] },
                        { title: 'Additional Subjects', children: [{title: 'Customer Relationship Management'}, {title: 'Financial Markets'}] },
                        { title: 'Career Options Post-Graduation', children: [{title: 'Bank PO (IBPS)'}, {title: 'Insurance Agent'}, {title: 'Credit Officer Trainee'}] },
                      ]
                    },
                    { title: 'MBA in Finance/Banking (2 Years)', 
                      description: 'A postgraduate degree for management roles in banking.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Risk Management'}, {title: 'Corporate Banking'}, {title: 'Treasury Management'}] },
                        { title: 'Career Options Post-MBA', children: [{title: 'Relationship Manager (Corporate)'}, {title: 'Credit Manager'}, {title: 'Branch Head'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a banking or insurance professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Financial Software (Finacle)'}, {title: 'MS Excel'}, {title: 'Credit Analysis'}, {title: 'Knowledge of RBI regulations'}] },
                    { title: 'Soft Skills', children: [{title: 'Customer Service'}, {title: 'Sales Acumen'}, {title: 'Communication'}, {title: 'Negotiation'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Digital Banking (Neobanks)'}, {title: 'AI in credit scoring and fraud detection'}, {title: 'InsurTech'}] },
            { title: 'Key Certifications', children: [{title: 'JAIIB/CAIIB for bankers'}, {title: 'NISM certifications for capital markets'}, {title: 'CFP for financial planning'}] }
        ]
    },
    'investment': {
        title: 'Investment, Capital Markets & Risk Management',
        description: 'Analyzing and trading securities, managing portfolios, and quantifying financial risks.',
        children: [
            { 
                title: 'Academics',
                description: 'The high-stakes academic path for finance professionals.',
                children: [
                    { title: 'B.Com / BBA Finance + Certifications', 
                      description: 'A strong foundation complemented by professional certifications.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Security Analysis'}, {title: 'Portfolio Management'}, {title: 'Financial Derivatives'}, {title: 'Corporate Finance'}] },
                        { title: 'Career Options', children: [{title: 'Equity Research Associate'}, {title: 'Financial Analyst'}, {title: 'Junior Trader'}, {title: 'Risk Analyst'}] },
                      ]
                    },
                    { title: 'MBA Finance / CFA Charter', 
                      description: 'The gold standards for senior roles in investment management.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Valuation'}, {title: 'Mergers & Acquisitions'}, {title: 'Alternative Investments'}, {title: 'Fixed Income'}] },
                        { title: 'Career Options', children: [{title: 'Investment Banker'}, {title: 'Portfolio Manager'}, {title: 'Hedge Fund Analyst'}, {title: 'CFO'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for the fast-paced world of finance.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Advanced Excel'}, {title: 'Financial Modeling (DCF, LBO)'}, {title: 'Bloomberg Terminal'}, {title: 'Python for finance'}, {title: 'Valuation'}] },
                    { title: 'Soft Skills', children: [{title: 'High-pressure decision making'}, {title: 'Analytical mindset'}, {title: 'Negotiation'}, {title: 'Networking'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Algorithmic Trading'}, {title: 'ESG Investing'}, {title: 'FinTech (Robo-advisors)'}, {title: 'Private Equity/Venture Capital growth'}] },
            { title: 'Key Roles', children: [{title: 'Investment Banking'}, {title: 'Private Equity'}, {title: 'Venture Capital'}, {title: 'Equity Research'}] }
        ]
    },
    'marketing': {
        title: 'Marketing, Advertising & Brand Strategy',
        description: 'Creating and communicating value to customers to drive business growth.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a creative and strategic marketing professional.',
                children: [
                    { title: 'BBA in Marketing (3 Years)', 
                      description: 'A foundational degree in marketing principles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Principles of Marketing'}, {title: 'Consumer Behavior'}, {title: 'Market Research'}, {title: 'Advertising Management'}] },
                        { title: 'Career Options', children: [{title: 'Marketing Executive'}, {title: 'Social Media Executive'}, {title: 'Market Research Analyst'}, {title: 'Sales Trainee'}] },
                      ]
                    },
                    { title: 'MBA in Marketing (2 Years)', 
                      description: 'A postgraduate degree for leadership roles in marketing and branding.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Brand Management'}, {title: 'Strategic Marketing'}, {title: 'Services Marketing'}, {title: 'Digital Marketing Analytics'}] },
                        { title: 'Career Options', children: [{title: 'Brand Manager'}, {title: 'Product Manager'}, {title: 'Marketing Head'}, {title: 'Digital Marketing Strategist'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The blend of creativity and analytical skills needed for modern marketing.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'SEO/SEM tools (Google Analytics, SEMrush)'}, {title: 'CRM software (Salesforce)'}, {title: 'Social Media Marketing platforms'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Storytelling'}, {title: 'Communication'}, {title: 'Persuasion'}, {title: 'Analytical thinking'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Personalized Marketing using AI'}, {title: 'Influencer Marketing'}, {title: 'Voice Search Optimization'}, {title: 'Experiential Marketing'}] },
            { title: 'Top Industries', children: [{title: 'FMCG'}, {title: 'E-commerce'}, {title: 'Advertising Agencies'}, {title: 'IT (Product Marketing)'}, {title: 'Retail'}] }
        ]
    },
    'sales_ecom': {
        title: 'Sales, E-Commerce & Digital Business',
        description: 'Driving revenue through direct customer interaction and online platforms.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in sales and digital commerce.',
                children: [
                    { title: 'BBA / B.Com (3 Years)', 
                      description: 'A foundational business degree.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Sales Management'}, {title: 'Retail Management'}, {title: 'E-Commerce Fundamentals'}, {title: 'Digital Marketing'}] },
                        { title: 'Career Options', children: [{title: 'Sales Executive'}, {title: 'E-commerce Executive'}, {title: 'Digital Marketing Trainee'}, {title: 'Business Development'}] },
                      ]
                    },
                    { title: 'MBA in Sales/Marketing (2 Years)', 
                      description: 'A postgraduate degree for leadership roles in sales and e-commerce.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Key Account Management'}, {title: 'E-Commerce Strategy'}, {title: 'Digital Business Models'}] },
                        { title: 'Career Options', children: [{title: 'Regional Sales Manager'}, {title: 'E-Commerce Head'}, {title: 'Head of Business Development'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The competencies required to excel in sales.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'CRM Software (Salesforce, HubSpot)'}, {title: 'E-commerce Platforms (Shopify)'}, {title: 'Digital Marketing tools'}, {title: 'Data Analytics'}] },
                    { title: 'Soft Skills', children: [{title: 'Persuasion'}, {title: 'Negotiation'}, {title: 'Resilience'}, {title: 'Relationship Building'}, {title: 'Target-Oriented Mindset'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Social Commerce'}, {title: 'AI-driven Sales Forecasting'}, {title: 'Hyper-Personalization'}, {title: 'Direct-to-Consumer (D2C) growth'}] },
            { title: 'Top Industries', children: [{title: 'E-commerce'}, {title: 'Retail'}, {title: 'IT & SaaS'}, {title: 'FMCG'}, {title: 'Real Estate'}] }
        ]
    },
    'entrepreneur': {
        title: 'Entrepreneurship & Startups',
        description: 'The journey of creating a new business venture from the ground up.',
        children: [
            { 
                title: 'Academics',
                description: 'While not mandatory, education can provide a strong foundation.',
                children: [
                    { title: 'BBA in Entrepreneurship (3 Years)', 
                      description: 'A specialized degree covering the fundamentals of starting a business.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'New Venture Creation'}, {title: 'Family Business Management'}, {title: 'Startup Finance'}, {title: 'Innovation Management'}] },
                        { title: 'Career Options', children: [{title: 'Founder/Co-founder'}, {title: 'Product Manager at a startup'}, {title: 'Venture Capital Analyst'}] },
                      ]
                    },
                    { title: 'No Formal Degree Required', 
                      description: 'Many successful founders learn through experience rather than formal education.',
                      children: [
                        { title: 'Key Focus', description: 'Real-world experience, building MVPs, and learning from failure are key.' },
                        { title: 'Career Options', children: [{title: 'Serial Entrepreneur'}, {title: 'Angel Investor'}, {title: 'Startup Mentor/Advisor'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The unique mindset and abilities required to be an entrepreneur.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Financial Projections'}, {title: 'Digital Marketing'}, {title: 'Product Management'}, {title: 'Fundraising'}] },
                    { title: 'Soft Skills', children: [{title: 'Vision'}, {title: 'Resilience'}, {title: 'Risk-Taking'}, {title: 'Adaptability'}, {title: 'Salesmanship'}, {title: 'Leadership'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Deep Tech (AI, Blockchain)'}, {title: 'Sustainability (Cleantech)'}, {title: 'HealthTech'}, {title: 'FinTech'}] },
            { title: 'Key Concepts', children: [{title: 'Minimum Viable Product (MVP)'}, {title: 'Product-Market Fit'}, {title: 'Bootstrapping'}, {title: 'Venture Capital'}, {title: 'Pivoting'}] }
        ]
    },
    'intl_biz': {
        title: 'International Business & Trade',
        description: 'Managing business operations that cross national borders.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a global business career.',
                children: [
                    { title: 'BBA in International Business (3 Years)', 
                      description: 'An undergraduate degree focused on global commerce.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Global Business Management'}, {title: 'Export-Import Procedures'}, {title: 'Foreign Exchange Management'}, {title: 'International Law'}] },
                        { title: 'Career Options', children: [{title: 'Export Executive'}, {title: 'International Marketing Trainee'}, {title: 'Trade Documentation Officer'}] },
                      ]
                    },
                    { title: 'MBA in International Business (2 Years)', 
                      description: 'A postgraduate degree for leadership roles in global companies.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Global Strategy'}, {title: 'International Finance'}, {title: 'Foreign Trade Policy'}] },
                        { title: 'Career Options', children: [{title: 'Export Manager'}, {title: 'International Business Head'}, {title: 'Global Sourcing Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The competencies needed to operate in a global environment.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Knowledge of Incoterms'}, {title: 'Trade Finance documentation (Letter of Credit)'}, {title: 'Foreign languages'}] },
                    { title: 'Soft Skills', children: [{title: 'Cross-Cultural Sensitivity'}, {title: 'Negotiation'}, {title: 'Adaptability'}, {title: 'Global Mindset'}, {title: 'Networking'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Navigating global supply chain shifts'}, {title: 'Leveraging digital trade platforms'}, {title: 'Managing geo-political risks'}] },
            { title: 'Top Industries', children: [{title: 'Export Houses'}, {title: 'Manufacturing'}, {title: 'Shipping & Logistics'}, {title: 'Global IT firms'}, {title: 'Consulting'}] }
        ]
    },
    'supply_chain': {
        title: 'Supply Chain, Logistics & Operations',
        description: 'Managing the end-to-end flow of goods from source to consumer.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for managing complex operational systems.',
                children: [
                    { title: 'BBA/B.Tech (3/4 Years)', 
                      description: 'A foundational degree in operations and logistics.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Operations Management'}, {title: 'Logistics'}, {title: 'Warehouse Management'}, {title: 'Inventory Control'}] },
                        { title: 'Career Options', children: [{title: 'Logistics Coordinator'}, {title: 'Warehouse Supervisor'}, {title: 'Procurement Executive'}, {title: 'Supply Chain Analyst'}] },
                      ]
                    },
                    { title: 'MBA in Operations/Supply Chain (2 Years)', 
                      description: 'A postgraduate degree for leadership roles in the supply chain.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Supply Chain Management'}, {title: 'Strategic Sourcing'}, {title: 'Six Sigma'}, {title: 'Lean Management'}] },
                        { title: 'Career Options', children: [{title: 'Supply Chain Manager'}, {title: 'Operations Head'}, {title: 'Logistics Consultant'}, {title: 'Procurement Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The competencies needed to ensure operational efficiency.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'ERP Systems (SAP)'}, {title: 'Warehouse Management Systems (WMS)'}, {title: 'Data Analysis (Excel, SQL)'}, {title: 'Forecasting'}] },
                    { title: 'Soft Skills', children: [{title: 'Problem-Solving'}, {title: 'Planning & Organization'}, {title: 'Negotiation'}, {title: 'Vendor Management'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'AI in demand forecasting'}, {title: 'Blockchain for transparency'}, {title: 'Sustainable & Green Logistics'}, {title: 'Drone delivery'}] },
            { title: 'Top Industries', children: [{title: 'E-commerce'}, {title: 'Manufacturing'}, {title: 'Retail'}, {title: 'FMCG'}, {title: 'Logistics Companies (3PL)'}] }
        ]
    },
    'hospitality': {
        title: 'Tourism, Hospitality & Event Management',
        description: 'The business of providing accommodation, food services, and experiences.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in service and experience management.',
                children: [
                    { title: 'BHM / B.Sc. in Hospitality (3 Years)', 
                      description: 'A foundational degree in hotel and service management.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Food & Beverage Production'}, {title: 'Housekeeping'}, {title: 'Front Office Management'}, {title: 'Tourism Principles'}] },
                        { title: 'Career Options', children: [{title: 'Hotel Operations Trainee'}, {title: 'Event Coordinator'}, {title: 'Travel Consultant'}, {title: 'Guest Relations Executive'}] },
                      ]
                    },
                    { title: 'MBA in Hospitality/Tourism (2 Years)', 
                      description: 'A postgraduate degree for leadership roles in the hospitality sector.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Revenue Management'}, {title: 'Strategic Hospitality Management'}, {title: 'MICE Management'}] },
                        { title: 'Career Options', children: [{title: 'Hotel Manager'}, {title: 'Event Head'}, {title: 'Tourism Director'}, {title: 'Revenue Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for excelling in the service industry.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Property Management Systems (PMS)'}, {title: 'Point of Sale (POS) systems'}, {title: 'Revenue Management software'}] },
                    { title: 'Soft Skills', children: [{title: 'Customer Service'}, {title: 'Interpersonal Skills'}, {title: 'Problem-Solving under pressure'}, {title: 'Organization'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Sustainable Tourism'}, {title: 'Experiential Travel'}, {title: 'Tech-enabled guest services'}, {title: 'Large-scale MICE events'}] },
            { title: 'Top Industries', children: [{title: 'Hotel Chains (Taj, Marriott)'}, {title: 'Airlines'}, {title: 'Cruise Lines'}, {title: 'Event Management Companies'}, {title: 'Tourism Boards'}] }
        ]
    },
    'law_gov': {
        title: 'Law, Corporate Governance & Compliance',
        description: 'Ensuring businesses operate within legal and regulatory frameworks.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for corporate legal and compliance roles.',
                children: [
                    { title: 'B.Com + Company Secretary (CS)', 
                      description: 'A professional qualification for corporate governance experts.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Company Law'}, {title: 'Securities Law'}, {title: 'Economic & Commercial Laws'}, {title: 'Tax Laws'}] },
                        { title: 'Career Options', children: [{title: 'Company Secretary in a listed company'}, {title: 'Compliance Officer'}, {title: 'Legal Advisor'}] },
                      ]
                    },
                    { title: 'LL.B (for Corporate Law)', 
                      description: 'A law degree focused on business and corporate affairs.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Corporate Law'}, {title: 'Contract Law'}, {title: 'Mergers & Acquisitions'}] },
                        { title: 'Career Options', children: [{title: 'Corporate Lawyer'}, {title: 'In-house Counsel'}, {title: 'Legal Associate in a law firm'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The competencies required for legal and governance professionals.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Legal Drafting'}, {title: 'Interpretation of Statutes'}, {title: 'Due Diligence'}, {title: 'Knowledge of SEBI/RBI regulations'}] },
                    { title: 'Soft Skills', children: [{title: 'Attention to Detail'}, {title: 'Integrity'}, {title: 'Analytical Skills'}, {title: 'Logical Reasoning'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Increased focus on ESG compliance'}, {title: 'Data Privacy Laws (GDPR)'}, {title: 'Complex cross-border transactions'}] },
            { title: 'Top Industries', children: [{title: 'All listed companies'}, {title: 'Law Firms'}, {title: 'Professional Services Firms'}, {title: 'Banks and Financial Institutions'}] }
        ]
    },
    'real_estate': {
        title: 'Real Estate, Retail & Consumer Business',
        description: 'The business of property, retail operations, and consumer goods.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in property and retail.',
                children: [
                    { title: 'BBA in Retail/Real Estate Management (3 Years)', 
                      description: 'A specialized undergraduate degree.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Retail Management'}, {title: 'Real Estate Principles'}, {title: 'Property Law'}, {title: 'Consumer Behavior'}] },
                        { title: 'Career Options', children: [{title: 'Retail Store Manager'}, {title: 'Real Estate Agent'}, {title: 'Property Manager'}, {title: 'Merchandiser'}] },
                      ]
                    },
                    { title: 'MBA in Retail/Marketing (2 Years)', 
                      description: 'A postgraduate degree for leadership roles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Retail Strategy'}, {title: 'Real Estate Finance & Investment'}, {title: 'Category Management'}] },
                        { title: 'Career Options', children: [{title: 'Head of Retail Operations'}, {title: 'Real Estate Developer'}, {title: 'Brand Head'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for success in these sectors.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Property Valuation'}, {title: 'Real Estate Regulations (RERA)'}, {title: 'CRM Software'}, {title: 'Point of Sale (POS) Systems'}] },
                    { title: 'Soft Skills', children: [{title: 'Negotiation'}, {title: 'Salesmanship'}, {title: 'Customer Service'}, {title: 'Market Knowledge'}, {title: 'Networking'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Phygital (Physical + Digital) retail'}, {title: 'PropTech (Technology in Real Estate)'}, {title: 'Sustainable buildings'}] },
            { title: 'Top Industries', children: [{title: 'Real Estate Development Firms'}, {title: 'Property Consultancy (JLL, CBRE)'}, {title: 'Large Retail Chains'}, {title: 'E-commerce'}] }
        ]
    },

    // =================================================================================
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ARTS STREAM <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // =================================================================================

    'poli_sci': {
        title: 'Political Science & Public Policy',
        description: 'The study of political systems, public administration, and how policies affect society.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for careers in governance and policy.',
                children: [
                    { title: 'B.A. in Political Science (3 Years)', 
                      description: 'A foundational degree in political theory and systems.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Political Theory'}, {title: 'Indian Politics'}, {title: 'International Relations'}, {title: 'Public Administration'}] },
                        { title: 'Career Options', children: [{title: 'Civil Services Aspirant'}, {title: 'Policy Research Assistant'}, {title: 'Journalism'}, {title: 'NGO roles'}] },
                      ]
                    },
                    { title: 'M.A. in Public Policy / Int. Relations (2 Years)', 
                      description: 'A postgraduate degree for specialized roles in policy and diplomacy.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Policy Analysis & Evaluation'}, {title: 'Global Governance'}, {title: 'Conflict Resolution'}] },
                        { title: 'Career Options', children: [{title: 'Policy Analyst (Think Tanks)'}, {title: 'Diplomat (IFS)'}, {title: 'Political Consultant'}, {title: 'CSR Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for influencing policy and public discourse.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Research Methodology'}, {title: 'Data Analysis (SPSS/Stata)'}, {title: 'Report Writing'}, {title: 'Legal Interpretation'}] },
                    { title: 'Soft Skills', children: [{title: 'Critical Thinking'}, {title: 'Analytical Skills'}, {title: 'Public Speaking'}, {title: 'Argumentation'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Data-driven policy making'}, {title: 'Geopolitical analysis'}, {title: 'Urban governance'}, {title: 'Climate policy'}] },
            { title: 'Top Sectors', children: [{title: 'Government (Civil Services)'}, {title: 'Think Tanks (PRS, ORF)'}, {title: 'NGOs'}, {title: 'International Organizations (UN)'}] }
        ]
    },
    'history': {
        title: 'History, Archaeology & Heritage Studies',
        description: 'The research and interpretation of the human past through documents and artifacts.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for careers in research and heritage preservation.',
                children: [
                    { title: 'B.A. in History (3 Years)', 
                      description: 'A foundational degree in historical studies.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Ancient Indian History'}, {title: 'Medieval Indian History'}, {title: 'Modern Indian History'}, {title: 'World History'}] },
                        { title: 'Career Options', children: [{title: 'Civil Services Aspirant'}, {title: 'Museum Assistant'}, {title: 'Content Writer'}, {title: 'Tour Guide'}] },
                      ]
                    },
                    { title: 'M.A. in History/Archaeology (2 Years)', 
                      description: 'A postgraduate degree for specialized roles.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced study in a specific period'}, {title: 'Research Methodology'}, {title: 'Archaeology'}] },
                        { title: 'Career Options', children: [{title: 'Archaeologist (ASI)'}, {title: 'Museum Curator'}, {title: 'Archivist'}, {title: 'Professor'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a historian or archaeologist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Archival Research'}, {title: 'Archaeological Excavation'}, {title: 'Carbon Dating interpretation'}, {title: 'Manuscript analysis'}] },
                    { title: 'Soft Skills', children: [{title: 'Analytical Reading'}, {title: 'Critical Source Analysis'}, {title: 'Narrative Writing'}, {title: 'Research'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Digital Humanities (digital archives)'}, {title: 'Heritage Management for tourism'}, {title: 'Museum Curation'}] },
            { title: 'Top Sectors', children: [{title: 'Archaeological Survey of India (ASI)'}, {title: 'Museums'}, {title: 'Universities'}, {title: 'Tourism Industry'}] }
        ]
    },
    'philosophy': {
        title: 'Philosophy, Ethics & Religion Studies',
        description: 'The exploration of fundamental questions about existence, knowledge, values, and reason.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for careers in critical thinking and ethics.',
                children: [
                    { title: 'B.A. in Philosophy (3 Years)', 
                      description: 'A foundational degree in logical reasoning and abstract thought.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Indian & Western Philosophy'}, {title: 'Logic'}, {title: 'Ethics'}, {title: 'Metaphysics'}, {title: 'Epistemology'}] },
                        { title: 'Career Options', children: [{title: 'Civil Services Aspirant'}, {title: 'Journalism'}, {title: 'Law'}, {title: 'Content Creation'}] },
                      ]
                    },
                    { title: 'M.A. in Philosophy (2 Years)', 
                      description: 'A postgraduate degree for deep specialization.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Deep specialization in a philosophical school or thinker.'}] },
                        { title: 'Career Options', children: [{title: 'Professor'}, {title: 'Ethicist'}, {title: 'Policy Advisor'}, {title: 'Researcher'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies developed through the study of philosophy.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Formal Logic'}, {title: 'Argument Mapping'}, {title: 'Textual Analysis'}, {title: 'Rhetoric'}] },
                    { title: 'Soft Skills', children: [{title: 'Abstract Thinking'}, {title: 'Logical Reasoning'}, {title: 'Critical Analysis'}, {title: 'Persuasive Writing'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'AI Ethics'}, {title: 'Bioethics'}, {title: 'Corporate Ethics consulting'}] },
            { title: 'Top Sectors', children: [{title: 'Academia'}, {title: 'Law'}, {title: 'Journalism'}, {title: 'Civil Services'}, {title: 'Publishing'}] }
        ]
    },
    'sociology': {
        title: 'Sociology, Anthropology & Culture Studies',
        description: 'The scientific study of human social behavior, societal structures, and cultural development.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for understanding societies and cultures.',
                children: [
                    { title: 'B.A. in Sociology (3 Years)', 
                      description: 'A foundational degree in social structures and issues.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Introduction to Sociology'}, {title: 'Social Thinkers'}, {title: 'Indian Society'}, {title: 'Research Methods'}] },
                        { title: 'Career Options', children: [{title: 'Social Work'}, {title: 'NGO roles'}, {title: 'Market Research'}, {title: 'Public Relations'}] },
                      ]
                    },
                    { title: 'M.A. in Sociology (2 Years)', 
                      description: 'A postgraduate degree for specialized research and analysis.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Advanced Social Theory'}, {title: 'Quantitative and Qualitative Research'}] },
                        { title: 'Career Options', children: [{title: 'Sociologist'}, {title: 'User Experience (UX) Researcher'}, {title: 'CSR Manager'}, {title: 'Professor'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a sociologist or anthropologist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Qualitative Data Analysis (NVivo)'}, {title: 'Survey Design'}, {title: 'Statistical Analysis (SPSS)'}, {title: 'Ethnographic Research'}] },
                    { title: 'Soft Skills', children: [{title: 'Empathy'}, {title: 'Cultural Sensitivity'}, {title: 'Critical Thinking'}, {title: 'Observational Skills'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'UX Research for tech products'}, {title: 'CSR strategy'}, {title: 'Public Health policy'}, {title: 'Analysis of digital societies'}] },
            { title: 'Top Sectors', children: [{title: 'NGOs'}, {title: 'Market Research firms'}, {title: 'Tech Companies (UX Research)'}, {title: 'Corporate CSR'}] }
        ]
    },
    'psychology': {
        title: 'Psychology, Counseling & Human Behavior',
        description: 'The scientific study of the mind and behavior to understand and improve well-being.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in understanding the human mind.',
                children: [
                    { title: 'B.A. in Psychology (3 Years)', 
                      description: 'A foundational degree in the science of behavior.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Introduction to Psychology'}, {title: 'Social Psychology'}, {title: 'Developmental Psychology'}, {title: 'Statistics'}] },
                        { title: 'Career Options', children: [{title: 'HR Trainee'}, {title: 'School Counselor Assistant'}, {title: 'Social Work'}, {title: 'Market Research'}] },
                      ]
                    },
                    { title: 'M.A. / M.Sc. in Psychology (2 Years)', 
                      description: 'A postgraduate degree for specialization. RCI license needed for clinical practice.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Specialization in Clinical, Counseling, or Organizational Psychology'}] },
                        { title: 'Career Options', children: [{title: 'Counselor'}, {title: 'Clinical Psychologist (after M.Phil/Psy.D.)'}, {title: 'HR Manager'}, {title: 'UX Researcher'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a psychology professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Psychometric Testing'}, {title: 'Statistical Analysis (SPSS)'}, {title: 'Case History Taking'}, {title: 'Therapeutic Techniques'}] },
                    { title: 'Soft Skills', children: [{title: 'Active Listening'}, {title: 'Empathy'}, {title: 'Communication'}, {title: 'Ethical Judgment'}, {title: 'Patience'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Mental Health tech (apps)'}, {title: 'AI in therapy'}, {title: 'Sports Psychology'}, {title: 'Corporate wellness programs'}] },
            { title: 'Top Industries', children: [{title: 'Hospitals & Clinics'}, {title: 'Schools & Universities'}, {title: 'Corporates (HR Dept)'}, {title: 'NGOs'}] }
        ]
    },
    'literature': {
        title: 'Literature, Creative Writing & Languages',
        description: 'The critical analysis of written works and creative expression through language.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in writing and communication.',
                children: [
                    { title: 'B.A. in English/Literature (3 Years)', 
                      description: 'A foundational degree in literary studies.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Literary Theory'}, {title: 'British Literature'}, {title: 'American Literature'}, {title: 'Indian Writing in English'}] },
                        { title: 'Career Options', children: [{title: 'Content Writer'}, {title: 'Editor'}, {title: 'Journalist'}, {title: 'Teacher'}, {title: 'Public Relations Executive'}] },
                      ]
                    },
                    { title: 'M.A. in English/Literature (2 Years)', 
                      description: 'A postgraduate degree for advanced roles in academia and publishing.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Deep study of a literary period, genre, or theory.'}] },
                        { title: 'Career Options', children: [{title: 'Professor'}, {title: 'Publisher'}, {title: 'Senior Editor'}, {title: 'Literary Agent'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for writers and editors.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Editing & Proofreading'}, {title: 'Content Management Systems (CMS)'}, {title: 'SEO Writing'}, {title: 'Scriptwriting software'}] },
                    { title: 'Soft Skills', children: [{title: 'Critical Analysis'}, {title: 'Creative Writing'}, {title: 'Communication'}, {title: 'Storytelling'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Content Strategy for digital platforms'}, {title: 'Scriptwriting for OTT'}, {title: 'AI-assisted creative writing'}, {title: 'Corporate Storytelling'}] },
            { title: 'Top Industries', children: [{title: 'Publishing'}, {title: 'Media & Journalism'}, {title: 'Advertising'}, {title: 'EdTech'}, {title: 'IT (Technical Writing)'}] }
        ]
    },
    'media': {
        title: 'Media, Journalism & Communication Studies',
        description: 'Gathering, assessing, creating, and presenting news and information.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in media.',
                children: [
                    { title: 'B.A. / B.M.M. (3 Years)', 
                      description: 'A foundational degree in media and communication.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Introduction to Journalism'}, {title: 'Media Ethics & Law'}, {title: 'Reporting & Editing'}, {title: 'Public Relations'}] },
                        { title: 'Career Options', children: [{title: 'Journalist/Reporter'}, {title: 'PR Executive'}, {title: 'Social Media Manager'}, {title: 'Copywriter'}] },
                      ]
                    },
                    { title: 'M.A. / PGD in Journalism (2/1 Years)', 
                      description: 'A postgraduate degree for specialized roles in journalism.',
                      children: [
                        { title: 'Core Subjects', children: [{title: 'Investigative Journalism'}, {title: 'Broadcast Journalism'}, {title: 'Digital Media'}] },
                        { title: 'Career Options', children: [{title: 'Senior Correspondent'}, {title: 'Editor'}, {title: 'Producer'}, {title: 'Communications Manager'}] },
                      ]
                    },
                ]
            },
            { 
                title: 'Skills', 
                description: 'The key competencies for a media professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Video Editing (Adobe Premiere)'}, {title: 'Audio Editing (Audition)'}, {title: 'Camera Operation'}, {title: 'CMS'}] },
                    { title: 'Soft Skills', children: [{title: 'Communication'}, {title: 'Writing'}, {title: 'Storytelling'}, {title: 'Research'}, {title: 'Interviewing'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Mobile Journalism (MoJo)'}, {title: 'Podcasting'}, {title: 'Data Journalism'}, {title: 'Fact-checking'}] },
            { title: 'Top Industries', children: [{title: 'News Media (Print, TV, Digital)'}, {title: 'Advertising Agencies'}, {title: 'PR Firms'}, {title: 'Corporate Communications'}] }
        ]
    },
    'film_theatre': {
        title: 'Film, Theatre & Performing Arts',
        description: 'Artistic expression through visual and live performance.',
        children: [
            { 
                title: 'Academics',
                description: 'Formal training for careers in performance and production.',
                children: [
                    { title: 'B.A. in Performing Arts / B.F.A.', description: 'Focuses on acting, directing, scriptwriting, and technical aspects like lighting and set design.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Actor'}, {title: 'Director'}, {title: 'Cinematographer'}, {title: 'Set Designer'}] }
                    ]},
                    { title: 'Diploma from NSD / FTII', description: 'Prestigious, specialized training for serious actors, directors, and technicians.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Leads in Film & Theatre'}, {title: 'Acclaimed Directors'}, {title: 'Technical Experts'}] }
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The competencies required for the stage and screen.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Camera Operation'}, {title: 'Video/Sound Editing'}, {title: 'Lighting Design'}, {title: 'Scriptwriting Software'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Public Speaking'}, {title: 'Teamwork'}, {title: 'Improvisation'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Content creation for OTT platforms'}, {title: 'Independent filmmaking'}, {title: 'Regional cinema growth'}] },
        ]
    },
    'visual_arts': {
        title: 'Visual Arts, Design & Fashion',
        description: 'Creating works focused on visual perception, aesthetics, and tangible design.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in design.',
                children: [
                    { title: 'B.Des / B.F.A. (4 Years)', description: 'Entrance through NID, NIFT, UCEED. Specializations in Graphic, Product, Fashion, or Textile Design.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Graphic Designer'}, {title: 'UI/UX Designer'}, {title: 'Fashion Designer'}, {title: 'Animator'}] }
                    ]},
                    { title: 'M.Des (2 Years)', description: 'Advanced study for specialization in design research or strategy.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Design Head'}, {title: 'Creative Director'}, {title: 'Design Strategist'}] }
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a designer.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Adobe Creative Suite (Photoshop, Illustrator)'}, {title: 'CAD'}, {title: 'Sketching'}, {title: 'Prototyping'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Visual Thinking'}, {title: 'User Empathy'}, {title: 'Attention to Detail'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'UI/UX design for tech'}, {title: 'Sustainable fashion'}, {title: 'Experiential design'}] },
        ]
    },
    'music_dance': {
        title: 'Music, Dance & Fine Arts',
        description: 'Professional careers in musical performance, composition, and choreography.',
        children: [
            { 
                title: 'Academics',
                description: 'The path to mastering a performing art.',
                children: [
                    { title: 'B.P.A. (Bachelor of Performing Arts)', description: 'Formal training in Indian Classical or Western music/dance forms.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Performer'}, {title: 'Teacher/Guru'}, {title: 'Choreographer'}, {title: 'Music Composer'}] }
                    ]},
                    { title: 'Guru-Shishya Parampara', 
                      description: 'Traditional method of learning from a master artist over many years.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Classical Performer'}, {title: 'Preserver of a tradition (Gharana)'}]}
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The competencies required for a performing artist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Mastery of an instrument/voice/dance form'}, {title: 'Music Theory'}, {title: 'Composition'}, {title: 'Choreography'}] },
                    { title: 'Soft Skills', children: [{title: 'Discipline'}, {title: 'Practice'}, {title: 'Creativity'}, {title: 'Performance Skills'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Digital music production'}, {title: 'Online teaching'}, {title: 'Fusion art forms'}] },
        ]
    },
    'social_work': {
        title: 'Social Work, NGO & Activism',
        description: 'Working to improve human well-being and advocate for social change.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for a career in the social sector.',
                children: [
                    { title: 'B.S.W. (Bachelor of Social Work)', description: 'Provides foundational knowledge and fieldwork experience in social issues.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Community Mobilizer'}, {title: 'NGO Project Assistant'}, {title: 'Counselor Trainee'}] }
                    ]},
                    { title: 'M.S.W. (Master of Social Work)', description: 'Specialized training for roles in community development, counseling, or policy advocacy. Entrance: TISSNET.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Project Manager (NGO)'}, {title: 'CSR Manager'}, {title: 'Policy Advocate'}] }
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a social worker.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Community Mobilization'}, {title: 'Grant Writing'}, {title: 'Project Management'}, {title: 'Counseling Techniques'}] },
                    { title: 'Soft Skills', children: [{title: 'Empathy'}, {title: 'Communication'}, {title: 'Resilience'}, {title: 'Advocacy'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Corporate Social Responsibility (CSR) management'}, {title: 'Social entrepreneurship'}, {title: 'Data-driven impact assessment'}] },
        ]
    },
    'education': {
        title: 'Education, Teaching & Learning Sciences',
        description: 'Designing curricula, instructing students, and researching how humans learn.',
        children: [
            { 
                title: 'Academics',
                description: 'The educational path for becoming an educator.',
                children: [
                    { title: 'B.Ed. (Bachelor of Education)', description: 'A mandatory 2-year professional degree required to become a teacher in schools.',
                      children: [
                        { title: 'Career Options', children: [{title: 'School Teacher (TGT/PGT)'}, {title: 'Tutor'}, {title: 'Curriculum Developer'}] }
                    ]},
                    { title: 'M.Ed. (Master of Education)', description: 'For roles in educational administration, curriculum design, or teacher training.',
                      children: [
                        { title: 'Career Options', children: [{title: 'Principal'}, {title: 'Instructional Designer'}, {title: 'Education Consultant'}] }
                      ]
                    },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a teacher.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Classroom Management'}, {title: 'Lesson Planning'}, {title: 'Use of EdTech tools'}, {title: 'Assessment techniques'}] },
                    { title: 'Soft Skills', children: [{title: 'Patience'}, {title: 'Communication'}, {title: 'Empathy'}, {title: 'Subject Matter Expertise'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Online education platforms (EdTech)'}, {title: 'Instructional design'}, {title: 'Specialized education for children with special needs'}] },
        ]
    },

    // =================================================================================
    // >>>>>>>>>>>>>>>>>>>>>>>>>>> UNCONVENTIONAL STREAM <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // =================================================================================
    
    'gaming_esports': {
        title: 'Gaming & Esports',
        description: 'The competitive, business, and development aspects of the video game industry.',
        children: [
            { 
                title: 'Pathways',
                description: 'Different routes to a career in gaming.',
                children: [
                    { title: 'Pro-Player / Coach', description: 'Requires immense skill, practice, and dedication in a specific game (e.g., Valorant, BGMI).', children: [{title: 'Career Path', description: 'Involves rigorous practice, streaming, and tournament participation.'}] },
                    { title: 'Game Designer / Developer', description: 'Requires skills in computer science, art, and design. A B.Tech or Design degree is helpful.', children: [{title: 'Career Path', description: 'Works on creating the mechanics, story, and code of a game.'}] },
                    { title: 'Management / Caster', description: 'Often requires a background in media, management (BBA/MBA), or journalism.', children: [{title: 'Career Path', description: 'Manages esports teams, organizes tournaments, or provides on-air commentary.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The diverse skills needed in the gaming ecosystem.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Game Engines (Unity, Unreal)'}, {title: 'Coding (C++)'}, {title: 'Video Production'}, {title: 'Streaming Software (OBS)'}] },
                    { title: 'Soft Skills', children: [{title: 'Team Communication'}, {title: 'Strategy'}, {title: 'Quick Reflexes'}, {title: 'Public Speaking (for casters)'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Massive growth in mobile gaming'}, {title: 'Tier-2/3 city participation'}, {title: 'Formalization of Esports as a mainstream sport'}] },
        ]
    },
    'content_creation': {
        title: 'Digital Content Creation',
        description: 'Producing original media for digital platforms to build an audience and brand.',
        children: [
            { 
                title: 'Pathways',
                description: 'The most popular platforms for content creators.',
                children: [
                    { title: 'YouTuber / Vlogger', description: 'Focuses on video production, editing, and building a community around a niche.', children: [{title: 'Key to Success', description: 'Consistency, high-quality video/audio, and a unique personality.'}] },
                    { title: 'Podcaster / Streamer', description: 'Requires strong communication skills and expertise in audio or live-streaming.', children: [{title: 'Key to Success', description: 'Engaging conversations, clear audio, and regular interaction with the audience.'}] },
                    { title: 'Influencer (Instagram, etc.)', description: 'Builds a personal brand around niches like fashion, travel, or finance.', children: [{title: 'Key to Success', description: 'High-quality visuals, authentic engagement, and a well-defined niche.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The competencies needed to be a successful creator.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Video Editing'}, {title: 'SEO'}, {title: 'Social Media Analytics'}, {title: 'Graphic Design (Canva, Photoshop)'}, {title: 'Copywriting'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Authenticity'}, {title: 'Consistency'}, {title: 'Communication'}, {title: 'Understanding your audience'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Growth of the creator economy'}, {title: 'Monetization through courses and merchandise'}, {title: 'Brand collaborations'}] },
        ]
    },
    'culinary_arts': {
        title: 'Culinary Arts & Food Tech',
        description: 'The art of cooking combined with the science of food production.',
        children: [
            { 
                title: 'Academics',
                description: 'Formal training paths for food professionals.',
                children: [
                    { title: 'Degree in Hotel Management (IHM)', description: 'Comprehensive training in cooking, baking, and kitchen management.', children: [{title: 'Key Subjects', children: [{title: 'Food Production'}, {title: 'Bakery & Patisserie'}, {title: 'Kitchen Management'}]}] },
                    { title: 'Food Science / Tech Degree', description: 'Focuses on the science of food preservation, nutrition, and product development.', children: [{title: 'Key Subjects', children: [{title: 'Food Chemistry'}, {title: 'Food Preservation'}, {title: 'Nutrition'}]}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The competencies required in the kitchen and the lab.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Cooking Techniques'}, {title: 'Food Safety (HACCP)'}, {title: 'Menu Planning'}, {title: 'Molecular Gastronomy'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Time Management'}, {title: 'Working under pressure'}, {title: 'Team Leadership'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Cloud kitchens'}, {title: 'Plant-based food technology'}, {title: 'Food blogging/vlogging'}] },
        ]
    },
    'sports_mgmt': {
        title: 'Sports Management & Analytics',
        description: 'The business, administration, and organizational functions of the sports industry.',
        children: [
            { 
                title: 'Academics',
                description: 'Educational paths for the business side of sports.',
                children: [
                    { title: 'BBA/MBA in Sports Management', description: 'Covers the business side of sports, including marketing, finance, and operations.', children: [{title: 'Key Subjects', children: [{title: 'Sports Marketing'}, {title: 'Sports Finance'}, {title: 'League Operations'}]}] },
                    { title: 'Degree in Statistics/Data Science', description: 'For roles in sports analytics, focusing on player and team performance data.', children: [{title: 'Key Application', description: 'Using data to make decisions about player recruitment and on-field strategy.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The competencies needed to succeed in the sports industry.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Data Analysis (Python/R)'}, {title: 'Event Management'}, {title: 'Sponsorship Sales'}, {title: 'Digital Marketing'}] },
                    { title: 'Soft Skills', children: [{title: 'Networking'}, {title: 'Negotiation'}, {title: 'Leadership'}, {title: 'Passion for sports'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Growth of Indian sports leagues'}, {title: 'Esports management'}, {title: 'Data-driven coaching'}] },
        ]
    },
    'music_production': {
        title: 'Music Production & Sound Design',
        description: 'The technical process of recording, mixing, and creating sound for media.',
        children: [
            { 
                title: 'Academics',
                description: 'How to learn the craft of sound engineering.',
                children: [
                    { title: 'Degree/Diploma in Audio Engineering', description: 'Formal training in sound recording, mixing, and mastering.', children: [{title: 'Key Subjects', children: [{title: 'Sound Recording'}, {title: 'Mixing'}, {title: 'Mastering'}, {title: 'Acoustics'}]}] },
                    { title: 'Self-Taught / Online Courses', description: 'Many successful producers learn through practice and online tutorials.', children: [{title: 'Key to Success', description: 'Consistent practice and developing a good ear for sound.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a music producer.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Digital Audio Workstations (DAW) like FL Studio, Ableton Live'}, {title: 'Music Theory'}, {title: 'Sound Synthesis'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Critical Listening'}, {title: 'Patience'}, {title: 'Collaboration with artists'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Sound design for games and apps'}, {title: 'Growth of independent music scene'}, {title: 'AI in music composition'}] },
        ]
    },
    'social_entrepreneurship': {
        title: 'Social Entrepreneurship & Impact',
        description: 'Starting ventures that aim to solve social or environmental issues sustainably.',
        children: [
            { 
                title: 'Academics',
                description: 'Educational paths that can lead to social impact.',
                children: [
                    { title: 'Degree in Social Work or Business (BBA/MBA)', description: 'Provides a foundation in either social issues or business principles, which are then combined.', children: [{title: 'Key Idea', description: 'Applying business principles to solve social problems effectively.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The unique competencies required for a social entrepreneur.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Grant Writing'}, {title: 'Impact Measurement'}, {title: 'Business Modeling'}, {title: 'Community Mobilization'}] },
                    { title: 'Soft Skills', children: [{title: 'Empathy'}, {title: 'Resilience'}, {title: 'Innovation'}, {title: 'Storytelling'}, {title: 'Resourcefulness'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Growth in impact investing'}, {title: 'Sustainable businesses (ESG)'}, {title: 'Tech-for-good solutions'}] },
        ]
    },
    'travel_tourism': {
        title: 'Travel, Adventure & Tourism',
        description: 'Managing travel experiences, organizing adventure sports, and developing tourism.',
        children: [
            { 
                title: 'Academics',
                description: 'Educational paths for the travel industry.',
                children: [
                    { title: 'Degree in Tourism & Travel Management', description: 'Covers tour operations, travel agency management, and destination marketing.', children: [{title: 'Key Subjects', children: [{title: 'Tour Operations'}, {title: 'Travel Agency Management'}, {title: 'Destination Marketing'}]}] },
                    { title: 'Certifications in Adventure Sports', description: 'Required for roles like mountaineering or river rafting guide.', children: [{title: 'Example', description: 'Basic and Advanced Mountaineering Courses from certified institutes.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a travel professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Itinerary Planning'}, {title: 'Ticketing software'}, {title: 'First Aid & Survival Skills'}, {title: 'Foreign Languages'}] },
                    { title: 'Soft Skills', children: [{title: 'Communication'}, {title: 'Customer Service'}, {title: 'Storytelling'}, {title: 'Problem-Solving'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Eco-tourism'}, {title: 'Experiential travel'}, {title: 'Use of technology (VR) for travel planning'}] },
        ]
    },
    'animation_vfx': {
        title: 'Animation, VFX & Motion Graphics',
        description: 'Creating visual effects and animated sequences for film, TV, and games.',
        children: [
            { 
                title: 'Academics',
                description: 'Formal training for a career in digital visual arts.',
                children: [
                    { title: 'Degree/Diploma in Animation & VFX', description: 'Structured training in 2D/3D animation, modeling, and visual effects software.', children: [{title: 'Key Subjects', children: [{title: '2D/3D Animation'}, {title: 'Modeling'}, {title: 'Texturing'}, {title: 'Lighting'}, {title: 'Compositing'}]}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a VFX or animation artist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Software like Maya, Blender, Adobe After Effects, Nuke'}, {title: 'Understanding of lighting, texture, and physics'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Patience'}, {title: 'Attention to Detail'}, {title: 'Teamwork on a pipeline'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Real-time rendering in game engines'}, {title: 'Virtual Production'}, {title: 'AR/VR content'}] },
        ]
    },
    'petroleum_mining': {
        title: 'Petroleum, Mining & Geology',
        description: 'Exploring and extracting natural resources and managing geological processes.',
        children: [
            { 
                title: 'Academics',
                description: 'Specialized engineering degrees for the energy and resources sector.',
                children: [
                    { title: 'B.Tech in Petroleum/Mining Engineering', description: 'Specialized engineering degree focused on extraction technologies.', children: [{title: 'Key Subjects', children: [{title: 'Reservoir Engineering'}, {title: 'Drilling Technology'}, {title: 'Geological Surveying'}, {title: 'Mine Safety'}]}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for this demanding field.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Reservoir Simulation'}, {title: 'Drilling Technology'}, {title: 'Geological Surveying'}, {title: 'Safety Management'}] },
                    { title: 'Soft Skills', children: [{title: 'Ability to work in remote locations'}, {title: 'Team Management'}, {title: 'Problem-Solving'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Efficient and safer extraction methods'}, {title: 'Geothermal energy exploration'}] },
        ]
    },
    'public_relations': {
        title: 'Public Relations & Image Management',
        description: 'Managing communication between an organization and the public to maintain a positive brand image.',
        children: [
            { 
                title: 'Academics',
                description: 'Educational paths for a career in corporate communications.',
                children: [
                    { title: 'Degree in Mass Communication / Journalism', description: 'Provides a strong foundation in media relations, writing, and communication strategy.', children: [{title: 'Key Subjects', children: [{title: 'Media Relations'}, {title: 'Corporate Communication'}, {title: 'Writing for PR'}, {title: 'Brand Management'}]}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a PR professional.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Press Release Writing'}, {title: 'Media Monitoring'}, {title: 'Event Management'}, {title: 'Social Media Strategy'}] },
                    { title: 'Soft Skills', children: [{title: 'Communication'}, {title: 'Networking'}, {title: 'Crisis Management'}, {title: 'Persuasion'}, {title: 'Writing'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Digital PR'}, {title: 'Influencer Relations'}, {title: 'Managing online reputation and crises'}] },
        ]
    },
    'urban_planning': {
        title: 'Urban Planning & Architecture',
        description: 'Designing and managing the physical development of cities and buildings.',
        children: [
            { 
                title: 'Academics',
                description: 'Professional degrees for designing our built environment.',
                children: [
                    { title: 'B.Arch (5 Years) / B.Plan (4 Years)', description: 'Professional degrees required for licensure and practice.', children: [{title: 'Key Subjects', children: [{title: 'Architectural Design'}, {title: 'Urban Planning'}, {title: 'Building Materials'}, {title: 'Transportation Planning'}]}] },
                    { title: 'M.Arch / M.Plan (2 Years)', description: 'For specialization in areas like sustainable architecture or transport planning.', children: [{title: 'Specializations', children: [{title: 'Sustainable Architecture'}, {title: 'Transport Planning'}, {title: 'Landscape Architecture'}]}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for an architect or planner.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'AutoCAD'}, {title: 'Revit'}, {title: 'GIS'}, {title: 'Urban Planning regulations'}, {title: 'Sketching'}] },
                    { title: 'Soft Skills', children: [{title: 'Creativity'}, {title: 'Spatial Thinking'}, {title: 'Problem-Solving'}, {title: 'Social and environmental awareness'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Sustainable & Smart City development'}, {title: 'Affordable housing solutions'}, {title: 'Adaptive reuse of old buildings'}] },
        ]
    },
    'data_journalism': {
        title: 'Data Journalism & Investigative Reporting',
        description: 'Using data analysis and visualization to tell compelling journalistic stories.',
        children: [
            { 
                title: 'Academics',
                description: 'The interdisciplinary path for a modern journalist.',
                children: [
                    { title: 'Degree in Journalism + Data Skills', description: 'A combination of traditional journalism training with courses in statistics, programming, and data visualization.', children: [{title: 'Key Idea', description: 'Using data as a source to find and tell stories that would otherwise be hidden.'}] },
                ]
            },
            { 
                title: 'Skills',
                description: 'The key competencies for a data journalist.',
                children: [
                    { title: 'Technical Skills', children: [{title: 'Python/R for data analysis'}, {title: 'SQL'}, {title: 'GIS for mapping'}, {title: 'Data Visualization tools (Tableau)'}, {title: 'Web Scraping'}] },
                    { title: 'Soft Skills', children: [{title: 'Investigative mindset'}, {title: 'Skepticism'}, {title: 'Storytelling with data'}, {title: 'Ethical judgment'}, {title: 'Persistence'}] },
                ]
            },
            { title: 'Future Scopes', children: [{title: 'Using AI to analyze large datasets'}, {title: 'Open-source intelligence (OSINT)'}, {title: 'Fact-checking initiatives'}] },
        ]
    }
};


/* Corrected quizResultToMindMapKey */
const quizResultToMindMapKey = {
    // --- SCIENCE CORE FIELDS ---
    'Science & Engineering / Applied Sciences': 'sci_eng_applied',
    'Engineering & Technology': 'eng_tech',
    'Computer Science & Software Development': 'comp_sci', // Corrected from 'Software Development & IT'
    'Data Science, AI & Analytics': 'data_sci',
    'Mathematics & Statistics': 'math_stats',
    'Physical Sciences (Physics, Chemistry)': 'phy_sci',
    'Chemistry & Chemical Engineering': 'chem_eng',
    'Biotechnology & Biomedical Sciences': 'biotech',
    'Medicine & Healthcare': 'medicine',
    'Pharmacy & Drug Development': 'pharmacy',
    'Earth & Environmental Sciences': 'earth_sci',
    'Marine & Ocean Sciences': 'marine_sci',
    'Space, Aerospace & Robotics': 'space_aero',

    // --- COMMERCE CORE FIELDS ---
    'Business & Management': 'biz_mgmt',
    'Finance, Accounting & Auditing': 'fin_acc',
    'Banking, Insurance & Financial Services': 'banking',
    'Investment, Capital Markets & Risk Management': 'investment',
    'Marketing, Advertising & Brand Strategy': 'marketing',
    'Sales, E-Commerce & Digital Business': 'sales_ecom',
    'Entrepreneurship & Startups': 'entrepreneur',
    'International Business & Trade': 'intl_biz',
    'Supply Chain, Logistics & Operations': 'supply_chain',
    'Tourism, Hospitality & Event Management': 'hospitality',
    'Law, Corporate Governance & Compliance': 'law_gov',
    'Real Estate, Retail & Consumer Business': 'real_estate',

    // --- ARTS CORE FIELDS ---
    'Political Science, Public Policy & International Relations': 'poli_sci',
    'History, Archaeology & Heritage Studies': 'history',
    'Philosophy, Ethics & Religion Studies': 'philosophy',
    'Sociology, Anthropology & Culture Studies': 'sociology',
    'Psychology, Counseling & Human Behavior': 'psychology',
    'Literature, Creative Writing & Languages': 'literature',
    'Media, Journalism & Communication Studies': 'media',
    'Film, Theatre & Performing Arts': 'film_theatre',
    'Visual Arts, Design & Fashion': 'visual_arts',
    'Music, Dance & Fine Arts': 'music_dance',
    'Social Work, NGO & Activism': 'social_work',
    'Education, Teaching & Learning Sciences': 'education',
    
    // --- UNCONVENTIONAL CORE FIELDS (NEW) ---
    'Gaming & Esports': 'gaming_esports',
    'Digital Content Creation': 'content_creation',
    'Culinary Arts & Food Tech': 'culinary_arts',
    'Sports Management & Analytics': 'sports_mgmt',
    'Music Production & Sound Design': 'music_production',
    'Social Entrepreneurship & Impact': 'social_entrepreneurship',
    'Travel, Adventure & Tourism': 'travel_tourism', // Added mapping for field 'travel_tourism'
    'Animation, VFX & Motion Graphics': 'animation_vfx', // Added mapping for field 'animation_vfx'
    'Petroleum, Mining & Geology': 'petroleum_mining', // Added mapping for field 'petroleum_mining'
    'Public Relations & Image Management': 'public_relations', // Added mapping for field 'public_relations'
    'Urban Planning & Architecture': 'urban_planning', // Added mapping for field 'urban_planning'
    'Data Journalism & Investigative Reporting': 'data_journalism', // Added mapping for field 'data_journalism'

    // --- SUPPORT KEYS (For Mind Map internal structure, if needed) ---
    'sci_eng_applied': 'sci_eng_applied', // Placeholder/Redundant keys left for robustness
    'sw_dev_it': 'sw_dev_it',
    'data_science': 'data_science',
    'design_hci': 'design_hci',
    'industrial_manufacturing': 'industrial_manufacturing',
    'marine_environmental': 'marine_environmental',
    'renewable_tech': 'renewable_tech',
    'space_aerospace': 'space_aerospace',
    'innovation_tech': 'innovation_tech',
    'robotics_automation': 'robotics_automation',
    'comm_media_tech': 'comm_media_tech',
    'chem_process_eng': 'chem_process_eng',
    'quant_data_analytics': 'quant_data_analytics',
    'sci_data_research': 'sci_data_research',
    'math_physics': 'math_physics',
    'earth_atmospheric': 'earth_atmospheric',
    'biotech_life_sci': 'biotech_life_sci',
    'healthcare_edu': 'healthcare_edu',
    'medicine_pharmacy': 'medicine_pharmacy',
    'chem_life_sci': 'chem_life_sci',
    'corp_biz_mgmt': 'corp_biz_mgmt',
    'startups_entrepreneurship': 'startups_entrepreneurship',
    'accounting_financial': 'accounting_financial',
    'marketing_corp_comm': 'marketing_corp_comm',
    'accounting_compliance': 'accounting_compliance',
    'hr_org_dev': 'hr_org_dev',
    'law_corp_gov': 'law_corp_gov',
    'marketing_brand_strategy': 'marketing_brand_strategy',
    'entrepreneurship_small_biz': 'entrepreneurship_small_biz',
    'intl_biz_trade': 'intl_biz_trade',
    'finance_investment': 'finance_investment',
    'mgmt_leadership': 'mgmt_leadership',
    'tax_accounting': 'tax_accounting',
    'sales_growth': 'sales_growth',
    'finance_mgmt': 'finance_mgmt',
    'marketing_analytics_research': 'marketing_analytics_research',
    'financial_risk': 'financial_risk',
    'hr_comm': 'hr_comm',
    'investment_capital': 'investment_capital',
    'marketing_analytics_insights': 'marketing_analytics_insights',
    'auditing_compliance': 'auditing_compliance',
    'history_archaeology': 'history_archaeology',
    'philosophy_politics': 'philosophy_politics',
    'performing_arts': 'performing_arts',
    'film_media_prod': 'film_media_prod',
    'visual_arts': 'visual_arts',
    'literature_writing': 'literature_writing',
    'creative_media_mgmt': 'creative_media_mgmt',
    'visual_media_design': 'visual_media_design',
    'law_political_studies': 'law_political_studies',
    'pr_event_mgmt': 'pr_event_mgmt',
    'anthropology_culture': 'anthropology_culture',
    'linguistics_comm': 'linguistics_comm',
    'music_performing_arts': 'music_performing_arts',
    'writing_script_dev': 'writing_script_dev',
    'politics_intl_studies': 'politics_intl_studies',
    'social_work_counseling': 'social_work_counseling',
    'digital_media_design': 'digital_media_design',
    'history_archival_research': 'history_archival_research',
    'philosophy_ethics': 'philosophy_ethics',
    'linguistics_lang_studies': 'linguistics_lang_studies',
    'literature_creative_writing': 'literature_creative_writing',
    'social_activism_ngo': 'social_activism_ngo',
    'media_comm_studies': 'media_comm_studies',
    'literature_classical': 'literature_classical',
    'fashion_textile_design': 'fashion_textile_design',
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
  1: [ // Corresponds to IIT Delhi (id: 1)
    {
      id: 1, // Link to a bookable profile in mockMentors
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
      id: 5, 
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
  2: [ // Corresponds to AIIMS Delhi (id: 2)
    {
      id: 2,
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
  3: [ // Corresponds to St. Stephen's College (id: 3)
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
    4: [ // Corresponds to IIM Ahmedabad (id: 4)
    {
      id: 3,
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
  5: [ // Corresponds to NLSIU Bangalore (id: 5)
    {
        id: 4,
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
  6: [ // Corresponds to Christ University (id: 6)
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
    "Arts/Humanities Stream": [
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
  },
  // Academic Resource Library with Top World Institutes
  academicResourceLibrary: {
    "🔬 Science": {
      "Engineering & Technology": [
        { subject: "Engineering", name: "MIT Introduction to Engineering", url: "https://ocw.mit.edu/courses/1-00-introduction-to-computers-and-engineering-problem-solving-spring-2012/" },
        { subject: "Engineering", name: "Stanford Engineering Fundamentals", url: "https://www.edx.org/learn/engineering" }
      ],
      "Computer Science & Software Development": [
        { subject: "Computer Science", name: "Harvard CS50: Introduction to Computer Science", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science" },
        { subject: "Computer Science", name: "MIT Introduction to Computer Science and Programming", url: "https://www.edx.org/course/introduction-to-computer-science-and-programming-using-python" }
      ],
      "Data Science, AI & Analytics": [
        { subject: "Data Science", name: "Harvard Data Science Course", url: "https://pll.harvard.edu/subject/data-science" },
        { subject: "AI", name: "Stanford Machine Learning Course", url: "https://www.coursera.org/learn/machine-learning" }
      ],
      "Mathematics & Statistics": [
        { subject: "Mathematics", name: "MIT Calculus with Single Variable", url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" },
        { subject: "Statistics", name: "Stanford Introduction to Statistics", url: "https://www.coursera.org/learn/stanford-statistics" }
      ],
      "Physical Sciences": [
        { subject: "Physics", name: "MIT Classical Mechanics", url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/" },
        { subject: "Physics", name: "Harvard Introduction to Physics", url: "https://www.edx.org/course/introduction-to-mechanics" }
      ],
      "Chemistry & Chemical Engineering": [
        { subject: "Chemistry", name: "MIT Principles of Chemical Science", url: "https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/" },
        { subject: "Chemistry", name: "Stanford Chemical Engineering", url: "https://www.edx.org/learn/chemical-engineering" }
      ],
      "Biotechnology & Biomedical Sciences": [
        { subject: "Biotechnology", name: "Harvard Biomedical Sciences", url: "https://pll.harvard.edu/subject/life-sciences" },
        { subject: "Biotechnology", name: "MIT Biological Engineering", url: "https://ocw.mit.edu/courses/biological-engineering/" }
      ],
      "Medicine & Healthcare": [
        { subject: "Medicine", name: "Harvard Medical School Courses", url: "https://pll.harvard.edu/subject/health-medicine" },
        { subject: "Healthcare", name: "Stanford AI in Healthcare", url: "https://www.coursera.org/specializations/ai-healthcare" }
      ],
      "Pharmacy & Drug Development": [
        { subject: "Pharmacy", name: "Harvard Pharmacology", url: "https://pll.harvard.edu/subject/health-medicine" },
        { subject: "Drug Development", name: "MIT Drug Discovery", url: "https://ocw.mit.edu/courses/biological-engineering/" }
      ],
      "Earth & Environmental Sciences": [
        { subject: "Earth Sciences", name: "MIT Earth, Atmospheric Science", url: "https://ocw.mit.edu/courses/earth-atmospheric-and-planetary-sciences/" },
        { subject: "Environmental Science", name: "Harvard Environmental Science", url: "https://pll.harvard.edu/subject/environmental-science" }
      ],
      "Marine & Ocean Sciences": [
        { subject: "Marine Science", name: "MIT Ocean Systems", url: "https://ocw.mit.edu/courses/2-611-marine-power-and-propulsion-spring-2019/" },
        { subject: "Oceanography", name: "Harvard Ocean Sciences", url: "https://pll.harvard.edu/subject/environmental-science" }
      ],
      "Space, Aerospace & Robotics": [
        { subject: "Aerospace", name: "MIT Aerospace Engineering", url: "https://ocw.mit.edu/courses/aeronautics-and-astronautics/" },
        { subject: "Robotics", name: "Stanford Robotics Course", url: "https://www.edx.org/learn/robotics" }
      ]
    },
    "💼 Commerce": {
      "Business & Management": [
        { subject: "Business", name: "Harvard Business School Online", url: "https://pll.harvard.edu/subject/business/free" },
        { subject: "Management", name: "Stanford Organizational Leadership", url: "https://www.coursera.org/learn/organizational-analysis" }
      ],
      "Finance, Accounting & Auditing": [
        { subject: "Finance", name: "MIT Finance Theory", url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/" },
        { subject: "Finance", name: "Yale Financial Markets", url: "https://www.coursera.org/learn/financial-markets" }
      ],
      "Banking, Insurance & Financial Services": [
        { subject: "Banking", name: "Harvard Financial Services", url: "https://pll.harvard.edu/subject/business" },
        { subject: "Insurance", name: "MIT Financial Engineering", url: "https://ocw.mit.edu/courses/sloan-school-of-management/" }
      ],
      "Investment, Capital Markets & Risk Management": [
        { subject: "Investment", name: "Yale Investment Management", url: "https://www.coursera.org/learn/financial-markets" },
        { subject: "Risk Management", name: "Stanford Risk Analytics", url: "https://www.coursera.org/learn/financial-risk-management" }
      ],
      "Marketing, Advertising & Brand Strategy": [
        { subject: "Marketing", name: "Harvard Marketing Strategy", url: "https://pll.harvard.edu/subject/business" },
        { subject: "Digital Marketing", name: "MIT Digital Marketing", url: "https://ocw.mit.edu/courses/sloan-school-of-management/" }
      ],
      "Sales, E-Commerce & Digital Business": [
        { subject: "E-Commerce", name: "Stanford Digital Business", url: "https://www.coursera.org/learn/digital-business" },
        { subject: "Sales", name: "Harvard Sales Management", url: "https://pll.harvard.edu/subject/business/free" }
      ],
      "Entrepreneurship & Startups": [
        { subject: "Entrepreneurship", name: "MIT Entrepreneurship Course", url: "https://ocw.mit.edu/courses/15-390-new-enterprises-fall-2013/" },
        { subject: "Startups", name: "Stanford Startup Engineering", url: "https://www.coursera.org/learn/startup-engineering" }
      ],
      "International Business & Trade": [
        { subject: "International Business", name: "Harvard Global Business", url: "https://pll.harvard.edu/subject/business" },
        { subject: "Trade", name: "MIT International Trade", url: "https://ocw.mit.edu/courses/14-581-international-economics-i-spring-2013/" }
      ],
      "Supply Chain, Logistics & Operations": [
        { subject: "Supply Chain", name: "MIT Supply Chain Analytics", url: "https://www.edx.org/course/supply-chain-analytics" },
        { subject: "Operations", name: "Stanford Operations Management", url: "https://www.coursera.org/learn/operations-management" }
      ],
      "Tourism, Hospitality & Event Management": [
        { subject: "Tourism", name: "Harvard Tourism Management", url: "https://pll.harvard.edu/subject/business" },
        { subject: "Hospitality", name: "Cornell Hotel Management", url: "https://www.edx.org/school/cornellx" }
      ],
      "Law, Corporate Governance & Compliance": [
        { subject: "Law", name: "Harvard Law School Free Courses", url: "https://pll.harvard.edu/subject/law" },
        { subject: "Corporate Law", name: "Yale Corporate Finance Law", url: "https://www.coursera.org/learn/corporate-finance-law" }
      ],
      "Real Estate, Retail & Consumer Business": [
        { subject: "Real Estate", name: "MIT Real Estate Finance", url: "https://ocw.mit.edu/courses/urban-studies-and-planning/" },
        { subject: "Retail", name: "Harvard Retail Strategy", url: "https://pll.harvard.edu/subject/business/free" }
      ]
    },
    "🎭 Arts": {
      "Political Science, Public Policy & International Relations": [
        { subject: "Political Science", name: "Harvard Government Courses", url: "https://pll.harvard.edu/subject/government" },
        { subject: "International Relations", name: "MIT International Relations", url: "https://ocw.mit.edu/courses/political-science/" }
      ],
      "History, Archaeology & Heritage Studies": [
        { subject: "History", name: "Harvard Ancient History", url: "https://pll.harvard.edu/subject/history" },
        { subject: "History", name: "Yale History Courses", url: "https://www.edx.org/school/yalex" }
      ],
      "Philosophy, Ethics & Religion Studies": [
        { subject: "Philosophy", name: "Harvard Philosophy Courses", url: "https://pll.harvard.edu/subject/philosophy-religion" },
        { subject: "Ethics", name: "MIT Ethics in Science", url: "https://ocw.mit.edu/courses/philosophy/" }
      ],
      "Sociology, Anthropology & Culture Studies": [
        { subject: "Sociology", name: "Harvard Sociology", url: "https://pll.harvard.edu/subject/social-sciences" },
        { subject: "Anthropology", name: "MIT Cultural Studies", url: "https://ocw.mit.edu/courses/anthropology/" }
      ],
      "Psychology, Counseling & Human Behavior": [
        { subject: "Psychology", name: "Harvard Psychology Courses", url: "https://pll.harvard.edu/subject/psychology" },
        { subject: "Behavioral Science", name: "Stanford Behavioral Economics", url: "https://www.coursera.org/learn/behavioral-economics" }
      ],
      "Literature, Creative Writing & Languages": [
        { subject: "Literature", name: "Harvard Literature Courses", url: "https://pll.harvard.edu/subject/literature" },
        { subject: "Writing", name: "MIT Writing Courses", url: "https://ocw.mit.edu/courses/writing-and-humanistic-studies/" }
      ],
      "Media, Journalism & Communication Studies": [
        { subject: "Media Studies", name: "Harvard Media Courses", url: "https://pll.harvard.edu/subject/media" },
        { subject: "Communication", name: "Stanford Communication", url: "https://www.edx.org/learn/communication" }
      ],
      "Film, Theatre & Performing Arts": [
        { subject: "Film Studies", name: "Harvard Film Courses", url: "https://pll.harvard.edu/subject/arts" },
        { subject: "Theatre", name: "MIT Theatre Arts", url: "https://ocw.mit.edu/courses/music-and-theater-arts/" }
      ],
      "Visual Arts, Design & Fashion": [
        { subject: "Visual Arts", name: "Harvard Art History", url: "https://pll.harvard.edu/subject/arts" },
        { subject: "Design", name: "MIT Design Courses", url: "https://ocw.mit.edu/courses/architecture/" }
      ],
      "Music, Dance & Fine Arts": [
        { subject: "Music", name: "Harvard Music Courses", url: "https://pll.harvard.edu/subject/arts" },
        { subject: "Music Theory", name: "Yale Music Theory", url: "https://www.coursera.org/learn/music-theory" }
      ],
      "Social Work, NGO & Activism": [
        { subject: "Social Work", name: "Harvard Social Work", url: "https://pll.harvard.edu/subject/social-sciences" },
        { subject: "Public Service", name: "MIT Public Service", url: "https://ocw.mit.edu/courses/urban-studies-and-planning/" }
      ],
      "Education, Teaching & Learning Sciences": [
        { subject: "Education", name: "Harvard Education Courses", url: "https://pll.harvard.edu/subject/education" },
        { subject: "Teaching", name: "MIT Teaching Methods", url: "https://ocw.mit.edu/courses/education/" }
      ]
    },
    "🚀 Unconventional": {
      "Gaming & Esports (Competitive)": [
        { subject: "Game Theory", name: "Stanford Game Theory", url: "https://www.coursera.org/learn/game-theory-1" },
        { subject: "Gaming", name: "MIT Game Design", url: "https://ocw.mit.edu/courses/cms-611j-creating-video-games-fall-2014/" }
      ],
      "Gaming & Esports (Creative)": [
        { subject: "Game Development", name: "Harvard Game Development", url: "https://pll.harvard.edu/course/cs50s-introduction-game-development" },
        { subject: "Interactive Media", name: "MIT Interactive Media", url: "https://ocw.mit.edu/courses/comparative-media-studies-writing/" }
      ],
      "Aviation & Drone Operations": [
        { subject: "Aviation", name: "MIT Aerospace Systems", url: "https://ocw.mit.edu/courses/aeronautics-and-astronautics/" },
        { subject: "Drones", name: "Stanford Autonomous Systems", url: "https://www.edx.org/learn/autonomous-systems" }
      ],
      "Culinary Arts & Gastronomy": [
        { subject: "Food Science", name: "Harvard Food Science", url: "https://pll.harvard.edu/course/introduction-food-and-health" },
        { subject: "Nutrition", name: "Stanford Food and Health", url: "https://www.coursera.org/learn/food-and-health" }
      ],
      "Creative Technology (VR/AR)": [
        { subject: "Virtual Reality", name: "Stanford VR Development", url: "https://www.edx.org/learn/virtual-reality" },
        { subject: "Augmented Reality", name: "MIT AR Technology", url: "https://ocw.mit.edu/courses/media-arts-and-sciences/" }
      ],
      "Creative Technology (UX/UI)": [
        { subject: "UX Design", name: "Harvard UX Design", url: "https://pll.harvard.edu/course/introduction-digital-humanities" },
        { subject: "Human-Computer Interaction", name: "Stanford HCI", url: "https://www.coursera.org/specializations/human-computer-interaction" }
      ],
      "Content Creation & Digital Media": [
        { subject: "Digital Media", name: "MIT Digital Media", url: "https://ocw.mit.edu/courses/comparative-media-studies-writing/" },
        { subject: "Content Strategy", name: "Harvard Digital Strategy", url: "https://pll.harvard.edu/subject/media" }
      ],
      "Public Service & Civil Services": [
        { subject: "Public Administration", name: "Harvard Kennedy School", url: "https://pll.harvard.edu/subject/government" },
        { subject: "Policy Analysis", name: "MIT Policy Research", url: "https://ocw.mit.edu/courses/urban-studies-and-planning/" }
      ],
      "Wellness (Physical Fitness)": [
        { subject: "Exercise Science", name: "Harvard Health Science", url: "https://pll.harvard.edu/subject/health-medicine" },
        { subject: "Sports Medicine", name: "Stanford Sports Science", url: "https://www.edx.org/learn/sports-science" }
      ],
      "Wellness (Mindfulness)": [
        { subject: "Mindfulness", name: "Harvard Mindfulness Course", url: "https://pll.harvard.edu/course/de-mystifying-mindfulness" },
        { subject: "Mental Health", name: "Yale Psychology of Well-Being", url: "https://www.coursera.org/learn/the-science-of-well-being" }
      ],
      "Niche Event Management": [
        { subject: "Event Planning", name: "Cornell Event Management", url: "https://www.edx.org/school/cornellx" },
        { subject: "Project Management", name: "MIT Project Management", url: "https://ocw.mit.edu/courses/engineering-systems-division/" }
      ],
      "Cybersecurity": [
        { subject: "Cybersecurity", name: "Harvard Cybersecurity", url: "https://pll.harvard.edu/course/cybersecurity-managing-risk-information-age" },
        { subject: "Information Security", name: "MIT Cybersecurity", url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/" }
      ]
    }
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
// ... after the mockScholarships array

// --- [START] PASTE THE FULL skillsData BLOCK HERE ---
const skillsData = [
  {
    field: '🔬 Science',
    subsections: [
      {
        name: 'Engineering & Technology',
        skills: [
          {
            title: 'Problem-solving → NPTEL Engineering Courses',
            description: 'Comprehensive engineering fundamentals and problem-solving techniques',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Technical design → edX Engineering (Free)',
            description: 'Free engineering courses covering design principles and technical skills',
            link: 'https://www.edx.org/learn/engineering'
          }
        ]
      },
      {
        name: 'Computer Science & Software Development',
        skills: [
          {
            title: 'Programming → NPTEL Programming in C',
            description: 'Learn C programming fundamentals and best practices',
            link: 'https://onlinecourses.nptel.ac.in/noc25_cs119/preview'
          },
          {
            title: 'Algorithmic thinking → Coursera Python for Everybody (Free Audit)',
            description: 'Master Python programming and algorithmic problem solving',
            link: 'https://www.coursera.org/specializations/python'
          }
        ]
      },
      {
        name: 'Data Science, AI & Analytics',
        skills: [
          {
            title: 'Statistical analysis → edX Introduction to Data Science',
            description: 'Foundations of data analysis and statistical methods',
            link: 'https://www.edx.org/learn/data-science'
          },
          {
            title: 'Machine learning → Coursera Machine Learning Course (Free Audit)',
            description: 'Comprehensive machine learning algorithms and applications',
            link: 'https://www.coursera.org/learn/machine-learning'
          }
        ]
      },
      {
        name: 'Mathematics & Statistics',
        skills: [
          {
            title: 'Logical reasoning → NPTEL Statistics Course',
            description: 'Statistical reasoning and mathematical logic fundamentals',
            link: 'https://onlinecourses.nptel.ac.in/noc24_ma30/preview'
          },
          {
            title: 'Quantitative modeling → edX Introduction to Statistics',
            description: 'Statistical modeling and quantitative analysis techniques',
            link: 'https://www.edx.org/learn/statistics'
          }
        ]
      },
      {
        name: 'Physical Sciences',
        skills: [
          {
            title: 'Experimentation → NPTEL Physics Courses',
            description: 'Physics experiments and scientific methodology',
            link: 'https://archive.nptel.ac.in/'
          },
          {
            title: 'Analytical measurement → edX Physics Courses',
            description: 'Physics concepts and analytical measurement techniques',
            link: 'https://www.edx.org/learn/physics'
          }
        ]
      },
      {
        name: 'Chemistry & Chemical Engineering',
        skills: [
          {
            title: 'Laboratory techniques → NPTEL Chemistry',
            description: 'Chemical laboratory skills and experimental techniques',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Process optimization → edX Chemistry Courses',
            description: 'Chemical processes and optimization methods',
            link: 'https://www.edx.org/learn/chemistry'
          }
        ]
      },
      {
        name: 'Biotechnology & Biomedical Sciences',
        skills: [
          {
            title: 'Molecular biology → NPTEL Biotechnology',
            description: 'Biotechnology fundamentals and molecular biology techniques',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Research methods → edX Biology Courses',
            description: 'Biological research methodologies and scientific approaches',
            link: 'https://www.edx.org/learn/biology'
          }
        ]
      },
      {
        name: 'Medicine & Healthcare',
        skills: [
          {
            title: 'Clinical knowledge → edX Health & Medicine',
            description: 'Medical knowledge and healthcare fundamentals',
            link: 'https://www.edx.org/learn/health'
          },
          {
            title: 'Patient care → Coursera Healthcare Courses (Free Audit)',
            description: 'Patient care principles and healthcare management',
            link: 'https://www.coursera.org/browse/health'
          }
        ]
      },
      {
        name: 'Pharmacy & Drug Development',
        skills: [
          {
            title: 'Pharmacology → edX Pharmacology',
            description: 'Drug mechanisms and pharmacological principles',
            link: 'https://www.edx.org/learn/pharmacology'
          },
          {
            title: 'Regulatory compliance → Coursera Drug Development (Free Audit)',
            description: 'Drug development processes and regulatory requirements',
            link: 'https://www.coursera.org/browse/health/healthcare-management'
          }
        ]
      },
      {
        name: 'Earth & Environmental Sciences',
        skills: [
          {
            title: 'Field research → NPTEL Environmental',
            description: 'Environmental research methods and field studies',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Environmental modeling → edX Environmental Studies',
            description: 'Environmental modeling and sustainability concepts',
            link: 'https://www.edx.org/learn/environmental-studies'
          }
        ]
      },
      {
        name: 'Marine & Ocean Sciences',
        skills: [
          {
            title: 'Oceanography → edX Marine Biology',
            description: 'Marine ecosystems and oceanographic principles',
            link: 'https://www.edx.org/learn/marine-biology'
          },
          {
            title: 'Navigation/fieldwork skills → Coursera Oceanography (Free Audit)',
            description: 'Marine navigation and oceanographic fieldwork techniques',
            link: 'https://www.coursera.org/browse/physical-science-and-engineering/environmental-science-and-sustainability'
          }
        ]
      },
      {
        name: 'Space, Aerospace & Robotics',
        skills: [
          {
            title: 'Systems engineering → NPTEL Aerospace',
            description: 'Aerospace systems and engineering principles',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Robotics/mechatronics → edX Robotics',
            description: 'Robotics design and mechatronic systems',
            link: 'https://www.edx.org/learn/robotics'
          }
        ]
      }
    ]
  },
  {
    field: '💼 Commerce',
    subsections: [
      {
        name: 'Business & Management',
        skills: [
          {
            title: 'Strategic planning → Coursera Business Strategy (Free Audit)',
            description: 'Business strategy formulation and strategic planning',
            link: 'https://www.coursera.org/learn/business-strategy'
          },
          {
            title: 'Leadership → edX Leadership Courses',
            description: 'Leadership skills and management principles',
            link: 'https://www.edx.org/learn/leadership'
          }
        ]
      },
      {
        name: 'Finance, Accounting & Auditing',
        skills: [
          {
            title: 'Financial analysis → Coursera Financial Markets (Free Audit)',
            description: 'Financial market analysis and investment principles',
            link: 'https://www.coursera.org/learn/financial-markets'
          },
          {
            title: 'Risk assessment → edX Finance Courses',
            description: 'Financial risk management and assessment techniques',
            link: 'https://www.edx.org/learn/finance'
          }
        ]
      },
      {
        name: 'Banking, Insurance & Financial Services',
        skills: [
          {
            title: 'Customer relations → Coursera Customer Service (Free Audit)',
            description: 'Customer service excellence and relationship management',
            link: 'https://www.coursera.org/learn/customer-service-fundamentals'
          },
          {
            title: 'Compliance → edX Financial Regulation',
            description: 'Financial regulations and compliance frameworks',
            link: 'https://www.edx.org/learn/finance'
          }
        ]
      },
      {
        name: 'Investment, Capital Markets & Risk Management',
        skills: [
          {
            title: 'Portfolio management → Coursera Investment Management (Free Audit)',
            description: 'Investment portfolio construction and management',
            link: 'https://www.coursera.org/specializations/investment-management'
          },
          {
            title: 'Market analysis → edX Financial Analysis',
            description: 'Financial market analysis and valuation methods',
            link: 'https://www.edx.org/learn/financial-analysis'
          }
        ]
      },
      {
        name: 'Marketing, Advertising & Brand Strategy',
        skills: [
          {
            title: 'Market research → Coursera Market Research (Free Audit)',
            description: 'Market research methodologies and consumer insights',
            link: 'https://www.coursera.org/learn/market-research'
          },
          {
            title: 'Creative communication → edX Digital Marketing',
            description: 'Digital marketing strategies and creative communication',
            link: 'https://www.edx.org/learn/digital-marketing'
          }
        ]
      },
      {
        name: 'Sales, E-Commerce & Digital Business',
        skills: [
          {
            title: 'Negotiation → Coursera Negotiation (Free Audit)',
            description: 'Negotiation strategies and sales techniques',
            link: 'https://www.coursera.org/learn/negotiation'
          },
          {
            title: 'Digital marketing → edX E-commerce',
            description: 'E-commerce platforms and digital business models',
            link: 'https://www.edx.org/learn/e-commerce'
          }
        ]
      },
      {
        name: 'Entrepreneurship & Startups',
        skills: [
          {
            title: 'Innovation → Coursera Entrepreneurship (Free Audit)',
            description: 'Innovation processes and entrepreneurial thinking',
            link: 'https://www.coursera.org/specializations/entrepreneurship'
          },
          {
            title: 'Business planning → edX Entrepreneurship',
            description: 'Business plan development and startup fundamentals',
            link: 'https://www.edx.org/learn/entrepreneurship'
          }
        ]
      },
      {
        name: 'International Business & Trade',
        skills: [
          {
            title: 'Cross-cultural communication → Coursera Intercultural Communication (Free Audit)',
            description: 'Cross-cultural business communication and global practices',
            link: 'https://www.coursera.org/learn/intercultural-communication'
          },
          {
            title: 'Global economics → edX International Economics',
            description: 'International economics and global trade principles',
            link: 'https://www.edx.org/learn/economics'
          }
        ]
      },
      {
        name: 'Supply Chain, Logistics & Operations',
        skills: [
          {
            title: 'Inventory management → Coursera Supply Chain (Free Audit)',
            description: 'Supply chain optimization and inventory management',
            link: 'https://www.coursera.org/specializations/supply-chain-management'
          },
          {
            title: 'Process optimization → edX Operations Management',
            description: 'Operations management and process improvement',
            link: 'https://www.edx.org/learn/operations-management'
          }
        ]
      },
      {
        name: 'Tourism, Hospitality & Event Management',
        skills: [
          {
            title: 'Customer service → Coursera Hospitality (Free Audit)',
            description: 'Hospitality management and customer service excellence',
            link: 'https://www.coursera.org/browse/business/hospitality'
          },
          {
            title: 'Event coordination → edX Event Management',
            description: 'Event planning and coordination strategies',
            link: 'https://www.edx.org/learn/event-planning'
          }
        ]
      },
      {
        name: 'Law, Corporate Governance & Compliance',
        skills: [
          {
            title: 'Legal research → Coursera Law Courses (Free Audit)',
            description: 'Legal research methods and jurisprudence',
            link: 'https://www.coursera.org/browse/social-sciences/law'
          },
          {
            title: 'Policy interpretation → edX Law Courses',
            description: 'Legal policy analysis and interpretation',
            link: 'https://www.edx.org/learn/law'
          }
        ]
      },
      {
        name: 'Real Estate, Retail & Consumer Business',
        skills: [
          {
            title: 'Negotiation → Coursera Real Estate (Free Audit)',
            description: 'Real estate negotiation and market analysis',
            link: 'https://www.coursera.org/learn/real-estate'
          },
          {
            title: 'Market evaluation → edX Real Estate Finance',
            description: 'Real estate finance and market evaluation techniques',
            link: 'https://www.edx.org/learn/real-estate'
          }
        ]
      }
    ]
  },
  {
    field: '🎭 Arts',
    subsections: [
      {
        name: 'Political Science, Public Policy & International Relations',
        skills: [
          {
            title: 'Policy analysis → Coursera Public Policy (Free Audit)',
            description: 'Public policy analysis and governance principles',
            link: 'https://www.coursera.org/browse/social-sciences/governance-and-society'
          },
          {
            title: 'Diplomacy → edX International Relations',
            description: 'International relations and diplomatic strategies',
            link: 'https://www.edx.org/learn/international-relations'
          }
        ]
      },
      {
        name: 'History, Archaeology & Heritage Studies',
        skills: [
          {
            title: 'Archival research → Coursera History Courses (Free Audit)',
            description: 'Historical research methods and archival techniques',
            link: 'https://www.coursera.org/browse/arts-and-humanities/history'
          },
          {
            title: 'Critical analysis → edX History Courses',
            description: 'Critical historical analysis and interpretation',
            link: 'https://www.edx.org/learn/history'
          }
        ]
      },
      {
        name: 'Philosophy, Ethics & Religion Studies',
        skills: [
          {
            title: 'Ethical reasoning → Coursera Philosophy (Free Audit)',
            description: 'Ethical reasoning and philosophical argumentation',
            link: 'https://www.coursera.org/browse/arts-and-humanities/philosophy'
          },
          {
            title: 'Argumentation → edX Philosophy',
            description: 'Logical argumentation and philosophical discourse',
            link: 'https://www.edx.org/learn/philosophy'
          }
        ]
      },
      {
        name: 'Sociology, Anthropology & Culture Studies',
        skills: [
          {
            title: 'Fieldwork → Coursera Anthropology (Free Audit)',
            description: 'Anthropological fieldwork and research methods',
            link: 'https://www.coursera.org/browse/social-sciences/sociology'
          },
          {
            title: 'Cultural analysis → edX Sociology',
            description: 'Sociological analysis and cultural studies',
            link: 'https://www.edx.org/learn/sociology'
          }
        ]
      },
      {
        name: 'Psychology, Counseling & Human Behavior',
        skills: [
          {
            title: 'Empathy → Coursera Psychology (Free Audit)',
            description: 'Psychology fundamentals and empathetic understanding',
            link: 'https://www.coursera.org/browse/social-sciences/psychology'
          },
          {
            title: 'Behavioral assessment → edX Psychology',
            description: 'Behavioral assessment and psychological evaluation',
            link: 'https://www.edx.org/learn/psychology'
          }
        ]
      },
      {
        name: 'Literature, Creative Writing & Languages',
        skills: [
          {
            title: 'Writing skills → Coursera Creative Writing (Free Audit)',
            description: 'Creative writing techniques and literary composition',
            link: 'https://www.coursera.org/specializations/creative-writing'
          },
          {
            title: 'Literary analysis → edX Literature',
            description: 'Literary analysis and critical interpretation',
            link: 'https://www.edx.org/learn/literature'
          }
        ]
      },
      {
        name: 'Media, Journalism & Communication Studies',
        skills: [
          {
            title: 'Storytelling → Coursera Journalism (Free Audit)',
            description: 'Journalistic storytelling and media communication',
            link: 'https://www.coursera.org/browse/arts-and-humanities/music-and-art'
          },
          {
            title: 'Investigative research → edX Communication',
            description: 'Communication strategies and investigative journalism',
            link: 'https://www.edx.org/learn/communication'
          }
        ]
      },
      {
        name: 'Film, Theatre & Performing Arts',
        skills: [
          {
            title: 'Performance → Coursera Music & Arts (Free Audit)',
            description: 'Performance arts and creative expression',
            link: 'https://www.coursera.org/browse/arts-and-humanities/music-and-art'
          },
          {
            title: 'Direction/production → edX Film Studies',
            description: 'Film production and directorial techniques',
            link: 'https://www.edx.org/learn/film'
          }
        ]
      },
      {
        name: 'Visual Arts, Design & Fashion',
        skills: [
          {
            title: 'Creativity → Coursera Graphic Design (Free Audit)',
            description: 'Graphic design principles and creative development',
            link: 'https://www.coursera.org/specializations/graphic-design'
          },
          {
            title: 'Aesthetic design → edX Design',
            description: 'Design aesthetics and visual communication',
            link: 'https://www.edx.org/learn/design'
          }
        ]
      },
      {
        name: 'Music, Dance & Fine Arts',
        skills: [
          {
            title: 'Musical proficiency → Coursera Music Theory (Free Audit)',
            description: 'Music theory and musical composition',
            link: 'https://www.coursera.org/learn/edinburgh-music-theory'
          },
          {
            title: 'Choreography/artistic expression → edX Music',
            description: 'Musical performance and artistic expression',
            link: 'https://www.edx.org/learn/music'
          }
        ]
      },
      {
        name: 'Social Work, NGO & Activism',
        skills: [
          {
            title: 'Advocacy → Coursera Social Work (Free Audit)',
            description: 'Social advocacy and community engagement',
            link: 'https://www.coursera.org/browse/social-sciences/social-work'
          },
          {
            title: 'Case management → edX Social Sciences',
            description: 'Social work case management and intervention',
            link: 'https://www.edx.org/learn/social-sciences'
          }
        ]
      },
      {
        name: 'Education, Teaching & Learning Sciences',
        skills: [
          {
            title: 'Pedagogy → Coursera Teaching (Free Audit)',
            description: 'Teaching methodologies and pedagogical approaches',
            link: 'https://www.coursera.org/browse/social-sciences/education'
          },
          {
            title: 'Curriculum design → edX Education',
            description: 'Educational curriculum development and design',
            link: 'https://www.edx.org/learn/education'
          }
        ]
      }
    ]
  },
  {
    field: '🚀 Unconventional',
    subsections: [
      {
        name: 'Gaming & Esports (Competitive)',
        skills: [
          {
            title: 'Reflexes/hand-eye coordination → Coursera Game Design (Free Audit)',
            description: 'Game design fundamentals and competitive gaming skills',
            link: 'https://www.coursera.org/specializations/game-design'
          },
          {
            title: 'Team strategy → edX Game Development',
            description: 'Game development and strategic team coordination',
            link: 'https://www.edx.org/learn/game-development'
          }
        ]
      },
      {
        name: 'Gaming & Esports (Creative)',
        skills: [
          {
            title: 'Game design → Coursera Game Development (Free Audit)',
            description: 'Creative game development and design principles',
            link: 'https://www.coursera.org/specializations/game-development'
          },
          {
            title: 'Storyboarding → edX Interactive Media',
            description: 'Interactive media design and storyboarding techniques',
            link: 'https://www.edx.org/learn/multimedia'
          }
        ]
      },
      {
        name: 'Aviation & Drone Operations',
        skills: [
          {
            title: 'Navigation → NPTEL Aerospace Engineering',
            description: 'Aerospace navigation and flight systems',
            link: 'https://onlinecourses.nptel.ac.in/'
          },
          {
            title: 'Safety regulations → edX Aviation',
            description: 'Aviation safety protocols and regulatory compliance',
            link: 'https://www.edx.org/learn/aviation'
          }
        ]
      },
      {
        name: 'Culinary Arts & Gastronomy',
        skills: [
          {
            title: 'Cooking techniques → Coursera Food & Nutrition (Free Audit)',
            description: 'Culinary techniques and food science principles',
            link: 'https://www.coursera.org/browse/health/nutrition'
          },
          {
            title: 'Creativity in presentation → edX Food Science',
            description: 'Food presentation and culinary creativity',
            link: 'https://www.edx.org/learn/food-science'
          }
        ]
      },
      {
        name: 'Creative Technology (VR/AR)',
        skills: [
          {
            title: '3D modeling → Coursera Computer Graphics (Free Audit)',
            description: 'Computer graphics and 3D modeling techniques',
            link: 'https://www.coursera.org/learn/computer-graphics'
          },
          {
            title: 'Immersive design → edX Virtual Reality',
            description: 'Virtual reality design and immersive experiences',
            link: 'https://www.edx.org/learn/virtual-reality'
          }
        ]
      },
      {
        name: 'Creative Technology (UX/UI)',
        skills: [
          {
            title: 'User research → Coursera UX Design (Free Audit)',
            description: 'User experience research and design thinking',
            link: 'https://www.coursera.org/professional-certificates/google-ux-design'
          },
          {
            title: 'Interface design → edX User Experience',
            description: 'User interface design and interaction principles',
            link: 'https://www.edx.org/learn/user-experience-ux'
          }
        ]
      },
      {
        name: 'Content Creation & Digital Media',
        skills: [
          {
            title: 'Video editing → Coursera Digital Media (Free Audit)',
            description: 'Digital media production and video editing',
            link: 'https://www.coursera.org/browse/arts-and-humanities/music-and-art'
          },
          {
            title: 'Social media strategy → edX Social Media',
            description: 'Social media marketing and content strategy',
            link: 'https://www.edx.org/learn/social-media'
          }
        ]
      },
      {
        name: 'Public Service & Civil Services',
        skills: [
          {
            title: 'Administrative skills → Coursera Public Administration (Free Audit)',
            description: 'Public administration and governance principles',
            link: 'https://www.coursera.org/browse/social-sciences/governance-and-society'
          },
          {
            title: 'Policy knowledge → edX Public Policy',
            description: 'Public policy analysis and implementation',
            link: 'https://www.edx.org/learn/public-policy'
          }
        ]
      },
      {
        name: 'Wellness (Physical Fitness)',
        skills: [
          {
            title: 'Training methods → Coursera Exercise Science (Free Audit)',
            description: 'Exercise science and fitness training methodologies',
            link: 'https://www.coursera.org/browse/health/nutrition'
          },
          {
            title: 'Coaching → edX Health & Fitness',
            description: 'Health coaching and fitness program development',
            link: 'https://www.edx.org/learn/health'
          }
        ]
      },
      {
        name: 'Wellness (Mindfulness)',
        skills: [
          {
            title: 'Meditation techniques → Coursera The Science of Well-Being (Free Audit)',
            description: 'Mindfulness practices and well-being science',
            link: 'https://www.coursera.org/learn/the-science-of-well-being'
          },
          {
            title: 'Stress management → edX Psychology of Happiness',
            description: 'Stress management and psychological well-being',
            link: 'https://www.edx.org/learn/psychology'
          }
        ]
      },
      {
        name: 'Niche Event Management',
        skills: [
          {
            title: 'Event planning → Coursera Event Management (Free Audit)',
            description: 'Specialized event planning and management',
            link: 'https://www.coursera.org/browse/business/hospitality'
          },
          {
            title: 'Coordination → edX Project Management',
            description: 'Project coordination and event execution',
            link: 'https://www.edx.org/learn/project-management'
          }
        ]
      },
      {
        name: 'Cybersecurity',
        skills: [
          {
            title: 'Network security → NPTEL Cyber Security',
            description: 'Network security fundamentals and cyber defense',
            link: 'https://onlinecourses.nptel.ac.in/noc25_cs116/preview'
          },
          {
            title: 'Threat analysis → edX Cybersecurity',
            description: 'Cybersecurity threat analysis and risk management',
            link: 'https://www.edx.org/learn/cybersecurity'
          }
        ]
      }
    ]
  }
];
// --- [END] PASTE THIS BLOCK ---

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

// --- AUTHENTICATION CONTEXT ---
// Manages user state throughout the application.

// In src/app.jsx

// --- PASTE THIS ENTIRE CORRECTED COMPONENT ---
// --- PASTE THIS ENTIRE BLOCK INTO app.jsx ---



// --- PASTE THIS ENTIRE BLOCK INTO app.jsx to replace the broken Auth section ---

// File: src/app.jsx

// --- PASTE THIS ENTIRE REPLACEMENT FOR YOUR AuthProvider ---

// --- PASTE THIS ENTIRE REPLACEMENT FOR YOUR AuthProvider in src/app.jsx ---

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // On page load, we must fetch fresh user data
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    // Token is invalid or expired, so remove it
                    localStorage.removeItem('token');
                    console.error("Could not load user from token:", err.response?.data?.msg || err.message);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const setAuthData = (data) => {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setError(null);
        return true;
    };

    const login = async (credentials) => {
        setError(null);
        try {
            const res = await api.post('/auth/login', credentials);
            return setAuthData(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed.');
            return false;
        }
    };

    const signup = async (userData) => {
        setError(null);
        try {
            await api.post('/auth/register', userData);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Sign up failed.');
            return false;
        }
    };

    const verifyOtp = async (verificationData) => {
        setError(null);
        try {
            const res = await api.post('/auth/verify', verificationData);
            return setAuthData(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'OTP verification failed.');
            return false;
        }
    };

    const googleLogin = async (credentialResponse) => {
        setError(null);
        try {
            const res = await api.post('/auth/google', { 
                credential: credentialResponse.credential 
            });
            return setAuthData(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Google login failed.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };
    
    const updateUserProfile = async (updatedData) => {
        if (!user) return;
        try {
            const res = await api.put('/user/profile', updatedData);
            setUser(res.data); // Update state with the response
        } catch (err) {
            console.error('Failed to update profile:', err.response?.data?.msg || err.message);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            error, 
            setError, 
            loading, 
            login, 
            logout, 
            signup, 
            verifyOtp, 
            googleLogin, 
            updateUserProfile 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// --- END OF REPLACEMENT BLOCK ---

// --- END OF REPLACEMENT BLOCK ---

// --- END OF THE BLOCK TO PASTE ---






// --- NEW DATA CONTEXT ---
// Manages shared application data like mentor reviews.

// --- DATA CONTEXT (For non-user specific mock data) ---

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [collegeMentors, setCollegeMentors] = useState(mockCollegeMentors);

    const addMentorReview = (reviewData) => {
        // ... (This function's logic remains unchanged)
        const college = mockColleges.find(c => c.name.toLowerCase() === reviewData.college.toLowerCase());
        if (!college) {
            console.error("College not found:", reviewData.college);
            alert("Sorry, we couldn't find that college in our database.");
            return false;
        }
        const newMentorReview = {
            id: mockMentors.length + 1,
            name: reviewData.name,
            status: reviewData.academicYear === 'Pass Out' ? `Alumnus` : `${reviewData.academicYear} Year Student`,
            branch: reviewData.qualifications,
            qualifications: reviewData.job ? `Working as a ${reviewData.job}.` : 'Currently pursuing higher studies.',
            achievements: `CGPA: ${reviewData.cgpa}`,
            reviewType: 'positive',
            reviewTitle: reviewData.reviewTitle,
            reviewText: reviewData.reviewText,
            image: `https://i.pravatar.cc/150?u=${reviewData.name.replace(/\s+/g, '')}`
        };
        const newMentorProfile = {
            id: newMentorReview.id,
            name: reviewData.name,
            college: reviewData.college,
            field: reviewData.qualifications,
            rating: 5.0,
            reviews: 1,
            image: newMentorReview.image,
            availability: {
                days: reviewData.availability.days,
                time: reviewData.availability.time
            }
        };
        mockMentors.push(newMentorProfile);
        setCollegeMentors(prevMentors => {
            const updatedMentors = { ...prevMentors };
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
    onClick={onClick}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`
      bg-gray-900
      rounded-lg
      border
      border-gray-800
      overflow-hidden
      transition-all
      duration-300
      hover:shadow-xl
      hover:shadow-teal-900/20
      hover:border-teal-800
      w-full
      p-4
      sm:p-6
      ${className}
    `}
  >
    {children}
  </motion.div>
);




const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  animate,
  transition,
  type = 'button'
}) => {
  // Base styles now adjust padding/gap for mobile vs desktop
  const baseClasses = [
    'font-semibold',
    'rounded-md',
    'transition-all',
    'duration-300',
    'flex',
    'items-center',
    'justify-center',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-gray-950',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    'disabled:bg-gray-700',
    'disabled:text-gray-500',
    // Mobile padding
    'px-4',
    'py-2',
    'gap-1',
    // Tablet and up
    'sm:px-6',
    'sm:py-3',
    'sm:gap-2'
  ].join(' ');

  const variants = {
    primary: [
      'bg-teal-600',
      'text-white',
      'hover:bg-teal-500',
      'focus-visible:ring-teal-500',
      'shadow-lg',
      'shadow-teal-900/20',
      'hover:shadow-teal-800/40'
    ].join(' '),
    secondary: [
      'bg-gray-800',
      'text-gray-200',
      'border',
      'border-gray-700',
      'hover:bg-gray-700',
      'hover:border-gray-600',
      'focus-visible:ring-gray-500'
    ].join(' '),
    outline: [
      'border',
      'border-teal-500',
      'text-teal-500',
      'hover:bg-teal-500',
      'hover:text-white',
      'focus-visible:ring-teal-500'
    ].join(' ')
  };

  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={animate}
      transition={transition}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40"
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-teal-500 cursor-pointer flex items-center gap-3"
          onClick={() => setPage('home')}
        >
          <LogoIcon /> NextStepGuide
        </motion.div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavItem onClick={() => setPage('home')}>Home</NavItem>
          <NavItem onClick={() => setPage('pathways')}>Pathways</NavItem>
          <NavItem onClick={() => setPage('colleges')}>Colleges</NavItem>
          <NavItem onClick={() => setPage('mentors')}>Mentors</NavItem>
          <NavItem onClick={() => setPage('scholarships')}>Scholarships</NavItem>
          <NavItem onClick={() => setPage('ebooks')}>eBooks</NavItem>
          <NavItem onClick={() => setPage('skills')}>Skills</NavItem> 
        </div>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* --> PLACE IT HERE FOR DESKTOP VIEW <-- */}
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <>
              <span className="font-semibold text-gray-300">Welcome, {user.name}!</span>
              <Button onClick={() => setPage('dashboard')} variant="outline">
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  logout();
                  setPage('home');
                }}
                variant="secondary"
              >
                <LogOutIcon />
              </Button>
            </>
          ) : (
            <Button onClick={() => setPage('login')}>
              Login <LogInIcon className="w-5 h-5 inline-block ml-1" />
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950/90 backdrop-blur-md border-t border-gray-800">
          <nav className="flex flex-col py-4 px-4 space-y-2">
            <NavItem onClick={() => { setPage('home'); setMobileOpen(false); }}>Home</NavItem>
            <NavItem onClick={() => { setPage('pathways'); setMobileOpen(false); }}>Pathways</NavItem>
            <NavItem onClick={() => { setPage('colleges'); setMobileOpen(false); }}>Colleges</NavItem>
            <NavItem onClick={() => { setPage('mentors'); setMobileOpen(false); }}>Mentors</NavItem>
            <NavItem onClick={() => { setPage('scholarships'); setMobileOpen(false); }}>Scholarships</NavItem>
            <NavItem onClick={() => { setPage('ebooks'); setMobileOpen(false); }}>eBooks</NavItem>
            <div className="border-t border-gray-800 mt-2 pt-4 flex flex-col items-center space-y-4">
              
              {/* --> PLACE IT HERE FOR MOBILE VIEW <-- */}
              <LanguageSwitcher />

              {isAuthenticated ? (
                <>
                  <NavItem onClick={() => { setPage('dashboard'); setMobileOpen(false); }}>Dashboard</NavItem>
                  <NavItem onClick={() => { logout(); setPage('home'); setMobileOpen(false); }}>Logout</NavItem>
                </>
              ) : (
                <NavItem onClick={() => { setPage('login'); setMobileOpen(false); }}>Login</NavItem>
              )}
            </div>
          </nav>
        </div>
      )}
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
// ...inside the HomePage component's return statement...

            {/* Scholarships Section */}
            <AnimatedSection className="py-20 bg-black">
                {/* ... existing code for the scholarships card ... */}
            </AnimatedSection>
             {/* Testimonials */}
            <AnimatedSection className="py-20 bg-black">
               {/* ... existing code for testimonials ... */}
            </AnimatedSection>

// ...rest of the HomePage component...
// --- PAGE COMPONENTS ---

const HowItWorksStep = ({ t, stepNumber, titleKey, descriptionKey, imageUrl, imageSide = 'right' }) => {
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
                {/* Text is now translated */}
                <h3 className="text-3xl font-bold text-gray-100 mb-4">{t(titleKey)}</h3>
                <p className="text-lg text-gray-400">{t(descriptionKey)}</p>
            </motion.div>
            <motion.div 
                className="flex items-center justify-center"
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {/* The titleKey is used for the alt text as well */}
                <img src={imageUrl} alt={t(titleKey)} className="rounded-lg shadow-2xl shadow-teal-950/20 w-full h-auto object-cover border-2 border-gray-800"/>
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

// --- [START] PASTE THIS ENTIRE COMPONENT TO REPLACE THE EXISTING HomePage ---

const HomePage = () => {
    const { setPage } = useNavigation();
    const { t } = useTranslation(); 
   
    const subheadlineText = t('heroSubtitle');

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
                        <span className="overflow-hidden inline-block"><motion.span className="inline-block" variants={textRevealVariant} initial="hidden" animate="visible">{t('heroTitlePart1')}</motion.span></span>
                        <br/>
                        <span className="overflow-hidden inline-block"><motion.span className="inline-block text-teal-400" variants={textRevealVariant} initial="hidden" animate="visible" transition={{delay: 0.15}}>{t('heroTitlePart2')}</motion.span></span>
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
                        {/* Text is now translated */}
                        <h2 className="text-4xl font-bold text-teal-400 mb-4">{t('howItWorksTitle')}</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
                    </div>
                    <div className="space-y-20 md:space-y-28">
                        {/* The t function and keys are passed as props */}
                        <HowItWorksStep
                            t={t}
                            stepNumber={1}
                            titleKey="step1Title"
                            descriptionKey="step1Desc"
                            imageUrl="https://placehold.co/600x400/131314/ffffff?text=Aptitude+Quiz"
                            imageSide="right"
                        />
                        <HowItWorksStep
                            t={t}
                            stepNumber={2}
                            titleKey="step2Title"
                            descriptionKey="step2Desc"
                            imageUrl="https://placehold.co/600x400/131314/ffffff?text=Career+Roadmap"
                            imageSide="left"
                        />
                        <HowItWorksStep
                            t={t}
                            stepNumber={3}
                            titleKey="step3Title"
                            descriptionKey="step3Desc"
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
// --- [END] REPLACEMENT COMPONENT ---
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

// --- [START] PASTE THIS REPLACEMENT for the ENTIRE EbooksPage COMPONENT ---

const EbooksPage = () => {
  const { setPage } = useNavigation();
  const { class10, class12, academicResourceLibrary } = mockEbooksData;
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  const EbookCard = ({ ebook }) => (
    <Card className="p-4 flex flex-col justify-between gap-4">
      <div>
        <h4 className="font-bold text-gray-100 mb-2">{ebook.name}</h4>
        <p className="text-sm text-teal-400">{ebook.subject}</p>
      </div>
      <Button onClick={() => window.open(ebook.url, '_blank')} variant="outline" className="w-full px-4 py-2 text-sm">
        Read Now →
      </Button>
    </Card>
  );

  const FieldCard = ({ fieldName, fieldData, onClick }) => (
    <Card className="p-4 cursor-pointer hover:bg-gray-800/50" onClick={onClick}>
      <h3 className="text-xl font-semibold text-teal-400 mb-2">{fieldName}</h3>
      <p className="text-gray-400 text-sm">{fieldData.length} resources available</p>
    </Card>
  );

  const CategoryCard = ({ categoryName, onClick }) => (
    <Card className="p-6 text-center cursor-pointer hover:bg-gray-800/50" onClick={onClick}>
      <h3 className="text-2xl font-semibold text-teal-400 mb-2">{categoryName}</h3>
      <p className="text-gray-400">Explore specialized resources</p>
    </Card>
  );

  const renderSectionSelection = () => (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <Card 
        className="text-center p-8 cursor-pointer hover:bg-gray-800/50" 
        onClick={() => setSelectedSection('class10')}
      >
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Class 10 eBooks</h2>
        <p className="text-gray-400 mb-6">Access NCERT textbooks and study materials for Class 10</p>
      </Card>
      
      <Card 
        className="text-center p-8 cursor-pointer hover:bg-gray-800/50" 
        onClick={() => setSelectedSection('class12')}
      >
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Class 12 eBooks</h2>
        <p className="text-gray-400 mb-6">Explore stream-specific resources for Class 12</p>
      </Card>
      
      <Card 
        className="text-center p-8 cursor-pointer hover:bg-gray-800/50" 
        onClick={() => setSelectedSection('academic')}
      >
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Academic Resource Library</h2>
        <p className="text-gray-400 mb-6">Comprehensive educational resources across all disciplines</p>
      </Card>
    </div>
  );

  const renderClass10Books = () => (
    <div>
      <Button onClick={() => setSelectedSection(null)} variant="secondary" className="mb-8">
        ← Back to Sections
      </Button>
      <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">Class 10 eBooks</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {class10.map((ebook, index) => (
          <EbookCard key={index} ebook={ebook} />
        ))}
      </div>
    </div>
  );

  const renderClass12StreamSelection = () => (
    <div>
      <Button onClick={() => setSelectedSection(null)} variant="secondary" className="mb-8">
        ← Back to Sections
      </Button>
      <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">Choose Your Stream</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.keys(class12).map((stream) => (
          <Card 
            key={stream} 
            className="p-6 text-center cursor-pointer hover:bg-gray-800/50" 
            onClick={() => setSelectedStream(stream)}
          >
            <h3 className="text-xl font-semibold text-teal-400">{stream}</h3>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderClass12StreamBooks = () => {
    const streamData = class12[selectedStream];
    return (
      <div>
        <Button onClick={() => setSelectedStream(null)} variant="secondary" className="mb-8">
          ← Back to Streams
        </Button>
        <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">{selectedStream} eBooks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streamData.map((ebook, index) => (
            <EbookCard key={index} ebook={ebook} />
          ))}
        </div>
      </div>
    );
  };

  const renderAcademicCategories = () => (
    <div>
      <Button onClick={() => setSelectedSection(null)} variant="secondary" className="mb-8">
        ← Back to Sections
      </Button>
      <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">Academic Resource Library</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(academicResourceLibrary).map((category) => (
          <CategoryCard key={category} categoryName={category} onClick={() => setSelectedCategory(category)} />
        ))}
      </div>
    </div>
  );

  const renderAcademicFields = () => {
    const categoryData = academicResourceLibrary[selectedCategory];
    return (
      <div>
        <Button onClick={() => setSelectedCategory(null)} variant="secondary" className="mb-8">
          ← Back to Categories
        </Button>
        <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">{selectedCategory}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(categoryData).map((fieldName) => (
            <FieldCard key={fieldName} fieldName={fieldName} fieldData={categoryData[fieldName]} onClick={() => setSelectedField(fieldName)} />
          ))}
        </div>
      </div>
    );
  };

  const renderAcademicFieldBooks = () => {
    const categoryData = academicResourceLibrary[selectedCategory];
    const fieldData = categoryData[selectedField];
    return (
      <div>
        <Button onClick={() => setSelectedField(null)} variant="secondary" className="mb-8">
          ← Back to Fields
        </Button>
        <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">{selectedField}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fieldData.map((ebook, index) => (
            <EbookCard key={index} ebook={ebook} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow bg-black">
      <div className="container mx-auto px-6 py-12">
        <Button onClick={() => setPage('home')} variant="secondary" className="mb-8">
          ← Back to Home
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">Digital Library</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Access comprehensive educational resources including NCERT textbooks and specialized academic materials
          </p>
        </div>

        {!selectedSection ? renderSectionSelection() :
         selectedSection === 'class10' ? renderClass10Books() :
         selectedSection === 'class12' && !selectedStream ? renderClass12StreamSelection() :
         selectedSection === 'class12' && selectedStream ? renderClass12StreamBooks() :
         selectedSection === 'academic' && !selectedCategory ? renderAcademicCategories() :
         selectedSection === 'academic' && selectedCategory && !selectedField ? renderAcademicFields() :
         selectedSection === 'academic' && selectedField ? renderAcademicFieldBooks() :
         null}
      </div>
    </div>
  );
};
// --- [END] REPLACEMENT for the EbooksPage COMPONENT ---


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
                        <Button onClick={() => handleSelection('class12', 'Unconventional')} variant="secondary" className="w-full col-span-2">Unconventional</Button> 
                    </div>
                </Card>
            </div>
        </div>
    );
};



const QuizPage = () => {
    const { quizType, setPage, setQuizResult } = useNavigation();
    const { user, updateUserProfile } = useAuth();

    if (!quizType) {
        useEffect(() => { setPage('pathways'); }, [setPage]);
        return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
    }

    const [currentPhase, setCurrentPhase] = useState(1);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [phase2Questions, setPhase2Questions] = useState([]); 
    
    const isClass10 = quizType.level === 'class10';
    const stream = quizType.stream;

    const phase1Data = isClass10 ? adaptiveQuizData.class10 : adaptiveQuizData.class12.phase1[stream];
    const phase2Data = isClass10 ? null : adaptiveQuizData.class12.phase2[stream];

    if (!phase1Data) {
        return (
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Quiz Error</h2>
                    <p className="text-gray-300">Could not load quiz data for stream: "{stream}".</p>
                    <Button onClick={() => setPage('pathways')} className="mt-6">Back to Pathways</Button>
                </Card>
            </div>
        );
    }

    // Determine which questions to show now
    const questions = (currentPhase === 1 ? phase1Data.questions : phase2Questions) || [];
    const currentQuestion = questions[currentQuestionIndex];

    
    // --- HELPER FUNCTION: SHUFFLE ---
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    // --- CORE LOGIC: PHASE 2 RESULT CALCULATION ---
    const calculatePhase2Results = (finalAnswers) => {
        const stream = quizType.stream;
        const streamFields = careerFields[stream];
        const streamWeights = adaptiveQuizData.class12.phase2[stream].weights;

        let fieldScores = {};
        
        // Get Phase 1 scores again (to use as a baseline weight)
        const phase1Scores = {};
        const phase1Questions = adaptiveQuizData.class12.phase1[stream].questions;
        
        // Initialize scores and calculate raw Phase 1 interest (1-10)
        phase1Questions.forEach(q => {
            const score = finalAnswers[q.id] || 5; 
            phase1Scores[q.fieldId] = score; 
        });
        
       // Initialize scores and calculate raw Phase 1 interest (1-10)
        phase1Questions.forEach(q => {
            const score = finalAnswers[q.id] || 5; 
            phase1Scores[q.fieldId] = score; 
        });
        
        // Calculate final scores
        streamFields.forEach(field => {
            let cumulativeWeightedScore = 0;
            let cumulativeMaxPossibleScore = 0;
            
            // FIX: Use 50 as the consistent base score for normalization, regardless of the number of P1 Qs per stream.
            const BASE_SCORE = 50; 
            
            // 1. Initial Score: Start with the baseline score from Phase 1, scaled to 50.
            const baseScoreFactor = (phase1Scores[field.id] || 5); 
            const scaledBaseScore = (baseScoreFactor / 10) * BASE_SCORE; // Scales P1 score (1-10) to a 0-50 range.
            
            cumulativeWeightedScore += scaledBaseScore;
            cumulativeMaxPossibleScore += BASE_SCORE;
            
            cumulativeWeightedScore += baseScoreFactor;
            cumulativeMaxPossibleScore += 50; 

            // 2. Add Phase 2 weight adjustments
            phase2Questions.forEach(q => {
                const userResponse = finalAnswers[q.id] || 5;
                const weight = streamWeights[q.id]?.[field.id] || 0;
                
                // Raw weighted contribution based on deviation from neutral (5)
                cumulativeWeightedScore += (userResponse - 5) * weight;
                
                // Calculate max possible score for normalization
                cumulativeMaxPossibleScore += 5 * Math.abs(weight);
            });

            // Normalize the score to a 0-100 range
            const scorePercentage = (cumulativeWeightedScore / cumulativeMaxPossibleScore) * 100;
            
            fieldScores[field.name] = Math.max(0, Math.min(100, Math.round(scorePercentage)));
        });

        const sortedResults = Object.entries(fieldScores)
            .sort(([, a], [, b]) => b - a)
            .map(([name, score]) => ({ name, score }));
        
        const quizRecord = {
            date: new Date().toISOString(),
            type: `${quizType.level} - ${quizType.stream}`,
            result: sortedResults[0].name,
        };
        if (user) {
            updateUserProfile({ quizHistory: [...(user.quizHistory || []), quizRecord] });
        }

        setQuizResult(sortedResults);
        setPage('results');
    };
    
    // --- CORE LOGIC: CLASS 10 RESULT CALCULATION ---
    const calculateClass10Results = (finalAnswers) => {
        const counts = {};
        Object.values(finalAnswers).forEach(value => { counts[value] = (counts[value] || 0) + 1; });
        const result = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "Science");
        
        const quizRecord = {
          date: new Date().toISOString(),
          type: `${quizType.level}`,
          result: result,
        };

        if (user) {
            updateUserProfile({ quizHistory: [...(user.quizHistory || []), quizRecord] });
        }
        setQuizResult([{ name: result, score: null }]);
        setPage('results');
    };

    // --- CORE LOGIC: PHASE 1 TO PHASE 2 ADVANCE ---
    const processPhase1 = (currentAnswers) => {
        // 1. Calculate the raw interest score from Phase 1 to identify top fields
        const phase1Scores = {};
        const phase1Questions = adaptiveQuizData.class12.phase1[stream].questions;
        
        careerFields[stream].forEach(field => {
            phase1Scores[field.id] = 0;
        });

        phase1Questions.forEach(q => {
            const score = currentAnswers[q.id] || 5; 
            phase1Scores[q.fieldId] += score; 
        });

        // Get the field IDs of the top 3 highest scoring fields from Phase 1
        const topInterestFieldIds = Object.entries(phase1Scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3) 
            .map(([id]) => id);

        // 2. Filter Phase 2 Questions based on relevance to the top 3 fields
        const allPhase2Questions = phase2Data.questions;
        const relevantQuestions = [];
        const nonRelevantQuestions = [];

        allPhase2Questions.forEach(q => {
            const weights = phase2Data.weights[q.id];
            let isRelevant = false;

            for (const fieldId of topInterestFieldIds) {
                const weight = weights[fieldId] || 0;
                if (Math.abs(weight) >= 2) { 
                    isRelevant = true;
                    break;
                }
            }
            
            if (isRelevant) {
                relevantQuestions.push(q);
            } else {
                nonRelevantQuestions.push(q);
            }
        });

        // 3. Select 6 questions: Prioritize all relevant ones, then fill with random less relevant ones
        let selectedQuestions = relevantQuestions;
        
        const shuffledNonRelevant = shuffleArray(nonRelevantQuestions);

        let remainingSlots = 6 - selectedQuestions.length;
        if (remainingSlots > 0) {
            selectedQuestions = selectedQuestions.concat(shuffledNonRelevant.slice(0, remainingSlots));
        }
        
        setPhase2Questions(shuffleArray(selectedQuestions).slice(0, 6)); 
        
        setCurrentPhase(2);
        setCurrentQuestionIndex(0);
    };

    // --- CORE HANDLERS: UPDATING STATE AND ADVANCING ---
    const handleSliderChange = (questionId, value) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Auto-advance logic (triggered by clicking a button/slider on the scale)
        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
            if (currentPhase === 1 && !isClass10) {
                processPhase1(newAnswers);
            } else if (!isClass10) {
                calculatePhase2Results(newAnswers);
            } else {
                calculateClass10Results(newAnswers);
            }
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleOptionClick = (questionId, option) => {
        const newAnswers = { ...answers, [questionId]: option.stream };
        if (currentQuestionIndex < questions.length - 1) {
            setAnswers(newAnswers);
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateClass10Results(newAnswers);
        }
    };
    
    // --- RENDERING ---
    if (!currentQuestion) {
       return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
    }
    
    // RENDER: Class 10 Quiz
    // RENDER: Class 10 Quiz
   // ... (lines above)

    // RENDER: Class 10 Quiz
    // RENDER: Class 10 Quiz
    if (isClass10) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        return (
            <div className="flex-grow bg-gray-950 flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <Card className="w-full max-w-2xl p-8">
                    <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">{phase1Data.title}</h1>
                    <p className="text-center text-gray-400 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-8"><div className="bg-teal-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div></div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-8 min-h-[56px]">{currentQuestion.text}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleOptionClick(currentQuestion.id, option)} 
                                    className="w-full text-left p-4 bg-gray-800 text-gray-200 border-2 border-gray-700 rounded-lg hover:bg-gray-700 hover:border-teal-500 transition-all duration-200"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
    
    // RENDER: Class 12 Quiz (Phase 1 & 2)
    else { 
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        return (
            // 1. FULL SCREEN CONTAINER
            <div className="flex-grow bg-gray-950 flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <Card className="w-full max-w-2xl p-8">
                    <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">{currentPhase === 1 ? phase1Data.title : `Phase 2: Deep Dive for ${stream}`}</h1>
                    <p className="text-center text-gray-400 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-8"><div className="bg-teal-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div></div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-8 min-h-[56px]">{currentQuestion.text}</h2>
                        
                        {/* 2. NPS STYLE BUTTON SCALE (REPLACEMENT) */}
                        <div className="my-10 relative">
                            <div className="flex justify-between w-full mb-3">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(valueStr => {
                                    const value = parseInt(valueStr);
                                    const selectedValue = answers[currentQuestion.id] || 5;
                                    const isSelected = value === selectedValue;
                                    
                                    let colorClass;
                                        // Themed Color Logic: 1-4 (Grey), 5-7 (Dark Teal), 8-10 (Bright Teal)
                                        if (value <= 4) colorClass = 'bg-gray-700 text-gray-300 hover:bg-gray-600';
                                        else if (value <= 7) colorClass = 'bg-teal-800 text-white hover:bg-teal-700'; 
                                        else colorClass = 'bg-teal-600 text-white hover:bg-teal-500';

                                    const ringClass = isSelected ? 'ring-4 ring-offset-2 ring-teal-500 ring-offset-gray-900' : 'ring-1 ring-gray-700 hover:ring-2 hover:ring-teal-500';
                                     
                                    return (
                                        <motion.div
                                            key={value}
                                            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md font-bold transition-all duration-150 cursor-pointer ${colorClass} ${ringClass}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                // Instant advance is handled here
                                                handleSliderChange(currentQuestion.id, value);
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {value}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            
                            {/* 3. Themed HINTS */}
                            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                                <span className="text-gray-400 font-semibold">Not for me</span>
                                <span className="text-teal-400 font-semibold">Highly Interested</span>
                            </div>
                        </div>
                        {/* The Next button is REMOVED */}
                        
                    </div>
                </Card>
            </div>
        );
    }
};
// --- [END] REPLACEMENT FOR QuizPage COMPONENT ---
// --- [END] PASTE THIS COMPONENT ---
// --- [START] REPLACEMENT FOR ResultsPage COMPONENT ---

// --- [START] PASTE THIS REPLACEMENT for the ENTIRE ResultsPage COMPONENT ---

// --- [START] PASTE THIS REPLACEMENT for the ENTIRE ResultsPage COMPONENT ---

const ResultsPage = () => {
    const { quizResult, quizType, setPage, setSelectedMindMapKey } = useNavigation();
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    
    const isRankedResult = Array.isArray(quizResult) && quizResult.length > 0;
    const isClass10 = quizType?.level === 'class10';

    if (!isRankedResult) {
        return (
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Quiz Result Error</h2>
                    <p className="text-gray-300">Could not calculate results. Please try the quiz again.</p>
                    <Button onClick={() => setPage('pathways')} className="mt-6">Back to Pathways</Button>
                </Card>
            </div>
        );
    }
    
    const primaryResult = quizResult[0];

    // This function will now only be called for Class 12 results
    const openMindMap = (resultName) => {
        const key = quizResultToMindMapKey[resultName];
        if (key && mindMapData[key]) {
            setSelectedMindMapKey(key);
            setPage('mindMap');
        } else {
            alert(`An interactive mind map for "${resultName}" is not yet available.`);
        }
    };

    return (
        <div className="flex-grow container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-teal-400">Your Quiz Results</h1>
                {isClass10 ? (
                    <>
                        <p className="text-xl text-gray-400 mt-2">Based on your answers, we recommend the following stream:</p>
                        <div className="inline-block bg-gray-800 text-teal-300 text-2xl font-bold px-6 py-3 rounded-full my-6 border border-gray-700">
                           {primaryResult.name}
                        </div>
                    </>
                ) : (
                    <p className="text-xl text-gray-400 mt-2">Based on your answers, here are your top career fields:</p>
                )}
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-teal-400 text-center">
                    {isClass10 ? 'Your Recommended Stream' : 'Your Top Career Paths'}
                </h2>
                {quizResult.slice(0, 3).map((result, index) => (
                    <Card 
                        key={index} 
                        // CHANGE #1: The onClick is now conditional. It does nothing for Class 10.
                        onClick={isClass10 ? undefined : () => openMindMap(result.name)}
                        // CHANGE #2: The styling is conditional. It removes the pointer cursor for Class 10.
                        className={`p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-2 ${isClass10 ? 'cursor-default' : 'cursor-pointer'} ${index === 0 ? 'border-teal-500 shadow-lg shadow-teal-900/30' : 'border-gray-800'}`}
                    >
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <span className={`text-3xl font-bold w-12 text-center ${index === 0 ? 'text-teal-400' : 'text-gray-600'}`}>#{index + 1}</span>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-100">{result.name}</h3>
                                {!isClass10 && <p className="text-teal-400 font-semibold">{result.score}% Match</p>}
                            </div>
                        </div>
                        {/* CHANGE #3: The text is dimmed and has no "semibold" for Class 10 */}
                        <div className={`flex items-center gap-2 pointer-events-none ${isClass10 ? 'text-gray-600' : 'text-teal-400 font-semibold'}`}>
                            {isClass10 ? null: 'Explore Path'} <ArrowRightIcon />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-2 justify-center gap-8 max-w-4xl mx-auto mt-12">
                 {!isClass10 && (
                    <Card className="p-6 flex flex-col items-center justify-center text-center">
                        <SchoolIcon className="w-12 h-12 text-teal-400 mb-4"/>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">Explore Colleges</h3>
                        <p className="text-gray-400 mb-4">Find top colleges related to your recommended fields.</p>
                        <Button onClick={() => setPage('colleges')} variant="secondary">Find Colleges</Button>
                    </Card>
                 )}
                 
                 <Card className={`p-6 flex flex-col items-center justify-center text-center ${isClass10 ? 'md:col-span-2' : ''}`}>
                    <SparkleIcon className="w-12 h-12 text-teal-400 mb-4"/>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">Have Questions? Ask AI Mentor</h3>
                    <p className="text-gray-400 mb-4">Get instant answers about your recommended stream, subjects, and more.</p>
                    <Button onClick={() => setIsAiChatOpen(true)} variant="secondary">Chat Now</Button>
                </Card>
            </div>

            <div className="text-center mt-12">
                <Button onClick={() => setPage('pathways')} variant="outline">Take Another Quiz</Button>
            </div>
            
            <AiMentorChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
        </div>
    );
};
// --- [END] REPLACEMENT for the ResultsPage COMPONENT ---

// --- [START] PASTE THIS REPLACEMENT for the MindMapNode COMPONENT ---

// --- [START] PASTE THIS FINAL REPLACEMENT for the MindMapNode COMPONENT ---

const MindMapNode = ({ node, onToggle, openNodes, path, isRoot = false, level = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isNodeOpen = openNodes.has(path);

    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const tooltipTimeoutRef = useRef(null);
    
    // Refs to measure DOM elements for line drawing
    const nodeRef = useRef(null);
    const childrenContainerRef = useRef(null);
    const containerRef = useRef(null); // Ref for the shared container
    const [lines, setLines] = useState([]);

    useLayoutEffect(() => {
        const calculateLines = () => {
            if (isNodeOpen && hasChildren && nodeRef.current && childrenContainerRef.current && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const parentRect = nodeRef.current.getBoundingClientRect();
                const childNodes = Array.from(childrenContainerRef.current.children);
                
                const newLines = childNodes.map(childElement => {
                    const childBox = childElement.querySelector('.node-box');
                    if (!childBox) return '';
                    const childRect = childBox.getBoundingClientRect();
                    
                    const startX = (parentRect.left - containerRect.left) + parentRect.width;
                    const startY = (parentRect.top - containerRect.top) + parentRect.height / 2;
                    const endX = childRect.left - containerRect.left;
                    const endY = (childRect.top - containerRect.top) + childRect.height / 2;
                    
                    const midX = startX + (endX - startX) / 2;
                    return `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
                });
                
                setLines(newLines);
            } else {
                setLines([]);
            }
        };

        calculateLines();

        if (childrenContainerRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                calculateLines();
            });
            resizeObserver.observe(childrenContainerRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [isNodeOpen, hasChildren, node, openNodes]);


    const handleMouseEnter = () => {
        if (node.description) {
            tooltipTimeoutRef.current = setTimeout(() => { setIsTooltipVisible(true); }, 1500);
        }
    };
    const handleMouseLeave = () => {
        clearTimeout(tooltipTimeoutRef.current);
        setIsTooltipVisible(false);
    };
    const handleClick = (e) => {
        e.stopPropagation();
        if (hasChildren || isRoot) {
            onToggle(path);
        }
    };

    const levelClass = isRoot ? 'is-root-box' : `node-level-${level}`;

    return (
        <motion.div layout className={`mind-map-node ${isRoot ? 'is-root' : 'is-child'}`}>
            <div ref={containerRef} className="node-and-children-container">
                <motion.div
                    ref={nodeRef}
                    className={`node-box ${levelClass} ${hasChildren || isRoot ? 'cursor-pointer' : ''}`}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ scale: 1.05, zIndex: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <span className="node-title">{node.title}</span>
                    {(hasChildren || isRoot) && (
                        <motion.div className="node-arrow" animate={{ rotate: isNodeOpen ? 90 : 0 }}>
                            <svg width="12" height="12" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </motion.div>
                    )}
                    <AnimatePresence>
                        {isTooltipVisible && (
                            <motion.div className="node-tooltip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                               {node.description}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                <svg className="connector-svg">
                    {lines.map((d, i) => (
                        <motion.path
                            key={i}
                            d={d}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                        />
                    ))}
                </svg>

                <AnimatePresence initial={false}>
                    {/* THIS IS THE SIMPLIFIED LOGIC */}
                    {isNodeOpen && hasChildren && (
                        <motion.div
                            ref={childrenContainerRef}
                            className="children-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {node.children.map((child, index) => (
                                <MindMapNode
                                    key={index}
                                    node={child}
                                    onToggle={onToggle}
                                    openNodes={openNodes}
                                    path={`${path}/${child.title}`}
                                    level={level + 1}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
// --- [END] REPLACEMENT for the MindMapNode COMPONENT ---
// --- [END] REPLACEMENT for the MindMapNode COMPONENT ---

const MindMapPage = () => {
    const { selectedMindMapKey, setPage, quizType } = useNavigation();
    
    // Ensure we start with the key provided by the quiz results page
    const [selectedField, setSelectedField] = useState(selectedMindMapKey);
    const [openNodes, setOpenNodes] = useState(new Set());
    
    // Determine which dataset to use (Class 10 uses mockMindMapData, Class 12 uses detailed mindMapData)
    const isClass10 = quizType?.level === 'class10';
    const currentDataSet = isClass10 ? mockMindMapData : mindMapData;

    const contentRef = useRef(null);

    // --- FIX FOR handleToggleNode ReferenceError ---
    const handleToggleNode = (path) => {
        setOpenNodes(prevOpenNodes => {
            const newOpenNodes = new Set(prevOpenNodes);
            if (newOpenNodes.has(path)) {
                // If the node is already open, close it and all its children
                newOpenNodes.forEach(openPath => {
                    // Check if the open path starts with the current path
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
    // --- END FIX ---


    useEffect(() => {
        // Reset open nodes when a new field is selected or page loads
        const currentMap = currentDataSet[selectedField];
        if (currentMap) {
           setOpenNodes(new Set());// Open only the root node initially
        } else if (Object.keys(currentDataSet).length > 0) {
            // Set a default selected field if the initial one is invalid/missing
            setSelectedField(Object.keys(currentDataSet)[0]);
        }
        if (contentRef.current) {
             contentRef.current.scrollTop = 0;
        }
    }, [selectedField, currentDataSet]);
    
    // Fallback if key is missing or data is invalid
    if (!selectedField || !currentDataSet[selectedField]) {
        return (
             <div className="flex-grow flex items-center justify-center p-8">
                <Card className="p-6">
                    <p className="text-red-400">Error: Could not load mind map data. Please try the quiz again.</p>
                    <Button onClick={() => setPage('pathways')} className="mt-4">Go to Pathways</Button>
                </Card>
            </div>
        );
    }

    const currentMindMap = currentDataSet[selectedField];

    return (
        <div className="flex-grow bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen font-sans text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <header className="text-center pt-8 sm:pt-12 mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-400 mb-2">Interactive Career Map</h1>
                    <p className="text-lg text-gray-400">
                        Explore the educational and career hierarchy for **{currentMindMap.title}**.
                    </p>
                </header>

                <div className="mb-6 flex justify-between items-center">
                    <Button onClick={() => setPage('results')} variant="secondary">
                        &larr; Back to Results
                    </Button>
                    
                    {/* Field Selection Dropdown */}
                    <select
                        id="field-select"
                        className="p-3 text-sm bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-300 max-w-[250px]"
                        value={selectedField}
                        onChange={(e) => {
                            setSelectedField(e.target.value);
                            setOpenNodes(new Set()); // Reset tree state
                        }}
                    >
                        <option disabled value={selectedMindMapKey}>--- Jump to Another Path ---</option>
                        
                        {/* Render options grouped by stream */}
                        {Object.entries(careerFields).map(([groupName, fields]) => (
                            <optgroup label={groupName} key={groupName} style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}>
                                {fields.filter(f => mindMapData[f.id] || (isClass10 && mockMindMapData[f.name.charAt(0).toUpperCase() + f.name.slice(1).toLowerCase()]))
                                       .map(field => {
                                           // Use the stream name for Class 10 keys (Science, Commerce, etc.)
                                           const key = isClass10 ? field.name.charAt(0).toUpperCase() + field.name.slice(1).toLowerCase() : field.id;
                                           
                                           // Check if the stream or the detailed field has map data
                                           const dataExists = isClass10 ? mockMindMapData[key] : mindMapData[key];

                                           if (dataExists) {
                                                return (
                                                    <option key={key} value={key} style={{ backgroundColor: '#334155'}}>
                                                        {field.name}
                                                    </option>
                                                );
                                           }
                                           return null;
                                       })}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            <main ref={contentRef} className="w-full overflow-x-auto p-4 sm:p-8 pt-4">
                 <div className="mind-map-container">
                     {/* The root node of the mind map tree */}
                     {currentMindMap && (
                         <div className="min-w-[1200px] pb-12">
                             <MindMapNode
                                 node={currentMindMap}
                                 onToggle={handleToggleNode}
                                 openNodes={openNodes}
                                 path={currentMindMap.title}
                                 isRoot={true}
                             />
                         </div>
                     )}
                 </div>
            </main>
        </div>
    );
};


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

// --- In src/app.jsx, replace your existing CollegeCard component ---

// --- In src/app.jsx, replace your existing CollegeCard component ---

const CollegeCard = ({ college, onSelect }) => {
    const { user, updateUserProfile, isAuthenticated } = useAuth();
    const collegeId = college.id; 
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
                <img 
                    src={college.image || `https://placehold.co/600x400/131314/ffffff?text=${encodeURIComponent(college.name)}`}
                    alt={college.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
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

// --- In src/app.jsx, replace your existing CollegeDetailPage component ---

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
return (
       <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('colleges')} variant="secondary" className="mb-8">
                    &larr; Back to Search
                </Button>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        
                        {/* Fix #1: Conditionally renders the image or a reliable built-in placeholder */}
                        {college.photoUrl ? (
                            <img 
                                src={college.photoUrl} 
                                alt={college.name} 
                                className="w-full h-64 object-cover rounded-lg mb-6 shadow-2xl"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-900 rounded-lg mb-6 shadow-2xl flex items-center justify-center border border-gray-800">
                                <SchoolIcon className="w-16 h-16 text-gray-700" />
                            </div>
                        )}

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-teal-400 mb-2">{college.name}</h1>
                                <p className="text-lg text-gray-400 mb-6">{college.address}</p>
                            </div>
                            {isAuthenticated && (
                                <Button onClick={handleBookmark} variant="secondary" className="flex-shrink-0">
                                    <BookmarkIcon filled={isBookmarked} />
                                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                </Button>
                            )}
                        </div>
                        
                        {/* Fix #2: Adds a fallback to show sample data for colleges from the live API */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                           <h2 className="text-2xl font-bold text-gray-100 mb-4">Courses & Speciality (Sample)</h2>
                           <p className="text-gray-300 mb-4"><strong>Speciality:</strong> {college.specialty || 'Multidisciplinary'}</p>
                           <div className="flex flex-wrap gap-2">
                               { (college.courses || ["Computer Science", "Business Admin", "Arts & Humanities", "Law", "Medical Prep"]).map(course => (
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
                </div>
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
                </div>
                <div className="mt-16">
                  <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">Mentor Reviews from Our Community</h2>
                  <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {mentors && mentors.length > 0 ? (
                      mentors.map(mentor => <MentorReviewCard key={mentor.name + mentor.status} mentor={mentor}/>)
                    ) : (
                      <p className="text-center col-span-2 text-gray-500">No mentor reviews available for this college yet.</p>
                    )}
                  </div>
                </div>
            </div>
       </div>
    );
    };

    // --- START: DYNAMIC MENTOR GENERATION LOGIC ---

    // Helper function to generate generic, placeholder mentors for any college
    const generateGenericMentors = (collegeName) => {
        return [
            {
                id: null, // No ID, so no "Book Session" button will appear
                name: "Rohan Verma",
                status: "Alumnus",
                branch: "Computer Science",
                qualifications: "Working as a Software Engineer at a top tech firm.",
                achievements: "Was the president of the coding club during my time.",
                reviewType: 'positive',
                reviewTitle: "A Place of Growth and Opportunity",
                reviewText: `${collegeName} provided a fantastic learning environment. The professors are knowledgeable, and the campus life is vibrant. I made lifelong friends and got great career opportunities from here.`,
                image: "https://i.pravatar.cc/150?u=generic_rohan"
            },
            {
                id: null,
                name: "Priya Singh",
                status: "4th Year Student",
                branch: "Electronics Engineering",
                qualifications: "Currently interning at a leading tech company.",
                achievements: "Active member of the college's entrepreneurship cell.",
                reviewType: 'negative',
                reviewTitle: "Has Its Pros and Cons",
                reviewText: `While the faculty at ${collegeName} is decent, the administration can be slow and the infrastructure needs an update. It's a good college, but be prepared to be proactive about finding your own opportunities.`,
                image: "https://i.pravatar.cc/150?u=generic_priya"
            }
        ];
    };

    // Helper to clean up names for matching
    const normalizeName = (name) => {
        if (!name) return '';
        return name.toLowerCase().replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
    };

    let mentors = [];
    const normalizedApiName = normalizeName(college.name);
    
    // First, try to find a match in our curated mock data
    const mockCollegeEntry = mockColleges.find(c => {
        const normalizedMockName = normalizeName(c.name);
        return normalizedApiName.includes(normalizedMockName) || normalizedMockName.includes(normalizedApiName);
    });

    if (mockCollegeEntry) {
        // If we find a specific entry, use its curated mentors
        mentors = mockCollegeMentors[mockCollegeEntry.id];
    } else {
        // If it's a new college from the API, generate generic mentors on the fly
        mentors = generateGenericMentors(college.name);
    }

    // --- END: DYNAMIC MENTOR GENERATION LOGIC ---


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
                </div> 

    return (
       <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('colleges')} variant="secondary" className="mb-8">
                    &larr; Back to Search
                </Button>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                       <img 
                       src={college.photoUrl || `https://placehold.co/600x400/131314/ffffff?text=${encodeURIComponent(college.name)}`} 
                       alt={college.name} 
                       className="w-full h-64 object-cover rounded-lg mb-6 shadow-2xl"
                       />
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
                </div>
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
                </div>
                {/* NEW: Mentor Reviews Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">Mentor Reviews from Our Community</h2>
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

// --- PASTE THIS ENTIRE CORRECTED COMPONENT ---

// File: src/App.jsx

// File: src/App.jsx

const DashboardPage = () => {
    const { user } = useAuth();
    const { setPage, setSelectedCollegeId } = useNavigation();
    const [bookmarkedCollegeData, setBookmarkedCollegeData] = useState([]);
    const [bookmarksLoading, setBookmarksLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchBookmarkedColleges = async () => {
                setBookmarksLoading(true);
                if (!user.bookmarks || user.bookmarks.length === 0) {
                    setBookmarkedCollegeData([]);
                    setBookmarksLoading(false);
                    return;
                }
                try {
                    const collegePromises = user.bookmarks.map(id =>
                        api.get(`/places/details?placeId=${id}`) 
                    );
                    const responses = await Promise.all(collegePromises);
                    setBookmarkedCollegeData(responses.map(res => res.data));
                } catch (error) {
                    console.error("Failed to fetch bookmarked colleges:", error);
                    setBookmarkedCollegeData([]);
                } finally {
                    setBookmarksLoading(false);
                }
            };
            fetchBookmarkedColleges();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex-grow flex items-center justify-center text-center bg-gray-950">
                <Button onClick={() => setPage('login')}>Please Login</Button>
            </div>
        );
    }

    const allInterests = (user.quizHistory || []).flatMap(q => {
        const interests = [q.result];
        if (q.type.startsWith('class12')) {
            const stream = q.type.split(' - ')[1];
            if (stream) interests.push(stream);
        }
        return interests;
    });
    const uniqueInterests = [...new Set(allInterests)];
    const allRelevantDates = uniqueInterests.map(interest => ({
        interest,
        dates: mockExamDates[interest] || []
    })).filter(group => group.dates.length > 0);

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* THIS SECTION WAS MISSING */}
                        <DashboardSection title="Your Progress">
                            <div className="text-center bg-gray-900/50 p-6 rounded-lg">
                                <p className="text-lg text-gray-300">
                                    You are on the <span className="font-bold text-teal-400">{user.level ? (user.level === 'class10' ? 'Class 10' : `Class 12 - ${user.stream}`) : 'General'}</span> pathway.
                                </p>
                                {(user.quizHistory || []).length > 0 ? (
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
                            {(user.sessions || []).length > 0 ? (
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
                            {(user.quizHistory || []).length > 0 ? (
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
                        {/* THIS SECTION WAS MISSING */}
                        <DashboardSection title="Profile">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <button className="text-sm text-teal-500 hover:underline mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1">Edit Profile</button>
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Important Dates">
                            {allRelevantDates.length > 0 ? (
                                 <div className="space-y-4">
                                     {allRelevantDates.map(group => (
                                         <div key={group.interest}>
                                             <h4 className="font-semibold text-teal-300 mb-2">{group.interest}-Related Exams:</h4>
                                             <ul className="space-y-3 pl-4 border-l-2 border-gray-700">
                                                 {group.dates.map((event, i) => (
                                                     <li key={i} className="text-sm">
                                                         <p className="font-bold text-gray-200">{event.date}: {event.title}</p>
                                                         <p className="text-gray-400">{event.description}</p>
                                                     </li>
                                                 ))}
                                             </ul>
                                         </div>
                                     ))}
                                 </div>
                            ) : (
                                <p className="text-gray-400">Take a quiz to see relevant exam dates.</p>
                            )}
                        </DashboardSection>
                        <DashboardSection title="My Bookmarked Colleges">
                            {bookmarksLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (bookmarkedCollegeData.length > 0 ? (
                                <div className="space-y-3">
                                    {bookmarkedCollegeData.map(college => (
                                        <div key={college.id} onClick={() => { setSelectedCollegeId(college.id); setPage('collegeDetail'); }} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                                            <p className="font-semibold text-gray-100">{college.name}</p>
                                            <ArrowRightIcon className="w-4 h-4 text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">You haven't bookmarked any colleges. <a onClick={() => setPage('colleges')} className="text-teal-500 cursor-pointer hover:underline">Explore now</a>.</p>
                            ))}
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
    const [emailForVerification, setEmailForVerification] = useState('');

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
        setSelectedMindMapKey,
        emailForVerification,
        setEmailForVerification,
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);

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
            case 'otp': return <OtpPage />;
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
            case 'skills': return <SkillsPage skillsData={skillsData} useNavigation={useNavigation} Card={Card} Button={Button} />;
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
// The root component that wraps the app in providers
export default function NextStepGuideApp() {
    return (
        <>
          <style>{`
/* Force hide scrollbar on all elements */
*::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}
* {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    
    /* AGGRESSIVE RESET: These lines help eliminate browser default margins/padding that cause flicker */
    margin: 0;
    padding: 0;
}

:root {
    --background: #020617;
}

/* --- THE RELIABLE FIX: Targeting html and body together and forcing dark background and full height immediately --- */
html, body {
    background-color: var(--background); 
    min-height: 100vh;
    scroll-behavior: smooth;
}
/* --- END OF FIX --- */

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
/* --- [START] PASTE THIS FINAL REPLACEMENT FOR THE MIND MAP CSS --- */
.mind-map-container {
    padding: 2rem;
    background-color: transparent;
    overflow-x: auto;
    min-height: 70vh;
}
.mind-map-node {
    display: flex;
    align-items: flex-start;
    position: relative;
}
.mind-map-node.is-root {
     justify-content: flex-start;
     margin-left: 2rem;
}
.node-and-children-container {
    display: flex;
    align-items: center;
    position: relative;
}
.node-box {
    position: relative;
    padding: 8px 16px;
    border-radius: 8px;
    white-space: nowrap;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    border: 1px solid #374151;
    z-index: 2;
}
.node-title { font-weight: 500; }
.node-arrow {
    margin-left: 12px;
    color: #9ca3af;
    display: flex;
    align-items: center;
}
.children-container {
    display: flex;
    flex-direction: column;
    padding-left: 80px;
    position: relative;
    /* THIS IS THE FIX: Adds vertical space between child nodes */
    gap: 1rem; /* 16px */
}
/* This rule is no longer needed with gap */
/* .children-container > .mind-map-node { margin: 8px 0; } */

/* --- SVG CONNECTOR STYLES --- */
.connector-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
    z-index: 1;
}
.connector-svg path {
    fill: none;
    stroke: #4b5563; /* gray-600 */
    stroke-width: 1.5px;
    stroke-linecap: round;
}

/* --- THEMED NODE COLORS --- */
.node-box.is-root-box { background-color: #0d9488; color: #ffffff; border-color: #0d9488; }
.node-box.node-level-1 { background-color: #115e59; color: #ccfbf1; border-color: #0f766e; }
.node-box.node-level-2 { background-color: #134e4a; color: #99f6e4; border-color: #115e59; }
.node-box.node-level-3, .node-box.node-level-4, .node-box.node-level-5 { background-color: #1f2937; color: #9ca3af; border-color: #374151; border-left: 4px solid #0f766e; }
.node-box.node-level-3 .node-title, .node-box.node-level-4 .node-title, .node-box.node-level-5 .node-title { color: #d1d5db; }

/* --- TOOLTIP STYLING --- */
.node-tooltip {
    position: absolute;
    bottom: 115%;
    left: 50%;
    transform: translateX(-50%);
    width: 280px;
    background-color: #030712;
    color: #d1d5db;
    border: 1px solid #374151;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.875rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    z-index: 10;
    white-space: normal;
    pointer-events: none;
}
/* --- [END] REPLACEMENT FOR THE MIND MAP CSS --- */
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