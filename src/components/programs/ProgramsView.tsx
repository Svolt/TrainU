/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Training Programs Catalog View
 * Implements Section 6 Training Program Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrainingProgram, ProgramCategory } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Layers,
  CheckCircle2,
  Plus,
  ChevronRight,
  ExternalLink,
  Shield,
  FileCheck,
  FileText
} from 'lucide-react';

interface ProgramsViewProps {
  onOpenCreateProgram: () => void;
  onOpenAssign: (programId: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  onOpenCreateProgram,
  onOpenAssign
}) => {
  const { programs, resources } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [activeVersionNumber, setActiveVersionNumber] = useState<string>('');

  const filteredPrograms = programs.filter(p => {
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  const handleOpenDetail = (prog: TrainingProgram) => {
    setSelectedProgram(prog);
    setActiveVersionNumber(prog.currentVersion);
  };

  const currentVersionObj = selectedProgram?.versions.find(
    v => v.versionNumber === activeVersionNumber
  ) || selectedProgram?.versions[0];

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['All', 'Product', 'Operational', 'Onboarding', 'Compliance'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#17191B] text-white shadow-soft'
                  : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
              }`}
            >
              {cat} <span className="tabular-nums font-semibold ml-1">({cat === 'All' ? programs.length : programs.filter(p => p.category === cat).length})</span>
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCreateProgram}
          className="flex items-center gap-2 px-4 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Training Program
        </button>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map(prog => {
          const activeVersion = prog.versions.find(v => v.versionNumber === prog.currentVersion) || prog.versions[0];
          const totalMinutes = (activeVersion?.modules || []).reduce((acc, m) => acc + m.estimatedMinutes, 0);

          return (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-[#ECEEF0] p-5 shadow-soft hover:shadow-medium transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-[#F8F9F8] text-[#17191B] font-semibold px-2.5 py-1 rounded-full border border-[#ECEEF0]">
                      {prog.code}
                    </span>
                    <Badge variant={getStatusBadgeVariant(prog.status)} size="sm">
                      {prog.currentVersion} {prog.status}
                    </Badge>
                  </div>
                  <Badge variant="blue" size="sm">
                    {prog.brandAssociation}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-[#17191B] leading-snug mb-1">
                  {prog.name}
                </h3>
                <p className="text-xs text-[#73777D] line-clamp-2 leading-relaxed mb-3">
                  {prog.description}
                </p>

                {/* Metadata badges */}
                <div className="space-y-2 py-2.5 border-t border-[#ECEEF0] text-xs text-[#73777D]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A1A5AA]">Target Roles:</span>
                    <span className="font-medium text-[#17191B] truncate max-w-[170px]">
                      {prog.targetDesignations.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A1A5AA]">Curriculum Structure:</span>
                    <span className="font-medium text-[#17191B] tabular-nums">
                      {activeVersion?.modules?.length || 0} Modules ({Math.round(totalMinutes / 60)} hrs)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A1A5AA]">Passing Threshold:</span>
                    <span className="font-semibold text-[#4DBB70] tabular-nums">
                      {activeVersion?.passingScore || 80}% Passing Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#ECEEF0] flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleOpenDetail(prog)}
                  className="text-xs text-[#17191B] hover:text-[#4DBB70] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View Modules &rarr;
                </button>
                <button
                  onClick={() => onOpenAssign(prog.id)}
                  className="px-4 py-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Assign to Employees
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <Modal
          isOpen={Boolean(selectedProgram)}
          onClose={() => setSelectedProgram(null)}
          title={
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#17191B]">{selectedProgram.name}</span>
              <span className="text-xs font-mono font-medium text-[#A1A5AA]">({selectedProgram.code})</span>
            </div>
          }
          subtitle={`Brand: ${selectedProgram.brandAssociation} · Category: ${selectedProgram.category}`}
          maxWidth="4xl"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-[#73777D] tabular-nums">
                Created: {new Date(selectedProgram.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onOpenAssign(selectedProgram.id);
                    setSelectedProgram(null);
                  }}
                  className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
                >
                  Assign Program
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-[#17191B]">
            {/* Version Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] w-fit">
              <span className="font-semibold text-[#17191B] text-xs px-2.5">Version History:</span>
              {selectedProgram.versions.map(v => (
                <button
                  key={v.versionId}
                  onClick={() => setActiveVersionNumber(v.versionNumber)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeVersionNumber === v.versionNumber
                      ? 'bg-[#17191B] text-white shadow-soft'
                      : 'bg-white text-[#73777D] border border-[#ECEEF0] hover:text-[#17191B]'
                  }`}
                >
                  {v.versionNumber} ({v.status})
                </button>
              ))}
            </div>

            {/* Version details summary */}
            {currentVersionObj && (
              <div className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17191B]">Version {currentVersionObj.versionNumber} Rules</span>
                  <span className="text-[11px] text-[#73777D] tabular-nums">Effective: {currentVersionObj.effectiveDate}</span>
                </div>
                <p className="text-[11px] text-[#73777D]">{currentVersionObj.changeSummary}</p>
                <div className="flex flex-wrap gap-4 pt-1 font-medium text-[11px] text-[#17191B]">
                  <span>Passing Score: <strong className="tabular-nums">{currentVersionObj.passingScore}%</strong></span>
                  <span>Max Attempts: <strong className="tabular-nums">{currentVersionObj.maxAssessmentAttempts}</strong></span>
                  <span>Practical Follow-up Required: <strong>{currentVersionObj.requiresPracticalFollowUp ? 'Yes' : 'No'}</strong></span>
                  <span>Certification: <strong>{currentVersionObj.requiresCertification ? 'Yes (180 days)' : 'No'}</strong></span>
                </div>
              </div>
            )}

            {/* Objectives */}
            <div>
              <h4 className="font-semibold text-[#17191B] mb-1.5 uppercase tracking-wider text-[11px]">
                Training Objectives
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[#73777D]">
                {selectedProgram.trainingObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Modules List */}
            <div>
              <h4 className="font-semibold text-[#17191B] mb-2 uppercase tracking-wider text-[11px]">
                Modular Curriculum Sequence ({currentVersionObj?.modules?.length || 0} Modules)
              </h4>

              <div className="space-y-2">
                {(currentVersionObj?.modules || []).map(mod => {
                  const linkedDocs = resources.filter(r => mod.linkedResourceIds.includes(r.id));
                  return (
                    <div
                      key={mod.id}
                      className="p-3.5 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold text-[#73777D] border border-[#ECEEF0]">
                            Seq {mod.sequence}
                          </span>
                          <span className="font-semibold text-[#17191B]">{mod.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={mod.deliveryMode === 'physical' ? 'blue' : 'purple'} size="sm">
                            {mod.deliveryMode}
                          </Badge>
                          {mod.isMandatory && (
                            <Badge variant="amber" size="sm">Mandatory</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-[#73777D] text-[11px]">{mod.description}</p>

                      <div className="flex items-center justify-between text-[11px] text-[#73777D] pt-1.5 border-t border-[#ECEEF0]">
                        <span>Est. Duration: <strong className="text-[#17191B] tabular-nums">{mod.estimatedMinutes} mins</strong></span>
                        {linkedDocs.length > 0 && (
                          <span className="text-[#4D91D8] font-medium">
                            Linked: {linkedDocs.map(d => d.title).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
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
