'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const subjects = [
    {
        title: 'NCERT',
        description: 'Complete Class 9-12 Mathematics strictly following NCERT',
        href: '/ncert',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Calculus',
        description: 'Derivatives, integrals, limits, and function analysis',
        href: '/calculus',
        gradient: 'from-blue-500 to-cyan-400',
    },
    {
        title: 'Algebra',
        description: 'Equations, progressions, and polynomial operations',
        href: '/algebra',
        gradient: 'from-purple-500 to-pink-400',
    },
    {
        title: 'Geometry',
        description: 'Points, lines, circles, and coordinate geometry',
        href: '/geometry',
        gradient: 'from-green-500 to-emerald-400',
    },
    {
        title: 'Trigonometry',
        description: 'Trig functions, identities, and transformations',
        href: '/trigonometry',
        gradient: 'from-orange-500 to-yellow-400',
    },
    {
        title: 'AI Assistant',
        description: 'Get step-by-step solutions to any math problem',
        href: '/ai-assistant',
        gradient: 'from-indigo-500 to-violet-400',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function HomePage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16 md:py-24"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
                >
                    <span className="text-sm font-medium">✨ MSc AIML Project</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient">Function</span>{' '}
                    <span className="text-foreground">Visualizer</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Interactive mathematical visualization with AI-powered problem solving.
                    Explore calculus, algebra, geometry, and more with beautiful graphs and step-by-step explanations.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/docs"
                        className="btn-primary px-8 py-3 text-lg"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/ai-assistant"
                        className="btn-outline px-8 py-3 text-lg"
                    >
                        Ask AI
                    </Link>
                </div>
            </motion.section>

            {/* Subject Cards */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12"
            >
                {subjects.map((subject) => {
                    return (
                        <motion.div key={subject.title} variants={itemVariants}>
                            <Link href={subject.href}>
                                <div className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border card-hover h-full">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {subject.title}
                                    </h3>

                                    <p className="text-muted-foreground">
                                        {subject.description}
                                    </p>

                                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-medium">Explore</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-16 text-center"
            >
                <h2 className="text-3xl font-bold mb-12">Why Function Visualizer?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Interactive Graphs</h3>
                        <p className="text-muted-foreground">
                            Beautiful, zoomable visualizations powered by Plotly.js
                        </p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                        <p className="text-muted-foreground">
                            Get instant solutions with step-by-step explanations
                        </p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">LaTeX Rendering</h3>
                        <p className="text-muted-foreground">
                            Beautiful math notation with KaTeX
                        </p>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
