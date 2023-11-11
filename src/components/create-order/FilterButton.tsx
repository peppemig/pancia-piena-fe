import { Button } from "@/components/ui/button";

type FilterButtonProps = {
  label: string;
  value: string;
  currentFilter: string;
  onClick: (value: string) => void;
};

const FilterButton = ({
  label,
  value,
  currentFilter,
  onClick,
}: FilterButtonProps) => {
  return (
    <Button
      variant={currentFilter === value ? "default" : "outline"}
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  );
};

export default FilterButton;
