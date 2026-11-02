/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Trainer Management Web Panel
 * Main Application Shell, Authentication Routing & View Orchestration
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, NavTabId } from './components/common/Sidebar';
import { Header } from './components/common/Header';

// Authentication Views
import { AuthScreen } from './components/auth/AuthScreen';
import { UserProfileModal } from './components/auth/UserProfileModal';

// Primary Views
import { DashboardView } from './components/dashboard/DashboardView';
import { EmployeeDirectoryView } from './components/employees/EmployeeDirectoryView';
import { ProgramsView } from './components/programs/ProgramsView';
import { ResourcesView } from './components/resources/ResourcesView';
import { SessionsView } from './components/sessions/SessionsView';
import { AssessmentsView } from './components/assessments/AssessmentsView';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { ImprovementView } from './components/improvement/ImprovementView';
import { CertificationsView } from './components/certifications/CertificationsView';
import { CommunicationView } from './components/communication/CommunicationView';
import { HistoryView } from './components/history/HistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { EmployeeProfileModal } from './components/employees/EmployeeProfileModal';
import { BulkAssignModal } from './components/employees/BulkAssignModal';
import { CreateProgramModal } from './components/programs/CreateProgramModal';
import { CreateSessionModal } from './components/sessions/CreateSessionModal';
import { TakeAttendanceModal } from './components/sessions/TakeAttendanceModal';
import { CompleteFollowUpModal } from './components/followups/CompleteFollowUpModal';
import { CertificateModal } from './components/certifications/CertificateModal';
import { ToastContainer } from './components/common/Toast';

interface MainShellProps {
  onOpenProfile: () => void;
}

const MainShell: React.FC<MainShellProps> = ({ onOpenProfile }) => {
  const { certificates, employees, followUps, toasts, dismissToast } = useApp();

  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [profileModalEmpId, setProfileModalEmpId] = useState<string | null>(null);
  const [profileInitialTab, setProfileInitialTab] = useState<string>('journey');

  const [bulkAssignIds, setBulkAssignIds] = useState<string[]>([]);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);

  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);

  const [attendanceSessionId, setAttendanceSessionId] = useState<string | null>(null);
  const [completeFollowUpId, setCompleteFollowUpId] = useState<string | null>(null);
  const [viewCertificateId, setViewCertificateId] = useState<string | null>(null);

  // Quick navigation handlers
  const handleOpenEmployee = (empId: string, initialTab: string = 'journey') => {
    setProfileModalEmpId(empId);
    setProfileInitialTab(initialTab);
  };

  const handleOpenBulkAssign = (selectedIds: string[]) => {
    setBulkAssignIds(selectedIds);
    setIsBulkAssignOpen(true);
  };

  const handleOpenQuickAssign = () => {
    setBulkAssignIds(employees.slice(0, 3).map(e => e.id));
    setIsBulkAssignOpen(true);
  };

  const handleOpenQuickSession = () => {
    setIsCreateSessionOpen(true);
  };

  const handleOpenQuickFollowUp = () => {
    const target = followUps.find(f => f.status === 'Due' || f.status === 'Overdue') || followUps[0];
    if (target) {
      setCompleteFollowUpId(target.id);
    } else {
      setActiveTab('followups');
    }
  };

  const certificateToView = certificates.find(c => c.id === viewCertificateId) || null;

  return (
    <div className="min-h-screen bg-[#F1F2F5] flex flex-col antialiased font-sans text-[#17191B]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenProfile={onOpenProfile}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigateTab={setActiveTab}
          onOpenQuickAssign={handleOpenQuickAssign}
          onOpenQuickSession={handleOpenQuickSession}
          onOpenQuickFollowUp={handleOpenQuickFollowUp}
          onOpenEmployeeDetail={handleOpenEmployee}
          onOpenProfile={onOpenProfile}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <DashboardView
              onNavigateTab={setActiveTab}
              onOpenEmployee={handleOpenEmployee}
              onTakeAttendance={sessionId => setAttendanceSessionId(sessionId)}
              onCompleteFollowUp={flwId => setCompleteFollowUpId(flwId)}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeDirectoryView
              onOpenEmployee={handleOpenEmployee}
              onOpenBulkAssign={handleOpenBulkAssign}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramsView
              onOpenCreateProgram={() => setIsCreateProgramOpen(true)}
              onOpenAssign={() => {
                setBulkAssignIds(employees.slice(0, 4).map(e => e.id));
                setIsBulkAssignOpen(true);
              }}
            />
          )}

          {activeTab === 'resources' && <ResourcesView />}

          {activeTab === 'sessions' && <SessionsView />}

          {activeTab === 'assessments' && <AssessmentsView />}

          {activeTab === 'followups' && <FollowUpsView />}

          {activeTab === 'improvement' && <ImprovementView />}

          {activeTab === 'certifications' && <CertificationsView />}

          {activeTab === 'communication' && <CommunicationView />}

          {activeTab === 'history' && <HistoryView onOpenEmployee={handleOpenEmployee} />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Interactive Workflows & Modals */}
      <EmployeeProfileModal
        isOpen={Boolean(profileModalEmpId)}
        onClose={() => setProfileModalEmpId(null)}
        employeeId={profileModalEmpId}
        initialTab={profileInitialTab}
        onOpenCertificateModal={(certId: string) => setViewCertificateId(certId)}
        onOpenAssignModal={(empId: string) => {
          setBulkAssignIds([empId]);
          setIsBulkAssignOpen(true);
        }}
        onOpenScheduleFollowUp={() => {
          setActiveTab('followups');
        }}
      />

      <BulkAssignModal
        isOpen={isBulkAssignOpen}
        onClose={() => {
          setIsBulkAssignOpen(false);
          setBulkAssignIds([]);
        }}
        selectedEmployeeIds={bulkAssignIds}
        onSuccess={() => {
          setIsBulkAssignOpen(false);
          setBulkAssignIds([]);
        }}
      />

      <CreateProgramModal
        isOpen={isCreateProgramOpen}
        onClose={() => setIsCreateProgramOpen(false)}
      />

      <CreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => setIsCreateSessionOpen(false)}
      />

      <TakeAttendanceModal
        isOpen={Boolean(attendanceSessionId)}
        onClose={() => setAttendanceSessionId(null)}
        sessionId={attendanceSessionId}
      />

      <CompleteFollowUpModal
        isOpen={Boolean(completeFollowUpId)}
        onClose={() => setCompleteFollowUpId(null)}
        followUpId={completeFollowUpId}
      />

      <CertificateModal
        isOpen={Boolean(viewCertificateId)}
        onClose={() => setViewCertificateId(null)}
        certificate={certificateToView}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <>
      <MainShell onOpenProfile={() => setIsUserProfileOpen(true)} />
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onSignOut={() => setIsUserProfileOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthenticatedApp />
      </AppProvider>
    </AuthProvider>
  );
}
