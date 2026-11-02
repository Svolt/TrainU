/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Official Printable Certificate Modal
 * Implements Section 16 Certification Management
 */

import React from 'react';
import { Modal } from '../common/Modal';
import { Certification } from '../../types';
import { Badge } from '../common/Badge';
import { Award, Printer, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certification | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Certification of Competency"
      subtitle={`Serial: ${certificate.certificateNumber} · Verification: ${certificate.verificationCode}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-1.5 text-[#73777D]">
            <ShieldCheck className="w-4 h-4 text-[#A6F52F] fill-[#101411]" />
            <span>Cryptographically sealed & auditable on LoveInStore verification portal</span>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="monetra-btn-primary px-5 py-2 text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save Certificate PDF
            </button>
          </div>
        </div>
      }
    >
      {/* High-Fidelity Certificate Card - Monetra Styled */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-[#101411] shadow-soft text-center relative overflow-hidden">
        {/* Subtle geometric background watermark */}
        <div className="absolute inset-0 border-[10px] border-[#F8F9F8] pointer-events-none rounded-xl m-2" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-2 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#101411] text-[#A6F52F] flex items-center justify-center font-black text-xl shadow-xs">
            LIS
          </div>
          <div className="text-left">
            <span className="text-xs font-black tracking-widest text-[#17191B] block leading-tight uppercase">
              LOVEINSTORE
            </span>
            <span className="text-[10px] tracking-wider font-semibold text-[#73777D] block uppercase">
              Field Execution Training Academy
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-[#17191B] tracking-wide mt-4 uppercase">
          Certificate of Operational Competency
        </h3>
        <p className="text-[11px] text-[#73777D] font-bold tracking-widest uppercase mt-1">
          Retail & FMCG Execution Standards Assurance
        </p>

        <p className="text-xs text-[#73777D] italic mt-6">
          This is to officially certify that
        </p>

        {/* Recipient Name */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17191B] my-2 tracking-tight">
          {certificate.employeeName}
        </h2>

        <p className="text-xs font-mono text-[#73777D] font-semibold mb-4 tabular-nums">
          ID: {certificate.employeeId} · Role: {certificate.employeeDesignation}
        </p>

        <p className="text-xs text-[#73777D] max-w-xl mx-auto leading-relaxed">
          has successfully fulfilled all curriculum requirements, passed comprehensive examination assessment with a score of{' '}
          <strong className="text-[#17191B] font-bold tabular-nums bg-[#A6F52F]/20 px-1.5 py-0.5 rounded text-xs">{certificate.scoreAchieved}%</strong>, and completed on-site practical store verification for
        </p>

        {/* Program Title */}
        <div className="my-4 py-2.5 px-6 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] inline-block shadow-2xs">
          <h4 className="text-sm sm:text-base font-bold text-[#17191B]">
            {certificate.programName}
          </h4>
          <span className="text-[11px] text-[#73777D] font-mono font-medium">
            Program Curriculum {certificate.programVersion}
          </span>
        </div>

        {/* Signatures & QR Section */}
        <div className="mt-8 pt-6 border-t border-[#ECEEF0] grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs relative z-10">
          {/* Issuer */}
          <div className="text-left">
            <p className="italic text-base text-[#17191B] font-bold mb-1">
              {certificate.issuedByTrainerName}
            </p>
            <div className="h-0.5 bg-[#17191B] w-36 mb-1" />
            <p className="text-[10px] uppercase font-bold text-[#73777D]">Authorized Lead Facilitator</p>
            <p className="text-[10px] text-[#73777D] tabular-nums">Issue Date: {certificate.issueDate}</p>
          </div>

          {/* Seal / QR Verification */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#F8F9F8] p-1.5 rounded-xl border border-[#ECEEF0] shadow-2xs flex items-center justify-center mb-1">
              <QrCode className="w-12 h-12 text-[#101411]" />
            </div>
            <span className="font-mono text-[9px] text-[#73777D] font-bold tabular-nums">
              {certificate.verificationCode}
            </span>
          </div>

          {/* Expiry & Validity */}
          <div className="text-right">
            <div className="inline-block text-right">
              <Badge variant="green" size="sm" dot>
                {certificate.status} & Valid
              </Badge>
              <p className="text-[10px] uppercase font-bold text-[#73777D] mt-2">Validity Horizon</p>
              <p className="text-[10px] font-semibold text-[#17191B] tabular-nums">Valid Through: {certificate.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
