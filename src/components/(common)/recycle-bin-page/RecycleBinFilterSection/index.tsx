import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormControl } from "@/components/ui/FormControl";
import { RotateCcw } from "lucide-react";
import React from "react";

interface RecycleBinFilterSectionProps {
  gte: string;
  setGte: (value: string) => void;
  lte: string;
  setLte: (value: string) => void;
  onReset: () => void;
}

const RecycleBinFilterSection: React.FC<RecycleBinFilterSectionProps> = ({
  gte,
  setGte,
  lte,
  setLte,
  onReset,
}) => {
  return (
    <Card className="mb-6">
      <Card.Content className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <div className="space-y-1">
              <FormControl.Label>Date Deleted Range</FormControl.Label>
              <div className="flex items-center gap-2">
                <DatePicker
                  value={gte}
                  onChange={(e) => setGte(e.target.value)}
                  placeholder="From"
                />
                <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                  to
                </span>
                <DatePicker
                  value={lte}
                  onChange={(e) => setLte(e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default RecycleBinFilterSection;
