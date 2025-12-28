'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const classes = [
    {
        id: 'class_9',
        title: 'Class 9',
        description: 'Number Systems, Polynomials, Coordinate Geometry, and more.',
        link: '/learn/class_9/ch_1_number_systems/topic_1_1_foundations_and_classification'
    },
    {
        id: 'class_10',
        title: 'Class 10',
        description: 'Real Numbers, Quadratic Equations, Trigonometry, and Circles.',
        link: '/learn/class_10/ch_1_real_numbers/topic_1_1_real_number_system'
    },
    {
        id: 'class_11',
        title: 'Class 11',
        description: 'Sets, Functions, Trigonometry, Conic Sections, and Limits.',
        link: '/learn/class_11/11_1/11_1_1'
    },
    {
        id: 'class_12',
        title: 'Class 12',
        description: 'Relations, Matrices, Integrals, and Differential Equations.',
        link: '/learn/class_12/12_1/12_1_1'
    }
];

export default function NCERTPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">NCERT Curriculum</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Comprehensive mathematics curriculum from Class 9 to 12.
                    Complete with interactive formulas, step-by-step solutions, and visualizations.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {classes.map((cls, index) => (
                    <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={cls.link} className="block group">
                            <div className="bg-card border border-border p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative overflow-hidden h-full">
                                {/* Academic Graduation Cap Background */}
                                <svg
                                    className="absolute top-[40%] -translate-y-1/2 right-12 w-40 h-40 text-primary/[0.085] dark:text-primary/[0.065] pointer-events-none transition-all duration-500 group-hover:text-primary/[0.125] dark:group-hover:text-primary/[0.095]"
                                    viewBox="0 0 64 64"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    {/* Mortarboard Top (Square Board) */}
                                    <path d="M8 20 L32 12 L56 20 L32 28 Z" />

                                    {/* Cap Base */}
                                    <ellipse cx="32" cy="28" rx="18" ry="6" />

                                    {/* Tassel String */}
                                    <rect x="31" y="12" width="2" height="20" />

                                    {/* Tassel End */}
                                    <circle cx="32" cy="34" r="3" />
                                </svg>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {cls.title}
                                        </h2>
                                        <div className="p-2 rounded-full bg-accent group-hover:bg-primary/10 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                                        {cls.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
