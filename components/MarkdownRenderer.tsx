import React from 'react';

interface MarkdownRendererProps {
  markdown: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const renderLine = (line: string, index: number) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-700">{line.substring(2, line.length - 2)}</strong>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
    if (line.trim() === '') {
        return <br key={index} />;
    }
    return <p key={index}>{line}</p>;
  };

  const lines = markdown.split('\n');
  
  return (
    <div className="prose prose-sm max-w-none space-y-2">
      {lines.map(renderLine)}
    </div>
  );
};
