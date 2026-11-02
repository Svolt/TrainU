/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Profile & Configurable Business Policies View
 * Implements Appendix B Open Business Policies to Configure & Trainer Profile
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Settings,
  Shield,
  Sliders,
  RotateCcw,
  User,
  CheckCircle2,
  Lock,
  Globe,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentTrainer, policies, updatePolicies, resetToDefaultData, showToast } = useApp();

  const [programPolicy, setProgramPolicy] = useState(policies.programCreationPolicy);
  const [assignmentPolicy, setAssignmentPolicy] = useState(policies.assignmentApprovalPolicy);
  const [followUpPolicy, setFollowUpPolicy] = useState(policies.followUpOwnership);
  const [scopePolicy, setScopePolicy] = useState(policies.employeeDataScope);
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePolicies = () => {
    updatePolicies({
      programCreationPolicy: programPolicy,
      assignmentApprovalPolicy: assignmentPolicy,
      followUpOwnership: followUpPolicy,
      employeeDataScope: scopePolicy
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#ECEEF0] p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#ECEEF0] pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentTrainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentTrainer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#101411] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#17191B]">{currentTrainer.name}</h3>
                <Badge variant="blue" size="sm" dot>
                  {currentTrainer.role.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-[#73777D] font-mono mt-0.5">{currentTrainer.id} · {currentTrainer.email}</p>
              <p className="text-xs text-[#73777D] mt-1">Phone: <span className="tabular-nums">{currentTrainer.phone}</span></p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="font-semibold text-[#73777D]">Conduct History:</span>
            <p className="font-bold text-[#17191B] text-sm mt-0.5 tabular-nums">{currentTrainer.totalSessionsConducted} Sessions Conducted</p>
            <p className="text-[#73777D] text-[11px] tabular-nums">{currentTrainer.totalEmployeesTrained} Employees Trained</p>
          </div>
        </div>

        {/* Operational Scopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <span className="font-bold text-[10px] text-[#73777D] uppercase tracking-wider block mb-1">
              Authorised Regional & Brand Scopes
            </span>
            <p className="text-[#17191B]">
              <strong className="text-[#17191B]">Assigned Regions:</strong> {currentTrainer.assignedRegions.join(', ')}
            </p>
            <p className="text-[#17191B] mt-1">
              <strong className="text-[#17191B]">Authorised FMCG Brands:</strong> {currentTrainer.assignedBrands.join(', ')}
            </p>
          </div>

          <div className="bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <span className="font-bold text-[10px] text-[#73777D] uppercase tracking-wider block mb-1">
              Account Security & Access Mode
            </span>
            <p className="text-[#17191B]">
              <strong className="text-[#17191B]">Session Status:</strong> Authenticated Active
            </p>
            <p className="text-[#17191B] mt-1">
              <strong className="text-[#17191B]">Permission Mode:</strong> Role-Based Access Control (RBAC) + Data Scope
            </p>
          </div>
        </div>
      </div>

      {/* Appendix B: Configurable Business Policies */}
      <div className="bg-white rounded-2xl border border-[#ECEEF0] p-6 shadow-soft space-y-5">
        <div className="border-b border-[#ECEEF0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#101411]" />
              <h3 className="font-bold text-sm text-[#17191B]">
                Appendix B: Configurable Business Policies
              </h3>
            </div>
            <p className="text-[11px] text-[#73777D] mt-0.5">
              Enterprise governance policies for curriculum creation, approvals, follow-up ownership, and data isolation
            </p>
          </div>

          <button
            onClick={handleSavePolicies}
            className="monetra-btn-primary px-5 py-2 text-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            Save Policy Rules
          </button>
        </div>

        {isSaved && (
          <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Business policies updated and logged to system audit trail!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-[#17191B]">
          {/* Policy 1 */}
          <div className="space-y-1.5 bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <label className="font-bold text-[#17191B] block text-xs">
              1. Who creates and publishes training programs?
            </label>
            <p className="text-[11px] text-[#73777D] mb-2">
              Defines curriculum authoring rights in the platform.
            </p>
            <select
              value={programPolicy}
              onChange={e => setProgramPolicy(e.target.value as any)}
              className="w-full bg-white border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] focus:border-[#17191B] transition-colors cursor-pointer"
            >
              <option value="trainer">Trainer (Direct creation within authorised scope)</option>
              <option value="manager_admin_only">Program Manager & Platform Admin Only</option>
              <option value="both_with_approval">Both (Trainer drafts, Manager approval required)</option>
            </select>
          </div>

          {/* Policy 2 */}
          <div className="space-y-1.5 bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <label className="font-bold text-[#17191B] block text-xs">
              2. Does training assignment require approval?
            </label>
            <p className="text-[11px] text-[#73777D] mb-2">
              Controls whether assignments start immediately or require manager sign-off.
            </p>
            <select
              value={assignmentPolicy}
              onChange={e => setAssignmentPolicy(e.target.value as any)}
              className="w-full bg-white border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] focus:border-[#17191B] transition-colors cursor-pointer"
            >
              <option value="no_approval">No Approval Required (Immediate Enrolment)</option>
              <option value="manager_approval">Program Manager Approval Required</option>
              <option value="conditional_by_brand">Conditional Approval by FMCG Brand / Budget</option>
            </select>
          </div>

          {/* Policy 3 */}
          <div className="space-y-1.5 bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <label className="font-bold text-[#17191B] block text-xs">
              3. Who owns practical follow-ups & store verification?
            </label>
            <p className="text-[11px] text-[#73777D] mb-2">
              Determines audit sign-off authority and visit ownership.
            </p>
            <select
              value={followUpPolicy}
              onChange={e => setFollowUpPolicy(e.target.value as any)}
              className="w-full bg-white border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] focus:border-[#17191B] transition-colors cursor-pointer"
            >
              <option value="trainer_primary">Trainer Primary (Trainer leads on-site verification)</option>
              <option value="manager_shared">Shared with Field Supervisor / Area Manager</option>
              <option value="supervisor_lead">Store Supervisor Leads with Trainer Sign-off</option>
            </select>
          </div>

          {/* Policy 4 */}
          <div className="space-y-1.5 bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0]">
            <label className="font-bold text-[#17191B] block text-xs">
              4. What employee records can a Trainer access?
            </label>
            <p className="text-[11px] text-[#73777D] mb-2">
              Data isolation boundaries to protect confidential employee information.
            </p>
            <select
              value={scopePolicy}
              onChange={e => setScopePolicy(e.target.value as any)}
              className="w-full bg-white border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] focus:border-[#17191B] transition-colors cursor-pointer"
            >
              <option value="combined_brand_location">Combined Authorised Brand & Location Scope</option>
              <option value="assigned_programs_only">Assigned Programs / Batches Only</option>
              <option value="all_within_org">All Employees Within Authorised Organisation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-soft space-y-3 text-xs">
        <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          Demonstration State Reset
        </h4>
        <p className="text-[#73777D] leading-relaxed">
          Restore all 32 employee records, canonical test scenarios (Rahul Sharma & Pooja Verma), scheduled sessions, questions, and audit logs to their initial baseline seed state.
        </p>
        <button
          onClick={() => {
            resetToDefaultData();
            showToast('Demo database reset to initial seed state.', 'info');
          }}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold shadow-xs cursor-pointer text-xs transition-colors"
        >
          Reset Demo Data to Factory Defaults
        </button>
      </div>
    </div>
  );
};
