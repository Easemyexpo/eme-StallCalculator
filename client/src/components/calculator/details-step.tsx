import { EventDetails } from "./event-details";

interface DetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function DetailsStep({ formData, updateFormData }: DetailsStepProps) {
  return <EventDetails formData={formData} updateFormData={updateFormData} />;
}