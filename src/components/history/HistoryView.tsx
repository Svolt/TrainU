/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Training History & Audit Trail View
 * Implements Section 18 Training History, Audit Trail and Employee Journey
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { History, ShieldCheck, User, Calendar, FileText, Search, ArrowRight } from 'lucide-react';

export const HistoryView: React.FC<{ onOpenEmployee: (empId: string, initialTab?: string) => void }> = ({ onOpenEmployee }) => {
  const { auditLogs, timelineEvents, employees, trainers, currentTrainer } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'trainer' | 'journey'>('audit');
  const [selectedTrainerId, setSelectedTrainerId] = useState(currentTrainer.id);
  const [selectedEmpId, setSelectedEmpId] = useState('EMP-10023'); // Rahul Sharma default
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTrainerObj = trainers.find(t => t.id === selectedTrainerId) || trainers[0];
  const trainerTimeline = timelineEvents.filter(e => e.actorName === selectedTrainerObj.name);

  const selectedEmpObj = employees.find(e => e.id === selectedEmpId) || employees[0];
  const empTimeline = timelineEvents
    .filter(e => e.employeeId === selectedEmpObj.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-[#F8F9F8] p-1.5 rounded-full border border-[#ECEEF0]">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            System Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'trainer'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Trainer Activity Log
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'journey'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Employee Journey Explorer
          </button>
        </div>

        <span className="text-xs text-[#73777D] font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#A6F52F] fill-[#101411]" />
          Append-only immutability enforced
        </span>
      </div>

      {/* SUBTAB 1: SYSTEM AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-soft overflow-hidden space-y-3">
          <div className="p-4 border-b border-[#ECEEF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9F8]">
            <div>
              <h3 className="font-bold text-[#17191B] text-sm">Enterprise System Audit Events</h3>
              <p className="text-[11px] text-[#73777D]">
                Mandatory operational record of attendance corrections, certificate revocations, and policy edits
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#73777D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search audit records..."
                className="w-full bg-white border border-[#ECEEF0] text-xs pl-9 pr-3.5 py-2 rounded-full text-[#17191B] placeholder-[#73777D] focus:outline-hidden focus:border-[#17191B] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9F8] border-b border-[#ECEEF0] text-[#73777D] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Justification / Reason</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF0] text-[#17191B]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#F8F9F8]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#17191B]">{log.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#17191B]">
                      <Badge variant="blue" size="sm">{log.eventType}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#17191B]">{log.entityType}</span>
                      <span className="text-[10px] text-[#73777D] block font-mono">{log.entityId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#17191B] block">{log.actorName}</span>
                      <span className="text-[10px] text-[#73777D] capitalize">{log.actorRole.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-[11px] text-[#73777D] truncate" title={log.reason}>
                        {log.reason}
                      </p>
                      {log.previousValue && log.newValue && (
                        <p className="text-[10px] text-[#73777D] mt-0.5 truncate">
                          {log.previousValue} &rarr; <strong className="text-[#17191B]">{log.newValue}</strong>
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-[11px] text-[#73777D] font-mono tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TRAINER ACTIVITY LOG */}
      {activeTab === 'trainer' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#ECEEF0] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#17191B]">Select Trainer:</span>
              <select
                value={selectedTrainerId}
                onChange={e => setSelectedTrainerId(e.target.value)}
                className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl px-3 py-2 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#17191B] transition-colors cursor-pointer"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role.replace('_', ' ')}) · {t.totalSessionsConducted} Sessions
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-[#73777D]">
              Total Recorded Actions: <strong className="text-[#17191B] tabular-nums">{trainerTimeline.length}</strong>
            </div>
          </div>

          <div className="space-y-2.5">
            {trainerTimeline.map(evt => (
              <div key={evt.id} className="bg-white p-4 rounded-2xl border border-[#ECEEF0] shadow-soft flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#17191B]">{evt.title}</span>
                    <Badge variant="blue" size="sm">{evt.eventType}</Badge>
                  </div>
                  <p className="text-[#73777D] text-[11px]">{evt.description}</p>
                </div>
                <span className="text-[10px] text-[#73777D] font-mono shrink-0 tabular-nums">
                  {new Date(evt.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EMPLOYEE JOURNEY EXPLORER */}
      {activeTab === 'journey' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#ECEEF0] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#17191B]">Select Employee:</span>
              <select
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl px-3 py-2 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#17191B] transition-colors cursor-pointer"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id}) · {e.designation} · {e.brand} [{e.currentReadiness}]
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onOpenEmployee(selectedEmpId, 'journey')}
              className="monetra-btn-primary px-4 py-2 text-xs cursor-pointer"
            >
              Open Full Profile &rarr;
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#ECEEF0] shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECEEF0] pb-3">
              <div>
                <h4 className="font-bold text-base text-[#17191B]">{selectedEmpObj.name}</h4>
                <p className="text-xs text-[#73777D]">
                  {selectedEmpObj.id} · {selectedEmpObj.designation} · {selectedEmpObj.brand}
                </p>
              </div>
              <Badge variant={selectedEmpObj.currentReadiness === 'Training Ready' ? 'green' : 'blue'}>
                {selectedEmpObj.currentReadiness}
              </Badge>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ECEEF0]">
              {empTimeline.map((evt, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-[#101411] bg-[#A6F52F]" />
                  <div className="bg-[#F8F9F8] p-3.5 rounded-2xl border border-[#ECEEF0] text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#17191B]">{evt.title}</span>
                      <span className="text-[10px] text-[#73777D] font-mono tabular-nums">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#73777D] text-[11px]">{evt.description}</p>
                    <p className="text-[10px] text-[#73777D]">Recorded by: {evt.actorName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
