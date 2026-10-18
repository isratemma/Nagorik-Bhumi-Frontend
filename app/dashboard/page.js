import DashboardContent from '@/components/dashboard/DashboardContent';
import RightPanel from '@/components/dashboard/RightPanel';

export default function DashboardPage() {
  return (
    <>
      <DashboardContent />
      {/* Right panel */}
      <div className="w-72 overflow-y-auto p-4 bg-gray-50 border-l border-gray-100 flex-shrink-0">
        <RightPanel />
      </div>
    </>
  );
}
