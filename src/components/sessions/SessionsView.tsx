/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Batches & Sessions Management View
 * Implements Section 9 & 10 Batch & Training Session Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrainingSession, TrainingBatch, SessionType } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import { TakeAttendanceModal } from './TakeAttendanceModal';
import { CreateSessionModal } from './CreateSessionModal';
import {
  CalendarDays,
  Layers,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  Calendar,
  List,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const SessionsView: React.FC = () => {
  const { sessions, batches, currentTrainer, employees } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'sessions' | 'batches'>('sessions');
  const [viewFormat, setViewFormat] = useState<'list' | 'calendar'>('list');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedSessionIdForAttendance, setSelectedSessionIdForAttendance] = useState<string | null>(null);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<TrainingBatch | null>(null);

  const filteredSessions = sessions.filter(s => {
    const matchesMode =
      modeFilter === 'All' ||
      (modeFilter === 'Physical' && s.sessionType === 'field/practical') ||
      (modeFilter === 'Digital' && s.isOnline) ||
      (modeFilter === 'Classroom' && s.sessionType === 'classroom');
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesMode && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Sub tabs & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#F8F9F8] p-1 rounded-full border border-[#ECEEF0] flex items-center text-xs font-medium gap-1">
            <button
              onClick={() => setActiveSubTab('sessions')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeSubTab === 'sessions'
                  ? 'bg-[#17191B] text-white shadow-soft font-semibold'
                  : 'text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              Scheduled Sessions <span className="tabular-nums ml-1">({sessions.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('batches')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeSubTab === 'batches'
                  ? 'bg-[#17191B] text-white shadow-soft font-semibold'
                  : 'text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              Training Batches <span className="tabular-nums ml-1">({batches.length})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'sessions' && (
            <div className="flex items-center bg-white border border-[#ECEEF0] rounded-full p-1 text-xs">
              <button
                onClick={() => setViewFormat('list')}
                className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                  viewFormat === 'list' ? 'bg-[#17191B] text-white' : 'text-[#73777D] hover:text-[#17191B]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewFormat('calendar')}
                className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                  viewFormat === 'calendar' ? 'bg-[#17191B] text-white' : 'text-[#73777D] hover:text-[#17191B]'
                }`}
                title="Calendar View"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCreateSessionOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule New Session
          </button>
        </div>
      </div>

      {/* SESSIONS SUBTAB */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#ECEEF0] shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#17191B]">Filter By:</span>
              <select
                value={modeFilter}
                onChange={e => setModeFilter(e.target.value)}
                className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3.5 py-1.5 text-[#17191B] font-medium cursor-pointer focus:outline-hidden"
              >
                <option value="All">All Delivery Modes</option>
                <option value="Physical">Field / Practical Store</option>
                <option value="Classroom">Classroom</option>
                <option value="Digital">Digital / Online</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3.5 py-1.5 text-[#17191B] font-medium cursor-pointer focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <span className="text-[#73777D] tabular-nums">
              Showing {filteredSessions.length} session(s)
            </span>
          </div>

          {/* List View */}
          {viewFormat === 'list' ? (
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-[#ECEEF0] p-4 shadow-soft hover:shadow-medium transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] bg-[#F8F9F8] text-[#17191B] font-semibold px-2.5 py-0.5 rounded-full border border-[#ECEEF0]">
                        {session.id}
                      </span>
                      <h4 className="font-semibold text-xs text-[#17191B]">{session.title}</h4>
                      <Badge variant={session.isOnline ? 'purple' : 'blue'} size="sm">
                        {session.sessionType}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(session.status)} size="sm">
                        {session.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#73777D]">
                      <strong className="text-[#17191B]">Program:</strong> {session.programName}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#73777D] pt-1">
                      <span className="flex items-center gap-1 font-medium text-[#17191B] tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-[#4D91D8]" />
                        {session.date} ({session.startTime} - {session.endTime})
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#A1A5AA] shrink-0" />
                        <span className="truncate">{session.venueOrLink}</span>
                      </span>
                      <span className="flex items-center gap-1 tabular-nums">
                        <Users className="w-3.5 h-3.5 text-[#A1A5AA]" />
                        {session.attendanceRecords.length} Enrolled (Cap: {session.capacity})
                      </span>
                    </div>

                    {session.sessionNotes && (
                      <p className="text-[11px] text-[#73777D] italic bg-[#F8F9F8] p-2.5 rounded-xl border border-[#ECEEF0] mt-2">
                        "{session.sessionNotes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedSessionIdForAttendance(session.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        session.status === 'Completed'
                          ? 'bg-[#F8F9F8] hover:bg-white text-[#17191B] border border-[#ECEEF0]'
                          : 'bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B]'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {session.status === 'Completed' ? 'Inspect Register' : 'Take Attendance'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Calendar View */
            <div className="bg-white rounded-2xl border border-[#ECEEF0] p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[#17191B] text-sm">Monthly Session Schedule (Q4 2024)</h4>
                <span className="text-xs text-[#73777D] font-mono">IST (UTC+05:30)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-semibold text-[#A1A5AA] uppercase text-[10px] py-1">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const matching = sessions.filter(
                    s => s.date.endsWith(`-${String(day).padStart(2, '0')}`)
                  );

                  return (
                    <div
                      key={day}
                      className={`min-h-24 p-2 border rounded-xl text-left transition-colors flex flex-col justify-between ${
                        matching.length > 0 ? 'bg-[#E9FBD1]/40 border-[#A6F52F]/40' : 'bg-[#F8F9F8]/60 border-[#ECEEF0]'
                      }`}
                    >
                      <span className="font-semibold text-[10px] text-[#73777D] tabular-nums">{day}</span>
                      <div className="space-y-1">
                        {matching.map(s => (
                          <div
                            key={s.id}
                            onClick={() => setSelectedSessionIdForAttendance(s.id)}
                            className="bg-white p-1 rounded-lg border border-[#ECEEF0] text-[10px] font-medium text-[#17191B] truncate shadow-soft cursor-pointer hover:border-[#17191B]"
                            title={s.title}
                          >
                            {s.startTime} {s.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BATCHES SUBTAB */}
      {activeSubTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map(batch => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-[#ECEEF0] p-5 shadow-soft space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-[#F8F9F8] px-2.5 py-0.5 rounded-full font-semibold text-[#17191B] border border-[#ECEEF0]">
                      {batch.code}
                    </span>
                    <Badge variant={getStatusBadgeVariant(batch.status)} size="sm">
                      {batch.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-[#17191B] mt-1">{batch.name}</h4>
                  <p className="text-xs text-[#73777D]">{batch.programName} ({batch.programVersion})</p>
                </div>
                <Badge variant="blue" size="sm">{batch.mode}</Badge>
              </div>

              <div className="space-y-1 text-xs text-[#73777D]">
                <p>Location: <strong className="text-[#17191B]">{batch.location}</strong></p>
                <p>Timeline: <strong className="text-[#17191B] tabular-nums">{batch.startDate} to {batch.endDate}</strong></p>
                <p>Facilitator: <strong className="text-[#17191B]">{batch.trainerName}</strong></p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-[#17191B] mb-1">
                  <span>Batch Completion Rate</span>
                  <span className="tabular-nums font-semibold">{batch.completionRatePercent}%</span>
                </div>
                <div className="w-full bg-[#ECEEF0] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A6F52F] rounded-full"
                    style={{ width: `${batch.completionRatePercent}%` }}
                  />
                </div>
              </div>

              {/* Roster preview */}
              <div className="pt-2 border-t border-[#ECEEF0] flex items-center justify-between text-xs">
                <span className="text-[#73777D] font-normal tabular-nums">
                  {batch.enrolledCount} of {batch.capacity} seats filled
                </span>
                <button
                  onClick={() => setSelectedBatch(batch)}
                  className="text-[#17191B] hover:text-[#4DBB70] font-medium cursor-pointer transition-colors"
                >
                  View Participant Roster &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Modal */}
      <TakeAttendanceModal
        isOpen={Boolean(selectedSessionIdForAttendance)}
        onClose={() => setSelectedSessionIdForAttendance(null)}
        sessionId={selectedSessionIdForAttendance}
      />

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => setIsCreateSessionOpen(false)}
      />

      {/* Batch Roster Modal */}
      {selectedBatch && (
        <Modal
          isOpen={Boolean(selectedBatch)}
          onClose={() => setSelectedBatch(null)}
          title={selectedBatch.name}
          subtitle={`${selectedBatch.code} · Enrolled Roster`}
          maxWidth="lg"
          footer={
            <button
              onClick={() => setSelectedBatch(null)}
              className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          }
        >
          <div className="divide-y divide-[#ECEEF0] max-h-80 overflow-y-auto border border-[#ECEEF0] rounded-xl">
            {selectedBatch.participantEmployeeIds.map(empId => {
              const emp = employees.find(e => e.id === empId);
              return (
                <div key={empId} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-[#17191B]">{emp?.name || empId}</span>
                    <span className="text-[#A1A5AA] text-[10px] ml-2 font-mono tabular-nums">{empId}</span>
                    <p className="text-[10px] text-[#73777D]">{emp?.designation} · {emp?.brand}</p>
                  </div>
                  <Badge variant={emp?.currentReadiness === 'Training Ready' ? 'green' : 'blue'} size="sm">
                    {emp?.currentReadiness || 'Enrolled'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};
