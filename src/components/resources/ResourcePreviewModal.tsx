/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from '../common/Modal';
import { LearningResource } from '../../types';
import { Badge } from '../common/Badge';
import { Download, FileText, Video, Image, ExternalLink, ShieldCheck } from 'lucide-react';

interface ResourcePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  isOpen,
  onClose,
  resource
}) => {
  if (!resource) return null;

  const handleDownload = () => {
    const text = `LOVEINSTORE SECURE REPOSITORY\nResource: ${resource.title}\nCategory: ${resource.category}\nVersion: ${resource.version}\nAuthor: ${resource.uploadedBy}\nContent summary: ${resource.description}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.fileName || `${resource.title.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          {resource.type === 'video' ? (
            <Video className="w-5 h-5 text-indigo-600" />
          ) : resource.type === 'image' ? (
            <Image className="w-5 h-5 text-emerald-600" />
          ) : (
            <FileText className="w-5 h-5 text-blue-600" />
          )}
          <span className="text-base font-bold text-slate-900 truncate max-w-lg">
            {resource.title}
          </span>
        </div>
      }
      subtitle={`Category: ${resource.category} · Version: ${resource.version} · Size: ${resource.fileSize || 'N/A'}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-1.5 text-[#73777D]">
            <ShieldCheck className="w-4 h-4 text-[#4DBB70]" />
            <span>Watermarked & verified LoveInStore learning asset</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Asset
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Media Preview Box */}
        {resource.type === 'video' ? (
          <div className="bg-[#101411] rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center text-white relative shadow-inner border border-[#1A211A]">
            <Video className="w-12 h-12 text-[#A6F52F] mb-2 opacity-90" />
            <p className="font-semibold text-sm text-white">Interactive Media Stream</p>
            <p className="text-xs text-[#B8C0B8] mt-1 tabular-nums">Duration: {resource.durationMinutes || 15} minutes · 1080p HD</p>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between bg-[#1A211A]/90 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs border border-[#293629]">
              <span className="text-[#A6F52F] font-mono tabular-nums">00:00 / {resource.durationMinutes || 15}:00</span>
              <span className="text-[#B8C0B8]">LoveInStore Media Server Stream</span>
            </div>
          </div>
        ) : resource.category === 'Planograms' ? (
          <div className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-2xl p-6 text-center space-y-3">
            <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#ECEEF0] shadow-soft">
              <div className="h-7 bg-[#E9A84C]/15 rounded-lg mb-2 flex items-center justify-center text-[10px] font-semibold text-[#17191B]">
                TOP SHELF: Premium Packaged Sweets (Gulab Jamun / Rasgulla Cans)
              </div>
              <div className="h-9 bg-[#E9FBD1] border border-[#A6F52F]/60 rounded-lg mb-2 flex items-center justify-center text-xs font-semibold text-[#17191B]">
                GOLDEN ZONE (Eye-Level): Haldiram's Bhujia 400g & All-In-One Mixture
              </div>
              <div className="h-8 bg-[#F8F9F8] border border-[#ECEEF0] rounded-lg mb-2 flex items-center justify-center text-xs font-medium text-[#17191B]">
                TOUCH ZONE: Aloo Bhujia, Moong Dal & Mini Samosa Pouches
              </div>
              <div className="h-7 bg-[#F3F4F3] rounded-lg flex items-center justify-center text-[10px] font-medium text-[#73777D]">
                BOTTOM PALLET: Bulk Value Packs & Economy Family Bags
              </div>
            </div>
            <p className="text-xs text-[#73777D] font-medium">
              Schematic Planogram: 4-Tier Gondola Merchandising Standard (v2.0)
            </p>
          </div>
        ) : (
          <div className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#ECEEF0] pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#17191B] bg-white px-2.5 py-1 rounded-full border border-[#ECEEF0]">
                Official SOP Document
              </span>
              <h4 className="text-base font-semibold text-[#17191B] mt-2">{resource.title}</h4>
              <p className="text-xs text-[#73777D] mt-1">{resource.description}</p>
            </div>

            <div className="space-y-2 text-xs text-[#73777D] leading-relaxed bg-white p-4 rounded-xl border border-[#ECEEF0]">
              <p className="font-semibold text-[#17191B]">Standard Operating Checklist Summary:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify batch manufacturing date and shelf life before moving product from stockroom to sales floor.</li>
                <li>Ensure First-In-First-Out (FIFO) principle: older lots placed in front row, new lots placed to the rear.</li>
                <li>Conduct hourly facing checks ensuring zero deflated bags or torn packaging on display.</li>
                <li>Take geo-tagged, timestamped audit photograph on LIS Field App after daily replenishment.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tags and Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#73777D]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-[#17191B]">Tags:</span>
            {resource.tags.map((tag, i) => (
              <span key={i} className="bg-[#F8F9F8] text-[#73777D] px-2.5 py-0.5 rounded-full border border-[#ECEEF0] text-[11px]">
                #{tag}
              </span>
            ))}
          </div>
          <span className="tabular-nums">Uploaded by {resource.uploadedBy} on {resource.uploadDate}</span>
        </div>
      </div>
    </Modal>
  );
};
