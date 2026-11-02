/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Demo Story Banner Component
 */

import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';

interface DemoStoryBannerProps {
  onOpenEmployee: (employeeId: string, initialTab?: string) => void;
}

export const DemoStoryBanner: React.FC<DemoStoryBannerProps> = ({ onOpenEmployee }) => {
  return (
    <div className="bg-[#101411] text-white rounded-2xl p-5 shadow-[0_6px_20px_rgba(25,35,45,0.055)] border border-[#1A211A] mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#17191B] bg-[#A6F52F] px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#17191B]" />
              Verified Demo Scenarios (Section 27)
            </span>
            <span className="text-xs text-[#B8C0B8] hidden sm:inline">
              FMCG Field Training Lifecycle
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
            Traceable Employee Training Journeys & Operational Assurance
          </h2>
          <p className="text-xs text-[#B8C0B8] mt-1 max-w-2xl leading-relaxed">
            Review the two canonical life-cycles: a first-time pass on Haldiram's Modern Trade standards, and an auditable remedial journey with knowledge gap identification, targeted coaching, and reassessment.
          </p>
        </div>

        {/* Quick Review Buttons - Monetra Pill Style */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          {/* Story 1: Rahul Sharma */}
          <button
            onClick={() => onOpenEmployee('EMP-10023', 'journey')}
            className="flex-1 sm:flex-initial flex items-center justify-between gap-3 bg-[#1A211A] hover:bg-[#293629] text-white text-xs font-medium px-4 py-2.5 rounded-full border border-[#293629] transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
            title="Inspect Rahul Sharma's complete journey from assignment to Training Ready"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-full bg-[#E9FBD1] text-[#17191B] flex items-center justify-center font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-white leading-tight">Rahul Sharma</p>
                <p className="text-[10px] text-[#B8C0B8]">Merchandiser · Haldiram's</p>
              </div>
            </div>
            <span className="text-[10px] bg-[#A6F52F] text-[#17191B] px-2.5 py-0.5 rounded-full font-bold">
              Ready
            </span>
          </button>

          {/* Story 2: Pooja Verma */}
          <button
            onClick={() => onOpenEmployee('EMP-10045', 'journey')}
            className="flex-1 sm:flex-initial flex items-center justify-between gap-3 bg-[#1A211A] hover:bg-[#293629] text-white text-xs font-medium px-4 py-2.5 rounded-full border border-[#293629] transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
            title="Inspect Pooja Verma's failed attempt, remedial roleplay, and re-test recovery"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-full bg-[#FEF5E7] text-[#A66708] flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-white leading-tight">Pooja Verma</p>
                <p className="text-[10px] text-[#B8C0B8]">Promoter · Cadbury</p>
              </div>
            </div>
            <span className="text-[10px] bg-[#E9FBD1] text-[#226732] px-2.5 py-0.5 rounded-full font-bold border border-[#C8F58A]">
              100% Cleared
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
