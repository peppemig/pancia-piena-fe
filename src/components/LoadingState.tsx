import { Loader2 } from "lucide-react";

export const Icons = {
  spinner: Loader2,
};

const LoadingState = () => {
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center">
      <Icons.spinner className="h-20 w-20 animate-spin" />
    </div>
  );
};

export default LoadingState;
