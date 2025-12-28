
'use client';

import { motion } from 'framer-motion';
import { GeometryWorkstation } from '@/components/solvers/GeometryWorkstation';

export default function GeometryPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Geometry</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Comprehensive geometry engine: 2D foundations, 3D vectors, planes, lines, and advanced conic sections.
                </p>
            </motion.div>

            <GeometryWorkstation />
        </div>
    );
}
