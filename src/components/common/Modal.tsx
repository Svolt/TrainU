/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Modal Component
 * Renders via React Portal to document.body to guarantee proper z-index and full viewport centering
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '2xl'
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '3xl': 'max-w-4xl',
    '4xl': 'max-w-5xl',
    '5xl': 'max-w-6xl'
  };

  const modalNode = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ isolation: 'isolate' }}
    >
      {/* Fullscreen Backdrop spanning the entire viewport including sidebar */}
      <div 
        className="fixed inset-0 bg-[#101411]/60 backdrop-blur-xs transition-opacity -z-10" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Centered Modal Card */}
      <div 
        className={`relative z-10 w-full ${widthClasses[maxWidth] || 'max-w-3xl'} transform overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-[0_25px_60px_rgba(16,20,17,0.28)] transition-all border border-[#ECEEF0] flex flex-col max-h-[90vh] my-auto`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between border-b border-[#ECEEF0] px-6 py-4.5 bg-white">
          <div className="min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#17191B] tracking-tight leading-6">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-[#73777D] truncate">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-[#73777D] hover:bg-[#F3F4F3] hover:text-[#17191B] transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-xs sm:text-sm text-[#17191B] bg-white">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-[#ECEEF0] bg-[#F8F9F8] px-6 py-3.5 flex items-center justify-end gap-3 rounded-b-[20px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
