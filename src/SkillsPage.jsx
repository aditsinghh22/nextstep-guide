import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This component uses other components (Card, Button) and hooks (useNavigation) 
// that are defined in your main app.jsx file. We pass them in as props.
export const SkillsPage = ({ skillsData, useNavigation, Card, Button }) => {
    const { setPage } = useNavigation();
    const [activeField, setActiveField] = useState(null); // Start with the first section open
    const [activeSub, setActiveSub] = useState(null);

    const toggleField = (field) => {
        setActiveField(activeField === field ? null : field);
        setActiveSub(null);
    };

    const toggleSub = (sub) => {
        setActiveSub(activeSub === sub ? null : sub);
    };

    const ChevronIcon = ({ open }) => (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            animate={{ rotate: open ? 90 : 0 }} className="flex-shrink-0 text-gray-500"
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </motion.svg>
    );

    return (
        <div className="flex-grow bg-black">
            <div className="container mx-auto px-6 py-12">
                <Button onClick={() => setPage('home')} variant="secondary" className="mb-8">
                    &larr; Back to Home
                </Button>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-teal-400 mb-4">Build Your Skill Set</h1>
                    <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                        Explore free courses from top platforms like NPTEL, Coursera, and edX to build essential skills for your chosen field.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {skillsData.map((fieldData) => (
                        <div key={fieldData.field} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleField(fieldData.field)}
                                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors"
                            >
                                <h3 className="text-2xl font-bold text-gray-100">{fieldData.field}</h3>
                                <ChevronIcon open={activeField === fieldData.field} />
                            </button>
                            <AnimatePresence>
                                {activeField === fieldData.field && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 border-t border-gray-800 space-y-3">
                                            {fieldData.subsections.map((sub) => (
                                                <div key={sub.name} className="bg-gray-800/60 rounded-md overflow-hidden">
                                                    <button
                                                        onClick={() => toggleSub(sub.name)}
                                                        className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <h4 className="text-lg font-semibold text-teal-400">{sub.name}</h4>
                                                        <ChevronIcon open={activeSub === sub.name} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {activeSub === sub.name && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <ul className="p-4 border-t border-gray-700 space-y-4">
                                                                    {sub.skills.map((skill) => (
                                                                        <li key={skill.title}>
                                                                            <a
                                                                                href={skill.link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="block p-3 bg-gray-900 rounded-lg hover:bg-gray-800 border border-gray-700 hover:border-teal-600 transition-all"
                                                                            >
                                                                                <strong className="text-teal-400">{skill.title}</strong>
                                                                                <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};