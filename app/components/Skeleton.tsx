export function TableSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded w-full"></div>
      ))}
    </div>
  );
}