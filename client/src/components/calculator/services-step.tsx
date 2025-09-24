import { BoothSpecifications } from "./booth-specifications";

interface ServicesStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function ServicesStep({ formData, updateFormData }: ServicesStepProps) {
  return <BoothSpecifications formData={formData} updateFormData={updateFormData} />;
}