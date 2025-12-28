import { notFound } from 'next/navigation';
import { ConceptCard } from '@/components/learn/ConceptCard';
import curriculumData from '@/data/curriculum.json';

// Type definitions (shared with Sidebar, ideally move to types file)
type Topic = {
    id: string;
    title: string;
    content?: string;
    formulas?: string[];
    visualization_type?: string;
    graph_config?: any;
    examples?: any[];
    solverId?: string;
};

type Chapter = {
    id: string;
    title: string;
    topics: Topic[];
};

type ClassData = {
    id: string;
    title: string;
    chapters: Chapter[];
};

type Curriculum = {
    [key: string]: ClassData;
};

const curriculum = curriculumData as Curriculum;

interface PageProps {
    params: {
        classId: string;
        chapterId: string;
        topicId: string;
    };
}

export default async function LearnPage({ params }: { params: Promise<PageProps['params']> }) {
    const { classId, chapterId, topicId } = await params;

    const classData = curriculum[classId];
    if (!classData) return notFound();

    const chapter = classData.chapters.find(c => c.id === chapterId);
    if (!chapter) return notFound();

    const topic = chapter.topics.find(t => t.id === topicId);
    if (!topic) return notFound();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <ConceptCard
                title={topic.title}
                content={topic.content || "Content coming soon..."}
                formulas={topic.formulas || []}
                visualizationType={topic.visualization_type}
                graphConfig={topic.graph_config}
                context={{ classId, chapterId, topicId }}
                examples={topic.examples}
                solverId={topic.solverId}
            />
        </div>
    );
}
