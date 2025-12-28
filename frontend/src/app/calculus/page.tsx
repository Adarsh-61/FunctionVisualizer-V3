'use client';

import { motion } from 'framer-motion';
import { CalculusSolver } from '@/components/solvers/CalculusSolver';

export default function CalculusPage() {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Calculus</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Analyze functions, compute derivatives, integrals, and more with interactive visualizations.
                </p>
            </motion.div>

            <CalculusSolver />
        </div>
    );
}
