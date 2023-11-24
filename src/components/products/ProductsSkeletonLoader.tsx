import { Skeleton } from "../ui/skeleton";

const ProductsSkeletonLoader = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-60 h-10" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-60 h-10" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-60 h-10" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
          <Skeleton className="rounded-lg border shadow-sm h-52" />
        </div>
      </div>
    </div>
  );
};

export default ProductsSkeletonLoader;
