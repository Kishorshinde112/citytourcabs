'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';
import { FAQ_DATA } from '@/data/faqData';
import useSettingsStore from '@/store/settingsStore';

export default function FaqSection() {
  const { phone } = useSettingsStore();
  const [faqs, setFaqs] = useState(FAQ_DATA);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setFaqs(data.faqs);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadFaqs();
  }, []);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Everything you need to know about our cab booking process, tour packages, tolls, and safety standards.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0">
                      Q
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            Our team is available 24/7 on WhatsApp and phone to help tailor your trip itinerary and cab selection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/91${phone}?text=Hi%20CityTourCabs,%20I%20have%20a%20question%20regarding%20cab%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <a
              href={`tel:+91${phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: +91 {phone}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
