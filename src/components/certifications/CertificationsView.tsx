/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Certifications Registry View
 * Implements Section 16 Certification Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certification, CertificateStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { CertificateModal } from './CertificateModal';
import { Modal } from '../common/Modal';
import { Award, Eye, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const CertificationsView: React.FC = () => {
  const { certificates, revokeCertificate, currentTrainer, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [revokingCert, setRevokingCert] = useState<Certification | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  const filteredCertificates = certificates.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const handleConfirmRevoke = () => {
    if (!revokingCert) return;
    if (!revocationReason.trim()) {
      showToast('Please specify an authorized operational reason for certificate revocation.', 'error');
      return;
    }

    revokeCertificate(revokingCert.id, revocationReason.trim());
    showToast(`Certificate ${revokingCert.certificateNumber} has been revoked and logged in the system audit trail.`, 'info');
    setRevokingCert(null);
    setRevocationReason('');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-[#F8F9F8] p-1.5 rounded-full border border-[#ECEEF0]">
          {['All', 'Issued', 'Expiring', 'Revoked'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                  : 'text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              {st} ({st === 'All' ? certificates.length : certificates.filter(c => c.status === st).length})
            </button>
          ))}
        </div>

        <span className="text-xs text-[#73777D] font-medium">
          Section 16: Cryptographic verification codes & audit trail
        </span>
      </div>

      {/* Certificates Registry Table */}
      <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9F8] border-b border-[#ECEEF0] text-[#73777D] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Certificate #</th>
                <th className="py-3 px-4">Trainee</th>
                <th className="py-3 px-4">Certified Program</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Validity Horizon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF0] text-[#17191B]">
              {filteredCertificates.map(cert => (
                <tr key={cert.id} className="hover:bg-[#F8F9F8]/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#17191B] block">{cert.certificateNumber}</span>
                    <span className="text-[10px] text-[#73777D] font-mono">Code: {cert.verificationCode}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-[#17191B] block">{cert.employeeName}</span>
                    <span className="text-[10px] text-[#73777D] font-mono">
                      {cert.employeeId} · {cert.employeeDesignation}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-medium text-[#17191B]">
                    <span>{cert.programName}</span>
                    <span className="text-[10px] text-[#73777D] block">{cert.programVersion}</span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-emerald-700 tabular-nums">
                    {cert.scoreAchieved}%
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[#17191B] block font-medium tabular-nums">Issued: {cert.issueDate}</span>
                    <span className="text-[10px] text-[#73777D] tabular-nums">Expires: {cert.expiryDate}</span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(cert.status)} size="sm" dot>
                      {cert.status}
                    </Badge>
                    {cert.revocationReason && (
                      <span className="text-[10px] text-rose-600 block mt-0.5 max-w-xs truncate" title={cert.revocationReason}>
                        Reason: {cert.revocationReason}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#F8F9F8] hover:bg-[#101411] hover:text-[#A6F52F] text-[#17191B] border border-[#ECEEF0] rounded-full transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                      {cert.status !== 'Revoked' && (
                        <button
                          onClick={() => setRevokingCert(cert)}
                          className="px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-full transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateModal
        isOpen={Boolean(selectedCertificate)}
        onClose={() => setSelectedCertificate(null)}
        certificate={selectedCertificate}
      />

      {/* Revocation Workflow Modal */}
      {revokingCert && (
        <Modal
          isOpen={Boolean(revokingCert)}
          onClose={() => setRevokingCert(null)}
          title={`Revoke Certification: ${revokingCert.certificateNumber}`}
          subtitle={`Employee: ${revokingCert.employeeName} (${revokingCert.employeeId})`}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-2.5 w-full text-xs">
              <button
                type="button"
                onClick={() => setRevokingCert(null)}
                className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Confirm Revocation & Audit
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-[#17191B]">
            <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200/90 text-rose-950 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Consequential Operational Action</p>
                <p className="text-[11px] mt-0.5 leading-relaxed text-rose-900">
                  Revoking this credential will revert the employee's field readiness status to "Needs Attention" and create an append-only audit log entry.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">
                Mandatory Revocation Reason & Evidence *
              </label>
              <textarea
                rows={3}
                value={revocationReason}
                onChange={e => setRevocationReason(e.target.value)}
                placeholder="e.g. Failed subsequent mystery shopper compliance audit; multiple shelf FIFO violations detected."
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] placeholder-[#73777D] focus:bg-white focus:border-[#17191B] transition-colors"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
