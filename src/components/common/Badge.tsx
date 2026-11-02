/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Badge & Status Pill Component
 */

import React from 'react';

export interface BadgeProps {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'slate' | 'neutral' | 'lime';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  children,
  size = 'md',
  dot = false,
  className = ''
}) => {
  // Monetra Color System approximations
  const styles: Record<string, string> = {
    lime: 'bg-[#E9FBD1] text-[#17191B] border-[#C8F58A]',
    green: 'bg-[#E9FBD1] text-[#226732] border-[#C8F58A]',
    amber: 'bg-[#FEF5E7] text-[#A66708] border-[#FCE1B6]',
    red: 'bg-[#FDF0F0] text-[#D84B4B] border-[#FACACA]',
    blue: 'bg-[#EDF5FD] text-[#2C6FB5] border-[#CFE5FA]',
    purple: 'bg-[#F4EFFB] text-[#7143A6] border-[#DECFF5]',
    slate: 'bg-[#F3F4F3] text-[#55595F] border-[#ECEEF0]',
    neutral: 'bg-[#F8F9F8] text-[#73777D] border-[#ECEEF0]'
  };

  const dotColors: Record<string, string> = {
    lime: 'bg-[#A6F52F]',
    green: 'bg-[#4DBB70]',
    amber: 'bg-[#E9A84C]',
    red: 'bg-[#E56C6C]',
    blue: 'bg-[#4D91D8]',
    purple: 'bg-[#9161C8]',
    slate: 'bg-[#73777D]',
    neutral: 'bg-[#A1A5AA]'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles[variant] || styles.slate} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-slate-400'}`} />}
      {children}
    </span>
  );
};

export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Training Ready':
    case 'Completed':
    case 'Passed':
    case 'Satisfactory':
    case 'Issued':
    case 'Active':
    case 'Present':
    case 'Approved':
    case 'Closed':
      return 'green';
    case 'In Progress':
    case 'In Training':
    case 'Scheduled':
    case 'Started':
    case 'Under Evaluation':
    case 'Due':
    case 'Late':
    case 'Pending':
      return 'blue';
    case 'Assessment Pending':
    case 'Follow-up Pending':
    case 'Pending Approval':
    case 'Awaiting Verification':
    case 'Expiring':
    case 'Draft':
    case 'Planned':
      return 'amber';
    case 'Needs Attention':
    case 'Failed':
    case 'Overdue':
    case 'Revoked':
    case 'Absent':
    case 'Expired':
    case 'Re-training Required':
      return 'red';
    case 'Excused':
    case 'Paused':
    case 'Superseded':
    case 'Untrained':
    case 'Onboarding':
    default:
      return 'slate';
  }
};
