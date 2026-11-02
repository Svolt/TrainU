/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Employee Directory View
 * Implements Section 5 Employee Management & Directory
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, Designation, ReadinessStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';

interface EmployeeDirectoryViewProps {
  onOpenEmployee: (empId: string, initialTab?: string) => void;
  onOpenBulkAssign: (selectedIds: string[]) => void;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  onOpenEmployee,
  onOpenBulkAssign
}) => {
  const { employees } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDesignation = designationFilter === 'All' || emp.designation === designationFilter;
      const matchesBrand = brandFilter === 'All' || emp.brand === brandFilter;
      const matchesReadiness = readinessFilter === 'All' || emp.currentReadiness === readinessFilter;
      const matchesRegion = regionFilter === 'All' || emp.region === regionFilter;

      return matchesSearch && matchesDesignation && matchesBrand && matchesReadiness && matchesRegion;
    });
  }, [employees, searchQuery, designationFilter, brandFilter, readinessFilter, regionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedEmployees.map(e => e.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Quick chips
  const totalCount = employees.length;
  const readyCount = employees.filter(e => e.currentReadiness === 'Training Ready').length;
  const inTrainingCount = employees.filter(e => e.currentReadiness === 'In Training').length;
  const attentionCount = employees.filter(e => e.currentReadiness === 'Needs Attention').length;
  const untrainedCount = employees.filter(e => e.currentReadiness === 'Untrained').length;

  return (
    <div className="space-y-4">
      {/* Quick Status Segment Filters - Monetra Rounded Pill Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => { setReadinessFilter('All'); setCurrentPage(1); }}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
            readinessFilter === 'All'
              ? 'bg-[#17191B] text-white shadow-soft'
              : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
          }`}
        >
          All Employees <span className="tabular-nums font-semibold ml-1">({totalCount})</span>
        </button>
        <button
          onClick={() => { setReadinessFilter('Training Ready'); setCurrentPage(1); }}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
            readinessFilter === 'Training Ready'
              ? 'bg-[#4DBB70] text-white shadow-soft'
              : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
          }`}
        >
          Training Ready <span className="tabular-nums font-semibold ml-1">({readyCount})</span>
        </button>
        <button
          onClick={() => { setReadinessFilter('In Training'); setCurrentPage(1); }}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
            readinessFilter === 'In Training'
              ? 'bg-[#4D91D8] text-white shadow-soft'
              : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
          }`}
        >
          In Training <span className="tabular-nums font-semibold ml-1">({inTrainingCount})</span>
        </button>
        <button
          onClick={() => { setReadinessFilter('Needs Attention'); setCurrentPage(1); }}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
            readinessFilter === 'Needs Attention'
              ? 'bg-[#E56C6C] text-white shadow-soft'
              : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
          }`}
        >
          Needs Attention <span className="tabular-nums font-semibold ml-1">({attentionCount})</span>
        </button>
        <button
          onClick={() => { setReadinessFilter('Untrained'); setCurrentPage(1); }}
          className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
            readinessFilter === 'Untrained'
              ? 'bg-[#73777D] text-white shadow-soft'
              : 'bg-white text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] border border-[#ECEEF0]'
          }`}
        >
          Untrained <span className="tabular-nums font-semibold ml-1">({untrainedCount})</span>
        </button>
      </div>

      {/* Filter and Search Bar - Monetra Card */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECEEF0] shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, ID (EMP-10023), city, territory..."
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] text-xs pl-10 pr-4 py-2 rounded-full text-[#17191B] placeholder-[#A1A5AA] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Designation */}
            <select
              value={designationFilter}
              onChange={e => { setDesignationFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F9F8] border border-[#ECEEF0] text-xs rounded-full px-3.5 py-1.5 text-[#17191B] font-medium focus:outline-hidden focus:border-[#A6F52F] cursor-pointer"
            >
              <option value="All">All Designations</option>
              <option value="Merchandiser">Merchandiser</option>
              <option value="Promoter">Promoter</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Program Manager">Program Manager</option>
            </select>

            {/* Brand */}
            <select
              value={brandFilter}
              onChange={e => { setBrandFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F9F8] border border-[#ECEEF0] text-xs rounded-full px-3.5 py-1.5 text-[#17191B] font-medium focus:outline-hidden focus:border-[#A6F52F] cursor-pointer"
            >
              <option value="All">All Brands</option>
              <option value="Haldiram's">Haldiram's</option>
              <option value="Cadbury">Cadbury</option>
              <option value="Hindustan Unilever">Hindustan Unilever</option>
              <option value="Nestle">Nestle</option>
              <option value="ITC Limited">ITC Limited</option>
            </select>

            {/* Region */}
            <select
              value={regionFilter}
              onChange={e => { setRegionFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F9F8] border border-[#ECEEF0] text-xs rounded-full px-3.5 py-1.5 text-[#17191B] font-medium focus:outline-hidden focus:border-[#A6F52F] cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North">North Zone</option>
              <option value="West">West Zone</option>
              <option value="South">South Zone</option>
              <option value="East">East Zone</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar when selected - Monetra Dark Material Card */}
        {selectedIds.length > 0 && (
          <div className="bg-[#101411] text-white p-3 rounded-xl border border-[#1A211A] flex items-center justify-between text-xs animate-in fade-in duration-150">
            <span className="font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A6F52F]"></span>
              <strong className="tabular-nums font-semibold">{selectedIds.length}</strong> employee(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenBulkAssign(selectedIds)}
                className="px-4 py-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
              >
                Assign Training Curriculum
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 text-[#B8C0B8] hover:text-white rounded-full cursor-pointer transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Master Table - Monetra Surface Card */}
      <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9F8] border-b border-[#ECEEF0] text-[#73777D] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedEmployees.length > 0 &&
                      selectedIds.length === paginatedEmployees.length
                    }
                    onChange={handleSelectAll}
                    className="rounded accent-[#17191B] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Employee Details</th>
                <th className="py-3 px-4">Role & Brand</th>
                <th className="py-3 px-4">Territory & Reporting</th>
                <th className="py-3 px-4">Field Readiness</th>
                <th className="py-3 px-4 text-center">Active Curriculum</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF0] text-[#17191B]">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#A1A5AA]">
                    No employees matching the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map(emp => {
                  const isSelected = selectedIds.includes(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#F8F9F8] transition-colors ${
                        isSelected ? 'bg-[#E9FBD1]/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(emp.id)}
                          className="rounded accent-[#17191B] cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div
                          onClick={() => onOpenEmployee(emp.id)}
                          className="cursor-pointer group"
                        >
                          <span className="font-semibold text-[#17191B] group-hover:text-[#4DBB70] transition-colors block">
                            {emp.name}
                          </span>
                          <span className="text-[10px] text-[#A1A5AA] font-mono tabular-nums">
                            {emp.id} · {emp.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-[#17191B] block">{emp.designation}</span>
                        <span className="text-[#73777D] text-[11px]">{emp.brand}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[#17191B] block font-medium">{emp.city}, {emp.state}</span>
                        <span className="text-[10px] text-[#73777D] truncate block max-w-xs">{emp.territory}</span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(emp.currentReadiness)} size="sm" dot>
                          {emp.currentReadiness}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-bold tabular-nums text-[#17191B]">{emp.activeAssignmentCount}</span>
                        <span className="text-[#A1A5AA] text-[10px] ml-1">active</span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEmployee(emp.id, 'journey')}
                            className="px-3 py-1 text-xs font-medium text-[#17191B] bg-[#F8F9F8] hover:bg-white hover:border-[#17191B] border border-[#ECEEF0] rounded-full cursor-pointer transition-colors"
                          >
                            Journey &rarr;
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - Monetra Style */}
        <div className="p-3 border-t border-[#ECEEF0] flex items-center justify-between text-xs text-[#73777D] bg-[#F8F9F8]/50">
          <span className="tabular-nums">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredEmployees.length)} of{' '}
            {filteredEmployees.length} employees
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-full border border-[#ECEEF0] bg-white text-[#17191B] hover:bg-[#F8F9F8] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-semibold text-[#17191B] tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full border border-[#ECEEF0] bg-white text-[#17191B] hover:bg-[#F8F9F8] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
