import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { FilterX } from "lucide-react";
import React from "react";

interface FeatureFeedbacksFilterSectionProps {
  status: string;
  setStatus: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onReset: () => void;
}

const FeatureFeedbacksFilterSection: React.FC<
  FeatureFeedbacksFilterSectionProps
> = ({ status, setStatus, category, setCategory, onReset }) => {
  return (
    <Card className="p-4">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1 space-y-1">
            <FormControl.Label className="uppercase">Status</FormControl.Label>
            <FormControl
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9"
            >
              <option value="null">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </FormControl>
          </div>

          <div className="min-w-[200px] flex-1 space-y-1">
            <FormControl.Label className="uppercase">
              Category
            </FormControl.Label>
            <FormControl
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9"
            >
              <option value="null">All Categories</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug</option>
              <option value="compliment">Compliment</option>
              <option value="other">Other</option>
            </FormControl>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex h-9 items-center gap-2"
            >
              <FilterX className="size-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default FeatureFeedbacksFilterSection;
