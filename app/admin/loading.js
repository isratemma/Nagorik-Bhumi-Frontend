export default function AdminLoading() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="animate-pulse space-y-5">
        <div className="h-40 bg-gray-200 rounded-2xl"/>
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_,i) => <div key={i} className="h-24 bg-gray-200 rounded-xl"/>)}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-52 bg-gray-200 rounded-xl"/>
          <div className="h-52 bg-gray-200 rounded-xl"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_,i) => <div key={i} className="h-64 bg-gray-200 rounded-xl"/>)}
        </div>
      </div>
    </div>
  );
}
