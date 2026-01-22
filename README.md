# Function Visualizer - Version 3

**Official Documentation**

Developed by the **NAS Team**

---

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Features and Capabilities](#2-features-and-capabilities)
3.  [Project History and Version Evolution](#3-project-history-and-version-evolution)
4.  [High-Level System Architecture](#4-high-level-system-architecture)
5.  [Technologies and Tools Used](#5-technologies-and-tools-used)
6.  [Installation and Setup](#6-installation-and-setup)
7.  [How to Use the System](#7-how-to-use-the-system)
8.  [AI Integration Overview](#8-ai-integration-overview)


---

## 1. Project Overview

### 1.1 What is Function Visualizer?

Function Visualizer (Version 3) is a comprehensive, AI-powered educational platform specifically designed to help students master the mathematics curriculum prescribed by the National Council of Educational Research and Training (NCERT) of India. The system covers Classes 9, 10, 11, and 12, which correspond to high school mathematics education.

### 1.2 The Educational Problem It Solves

Traditional mathematics education often presents concepts in a static, text-heavy format. Students struggle to visualize abstract functions, understand the geometric meaning of calculus operations, or see the step-by-step reasoning behind complex algebraic manipulations. This project addresses these challenges by providing:

*   **Dynamic Visualizations**: Real-time, interactive graphs that respond to user input.
*   **Step-by-Step Solutions**: Detailed breakdowns of how a problem is solved, showing every intermediate step.
*   **AI-Powered Tutoring**: A context-aware AI assistant that can explain concepts, answer questions, and guide students through problems.
*   **Structured Curriculum**: Content organized strictly according to the NCERT syllabus, making it easy for students to find relevant material.

### 1.3 Who Is It Designed For?

*   **Students**: The primary audience. Students in Classes 9-12 can use the platform to learn, practice, and visualize mathematical concepts.
*   **Teachers**: Educators can use the platform as a teaching aid, demonstrating concepts interactively during lessons.
*   **Self-Learners**: Anyone interested in mathematics can benefit from the structured curriculum and AI assistance.
*   **Developers and Contributors**: The project is open source, inviting contributions from the developer community.

### 1.4 Core Subject Areas

The platform covers four primary mathematical domains:

| Domain        | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **Algebra**   | Polynomials, quadratic equations, arithmetic and geometric progressions.   |
| **Calculus**  | Limits, derivatives, integrals, differential equations, Taylor series.     |
| **Geometry**  | Coordinate geometry, circles, conics, 3D geometry, transformations.        |
| **Trigonometry** | Trigonometric functions, identities, equations, inverse functions.       |

### 1.5 Open Source and Versioning

We believe that educational tools should be transparent and accessible to all. That is why this project is **Fully Open Source**.

*   **Source Code**: Complete code is available on GitHub under the user [Adarsh-61](https://github.com/Adarsh-61).
*   **Version 3**: This is the third major iteration of the project. It represents a "ground-up" rewrite, moving away from the limitations of earlier Python-only GUI frameworks to a modern, web-standard architecture. It is faster, smarter, and significantly more robust than its predecessors.

---

## 2. Features and Capabilities

This section provides an exhaustive list of the features available in Version 3.

### 2.1 Structured NCERT Curriculum

The platform mirrors the official NCERT syllabus for Mathematics. Content is organized hierarchically:

1.  **Class Level**: Select from Class 9, Class 10, Class 11, or Class 12.
2.  **Chapter Level**: Each class contains multiple chapters as defined in the NCERT textbooks.
3.  **Topic Level**: Each chapter is broken down into individual topics for focused learning.

**Scale**: The platform includes content spanning dozens of chapters across four academic years. The exact number of topics, formulas, and examples is large-scale and continuously expanding.

### 2.2 Chapter-Wise and Topic-Wise Explanations

Every topic includes:

*   A clear, textual explanation of the underlying concept.
*   LaTeX-rendered mathematical notation for precise representation of formulas.
*   Key definitions, theorems, and properties relevant to the topic.

### 2.3 Step-by-Step Solved Examples

For every major formula or technique, the platform provides worked examples. These are not just answer sheets; each example includes:

*   The problem statement.
*   A numbered, sequential breakdown of the solution process.
*   Explanations for why each step is taken.
*   The final answer, clearly marked.

### 2.4 Interactive Formula Solvers (Dynamic Solvers)

Unlike static pages, the platform includes interactive solvers that allow users to input their own values and receive computed results. These solvers:

*   Accept user-defined variables (e.g., coefficients, limits, angles).
*   Perform the computation using the backend mathematical engine.
*   Display the result along with a step-by-step derivation.
*   Render all output in LaTeX for clarity.

**Examples of Solvers**:
*   Derivative calculator (compute the derivative of any expression).
*   Definite integral solver (compute the area under a curve between two limits).
*   Quadratic equation solver (find roots given a, b, c).
*   Taylor series expander (compute the first N terms of a Taylor series).

### 2.5 Dynamic Graph Generation

The platform generates interactive graphs for mathematical concepts. These graphs are:

*   Powered by Plotly.js, a high-performance graphing library.
*   Interactive: users can zoom, pan, and hover over points for details.
*   Context-aware: graphs are generated based on the topic being studied.

**Types of Graphs**:
*   Function plots (e.g., y = sin(x), y = x^2).
*   Derivative overlays (showing f(x) alongside f'(x)).
*   Area visualizations (shading the region under a curve for integrals).
*   Tangent line illustrations (showing the tangent at a specific point).
*   3D surface plots for multivariable functions.

### 2.6 AI-Assisted Learning ("Ask AI")

The "Ask AI" feature is available throughout the platform. It provides:

*   **Contextual Awareness**: When a student asks a question from within a specific topic (e.g., "Integration by Parts"), the AI is aware of this context.
*   **Step-by-Step Explanations**: The AI prioritizes explaining the "Why" and "How" over simply providing answers.
*   **Mathematical Notation**: Responses include properly formatted LaTeX equations.
*   **Concept Clarification**: Students can ask about definitions, theorems, or general concepts.

### 2.7 Clean Navigation Flow

The user experience is designed for clarity:

*   **Home Page**: Provides an overview of the platform and access to all modules.
*   **NCERT Section**: Hierarchical navigation from Class to Chapter to Topic.
*   **Module Pages**: Direct access to Calculus, Algebra, Geometry, and Trigonometry tools.
*   **AI Assistant Page**: A dedicated chat interface for interacting with the AI tutor.

---

## 3. Project History and Version Evolution

Understanding the history of the project helps contextualize the design decisions in Version 3.

### 3.1 Version 1 (Legacy - Tkinter)

**Technology**: Python, Tkinter (standard GUI library)

**Characteristics**:
*   A standalone desktop application.
*   Basic user interface with limited styling capabilities.
*   Hardcoded formulas with no dynamic computation.
*   Graphs rendered using Matplotlib, embedded in Tkinter windows.
*   No separation between UI and logic; all code was monolithic.

**Limitations**:
*   No web accessibility; users had to download and run the application.
*   Poor scalability; adding new features required significant code changes.
*   Limited interactivity; most content was static.
*   No AI integration.

### 3.2 Version 2 (Legacy - Streamlit)

**Technology**: Python, Streamlit (web application framework)

**Characteristics**:
*   A web-based application, accessible via a browser.
*   Improved UI compared to Tkinter, with built-in styling.
*   Some dynamic elements, with user inputs feeding into calculations.
*   Graphs rendered using Plotly, embedded in Streamlit components.

**Limitations**:
*   Streamlit is opinionated and limits custom UI design.
*   Performance issues with complex pages; re-renders were slow.
*   State management was cumbersome; the framework was not designed for complex applications.
*   LaTeX rendering was inconsistent.
*   No true separation of concerns; backend logic was intertwined with UI code.

### 3.3 Version 3 (Current - Next.js + FastAPI)

**Technology**: Next.js (React), FastAPI (Python), TypeScript, Tailwind CSS

**Why Version 3 Was Built**:
*   To overcome the architectural limitations of previous versions.
*   To create a scalable, maintainable, and production-ready system.
*   To integrate AI in a meaningful, context-aware manner.
*   To provide a premium, responsive user experience.

**Key Improvements**:
*   **Clean Architecture**: Strict separation between Frontend (UI), Backend (API), and Data (JSON Curriculum).
*   **JSON-Driven Curriculum**: All NCERT content is defined in structured JSON files, making updates easy.
*   **Reliable LaTeX Rendering**: Powered by KaTeX, which is faster and more consistent than MathJax.
*   **AI-Assisted Learning**: Integrated with DeepSeek R1 for high-accuracy, context-aware tutoring.
*   **Fully Custom UI**: Designed from scratch using Tailwind CSS, with no framework-imposed limitations.
*   **Performance Optimizations**: Backend caching, optimized React components, and GZip compression.

**Version 3 fully replaces all previous versions.** Versions 1 and 2 are no longer maintained or supported.

---

## 4. High-Level System Architecture

This section describes how the different components of the system interact. No code or terminal commands are included; this is a conceptual overview.

### 4.1 Component Overview

The system consists of four primary layers:

| Layer                     | Role                                                                 |
|---------------------------|----------------------------------------------------------------------|
| **Frontend (UI)**         | The user-facing interface. Handles rendering, navigation, and input. |
| **Backend (API)**         | The computational engine. Performs math operations and serves data.  |
| **Curriculum Data Layer** | Stores the structured NCERT content in JSON format.                  |
| **AI Integration Layer**  | Connects the system to the DeepSeek R1 model for tutoring.           |

### 4.2 Data Flow

1.  **User Request**: A student navigates to a topic page or uses a solver.
2.  **Frontend Rendering**: The Next.js frontend loads the topic content (from JSON) or displays the solver UI.
3.  **API Call**: If computation is needed (e.g., solving an integral), the frontend sends a request to the FastAPI backend.
4.  **Backend Processing**: The backend receives the request, performs the symbolic computation using SymPy, and generates the result.
5.  **Response**: The backend returns the result (including LaTeX-formatted steps) to the frontend.
6.  **Display**: The frontend renders the result using KaTeX and Plotly.js.

### 4.3 AI Flow: The "Dual-Path" Engine

The system uses a smart routing mechanism to decide how to process your questions:

1.  **User Query**: You ask a question (e.g., "Explain the chain rule").
2.  **Mode Check**: The system checks your `AI_MODE` setting.
3.  **Path Selection**:
    *   **Path A (Local - Preferred)**: The backend connects to your local Ollama instance. The data never leaves your network. The `gemma3n:e2b` model generates the response.
    *   **Path B (Cloud - Optional)**: If configured or if local fails, the backend securely opens a connection to OpenRouter. The `DeepSeek R1` model generates the response in the cloud.
4.  **Streaming**: Regardless of the source, the text is streamed token-by-token to your browser for that instant "typing" feel.
5.  **Rendering**: Key mathematical terms are identified and rendered into beautiful LaTeX notation on the fly.

---

## 5. Technologies and Tools Used

This section lists and explains the major technologies used in Version 3.

### 5.1 Frontend Technologies

| Technology       | Purpose                                                                 | Why Selected                                                                 |
|------------------|-------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Next.js 16**   | React framework for server-side rendering and routing.                 | Industry standard for production React apps; excellent performance.          |
| **React 19**     | Component-based UI library.                                            | Mature, well-documented, and highly flexible.                                |
| **TypeScript**   | Typed superset of JavaScript.                                          | Reduces bugs, improves maintainability, and enhances developer experience.   |
| **Tailwind CSS** | Utility-first CSS framework.                                           | Enables rapid, consistent styling without writing custom CSS.                |
| **Plotly.js**    | Interactive graphing library.                                          | Supports 2D/3D graphs, zoom, pan, and hover interactions.                    |
| **KaTeX**        | Fast LaTeX rendering library.                                          | Renders mathematical notation quickly and accurately.                        |
| **Framer Motion**| Animation library for React.                                           | Provides smooth, performant animations for UI transitions.                   |
| **Lucide React** | Icon library.                                                          | Clean, consistent icons for UI elements.                                     |

### 5.2 Backend Technologies

| Technology           | Purpose                                                             | Why Selected                                                                 |
|----------------------|---------------------------------------------------------------------|------------------------------------------------------------------------------|
| **FastAPI**          | High-performance Python web framework.                              | Asynchronous, automatic OpenAPI docs, and excellent typing support.          |
| **Python 3.11+**     | Core programming language.                                          | Industry standard for scientific computing and AI.                           |
| **SymPy**            | Symbolic mathematics library.                                       | Handles exact symbolic computation (derivatives, integrals, etc.).           |
| **NumPy**            | Numerical computing library.                                        | Fast numerical operations for generating graph data.                         |
| **SciPy**            | Scientific computing library.                                       | Advanced mathematical functions and optimizations.                           |
| **Pydantic**         | Data validation library.                                            | Ensures API inputs are correctly typed and validated.                        |
| **Pydantic Settings**| Environment variable management.                                    | Securely loads configuration from .env files.                                |
| **httpx**            | Asynchronous HTTP client.                                           | Used for calling external APIs (e.g., OpenRouter for AI).                    |

### 5.3 AI Integration Stack

| Technology | Role | Why Selected |
| :--- | :--- | :--- |
| **Ollama** | Local Model Runner | Allows running LLMs locally on consumer hardware with zero latency. |
| **gemma3n:e2b** | Local LLM | A highly efficient model optimized for math and logic, perfect for local inference. |
| **DeepSeek R1** | Cloud LLM (Fallback) | A state-of-the-art reasoning model used when local processing is unavailable. |
| **OpenRouter** | Cloud API Gateway | Provides unified access to cloud models for the "Online" mode. |

---

## 6. Installation and Setup

This section describes the setup process conceptually. It does not include step-by-step terminal commands but explains what needs to be prepared.

### 6.1 Prerequisites

| Requirement       | Version          | Purpose                                     |
|-------------------|------------------|---------------------------------------------|
| **Python**        | 3.11 or higher   | Backend runtime.                            |
| **Node.js**       | LTS (20.x)       | Frontend runtime.                           |
| **npm**           | Included with Node | Frontend package manager.                   |
| **Git**           | Latest           | Version control (for cloning the repository).|

### 6.2 Backend Setup (Conceptual)

1.  **Clone the Repository**: Obtain the source code from the project repository.
2.  **Create a Virtual Environment**: Python best practice to isolate project dependencies.
3.  **Install Dependencies**: A `requirements.txt` file lists all necessary Python packages. These must be installed into the virtual environment.
4.  **Configure Environment Variables**: Create a `.env` file in the backend directory. This file contains:
    *   `OPENROUTER_API_KEY`: Your API key for the OpenRouter service (required for AI).
    *   `OPENROUTER_MODEL`: Set to `deepseek/deepseek-r1-0528:free`.
    *   `AI_MODE`: Set to `auto`, `online`, or `offline`.
    *   Other server settings (host, port, CORS origins).
5.  **Run the Server**: The backend is started using `uvicorn`, which runs the FastAPI application.

### 6.3 Frontend Setup (Conceptual)

1.  **Navigate to the Frontend Directory**: The frontend code is in a separate directory.
2.  **Install Dependencies**: An `npm install` command reads `package.json` and installs all required Node.js packages.
3.  **Configure Environment Variables**: A `.env.local` file may be needed to specify the backend API URL (e.g., `NEXT_PUBLIC_API_URL=http://localhost:8000`).
4.  **Run the Development Server**: Use `npm run dev` to start the Next.js development server.

### 6.4 AI Setup (Ollama)
**Highly Recommended for Local-First Experience**

To enable the preferred locally-hosted AI features:

1.  **Download Ollama**: Visit [ollama.com](https://ollama.com) and download the installer for your OS.
2.  **Install the Model**: Open your terminal/command prompt and run:
    ```bash
    ollama run gemma3n:e2b
    ```
    This will pull the optimized math model to your machine.
3.  **Verify**: Ensure Ollama is running in the background. The application will automatically detect it on `localhost:11434`.

### 6.5 Docker Deployment

The recommended way to deploy Function Visualizer in production is using Docker containers. The project includes a complete containerization setup with security hardening and production optimizations.

#### 6.5.1 Docker Architecture

The system uses a **multi-stage build** pattern for both services:

| Stage | Purpose | Result |
|-------|---------|--------|
| **Builder** | Compiles dependencies and builds application | Temporary (discarded) |
| **Runtime** | Minimal image with only production artifacts | Final deployed image |

This approach significantly reduces the final image size and attack surface by excluding build tools, source code, and development dependencies from the production image.

#### 6.5.2 Container Images

| Service | Base Image | Size | Purpose |
|---------|------------|------|---------|
| Backend | `python:3.11-slim-bookworm` | ~200MB | FastAPI server with NumPy/SymPy |
| Frontend | `node:20-alpine` | ~50MB | Next.js standalone server |

#### 6.5.3 Pre-built Images (Docker Hub)

Ready-to-use images are available on Docker Hub:

| Image | Pull Command |
|-------|--------------|
| [Backend](https://hub.docker.com/r/adarsh61/function-visualizer-backend) | `docker pull adarsh61/function-visualizer-backend:latest` |
| [Frontend](https://hub.docker.com/r/adarsh61/function-visualizer-frontend) | `docker pull adarsh61/function-visualizer-frontend:latest` |

**Instant deployment with pre-built images:**
```bash
# Create docker-compose.yml with pre-built images
cat > docker-compose.yml << 'EOF'
services:
  backend:
    image: adarsh61/function-visualizer-backend:latest
    ports:
      - "8000:8000"
    environment:
      - AI_MODE=auto
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
  frontend:
    image: adarsh61/function-visualizer-frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend
EOF

# Run
docker compose up -d
```

#### 6.5.4 Quick Start (Build from Source)

1. **Prerequisites**: Install [Docker Desktop](https://docker.com/products/docker-desktop) (Windows/macOS) or Docker Engine (Linux).

2. **Configure Environment**: Create a `.env` file (or copy from `.env.example`):
   ```env
   AI_MODE=auto
   OPENROUTER_API_KEY=your_key_here
   ```

3. **Build and Run**:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

5. **View Logs**:
   ```bash
   docker compose logs -f
   ```

6. **Stop Services**:
   ```bash
   docker compose down
   ```

#### 6.5.5 Security Features

The Docker configuration implements multiple security layers:

| Feature | Description |
|---------|-------------|
| **Non-root User** | Containers run as `appuser` (UID 10001), not root |
| **Read-only Filesystem** | Root filesystem is mounted read-only |
| **Tmpfs Mounts** | Writable areas limited to `/tmp` and cache directories |
| **Resource Limits** | CPU and memory limits prevent resource exhaustion |
| **Health Checks** | Automatic container health monitoring |
| **Minimal Images** | Only runtime dependencies included |

#### 6.5.6 Docker Hardened Images (DHI)

The project is prepared for migration to [Docker Hardened Images](https://hub.docker.com/hardened-images/catalog), which provide additional security benefits:

- FIPS 140-2 validated cryptography
- Regular security patching
- Software Bill of Materials (SBOM)
- Verified provenance

To migrate to DHI (after authentication with `docker login dhi.io`):
1. Update the `FROM` instructions in each Dockerfile
2. Remove user creation steps (DHI images run as nonroot by default)

#### 6.5.7 Resource Allocation

| Service | CPU Limit | Memory Limit | CPU Reserved | Memory Reserved |
|---------|-----------|--------------|--------------|-----------------|
| Backend | 2 cores | 2 GB | 0.5 cores | 512 MB |
| Frontend | 1 core | 1 GB | 0.25 cores | 256 MB |

### 6.6 Cross-Platform Compatibility

The system runs on:

*   **Windows**: Fully supported. Use PowerShell or Command Prompt.
*   **macOS**: Fully supported. Use Terminal.
*   **Linux**: Fully supported. Use any shell.

---

## 7. How to Use the System

This section is an end-user guide for students and general users.

### 7.1 Navigation Overview

*   **Navbar**: The top navigation bar provides links to all major sections: Home, NCERT, Calculus, Algebra, Geometry, Trigonometry, AI Assistant.
*   **Home Page**: The main landing page. Click "Get Started" to access the documentation, or "Ask AI" to go directly to the AI Assistant.
*   **NCERT Section**: Hierarchical navigation. Select your Class, then a Chapter, then a Topic.
*   **Module Pages**: Direct access to specialized tools (e.g., Calculus solvers).

### 7.2 Navigating the NCERT Curriculum

1.  Click "NCERT" in the Navbar.
2.  Select your Class (9, 10, 11, or 12).
3.  Browse the list of Chapters for that Class.
4.  Click a Chapter to see its Topics.
5.  Click a Topic to view the explanation, examples, and solvers.

### 7.3 Using Interactive Solvers

1.  Navigate to a Topic that includes an interactive solver.
2.  Locate the input field for the solver.
3.  Enter your mathematical expression or values.

**Input Syntax Rules**:
*   Use `x^2` or `x**2` for powers (x squared).
*   Use `sin(x)`, `cos(x)`, `tan(x)` for trigonometric functions.
*   Use `sqrt(x)` for square root.
*   Use `exp(x)` for e^x.
*   Use `log(x)` for natural logarithm.
*   Use parentheses to group terms: `(x + 1) * (x - 1)`.
*   Avoid ambiguous notation: `2x` should be written as `2*x`.

4.  Click the "Calculate" or "Solve" button.
5.  View the result, including step-by-step derivation and LaTeX rendering.

### 7.4 Interpreting Graphs

*   **Zoom**: Use the scroll wheel or pinch gestures to zoom in/out.
*   **Pan**: Click and drag to move around the graph.
*   **Hover**: Move your mouse over points to see coordinates.
*   **Legend**: Click legend items to show/hide specific traces (e.g., hide the derivative to see only the function).

### 7.5 Using the AI Assistant

1.  Navigate to "AI Assistant" from the Navbar, or click "Ask AI" on a topic page.
2.  Type your mathematical question in the input field.
3.  Press Enter or click Send.
4.  Wait for the AI to generate a response. Responses are streamed in real-time.
5.  Read the step-by-step explanation. The AI uses LaTeX for mathematical notation.

**What the AI Can Do**:
*   Explain mathematical concepts (e.g., "What is a derivative?").
*   Solve specific problems (e.g., "Find the integral of x^2 from 0 to 1.").
*   Clarify doubts (e.g., "Why does the chain rule work?").
*   Provide examples and analogies.

**What the AI Is Not Designed to Replace**:
*   The AI is a tutor, not a replacement for understanding.
*   It is not designed to simply "give answers" without explanation.
*   Students should use the AI to learn, not to copy answers.

---

## 8. AI Integration Overview: A "Local-First" Philosophy

The Artificial Intelligence (AI) component of Function Visualizer is not just a chatbot; it is a deeply integrated "mathematical thinker" designed to guide students through problems.

In Version 3, we have adopted a **Local-First Design Philosophy**. This means the system is built to run its AI computations directly on your own device whenever possible, rather than relying on external web servers. This decision was made to ensure:

*   **Privacy**: Your queries and data stay on your machine.
*   **Reliability**: You can study even without an internet connection.
*   **Cost Efficiency**: Local models are free to run.

### 8.1 The Design Philosophy: Why Local?

Mathematics education requires focus and consistency. Reliance on cloud APIs (like ChatGPT or Claude) often introduces latency, potential costs, and the risk of server outages. By prioritizing **Local AI**, we treat the AI model like a library installed on your computer—always there, always fast, and completely private.

We use **Ollama**, a powerful tool for running large language models locally, combined with **gemma3n:e2b**, a model specifically optimized for mathematical reasoning and efficient performance on consumer hardware.

However, we understand that not every device has the power to run a model locally, or a user might prefer the state-of-the-art reasoning of a larger cloud model. Therefore, the system remains **flexible**, offering a seamless "Cloud Mode" as an alternative.

### 8.2 Supported Models

*   **Local Model (Default & Preferred)**: `gemma3n:e2b` running via **Ollama**.
    *   *Why this model?* It strikes the perfect balance between speed and mathematical accuracy, small enough to run on most laptops but smart enough to solve calculus problems.
*   **Cloud Model (Optional)**: `DeepSeek R1 (0528)` running via **OpenRouter**.
    *   *Why this model?* DeepSeek R1 is currently one of the world's leading open-weights models for logic and code, offering a higher tier of reasoning for extremely complex proofs if needed.

### 8.3 How the System Decides (AI Modes)

The system behavior is controlled by a simple configuration setting called `AI_MODE`. This transparency allows you to know exactly where your data is going.

| Mode | Behavior | Use Case |
| :--- | :--- | :--- |
| **`offline`** | **Strict Local Processing**. The system forces the use of the local Ollama model. It will never make an outbound request to the cloud. | Best for privacy, offline study, or slow internet. |
| **`online`** | **Strict Cloud Processing**. The system ignores local models and sends all queries to the OpenRouter API. | Best for low-power devices (Chromebooks, tablets) that cannot run local models. |
| **`auto`** | **Smart Fallback**. The system tries to connect to your local Ollama instance first. If it finds it running, it uses it. If not, it seamlessly switches to the online API. | The "set and forget" mode for most users. |

### 8.4 The Educational Goal

Regardless of whether the AI is running locally or in the cloud, its instructions remain the same: **Teach, don't just solve.**

We successfully prompt both models to avoid giving direct answers. Instead, the AI serves as a *Socratic Tutor*:
1.  **Context Injection**: It looks at what you are studying (e.g., "Differentiation") and helps you within that context.
2.  **Step-by-Step Reasoning**: It breaks down problems into logical steps (Step 1, Step 2, Conclusion).
3.  **LaTeX Formatting**: It speaks the language of math, returning beautifully formatted equations that render natively on the screen.

This approach ensures that the technology aids your learning journey rather than bypassing it.

---


## License

MIT License - **Developed by NAS Team**
