import { Loader2 } from "lucide-react";

export const Icons = {
  spinner: Loader2,
};

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Icons.spinner className="h-20 w-20 animate-spin" />
    </div>
  );
};

export default LoadingState;
