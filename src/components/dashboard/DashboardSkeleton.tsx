import { memo } from "react";

export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="absolute inset-0 z-20 bg-surface flex flex-col gap-6 lg:gap-8 rounded-2xl animate-pulse p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-6 rounded-full bg-outline/10"></div>
        <div className="h-6 w-32 bg-outline/10 rounded-md"></div>
        <div className="w-16 h-4 bg-outline/10 rounded-full"></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-baseline gap-4">
            <div className="h-10 w-48 bg-outline/10 rounded-lg"></div>
            <div className="h-5 w-16 bg-outline/10 rounded-md"></div>
          </div>
          <div className="h-4 w-64 bg-outline/10 rounded-md"></div>
        </div>
        
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 w-12 bg-outline/10 rounded-md"></div>
          ))}
        </div>
      </div>
      
      <div className="w-full h-[320px] md:h-[360px] bg-surface-dim/30 rounded-xl border border-outline/5 relative overflow-hidden mt-4">
         <div className="absolute bottom-4 left-4 right-4 h-32 bg-gradient-to-t from-outline/10 to-transparent rounded-lg"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-surface-dim/30 rounded-xl border border-outline/5 p-4 flex flex-col justify-between">
            <div className="h-3 w-16 bg-outline/10 rounded-sm"></div>
            <div className="h-6 w-24 bg-outline/10 rounded-md"></div>
            <div className="h-2 w-full bg-outline/10 rounded-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
});
