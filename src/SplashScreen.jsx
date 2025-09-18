import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './app.jsx'; // Make sure this path to your app.jsx is correct

const tags = [
    { text: "MENTORS", top: '20%', left: '15%' },
    { text: "SCHOLARSHIPS", top: '30%', left: '70%' },
    { text: "E-BOOKS", top: '75%', left: '80%' },
    { text: "MIND MAPS", top: '50%', left: '50%' },
    { text: "QUIZZES", top: '80%', left: '20%' },
    { text: "COLLEGES", top: '15%', left: '60%' },
    { text: "GEO-LOCATION", top: '55%', left: '5%' },
];

const SplashScreen = ({ onAnimationComplete }) => {
    const [stage, setStage] = useState('tags'); // 'tags', 'combine', 'reveal'

    useEffect(() => {
        const timer1 = setTimeout(() => setStage('combine'), 2000);
        const timer2 = setTimeout(() => setStage('reveal'), 2800);
        const timer3 = setTimeout(() => onAnimationComplete(), 4800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onAnimationComplete]);

    const tagVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 200 } },
        combine: {
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
            transition: { duration: 0.8, ease: 'easeIn' }
        }
    };

    const containerVariants = {
        visible: { transition: { staggerChildren: 0.15 } }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[9999] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        >
            <motion.div
                className="relative w-full h-full"
                variants={containerVariants}
                initial="hidden"
                animate={stage === 'tags' ? "visible" : "combine"}
            >
                {tags.map((tag) => (
                    <motion.div
                        key={tag.text}
                        className="absolute bg-teal-900/50 text-teal-300 font-semibold px-4 py-2 rounded-full border border-teal-800 shadow-lg"
                        style={{
                            top: tag.top,
                            left: tag.left,
                            transform: 'translate(-50%, -50%)',
                        }}
                        variants={tagVariants}
                    >
                        {tag.text}
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {stage === 'reveal' && (
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <LogoIcon />
                            <h1 className="text-5xl md:text-6xl font-bold text-teal-400">NextStepGuide</h1>
                        </div>
                        <p className="text-lg text-gray-400">Your Pathway to Success</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SplashScreen;