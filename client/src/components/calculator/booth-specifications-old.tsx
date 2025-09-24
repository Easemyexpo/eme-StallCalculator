import { Building } from "lucide-react";

interface BoothSpecificationsProps {
  formData: {
    boothSize: number;
    customSize?: number;
    boothType: string;
    furniture: boolean;
    avEquipment: boolean;
    lighting: boolean;
    internet: boolean;
    storage: boolean;
    security: boolean;
  };
  updateFormData: (updates: any) => void;
}

export function BoothSpecifications({ formData, updateFormData }: BoothSpecificationsProps) {
  const handleBoothSizeChange = (value: string) => {
    if (value === "custom") {
      updateFormData({ boothSize: 0, customSize: formData.customSize || 25 });
    } else {
      updateFormData({ boothSize: parseInt(value), customSize: undefined });
    }
  };

  const getBoothSizeValue = () => {
    if (formData.boothSize === 0 && formData.customSize) {
      return "custom";
    }
    return formData.boothSize.toString();
  };

  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }} data-testid="card-booth-specs">
      <div className="flex items-center space-x-3 mb-6">
        <Building className="w-6 h-6 text-pink-400" data-testid="icon-building" />
        <h2 className="text-2xl font-semibold text-white" data-testid="title-booth-specs">Exhibition Stall Specifications</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" data-testid="label-booth-size">Stall Size (sqm)</label>
          <select 
            value={getBoothSizeValue()}
            onChange={(e) => handleBoothSizeChange(e.target.value)}
            className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"
            data-testid="select-booth-size"
          >
            <option value="9" className="bg-slate-800">Small Stall (9 sqm)</option>
            <option value="18" className="bg-slate-800">Standard Stall (18 sqm)</option>
            <option value="36" className="bg-slate-800">Large Stall (36 sqm)</option>
            <option value="54" className="bg-slate-800">Premium Space (54 sqm)</option>
            <option value="custom" className="bg-slate-800">Custom Size</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" data-testid="label-booth-type">Stall Construction Type</label>
          <select 
            value={formData.boothType}
            onChange={(e) => updateFormData({ boothType: e.target.value })}
            className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"
            data-testid="select-booth-type"
          >
            <option value="shell" className="bg-slate-800">Shell Scheme Package (₹6k-8k/sqm)</option>
            <option value="custom" className="bg-slate-800">Custom Fabrication (₹12k-15k/sqm)</option>
            <option value="modular" className="bg-slate-800">Modular Exhibition System (₹8k-12k/sqm)</option>
            <option value="premium" className="bg-slate-800">Premium Designer Stall (₹20k-30k/sqm)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" data-testid="label-custom-size">Custom Size (sqm)</label>
          <input 
            type="number" 
            min="1" 
            value={formData.customSize || ""} 
            onChange={(e) => updateFormData({ customSize: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none" 
            placeholder="Enter custom size"
            disabled={getBoothSizeValue() !== "custom"}
            data-testid="input-custom-size"
          />
        </div>
      </div>

      {/* Booth Display Images */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <img 
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
          alt="Professional exhibition booth" 
          className="w-full h-16 object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          data-testid="img-booth-1"
        />
        <img 
          src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
          alt="Technology showcase booth" 
          className="w-full h-16 object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          data-testid="img-booth-2"
        />
        <img 
          src="https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
          alt="Modern trade show display" 
          className="w-full h-16 object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          data-testid="img-booth-3"
        />
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
          alt="Corporate event booth" 
          className="w-full h-16 object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          data-testid="img-booth-4"
        />
      </div>

      {/* Additional Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4" data-testid="title-additional-services">Stall Add-on Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-furniture">
            <input 
              type="checkbox" 
              checked={formData.furniture}
              onChange={(e) => updateFormData({ furniture: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-furniture"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Furniture & Fittings</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-av-equipment">
            <input 
              type="checkbox" 
              checked={formData.avEquipment}
              onChange={(e) => updateFormData({ avEquipment: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-av-equipment"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Audio Visual Setup</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-lighting">
            <input 
              type="checkbox" 
              checked={formData.lighting}
              onChange={(e) => updateFormData({ lighting: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-lighting"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Premium Lighting</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-internet">
            <input 
              type="checkbox" 
              checked={formData.internet}
              onChange={(e) => updateFormData({ internet: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-internet"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Internet & WiFi</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-storage">
            <input 
              type="checkbox" 
              checked={formData.storage}
              onChange={(e) => updateFormData({ storage: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-storage"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Storage Space</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group" data-testid="label-security">
            <input 
              type="checkbox" 
              checked={formData.security}
              onChange={(e) => updateFormData({ security: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              data-testid="checkbox-security"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Security Services</span>
          </label>
        </div>
      </div>
    </div>
  );
}
