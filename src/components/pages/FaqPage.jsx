import { faq } from '@data/legal';
import { useState } from 'react';

export default function FaqPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-neutral-900 border-b pb-4 mb-10">{faq.title}</h1>
      <div className="divide-y divide-neutral-200 shadow bg-white">
        {faq.sections.map((section, idx) => (
          <div key={section.title}>
            <button
              className={`w-full text-left px-4 py-3 focus:outline-none flex justify-between items-center text-base ${open === idx ? 'bg-neutral-50' : ''}`}
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span className="font-medium text-neutral-800">{section.title}</span>
              <span className={`ml-2 transition-transform ${open === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-[600px] py-3 px-4' : 'max-h-0 px-4 py-0'}`}
              style={{}}
            >
              <div className="prose prose-neutral prose-sm max-w-none">
                {section.content.split(/\n{2,}/).map((block, i) => (
                  <div key={i} className="mb-2">
                    {block.trim().startsWith('<ul>') ? (
                      <span dangerouslySetInnerHTML={{ __html: block.trim() }} />
                    ) : (
                      <p className="mb-1 whitespace-pre-line leading-relaxed">{block.trim()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
