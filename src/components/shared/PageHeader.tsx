import React from 'react';
export const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="mb-8">
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    {subtitle && <p className="text-gray-400">{subtitle}</p>}
  </header>
);
