/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ResourceType, ResourceCategory } from '../../types';
import { Upload, FileText } from 'lucide-react';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addLearningResource, currentTrainer, programs, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('pdf');
  const [category, setCategory] = useState<ResourceCategory>('Standard Operating Procedures');
  const [tags, setTags] = useState('Planogram, Modern Trade, Haldirams');
  const [version, setVersion] = useState('v1.0');
  const [associatedProgramId, setAssociatedProgramId] = useState(programs[0]?.id || '');

  const handleUpload = () => {
    if (!title.trim()) {
      showToast('Please enter a resource title.', 'error');
      return;
    }

    addLearningResource({
      title,
      description,
      type,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.${type}`,
      fileSize: '3.4 MB',
      version,
      uploadedBy: currentTrainer.name,
      associatedPrograms: [associatedProgramId],
      accessRole: 'all'
    });

    showToast(`Learning resource "${title}" uploaded and catalogued successfully!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Learning Resource"
      subtitle="Publish training materials, SOPs, planograms, or video modules to the library."
      maxWidth="lg"
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
            onClick={handleUpload}
            className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] font-semibold rounded-full cursor-pointer transition-colors"
          >
            Upload to Library
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#17191B]">
        <div>
          <label className="block font-medium text-[#17191B] mb-1">Resource Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Quick Commerce Dark Store Merchandising Guide.pdf"
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">File / Media Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] font-medium focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="pdf">PDF Document</option>
              <option value="video">MP4 Video Recording</option>
              <option value="sop">SOP Manual</option>
              <option value="presentation">PPT Presentation</option>
              <option value="image">Planogram / High-res Image</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Resource Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] font-medium focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="Standard Operating Procedures">Standard Operating Procedures</option>
              <option value="Planograms">Planograms</option>
              <option value="Demonstration Videos">Demonstration Videos</option>
              <option value="Product Materials">Product Materials</option>
              <option value="Brand Guidelines">Brand Guidelines</option>
              <option value="Assessment Guides">Assessment Guides</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Version</label>
            <input
              type="text"
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="e.g. v2.1"
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Link to Program</label>
            <select
              value={associatedProgramId}
              onChange={e => setAssociatedProgramId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] font-medium focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#17191B] mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="FIFO, Merchandising, Audit"
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block font-medium text-[#17191B] mb-1">Resource Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Operational purpose, target designation, and expected learning outcome..."
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>
      </div>
    </Modal>
  );
};
