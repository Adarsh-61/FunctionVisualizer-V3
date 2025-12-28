'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Function</span>{' '}
                        <span className="text-foreground">Visualiser</span>
                    </h1>
                    <p className="text-xl text-primary font-semibold mb-2">Version 3</p>
                    <p className="text-muted-foreground">Developed by the NAS Team</p>
                </header>

                {/* Table of Contents */}
                <nav className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li><a href="#overview" className="hover:text-primary transition-colors">Project Overview</a></li>
                        <li><a href="#features" className="hover:text-primary transition-colors">Features and Capabilities</a></li>
                        <li><a href="#history" className="hover:text-primary transition-colors">Project History and Version Evolution</a></li>
                        <li><a href="#architecture" className="hover:text-primary transition-colors">High-Level System Architecture</a></li>
                        <li><a href="#technologies" className="hover:text-primary transition-colors">Technologies and Tools Used</a></li>
                        <li><a href="#installation" className="hover:text-primary transition-colors">Installation and Setup</a></li>
                        <li><a href="#usage" className="hover:text-primary transition-colors">How to Use the System</a></li>
                        <li><a href="#ai" className="hover:text-primary transition-colors">AI Integration Overview</a></li>
                    </ol>
                </nav>

                {/* Section 1: Project Overview */}
                <section id="overview" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">1. Project Overview</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">1.1 What is Function Visualiser?</h3>
                            <p>Function Visualiser (Version 3) is a comprehensive, AI-powered educational platform specifically designed to help students master the mathematics curriculum prescribed by the National Council of Educational Research and Training (NCERT) of India. The system covers Classes 9, 10, 11, and 12, corresponding to high school mathematics education.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">1.2 The Educational Problem It Solves</h3>
                            <p>Traditional mathematics education often presents concepts in a static, text-heavy format. Students struggle to visualize abstract functions, understand the geometric meaning of calculus operations, or see the step-by-step reasoning behind complex algebraic manipulations. This project addresses these challenges by providing:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li><strong>Dynamic Visualizations</strong>: Real-time, interactive graphs that respond to user input.</li>
                                <li><strong>Step-by-Step Solutions</strong>: Detailed breakdowns of how a problem is solved, showing every intermediate step.</li>
                                <li><strong>AI-Powered Tutoring</strong>: A context-aware AI assistant that can explain concepts, answer questions, and guide students through problems.</li>
                                <li><strong>Structured Curriculum</strong>: Content organized strictly according to the NCERT syllabus.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">1.3 Who Is It Designed For?</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Students</strong>: The primary audience. Students in Classes 9-12 can use the platform to learn, practice, and visualize mathematical concepts.</li>
                                <li><strong>Teachers</strong>: Educators can use the platform as a teaching aid, demonstrating concepts interactively during lessons.</li>
                                <li><strong>Self-Learners</strong>: Anyone interested in mathematics can benefit from the structured curriculum and AI assistance.</li>
                                <li><strong>Developers and Contributors</strong>: The project is open source, inviting contributions from the developer community.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">1.4 Core Subject Areas</h3>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                                <div>
                                    <h4 className="font-semibold text-foreground">Algebra</h4>
                                    <p className="text-sm">Polynomials, quadratic equations, arithmetic and geometric progressions.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Calculus</h4>
                                    <p className="text-sm">Limits, derivatives, integrals, differential equations, Taylor series.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Geometry</h4>
                                    <p className="text-sm">Coordinate geometry, circles, conics, 3D geometry, transformations.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Trigonometry</h4>
                                    <p className="text-sm">Trigonometric functions, identities, equations, inverse functions.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">1.5 Open Source and Versioning</h3>
                            <p className="mb-2">We believe that educational tools should be transparent and accessible to all. That is why this project is <strong>Fully Open Source</strong>.</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Source Code</strong>: Complete code is available on GitHub under the user <strong><a href="https://github.com/Adarsh-61" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary/80">Adarsh-61</a></strong>.</li>
                                <li><strong>Version 3</strong>: This is the third major iteration of the project. It represents a &quot;ground-up&quot; rewrite, moving away from the limitations of earlier Python-only GUI frameworks to a modern, web-standard architecture. It is faster, smarter, and significantly more robust than its predecessors.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 2: Features */}
                <section id="features" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">2. Features and Capabilities</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.1 Structured NCERT Curriculum</h3>
                            <p>The platform mirrors the official NCERT syllabus for Mathematics. Content is organized hierarchically:</p>
                            <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                                <li><strong>Class Level</strong>: Select from Class 9, Class 10, Class 11, or Class 12.</li>
                                <li><strong>Chapter Level</strong>: Each class contains multiple chapters as defined in the NCERT textbooks.</li>
                                <li><strong>Topic Level</strong>: Each chapter is broken down into individual topics for focused learning.</li>
                            </ol>
                            <p className="mt-2">The platform includes content spanning dozens of chapters across four academic years. The exact number of topics, formulas, and examples is large-scale and continuously expanding.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.2 Chapter-Wise and Topic-Wise Explanations</h3>
                            <p>Every topic includes:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>A clear, textual explanation of the underlying concept.</li>
                                <li>LaTeX-rendered mathematical notation for precise representation of formulas.</li>
                                <li>Key definitions, theorems, and properties relevant to the topic.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.3 Step-by-Step Solved Examples</h3>
                            <p>For every major formula or technique, the platform provides worked examples. These are not just answer sheets; each example includes:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>The problem statement.</li>
                                <li>A numbered, sequential breakdown of the solution process.</li>
                                <li>Explanations for why each step is taken.</li>
                                <li>The final answer, clearly marked.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.4 Interactive Formula Solvers (Dynamic Solvers)</h3>
                            <p>Unlike static pages, the platform includes interactive solvers that allow users to input their own values and receive computed results. These solvers:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>Accept user-defined variables (e.g., coefficients, limits).</li>
                                <li>Perform the computation using the backend mathematical engine.</li>
                                <li>Display the result along with a step-by-step derivation.</li>
                                <li>Render all output in LaTeX for clarity.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.5 Dynamic Graph Generation</h3>
                            <p>The platform generates interactive graphs for mathematical concepts. These graphs are:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>Powered by Plotly.js, a high-performance graphing library.</li>
                                <li>Interactive: users can zoom, pan, and hover over points for details.</li>
                                <li>Context-aware: graphs are generated based on the topic being studied.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.6 AI-Assisted Learning (&quot;Ask AI&quot;)</h3>
                            <p>The &quot;Ask AI&quot; feature is available throughout the platform. It provides:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li><strong>Contextual Awareness</strong>: When a student asks a question from within a specific topic, the AI is aware of this context.</li>
                                <li><strong>Step-by-Step Explanations</strong>: The AI prioritizes explaining the &quot;Why&quot; and &quot;How&quot;.</li>
                                <li><strong>Mathematical Notation</strong>: Responses include properly formatted LaTeX equations.</li>
                                <li><strong>Concept Clarification</strong>: Students can ask about definitions, theorems, or general concepts.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">2.7 Clean Navigation Flow</h3>
                            <p>The user experience is designed for clarity:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li><strong>Home Page</strong>: Provides an overview of the platform and access to all modules.</li>
                                <li><strong>NCERT Section</strong>: Hierarchical navigation from Class to Chapter to Topic.</li>
                                <li><strong>Module Pages</strong>: Direct access to specialized tools (e.g., Calculus solvers).</li>
                                <li><strong>AI Assistant Page</strong>: A dedicated chat interface for interacting with the AI tutor.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 3: History */}
                <section id="history" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">3. Project History and Version Evolution</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">3.1 Version 1 (Legacy - Tkinter)</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li><strong>Technology</strong>: Python, Tkinter.</li>
                                <li><strong>Characteristics</strong>: Standalone desktop app, hardcoded formulas, Matplotlib graphs, monolithic code.</li>
                                <li><strong>Limitations</strong>: No web accessibility, poor scalability, limited interactivity, no AI.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">3.2 Version 2 (Legacy - Streamlit)</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li><strong>Technology</strong>: Python, Streamlit.</li>
                                <li><strong>Characteristics</strong>: Web-based, Plotly graphs, some dynamic elements.</li>
                                <li><strong>Limitations</strong>: Framework constraints, performance issues with complex pages, cumbersome state management.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">3.3 Version 3 (Current - Next.js + FastAPI)</h3>
                            <p className="text-muted-foreground mb-2">A complete rewrite designed for production. Key improvements:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                                <li><strong>Clean Architecture</strong>: Strict separation between Frontend (UI), Backend (API), and Data (JSON Curriculum).</li>
                                <li><strong>JSON-Driven Curriculum</strong>: All NCERT content is defined in structured JSON files.</li>
                                <li><strong>Reliable LaTeX Rendering</strong>: Powered by KaTeX.</li>
                                <li><strong>AI-Assisted Learning</strong>: Integrated with DeepSeek R1 for high-accuracy tutoring.</li>
                                <li><strong>Fully Custom UI</strong>: Designed from scratch using Tailwind CSS.</li>
                            </ul>
                            <p className="mt-2 font-medium text-foreground">Version 3 fully replaces all previous versions.</p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Architecture */}
                <section id="architecture" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">4. High-Level System Architecture</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">4.1 Component Overview</h3>
                            <p className="mb-4">The system consists of four primary layers:</p>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <h4 className="font-semibold text-foreground">Frontend (UI)</h4>
                                    <p className="text-sm">The user-facing interface. Handles rendering, navigation, and input. Built with Next.js and React.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Backend (API)</h4>
                                    <p className="text-sm">The computational engine. Performs math operations and serves data. Built with FastAPI.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Curriculum Data Layer</h4>
                                    <p className="text-sm">Stores the structured NCERT content in JSON format. Allows easy updates without code changes.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">AI Integration Layer</h4>
                                    <p className="text-sm">Connects the system to the AI models (Local or Cloud). Handles context injection and response streaming.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">4.2 Data Flow</h3>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li><strong>User Request</strong>: A student navigates to a topic page or uses a solver.</li>
                                <li><strong>Frontend Rendering</strong>: The frontend loads content or displays the solver UI.</li>
                                <li><strong>API Call</strong>: If computation is needed, a request is sent to the FastAPI backend.</li>
                                <li><strong>Backend Processing</strong>: The backend performs symbolic computation using SymPy.</li>
                                <li><strong>Response & Display</strong>: The result is returned and rendered using KaTeX and Plotly.js.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">4.3 AI Flow: The &quot;Dual-Path&quot; Engine</h3>
                            <p className="mb-2">The system uses a smart routing mechanism to decide how to process your questions:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li><strong>User Query</strong>: You ask a question (e.g., &quot;Explain the chain rule&quot;).</li>
                                <li><strong>Mode Check</strong>: The system checks your <code className="bg-muted px-1 py-0.5 rounded">AI_MODE</code> setting.</li>
                                <li><strong>Path Selection</strong>:
                                    <ul className="list-disc list-inside ml-6 mt-1">
                                        <li><strong>Path A (Local - Preferred)</strong>: Connects to your local Ollama instance. Data never leaves your network. Uses <code className="bg-muted px-1 py-0.5 rounded">gemma3n:e2b</code>.</li>
                                        <li><strong>Path B (Cloud - Optional)</strong>: Connects to OpenRouter securely. Uses <code className="bg-muted px-1 py-0.5 rounded">DeepSeek R1</code>.</li>
                                    </ul>
                                </li>
                                <li><strong>Streaming</strong>: The text is streamed token-by-token for an instant &quot;typing&quot; feel.</li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Section 5: Technologies */}
                <section id="technologies" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">5. Technologies and Tools Used</h2>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><strong>Next.js 16</strong>: Server-side rendering and routing.</li>
                                <li><strong>React 19</strong>: Component-based UI architecture.</li>
                                <li><strong>TypeScript</strong>: Typed superset of JavaScript.</li>
                                <li><strong>Tailwind CSS</strong>: Utility-first CSS framework.</li>
                                <li><strong>Plotly.js</strong>: Interactive graphing library.</li>
                                <li><strong>KaTeX</strong>: Fast LaTeX rendering.</li>
                                <li><strong>Framer Motion</strong>: Animation library.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">Backend and AI Structure</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><strong>FastAPI</strong>: High-performance Python web framework.</li>
                                <li><strong>Ollama</strong>: Local Model Runner (Zero Latency).</li>
                                <li><strong>gemma3n:e2b</strong>: Optimized Local LLM.</li>
                                <li><strong>DeepSeek R1</strong>: Cloud LLM (Fallback).</li>
                                <li><strong>OpenRouter</strong>: Cloud API Gateway.</li>
                                <li><strong>SymPy/NumPy</strong>: Core Math Engines.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 6: Installation */}
                <section id="installation" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">6. Installation and Setup</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.1 Prerequisites</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Python 3.11 or higher (for Backend).</li>
                                <li>Node.js LTS (20.x) (for Frontend).</li>
                                <li>Git (for cloning the repository).</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.2 Backend Setup (Conceptual)</h3>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li><strong>Clone the Repository</strong>: Obtain the source code from the project repository.</li>
                                <li><strong>Create a Virtual Environment</strong>: Isolate project dependencies.</li>
                                <li><strong>Install Dependencies</strong>: Install packages from <code className="bg-muted px-1 py-0.5 rounded">requirements.txt</code>.</li>
                                <li><strong>Configure Environment Variables</strong>: Create a <code className="bg-muted px-1 py-0.5 rounded">.env</code> file with your <code className="bg-muted px-1 py-0.5 rounded">AI_MODE</code> preference.</li>
                                <li><strong>Run the Server</strong>: Start the FastAPI application via <code className="bg-muted px-1 py-0.5 rounded">uvicorn</code>.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.3 Frontend Setup (Conceptual)</h3>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li><strong>Navigate to Frontend</strong>: Go to the frontend directory.</li>
                                <li><strong>Install Dependencies</strong>: Run <code className="bg-muted px-1 py-0.5 rounded">npm install</code>.</li>
                                <li><strong>Run Dev Server</strong>: Start the app with <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code>.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.4 AI Setup (Ollama)</h3>
                            <p className="mb-2 font-medium text-primary">Highly Recommended for Local-First Experience</p>
                            <p>To enable the preferred locally-hosted AI features:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                                <li><strong>Download Ollama</strong>: Visit <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">ollama.com</a> and download the installer.</li>
                                <li><strong>Install the Model</strong>: Run <code className="bg-muted px-1 py-0.5 rounded">ollama run gemma3n:e2b</code> in your terminal. This pulls the optimized math model.</li>
                                <li><strong>Verify</strong>: Ensure Ollama is running. The app will detect it automatically on localhost.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.5 Docker Setup (Conceptual)</h3>
                            <p>For containerized deployment:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li><strong>Backend Dockerfile</strong>: Builds a minimal, production-ready Python image.</li>
                                <li><strong>Frontend Dockerfile</strong>: Builds a standalone Next.js image.</li>
                                <li><strong>Docker Compose</strong>: Orchestrates both services.</li>
                                <li><strong>Security</strong>: Uses Docker Hardened Images (DHI) with non-root users.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">6.6 Cross-Platform Compatibility</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Windows</strong>: Fully supported.</li>
                                <li><strong>macOS</strong>: Fully supported.</li>
                                <li><strong>Linux</strong>: Fully supported.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 7: Usage */}
                <section id="usage" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">7. How to Use the System</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">7.1 Navigation Overview</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Navbar</strong>: Links to all major sections (Home, NCERT, Solvers, AI Assistant).</li>
                                <li><strong>NCERT Section</strong>: Hierarchical navigation from Class to Chapter to Topic.</li>
                                <li><strong>Module Pages</strong>: Direct access to specialized tools.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">7.2 Navigating the NCERT Curriculum</h3>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li>Click &quot;NCERT&quot; in the Navbar.</li>
                                <li>Select your Class (9, 10, 11, or 12).</li>
                                <li>Browse the list of Chapters for that Class.</li>
                                <li>Click a Chapter to see its Topics.</li>
                                <li>Click a Topic to view the explanation, examples, and solvers.</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">7.3 Using Interactive Solvers</h3>
                            <p className="mb-2"><strong>Input Syntax Rules:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Use <code className="bg-muted px-1 py-0.5 rounded">x^2</code> for powers.</li>
                                <li>Use <code className="bg-muted px-1 py-0.5 rounded">sin(x)</code>, <code className="bg-muted px-1 py-0.5 rounded">cos(x)</code>, <code className="bg-muted px-1 py-0.5 rounded">tan(x)</code>.</li>
                                <li>Use <code className="bg-muted px-1 py-0.5 rounded">sqrt(x)</code> for square root.</li>
                                <li>Use parentheses to group terms: <code className="bg-muted px-1 py-0.5 rounded">(x+1)*(x-1)</code>.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">7.4 Interpreting Graphs</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Zoom</strong>: Use scroll wheel or pinch.</li>
                                <li><strong>Pan</strong>: Click and drag.</li>
                                <li><strong>Hover</strong>: See coordinates.</li>
                                <li><strong>Legend</strong>: Click items to show/hide traces.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">7.5 Using the AI Assistant</h3>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li>Navigate to &quot;AI Assistant&quot; from the Navbar.</li>
                                <li>Type your mathematical question.</li>
                                <li>Press Enter or click Send.</li>
                                <li>Read the step-by-step explanation.</li>
                            </ol>
                            <p className="mt-2">The AI is a tutor, not a replacement for understanding. Use it to learn, not to copy answers.</p>
                        </div>
                    </div>
                </section>

                {/* Section 8: AI */}
                <section id="ai" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">8. AI Integration Overview</h2>

                    <div className="space-y-8 text-muted-foreground">
                        <p className="text-lg text-foreground">The Artificial Intelligence (AI) component of Function Visualiser is not just a chatbot; it is a deeply integrated &quot;mathematical thinker&quot; designed to guide students through problems.</p>

                        <p>In Version 3, we have adopted a <strong>Local-First Design Philosophy</strong>. This means the system is built to run its AI computations directly on your own device whenever possible, rather than relying on external web servers. This decision was made to ensure Privacy, Reliability, and Cost Efficiency.</p>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">8.1 The Design Philosophy: Why Local?</h3>
                            <p className="mb-4">Mathematics education requires focus and consistency. Reliance on cloud APIs often introduces latency, potential costs, and the risk of server outages. By prioritizing <strong>Local AI</strong>, we treat the AI model like a library installed on your computer—always there, always fast, and completely private.</p>
                            <p>We use <strong>Ollama</strong>, a powerful tool for running large language models locally, combined with <strong>gemma3n:e2b</strong>, a model specifically optimized for mathematical reasoning and efficient performance on consumer hardware.</p>
                            <p className="mt-2">However, we understand that not every device has the power to run a model locally. Therefore, the system remains <strong>flexible</strong>, offering a seamless &quot;Cloud Mode&quot; via OpenRouter as an alternative.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">8.2 Supported Models</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>
                                    <strong>Local Model (Default & Preferred): <code className="bg-muted px-1 py-0.5 rounded">gemma3n:e2b</code></strong> via Ollama.
                                    <span className="block text-sm mt-1 ml-6 text-muted-foreground">Why this model? It strikes the perfect balance between speed and mathematical accuracy, small enough to run on most laptops but smart enough to solve calculus problems.</span>
                                </li>
                                <li>
                                    <strong>Cloud Model (Optional): <code className="bg-muted px-1 py-0.5 rounded">DeepSeek R1 (0528)</code></strong> via OpenRouter.
                                    <span className="block text-sm mt-1 ml-6 text-muted-foreground">Why this model? DeepSeek R1 is currently one of the world&apos;s leading open-weights models for logic and code, offering a higher tier of reasoning if you cannot run local models.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">8.3 How the System Decides (AI Modes)</h3>
                            <p className="mb-4">The system behavior is controlled by a simple configuration setting called <code className="bg-muted px-1 py-0.5 rounded">AI_MODE</code>. This transparency allows you to know exactly where your data is going.</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse border border-border rounded-lg">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="p-3 border-b border-border font-semibold">Mode</th>
                                            <th className="p-3 border-b border-border font-semibold">Behavior</th>
                                            <th className="p-3 border-b border-border font-semibold">Use Case</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border-b border-border font-medium">offline</td>
                                            <td className="p-3 border-b border-border"><strong>Strict Local Processing</strong>. The system forces the use of the local Ollama model. It will never make an outbound request to the cloud.</td>
                                            <td className="p-3 border-b border-border">Best for privacy, offline study, or slow internet.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border-b border-border font-medium">online</td>
                                            <td className="p-3 border-b border-border"><strong>Strict Cloud Processing</strong>. The system ignores local models and sends all queries to the OpenRouter API.</td>
                                            <td className="p-3 border-b border-border">Best for low-power devices (Chromebooks, tablets) that cannot run local models.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium">auto</td>
                                            <td className="p-3"><strong>Smart Fallback</strong>. The system tries to connect to your local Ollama instance first. If it finds it running, it uses it. If not, it seamlessly switches to the online API.</td>
                                            <td className="p-3">The &quot;set and forget&quot; mode for most users.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">8.4 The Educational Goal</h3>
                            <p>Regardless of whether the AI is running locally or in the cloud, its instructions remain the same: <strong>Teach, don&apos;t just solve.</strong></p>
                            <p className="mt-2">We successfully prompt both models to avoid giving direct answers. Instead, the AI serves as a <em>Socratic Tutor</em>:</p>
                            <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                                <li><strong>Context Injection</strong>: It looks at what you are studying (e.g., &quot;Differentiation&quot;) and helps you within that context.</li>
                                <li><strong>Step-by-Step Reasoning</strong>: It breaks down problems into logical steps.</li>
                                <li><strong>LaTeX Formatting</strong>: It speaks the language of math, returning beautifully formatted equations.</li>
                            </ol>
                            <p className="mt-2">This approach ensures that the technology aids your learning journey rather than bypassing it.</p>
                        </div>
                    </div>
                </section>

                <footer className="text-sm text-muted-foreground mt-16 pt-8 border-t border-border text-center">
                    <p className="mt-1">Version 3</p>
                    <p>MIT License - Developed by NAS Team</p>
                </footer>
            </motion.div>
        </div>
    );
}
