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
    <div className="space-y-6" data-testid="card-booth-specs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-booth-size">Stall Size (sqm)</label>
          <select 
            value={getBoothSizeValue()}
            onChange={(e) => handleBoothSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            data-testid="select-booth-size"
          >
            <option value="9">Small Stall (9 sqm)</option>
            <option value="18">Standard Stall (18 sqm)</option>
            <option value="36">Large Stall (36 sqm)</option>
            <option value="54">Premium Space (54 sqm)</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-booth-type">Stall Construction Type</label>
          <select 
            value={formData.boothType}
            onChange={(e) => updateFormData({ boothType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            data-testid="select-booth-type"
          >
            <option value="shell">Shell Scheme Package (₹6k-8k/sqm)</option>
            <option value="custom">Custom Fabrication (₹12k-15k/sqm)</option>
            <option value="modular">Modular Exhibition System (₹8k-12k/sqm)</option>
            <option value="premium">Premium Designer Stall (₹20k-30k/sqm)</option>
          </select>
        </div>
        {formData.boothSize === 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-custom-size">Custom Size (sqm)</label>
            <input 
              type="number" 
              min="1" 
              max="500" 
              value={formData.customSize || ''} 
              onChange={(e) => updateFormData({ customSize: parseInt(e.target.value) || 25 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
              placeholder="25"
              data-testid="input-custom-size"
            />
          </div>
        )}
      </div>

      {/* Additional Services */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'furniture', label: 'Furniture Package', price: '₹25,000' },
            { key: 'avEquipment', label: 'AV Equipment', price: '₹18,500' },
            { key: 'lighting', label: 'Premium Lighting', price: '₹12,000' },
            { key: 'internet', label: 'WiFi & Internet', price: '₹5,500' },
            { key: 'storage', label: 'Storage Space', price: '₹8,000' },
            { key: 'security', label: 'Security Services', price: '₹15,000' }
          ].map((service) => (
            <label key={service.key} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 ${
              formData[service.key as keyof typeof formData] ? 'border-primary bg-primary/10' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData[service.key as keyof typeof formData] as boolean}
                  onChange={(e) => updateFormData({ [service.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  data-testid={`checkbox-${service.key}`}
                />
                <span className="text-sm font-medium text-gray-900">{service.label}</span>
              </div>
              <span className="text-sm font-semibold text-primary">{service.price}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}