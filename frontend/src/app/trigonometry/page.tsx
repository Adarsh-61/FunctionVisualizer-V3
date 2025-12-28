'use client';

import { motion } from 'framer-motion';
import { TrigonometryWorkstation } from '@/components/solvers/TrigonometryWorkstation';

export default function TrigonometryPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Trigonometry</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explore trigonometric functions, the unit circle, identities, and equations using dynamic tools.
                </p>
            </motion.div>

            <TrigonometryWorkstation />
        </div>
    );
}
