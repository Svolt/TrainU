/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Assessments & Evaluations View
 * Implements Section 13 Assessment and Examination Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentAttempt, Question, QuestionType } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Layers,
  Search,
  Eye,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const { assessments, questions, attempts, currentTrainer } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'attempts' | 'bank' | 'builder'>('attempts');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [selectedAttempt, setSelectedAttempt] = useState<AssessmentAttempt | null>(null);

  // Sub tab 1: Question Bank filters
  const topics = ['All', 'Modern Trade Planograms', 'Stock Rotation & FIFO', 'POSM & Shelf Facing', 'Sampling Hygiene', 'Objection Handling'];
  const filteredQuestions = questions.filter(q => {
    if (topicFilter === 'All') return true;
    return q.topic === topicFilter;
  });

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="p-1 bg-[#F8F9F8] border border-[#ECEEF0] rounded-full inline-flex gap-1 text-xs font-medium self-start">
          <button
            onClick={() => setActiveSubTab('attempts')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeSubTab === 'attempts'
                ? 'bg-[#17191B] text-white shadow-soft font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Attempt Evaluations <span className="tabular-nums ml-1">({attempts.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('bank')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeSubTab === 'bank'
                ? 'bg-[#17191B] text-white shadow-soft font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Question Bank <span className="tabular-nums ml-1">({questions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('builder')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeSubTab === 'builder'
                ? 'bg-[#17191B] text-white shadow-soft font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Exams Configuration <span className="tabular-nums ml-1">({assessments.length})</span>
          </button>
        </div>

        <span className="text-xs text-[#73777D] font-normal">
          Section 13 Compliance: Attempts never overwritten
        </span>
      </div>

      {/* SUBTAB 1: ATTEMPT EVALUATIONS & RESULTS */}
      {activeSubTab === 'attempts' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-soft overflow-hidden">
            <div className="p-4 border-b border-[#ECEEF0] bg-[#F8F9F8]/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#17191B] text-sm">Trainee Examination Results & Attempts</h3>
                <p className="text-[11px] text-[#73777D]">Every assessment attempt is retained independently for auditability</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9F8] border-b border-[#ECEEF0] text-[#73777D] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Attempt ID</th>
                    <th className="py-3 px-4">Trainee</th>
                    <th className="py-3 px-4">Assessment Title</th>
                    <th className="py-3 px-4 text-center">Attempt #</th>
                    <th className="py-3 px-4 text-center">Score / Max</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4">Evaluation Result</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEEF0] text-[#17191B]">
                  {attempts.map(att => (
                    <tr key={att.id} className="hover:bg-[#F8F9F8] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#17191B] tabular-nums">{att.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#17191B] block">{att.employeeName}</span>
                        <span className="text-[10px] text-[#A1A5AA] font-mono tabular-nums">{att.employeeId}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#17191B]">{att.assessmentTitle}</td>
                      <td className="py-3 px-4 text-center font-semibold tabular-nums">#{att.attemptNumber}</td>
                      <td className="py-3 px-4 text-center font-medium tabular-nums">{att.score} / {att.maxScore}</td>
                      <td className="py-3 px-4 text-center font-semibold text-[#17191B] tabular-nums">{att.percentage}%</td>
                      <td className="py-3 px-4">
                        <Badge variant={att.status === 'Passed' ? 'green' : 'red'} size="sm" dot>
                          {att.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAttempt(att)}
                          className="px-3.5 py-1 text-xs font-medium text-[#17191B] bg-[#F8F9F8] hover:bg-white hover:border-[#17191B] border border-[#ECEEF0] rounded-full cursor-pointer flex items-center gap-1 ml-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review Answers &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: QUESTION BANK */}
      {activeSubTab === 'bank' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 mr-1">Topics:</span>
            {topics.map(t => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  topicFilter === t
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map(q => (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                      {q.id}
                    </span>
                    <Badge variant="blue" size="sm">{q.topic}</Badge>
                    <Badge variant="slate" size="sm">{q.type.replace('_', ' ')}</Badge>
                  </div>
                  <span className="font-bold text-emerald-700">{q.marks} Marks</span>
                </div>

                <p className="font-semibold text-slate-900 text-sm leading-snug">{q.text}</p>

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {q.options.map(opt => {
                      const isCorrect = q.correctOptionIds.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 font-semibold text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt.text}</span>
                          {isCorrect && (
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  <strong>Explanation / Key:</strong> {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EXAM CONFIGURATION */}
      {activeSubTab === 'builder' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map(asm => (
            <div key={asm.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                      {asm.id}
                    </span>
                    <Badge variant="green" size="sm">{asm.version}</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{asm.title}</h4>
                  <p className="text-[11px] text-slate-500">{asm.programName}</p>
                </div>
                <Badge variant="blue" size="sm">Published</Badge>
              </div>

              <div className="space-y-1.5 text-slate-700 pt-1">
                <div className="flex justify-between">
                  <span>Passing Score Required:</span>
                  <strong className="text-emerald-700">{asm.passingScorePercent}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Maximum Marks:</span>
                  <strong>{asm.totalMarks} Marks</strong>
                </div>
                <div className="flex justify-between">
                  <span>Allocated Duration:</span>
                  <strong>{asm.durationMinutes} minutes</strong>
                </div>
                <div className="flex justify-between">
                  <span>Max Attempt Limits:</span>
                  <strong>{asm.maxAttempts} Attempts</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
                {asm.questionIds.length} Linked Questions from Question Bank
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attempt Review Modal */}
      {selectedAttempt && (
        <Modal
          isOpen={Boolean(selectedAttempt)}
          onClose={() => setSelectedAttempt(null)}
          title={`Review Attempt: ${selectedAttempt.id} - ${selectedAttempt.employeeName}`}
          subtitle={`${selectedAttempt.assessmentTitle} · Attempt #${selectedAttempt.attemptNumber} · Evaluator: ${selectedAttempt.evaluatorName}`}
          maxWidth="3xl"
          footer={
            <div className="flex justify-end w-full">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Review
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Score Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              selectedAttempt.status === 'Passed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div>
                <span className="font-bold text-sm">
                  {selectedAttempt.status === 'Passed' ? 'Exam Passed' : 'Exam Failed (Passing Threshold: 80%)'}
                </span>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Submitted at: {new Date(selectedAttempt.submittedTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{selectedAttempt.percentage}%</span>
                <p className="text-[10px] font-semibold">
                  {selectedAttempt.score} / {selectedAttempt.maxScore} Marks
                </p>
              </div>
            </div>

            {selectedAttempt.trainerComments && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-0.5">Trainer Feedback Remarks:</p>
                <p className="text-slate-700">{selectedAttempt.trainerComments}</p>
              </div>
            )}

            {/* Questions breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                Question-by-Question Trainee Responses ({selectedAttempt.answers.length})
              </h4>

              {selectedAttempt.answers.map((ans, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}: {ans.questionText}
                    </span>
                    <Badge variant={ans.isCorrect ? 'green' : 'red'} size="sm">
                      {ans.scoreAwarded} Marks
                    </Badge>
                  </div>

                  {ans.descriptiveText && (
                    <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-800">
                      <strong>Submitted Answer:</strong> "{ans.descriptiveText}"
                    </div>
                  )}

                  {ans.evaluatorFeedback && (
                    <p className="text-[11px] text-slate-600 italic">
                      Evaluator feedback: {ans.evaluatorFeedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
