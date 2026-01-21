import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormControl } from "@/components/ui/FormControl";
import { X } from "lucide-react";
import React from "react";

type TCreditsTransactionsFilterSectionProps = {
  gte: string;
  setGte: (value: string) => void;
  lte: string;
  setLte: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  increaseSource: string;
  setIncreaseSource: (value: string) => void;
  onReset: () => void;
};

const CreditsTransactionsFilterSection: React.FC<
  TCreditsTransactionsFilterSectionProps
> = ({
  gte,
  setGte,
  lte,
  setLte,
  type,
  setType,
  increaseSource,
  setIncreaseSource,
  onReset,
}) => {
  return (
    <Card>
      <Card.Header className="border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <FormControl.Label>Date Range (From - To)</FormControl.Label>
            <div className="border-input focus-within:ring-accent flex w-full items-center gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <DatePicker
                value={gte}
                onChange={(e) => setGte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="From"
              />
              <div className="bg-muted text-muted-foreground border-input flex h-9 shrink-0 items-center border-x px-2">
                <span className="font-mono text-[10px] font-bold">TO</span>
              </div>
              <DatePicker
                value={lte}
                onChange={(e) => setLte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="To"
              />
            </div>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Type</FormControl.Label>
            <FormControl
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9"
            >
              <option value="">All Types</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </FormControl>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Increase Source</FormControl.Label>
            <FormControl
              as="select"
              value={increaseSource}
              onChange={(e) => setIncreaseSource(e.target.value)}
              className="h-9"
              disabled={type === "decrease"}
            >
              <option value="">All Sources</option>
              <option value="payment">Payment</option>
              <option value="bonus">Bonus</option>
              <option value="refund">Refund</option>
            </FormControl>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CreditsTransactionsFilterSection;
