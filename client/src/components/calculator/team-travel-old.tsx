import { Users } from "lucide-react";

interface TeamTravelProps {
  formData: {
    teamSize: number;
    accommodationLevel: string;
  };
  updateFormData: (updates: any) => void;
}

export function TeamTravel({ formData, updateFormData }: TeamTravelProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }} data-testid="card-team-travel">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-6 h-6 text-cyan-400" data-testid="icon-users" />
        <h2 className="text-2xl font-semibold text-white" data-testid="title-team-travel">Team & Travel</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" data-testid="label-team-size">Team Size</label>
          <input 
            type="number" 
            min="1" 
            max="20" 
            value={formData.teamSize} 
            onChange={(e) => updateFormData({ teamSize: parseInt(e.target.value) || 4 })}
            className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none" 
            placeholder="4"
            data-testid="input-team-size"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" data-testid="label-accommodation">Accommodation Level</label>
          <select 
            value={formData.accommodationLevel}
            onChange={(e) => updateFormData({ accommodationLevel: e.target.value })}
            className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"
            data-testid="select-accommodation"
          >
            <option value="budget" className="bg-slate-800">Budget (3-star)</option>
            <option value="business" className="bg-slate-800">Business (4-star)</option>
            <option value="luxury" className="bg-slate-800">Luxury (5-star)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
