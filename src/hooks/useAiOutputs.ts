import { useState } from 'react';

export function useAiOutputs() {
  const [activeTab, setActiveTab] = useState('ksc');
  const [ignoredCriteria, setIgnoredCriteria] = useState<number[]>([]);

  const toggleCriteria = (id: number) => {
    setIgnoredCriteria(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const criteria = [
    { id: 1, title: "5+ years experience in React and TypeScript", required: true },
    { id: 2, title: "Experience with GraphQL and Node.js", required: false },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return {
    activeTab,
    setActiveTab,
    ignoredCriteria,
    toggleCriteria,
    criteria,
    handleCopy
  };
}
