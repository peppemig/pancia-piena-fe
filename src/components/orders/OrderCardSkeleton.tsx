import { Skeleton } from "@/components/ui/skeleton";

const OrderCardSkeleton = ({ qty = 1 }: { qty?: number }) => {
  return (
    <>
      {Array(qty)
        .fill(0)
        .map((item, index) => (
          <div
            key={index}
            className="gap-6 border rounded-md p-6 flex flex-col justify-between"
          >
            <Skeleton className="h-8" />
            <Skeleton className="flex-grow h-14" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        ))}
    </>
  );
};

export default OrderCardSkeleton;
