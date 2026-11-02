/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ProgramCategory, DeliveryMode, Designation, LearningModule } from '../../types';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createProgram, resources, showToast } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState("Haldiram's");
  const [category, setCategory] = useState<ProgramCategory>('Product');
  const [designations, setDesignations] = useState<Designation[]>(['Merchandiser']);
  const [deliveryModes, setDeliveryModes] = useState<DeliveryMode[]>(['hybrid']);
  const [passingScore, setPassingScore] = useState(80);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [modules, setModules] = useState<Omit<LearningModule, 'id' | 'programId'>[]>([
    {
      sequence: 1,
      title: 'Module 1: Product Architecture & Planogram Standards',
      description: 'Understanding shelf tiers and golden zone rules.',
      estimatedMinutes: 45,
      isMandatory: true,
      deliveryMode: 'digital',
      linkedResourceIds: [],
      hasKnowledgeCheck: true,
      quizPassingScore: 80
    }
  ]);

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      {
        sequence: prev.length + 1,
        title: `Module ${prev.length + 1}: Practical Field Demonstration`,
        description: 'Hands-on store simulation.',
        estimatedMinutes: 60,
        isMandatory: true,
        deliveryMode: 'physical',
        linkedResourceIds: [],
        hasKnowledgeCheck: false
      }
    ]);
  };

  const handleRemoveModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      showToast('Please fill in program name and code.', 'error');
      return;
    }

    createProgram({
      name,
      code,
      description,
      brandAssociation: brand,
      category,
      targetDesignations: designations,
      deliveryModes,
      versions: [
        {
          versionId: `VER-${Date.now()}`,
          versionNumber: 'v1.0',
          effectiveDate: new Date().toISOString().split('T')[0],
          changeSummary: 'Initial release',
          status: 'Active',
          passingScore,
          maxAssessmentAttempts: maxAttempts,
          requiresPracticalFollowUp: true,
          requiresCertification: true,
          modules: modules.map((m, idx) => ({
            ...m,
            id: `MOD-NEW-${idx + 1}`,
            programId: code
          }))
        }
      ]
    });

    showToast(`Program "${name}" successfully created and published!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Training Program"
      subtitle="Define curriculum objectives, delivery modes, and modular sequence."
      maxWidth="3xl"
      footer={
        <div className="flex justify-end gap-2 w-full text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] font-semibold rounded-full cursor-pointer transition-colors"
          >
            Save & Publish Program
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#17191B]">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Program Title *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Modern Trade Dairy Merchandising"
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Program Code *</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. HAL-DRY-2024"
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden font-mono uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Brand Association</label>
            <select
              value={brand}
              onChange={e => setBrand(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] font-medium focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="Haldiram's">Haldiram's</option>
              <option value="Cadbury">Cadbury</option>
              <option value="Hindustan Unilever">Hindustan Unilever</option>
              <option value="Nestle">Nestle</option>
              <option value="ITC Limited">ITC Limited</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] font-medium focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="Product">Product</option>
              <option value="Operational">Operational</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Compliance">Compliance</option>
              <option value="Refresher">Refresher</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Exam Passing Score (%)</label>
            <input
              type="number"
              value={passingScore}
              onChange={e => setPassingScore(Number(e.target.value))}
              min={50}
              max={100}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] tabular-nums focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#17191B] mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Operational purpose, skills covered, and field readiness criteria..."
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        {/* Modules Builder */}
        <div className="pt-2 border-t border-[#ECEEF0]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[#17191B] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#17191B]" />
              Curriculum Modules ({modules.length})
            </h4>
            <button
              type="button"
              onClick={handleAddModule}
              className="flex items-center gap-1 text-xs text-[#17191B] hover:text-[#4DBB70] font-medium cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Module
            </button>
          </div>

          <div className="space-y-2">
            {modules.map((mod, idx) => (
              <div key={idx} className="p-3.5 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-[#ECEEF0]">
                      Seq {mod.sequence}
                    </span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={e => {
                        const val = e.target.value;
                        setModules(m => m.map((item, i) => i === idx ? { ...item, title: val } : item));
                      }}
                      className="flex-1 bg-white border border-[#ECEEF0] rounded-lg px-2.5 py-1 text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F]"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#73777D]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mod.isMandatory}
                        onChange={e => {
                          const val = e.target.checked;
                          setModules(m => m.map((item, i) => i === idx ? { ...item, isMandatory: val } : item));
                        }}
                        className="rounded accent-[#17191B]"
                      />
                      <span>Mandatory</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mod.hasKnowledgeCheck}
                        onChange={e => {
                          const val = e.target.checked;
                          setModules(m => m.map((item, i) => i === idx ? { ...item, hasKnowledgeCheck: val } : item));
                        }}
                        className="rounded accent-[#17191B]"
                      />
                      <span>Knowledge Check</span>
                    </label>
                    <span className="tabular-nums">Est. {mod.estimatedMinutes} mins</span>
                  </div>
                </div>

                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(idx)}
                    className="p-1.5 text-[#E56C6C] hover:bg-[#E56C6C]/10 rounded-full cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
