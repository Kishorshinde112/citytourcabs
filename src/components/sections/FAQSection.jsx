'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function FAQSection({ title = 'Frequently Asked Questions' }) {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
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
        if (mounted) setFaqs(docs.filter((faq) => faq.question && faq.answer));
      } catch (err) {
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
  }, []);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold font-[Reddit_Sans] text-gray-900">
              {title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Quick answers to the questions we hear most often.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id || index}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#1A96EB] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600 sm:px-6 [&_a]:text-[#1A96EB] [&_a]:underline [&_li]:ml-4 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc">
                    <RichText data={faq.answer} />
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
