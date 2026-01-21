import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { FilterX } from "lucide-react";
import React from "react";

type PackageTransactionsFilterSectionProps = {
  increaseSource: string;
  setIncreaseSource: (value: string) => void;
  onReset: () => void;
};

const PackageTransactionsFilterSection: React.FC<
  PackageTransactionsFilterSectionProps
> = ({ increaseSource, setIncreaseSource, onReset }) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <FormControl.Label>Increase Source</FormControl.Label>
          <FormControl
            as="select"
            value={increaseSource}
            onChange={(e) => setIncreaseSource(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="payment">Payment</option>
            <option value="bonus">Bonus</option>
          </FormControl>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <FilterX className="size-4" />
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default PackageTransactionsFilterSection;
