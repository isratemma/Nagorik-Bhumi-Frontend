export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="animate-pulse space-y-5">
        {/* Hero skeleton */}
        <div className="h-40 bg-gray-200 rounded-2xl"/>
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_,i) => <div key={i} className="h-24 bg-gray-200 rounded-xl"/>)}
        </div>
        {/* Content */}
        <div className="h-64 bg-gray-200 rounded-xl"/>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_,i) => <div key={i} className="h-28 bg-gray-200 rounded-xl"/>)}
        </div>
      </div>
    </div>
  );
}
