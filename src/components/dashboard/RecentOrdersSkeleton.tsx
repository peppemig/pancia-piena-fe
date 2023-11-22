import { Skeleton } from "../ui/skeleton";

const RecentOrdersSkeleton = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </>
  );
};

export default RecentOrdersSkeleton;
