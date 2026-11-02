/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Learning Resources Library View
 * Implements Section 7 Learning Modules and Resource Library
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningResource, ResourceCategory } from '../../types';
import { Badge } from '../common/Badge';
import { ResourcePreviewModal } from './ResourcePreviewModal';
import { UploadResourceModal } from './UploadResourceModal';
import {
  FolderArchive,
  FileText,
  Video,
  Image,
  Upload,
  Search,
  ExternalLink,
  Download,
  Eye,
  Filter
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { resources } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const categories = [
    'All',
    'Planograms',
    'Standard Operating Procedures',
    'Demonstration Videos',
    'Product Materials',
    'Assessment Guides'
  ];

  const filteredResources = resources.filter(res => {
    const matchesCategory = categoryFilter === 'All' || res.category === categoryFilter;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECEEF0] shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search planograms, SOPs, videos, tags..."
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] text-xs pl-10 pr-4 py-2 rounded-full text-[#17191B] placeholder-[#A1A5AA] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden transition-colors"
            />
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            Upload New Resource
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-[#ECEEF0]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#17191B] text-white shadow-soft'
                  : 'bg-[#F8F9F8] text-[#73777D] hover:text-[#17191B] hover:bg-white border border-[#ECEEF0]'
              }`}
            >
              {cat} <span className="tabular-nums font-semibold ml-1">({cat === 'All' ? resources.length : resources.filter(r => r.category === cat).length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          let Icon = FileText;
          if (res.type === 'video') Icon = Video;
          if (res.type === 'image' || res.category === 'Planograms') Icon = Image;

          return (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className="bg-white rounded-2xl border border-[#ECEEF0] p-4 shadow-soft hover:shadow-medium transition-all flex flex-col justify-between cursor-pointer group hover:border-[#DFE2E5]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#F8F9F8] border border-[#ECEEF0] text-[#17191B] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="slate" size="sm">
                    {res.version} · {res.fileSize || 'N/A'}
                  </Badge>
                </div>

                <h4 className="font-semibold text-xs text-[#17191B] leading-snug mb-1 line-clamp-2">
                  {res.title}
                </h4>
                <p className="text-[11px] text-[#73777D] line-clamp-2 leading-relaxed mb-3">
                  {res.description}
                </p>

                {/* Category & Tags */}
                <div className="space-y-1.5 pt-2 border-t border-[#ECEEF0] text-[10px]">
                  <div className="flex items-center justify-between text-[#73777D]">
                    <span className="font-medium text-[#17191B]">{res.category}</span>
                    <span className="tabular-nums">Uploaded {res.uploadDate}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {res.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="bg-[#F8F9F8] text-[#73777D] px-2 py-0.5 rounded-full border border-[#ECEEF0]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#ECEEF0] flex items-center justify-between gap-2 mt-3">
                <button
                  onClick={() => setSelectedResource(res)}
                  className="flex items-center gap-1.5 text-xs text-[#17191B] hover:text-[#4DBB70] font-medium cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview Asset
                </button>
                <button
                  onClick={() => setSelectedResource(res)}
                  className="px-3.5 py-1 bg-[#F8F9F8] hover:bg-white text-[#17191B] border border-[#ECEEF0] rounded-full text-xs font-medium cursor-pointer transition-colors"
                >
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Preview Modal */}
      <ResourcePreviewModal
        isOpen={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />

      {/* Upload Resource Modal */}
      <UploadResourceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
