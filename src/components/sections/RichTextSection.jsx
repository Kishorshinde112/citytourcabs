import React from 'react';

export default function RichTextSection({ contentHtml = '', content = null, className = '' }) {
  const html = contentHtml || (typeof content === 'string' ? content : '');
  if (!html) return null;

  return (
    <section className={`py-14 md:py-20 bg-white text-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div
          className="mx-auto max-w-4xl text-base leading-relaxed text-gray-700 [&_a]:text-[#0F6EB8] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-orange-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:mb-1 [&_li]:ml-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
