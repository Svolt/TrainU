/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Communication & Announcements View
 * Implements Section 17 Communication and Notifications
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  BellRing,
  Send,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Mail
} from 'lucide-react';

export const CommunicationView: React.FC = () => {
  const { announcements, createAnnouncement, employees, currentTrainer, showToast } = useApp();

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('Dear {{employee_name}}, please note that mandatory training on {{program_name}} is scheduled.');
  const [category, setCategory] = useState<'General' | 'Policy' | 'Training Schedule' | 'Compliance'>('Training Schedule');
  const [targetBrand, setTargetBrand] = useState('All Brands');
  const [targetDesignation, setTargetDesignation] = useState('All Roles');
  const [channels, setChannels] = useState<('In-App' | 'SMS' | 'WhatsApp')[]>(['In-App', 'WhatsApp']);

  // Estimated recipient count based on criteria
  const estimatedRecipients = employees.filter(e => {
    const matchesBrand = targetBrand === 'All Brands' || e.brand === targetBrand;
    const matchesDesig = targetDesignation === 'All Roles' || e.designation === targetDesignation;
    return matchesBrand && matchesDesig;
  }).length;

  const handleSend = () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both title and announcement message.', 'error');
      return;
    }

    createAnnouncement({
      title,
      content,
      category,
      targetBrands: [targetBrand],
      targetDesignations: [targetDesignation],
      channels,
      recipientCount: estimatedRecipients || 15,
      status: 'Sent'
    });

    showToast(`Announcement "${title}" broadcasted to ${estimatedRecipients} recipients across ${channels.join(', ')}!`, 'success');
    setIsComposerOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#17191B] text-sm">Operational Broadcasts & Notifications</h3>
          <p className="text-[11px] text-[#73777D]">
            Send template-based announcements with safe variable substitution & audience review
          </p>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="monetra-btn-primary px-5 py-2.5 text-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          Compose Bulk Announcement
        </button>
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-3">
        {announcements.map(anc => (
          <div
            key={anc.id}
            className="bg-white rounded-2xl border border-[#ECEEF0] p-5 shadow-soft hover:shadow-md transition-all space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECEEF0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-[#F8F9F8] border border-[#ECEEF0] px-2.5 py-0.5 rounded-full font-bold text-[#17191B]">
                    {anc.id}
                  </span>
                  <Badge variant={anc.category === 'Compliance' ? 'red' : 'blue'} size="sm">
                    {anc.category}
                  </Badge>
                  <h4 className="font-bold text-[#17191B] text-sm">{anc.title}</h4>
                </div>
                <p className="text-[11px] text-[#73777D] mt-0.5 tabular-nums">
                  Sent by: <strong className="text-[#17191B]">{anc.sentBy}</strong> · {new Date(anc.sentAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="green" size="sm" dot>
                  {anc.status} ({anc.recipientCount} Recipients)
                </Badge>
              </div>
            </div>

            <p className="text-[#17191B] leading-relaxed text-xs">
              {anc.content}
            </p>

            <div className="pt-2 border-t border-[#ECEEF0] flex flex-wrap items-center justify-between text-[11px] text-[#73777D]">
              <div className="flex items-center gap-3">
                <span>Target: <strong className="text-[#17191B]">{anc.targetBrands.join(', ')}</strong> ({anc.targetDesignations.join(', ')})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-[#73777D]">Channels:</span>
                {anc.channels.map((ch, i) => (
                  <span key={i} className="bg-[#F8F9F8] border border-[#ECEEF0] text-[#17191B] px-2.5 py-0.5 rounded-full font-medium text-[10px]">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <Modal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          title="Compose Field Announcement"
          subtitle="Multi-channel template broadcast with recipient verification."
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-[#73777D] font-medium">
                Estimated Audience: <strong className="text-[#17191B] tabular-nums">{estimatedRecipients} Employees</strong>
              </span>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="monetra-btn-primary px-5 py-2 text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast to {estimatedRecipients} Recipients
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-[#17191B]">
            <div>
              <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">Announcement Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Planogram SOP v2.0 Rollout & Morning Attendance Alert"
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] placeholder-[#73777D] focus:bg-white focus:border-[#17191B] transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#17191B] transition-colors cursor-pointer"
                >
                  <option value="Training Schedule">Training Schedule</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Policy">Policy</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">Target Brand</label>
                <select
                  value={targetBrand}
                  onChange={e => setTargetBrand(e.target.value)}
                  className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#17191B] transition-colors cursor-pointer"
                >
                  <option value="All Brands">All Brands</option>
                  <option value="Haldiram's">Haldiram's</option>
                  <option value="Cadbury">Cadbury</option>
                  <option value="Nestle">Nestle</option>
                  <option value="Hindustan Unilever">Hindustan Unilever</option>
                  <option value="ITC Limited">ITC Limited</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">Target Designation</label>
                <select
                  value={targetDesignation}
                  onChange={e => setTargetDesignation(e.target.value)}
                  className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#17191B] transition-colors cursor-pointer"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Merchandiser">Merchandisers</option>
                  <option value="Promoter">Promoters</option>
                  <option value="Supervisor">Supervisors</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-[#17191B] uppercase text-[10px] tracking-wider">
                  Message Content (Template Variables Supported) *
                </label>
                <span className="text-[10px] text-[#73777D] font-mono">
                  Vars: {'{{employee_name}}'}, {'{{program_name}}'}, {'{{session_time}}'}
                </span>
              </div>
              <textarea
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#17191B] font-mono transition-colors"
              />
            </div>

            {/* Variable preview box */}
            <div className="p-3.5 bg-[#F8F9F8] rounded-xl border border-[#ECEEF0] text-[#17191B]">
              <span className="font-bold text-[10px] text-[#73777D] uppercase tracking-wider block mb-1">
                Live Trainee Preview (e.g. Rahul Sharma):
              </span>
              <p className="text-xs italic leading-relaxed text-[#17191B]">
                "{content
                  .replace('{{employee_name}}', 'Rahul Sharma')
                  .replace('{{program_name}}', "Haldiram's Modern Trade Standards")
                  .replace('{{session_time}}', '10:00 AM')}"
              </p>
            </div>

            {/* Delivery Channels */}
            <div>
              <label className="block font-semibold text-[#17191B] mb-1.5 uppercase text-[10px] tracking-wider">
                Dispatch Channels
              </label>
              <div className="flex items-center gap-4">
                {(['In-App', 'WhatsApp', 'SMS'] as ('In-App' | 'WhatsApp' | 'SMS')[]).map(ch => {
                  const isChecked = channels.includes(ch);
                  return (
                    <label key={ch} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setChannels(prev =>
                            isChecked ? prev.filter(c => c !== ch) : [...prev, ch]
                          );
                        }}
                        className="rounded text-[#101411] accent-[#101411] cursor-pointer"
                      />
                      <span className="font-medium text-[#17191B]">{ch}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
