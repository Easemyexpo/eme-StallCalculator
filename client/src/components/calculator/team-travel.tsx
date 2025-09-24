import { Users } from "lucide-react";
import { AITooltip } from "@/components/ui/ai-tooltip";

interface TeamTravelProps {
  formData: {
    teamSize: number;
    accommodationLevel: string;
  };
  updateFormData: (updates: any) => void;
}

export function TeamTravel({ formData, updateFormData }: TeamTravelProps) {
  return (
    <div className="space-y-6" data-testid="card-team-travel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700" data-testid="label-team-size">Team Size</label>
            <AITooltip 
              context="travel-planning"
              fieldName="teamSize"
              currentValue={formData.teamSize}
              formData={formData}
              position="top"
            />
          </div>
          <input 
            type="text" 
            value={formData.teamSize} 
            onChange={(e) => updateFormData({ teamSize: parseInt(e.target.value) || 4 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
            placeholder="4"
            data-testid="input-team-size"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700" data-testid="label-accommodation">Accommodation Level</label>
            <AITooltip 
              context="travel-planning"
              fieldName="accommodationLevel"
              currentValue={formData.accommodationLevel}
              formData={formData}
              position="top"
            />
          </div>
          <select 
            value={formData.accommodationLevel}
            onChange={(e) => updateFormData({ accommodationLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            data-testid="select-accommodation"
          >
            <option value="budget">Budget (3-star)</option>
            <option value="business">Business (4-star)</option>
            <option value="luxury">Luxury (5-star)</option>
          </select>
        </div>
      </div>
    </div>
  );
}