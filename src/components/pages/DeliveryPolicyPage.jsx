import { delivery } from '@data/legal';

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-neutral-900 border-b pb-4 mb-10">{delivery.title}</h1>
      <div className="bg-white rounded-2xl shadow border border-neutral-100 p-8 space-y-8">
        {delivery.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
