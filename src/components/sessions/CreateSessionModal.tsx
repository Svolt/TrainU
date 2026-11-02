/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { SessionType } from '../../types';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { programs, batches, employees, trainers, currentTrainer, createSession, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [sessionType, setSessionType] = useState<SessionType>('field/practical');
  const [trainerId, setTrainerId] = useState(currentTrainer.id);
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:30');
  const [venueOrLink, setVenueOrLink] = useState('Ambience Mall Hypermarket, Vasant Kunj, New Delhi');
  const [isOnline, setIsOnline] = useState(false);
  const [capacity, setCapacity] = useState(15);
  const [agenda, setAgenda] = useState('1. Planogram review. 2. Shelf replenishment & FIFO drill. 3. App photo audit.');
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>(['EMP-10023', 'EMP-10105', 'EMP-10130']);

  const selectedProgram = programs.find(p => p.id === programId);
  const selectedBatch = batches.find(b => b.id === batchId);

  const handleCreate = () => {
    if (!title.trim()) {
      showToast('Please enter a session title.', 'error');
      return;
    }

    const assignedTrainer = trainers.find(t => t.id === trainerId) || currentTrainer;

    const res = createSession(
      {
        title,
        programId,
        programName: selectedProgram?.name || '',
        batchId: batchId || undefined,
        batchName: selectedBatch?.name,
        sessionType,
        trainerId: assignedTrainer.id,
        trainerName: assignedTrainer.name,
        date,
        startTime,
        endTime,
        venueOrLink,
        isOnline,
        capacity,
        agenda
      },
      selectedEmpIds
    );

    if (res.success) {
      showToast(res.message, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Training Session"
      subtitle="Configure physical store practical, classroom, or digital training workshop."
      maxWidth="2xl"
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
            onClick={handleCreate}
            className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] font-semibold rounded-full cursor-pointer transition-colors"
          >
            Schedule & Notify Participants
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#17191B]">
        <div>
          <label className="block font-medium text-[#17191B] mb-1">Session Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Modern Trade Gondola Practical & FIFO Audit"
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Associated Program</label>
            <select
              value={programId}
              onChange={e => setProgramId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Associated Batch (Optional)</label>
            <select
              value={batchId}
              onChange={e => setBatchId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="">No Batch / Ad-hoc Roster</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Session Delivery Mode</label>
            <select
              value={sessionType}
              onChange={e => {
                const val = e.target.value as SessionType;
                setSessionType(val);
                setIsOnline(val === 'online');
              }}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="field/practical">Field / Practical Store</option>
              <option value="classroom">Classroom Training</option>
              <option value="online">Online Virtual Class</option>
              <option value="hybrid">Hybrid Interactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Lead Facilitator</label>
            <select
              value={trainerId}
              onChange={e => setTrainerId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              {trainers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Session Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              min={1}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] tabular-nums focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-[#17191B] mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">End Time *</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#17191B] mb-1">
            {isOnline ? 'Online Meeting Link *' : 'Physical Store Venue / Address *'}
          </label>
          <input
            type="text"
            value={venueOrLink}
            onChange={e => setVenueOrLink(e.target.value)}
            placeholder={isOnline ? 'https://meet.google.com/lis-demo' : 'Store name, Mall, Street, City'}
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block font-medium text-[#17191B] mb-1">Agenda & Exercises</label>
          <textarea
            rows={2}
            value={agenda}
            onChange={e => setAgenda(e.target.value)}
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
          />
        </div>

        {/* Participant Selection */}
        <div>
          <label className="block font-medium text-[#17191B] mb-1">
            Enrolled Participants ({selectedEmpIds.length})
          </label>
          <div className="max-h-36 overflow-y-auto divide-y divide-[#ECEEF0] border border-[#ECEEF0] rounded-2xl bg-[#F8F9F8] p-2 space-y-1">
            {employees.slice(0, 10).map(emp => {
              const isChecked = selectedEmpIds.includes(emp.id);
              return (
                <label key={emp.id} className="flex items-center justify-between p-1.5 hover:bg-white rounded-xl cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedEmpIds(prev =>
                          isChecked ? prev.filter(id => id !== emp.id) : [...prev, emp.id]
                        );
                      }}
                      className="rounded accent-[#17191B]"
                    />
                    <span className="font-medium text-[#17191B]">{emp.name}</span>
                    <span className="text-[10px] text-[#A1A5AA] font-mono tabular-nums">({emp.id})</span>
                  </div>
                  <span className="text-[10px] text-[#73777D]">{emp.brand} · {emp.designation}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
