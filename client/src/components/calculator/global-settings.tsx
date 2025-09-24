import { Globe } from "lucide-react";

interface GlobalSettingsProps {
  formData: {
    currency: string;
    marketLevel: string;
  };
  updateFormData: (updates: any) => void;
}

export function GlobalSettings({ formData, updateFormData }: GlobalSettingsProps) {
  return (
    <div className="space-y-6" data-testid="card-global-settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-currency">Currency</label>
          <select 
            value={formData.currency}
            onChange={(e) => updateFormData({ currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
            data-testid="select-currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="SGD">SGD (S$)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-market-level">Market Level</label>
          <select 
            value={formData.marketLevel}
            onChange={(e) => updateFormData({ marketLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
            data-testid="select-market-level"
          >
            <option value="low">Low Cost Market (Emerging)</option>
            <option value="medium">Medium Cost Market (Standard)</option>
            <option value="high">High Cost Market (Premium Cities)</option>
            <option value="premium">Ultra Premium (NYC, London, Tokyo)</option>
          </select>
        </div>
      </div>

      {/* Company Details */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4" data-testid="title-company">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-company-name">Company Name</label>
            <input 
              type="text"
              placeholder="Enter your company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="input-company-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-contact-person">Contact Person</label>
            <input 
              type="text"
              placeholder="Contact person name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="input-contact-person"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-email">Email</label>
            <input 
              type="email"
              placeholder="contact@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="input-email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-phone">Phone Number</label>
            <input 
              type="tel"
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="input-phone"
            />
          </div>
        </div>
      </div>

      {/* Budget Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4" data-testid="title-budget">Budget & Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-budget">Total Budget</label>
            <input 
              type="number"
              placeholder="Enter total budget"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="input-budget"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-priority">Priority</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="select-priority"
            >
              <option value="">Select priority</option>
              <option value="cost">Cost Effectiveness</option>
              <option value="quality">Quality</option>
              <option value="speed">Speed</option>
              <option value="innovation">Innovation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibition Preferences */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4" data-testid="title-preferences">Exhibition Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-booth-style">Preferred Booth Style</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="select-booth-style"
            >
              <option value="">Select style</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="minimalist">Minimalist</option>
              <option value="interactive">Interactive</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="label-goals">Primary Goals</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary input-focus"
              data-testid="select-goals"
            >
              <option value="">Select primary goal</option>
              <option value="lead-generation">Lead Generation</option>
              <option value="brand-awareness">Brand Awareness</option>
              <option value="product-launch">Product Launch</option>
              <option value="networking">Networking</option>
              <option value="market-research">Market Research</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}