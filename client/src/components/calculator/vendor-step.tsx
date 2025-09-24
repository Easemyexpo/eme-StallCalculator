import SmartVendorMatching from "./smart-vendor-matching";

interface VendorStepProps {
  formData: any;
  selectedVendors: any[];
  setSelectedVendors: (vendors: any[]) => void;
}

export function VendorStep({ formData, selectedVendors, setSelectedVendors }: VendorStepProps) {
  return <SmartVendorMatching 
    formData={formData} 
    selectedVendors={selectedVendors} 
    setSelectedVendors={setSelectedVendors} 
  />;
}