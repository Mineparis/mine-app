import { terms } from '@data/legal';

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-neutral-900 border-b pb-4 mb-10">{terms.title}</h1>
      <div className="prose prose-neutral prose-sm max-w-none whitespace-pre-line leading-relaxed text-neutral-700">
        {terms.content}
      </div>
    </div>
  );
}
