'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

function extractLexicalText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node.text === 'string') return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(extractLexicalText).filter(Boolean).join(' ');
  }
  if (node.root) return extractLexicalText(node.root);
  return '';
}

export default function FAQSection({
  title = 'Frequently Asked Questions',
  initialFaqs = null,
}: {
  title?: string;
  initialFaqs?: { id: string; question: string; answerHtml?: string; answer?: any }[] | null;
}) {
  const hasInitial = Array.isArray(initialFaqs);
  const [faqs, setFaqs] = useState<any[]>(hasInitial ? initialFaqs : []);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (hasInitial) return;
    let mounted = true;
    const controller = new AbortController();

    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs?limit=100&depth=0', {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const docs = Array.isArray(data.docs)
          ? data.docs
          : Array.isArray(data.faqs)
            ? data.faqs
            : [];
        if (mounted) {
          setFaqs(
            docs
              .filter((faq: any) => faq.question && (faq.answerHtml || faq.answer))
              .map((faq: any, idx: number) => ({
                id: String(faq.id || idx),
                question: faq.question,
                answerHtml: faq.answerHtml || '',
                answerText: extractLexicalText(faq.answer),
              }))
          );
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Unable to load FAQs from CMS', err);
        }
      }
    }

    loadFaqs();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [hasInitial]);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold font-display text-gray-900">
              {title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
              Quick answers to the questions we hear most often.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {faqs.map((faq: any, index: number) => {
            const faqId = String(faq.id || index);
            const isOpen = openId === faqId;
            return (
              <div key={faqId}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faqId)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 cursor-pointer"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#0F6EB8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-gray-700 sm:px-6 [&_a]:text-[#0F6EB8] [&_a]:underline [&_li]:ml-4 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc">
                    {faq.answerHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: faq.answerHtml }} />
                    ) : (
                      <p>{faq.answerText || extractLexicalText(faq.answer)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
