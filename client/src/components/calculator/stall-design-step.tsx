import { StallDesign } from "./stall-design";

interface StallDesignStepProps {
  stallDesignData: any;
  updateStallDesignData: (data: any) => void;
}

export function StallDesignStep({ stallDesignData, updateStallDesignData }: StallDesignStepProps) {
  return <StallDesign data={stallDesignData} onUpdate={updateStallDesignData} />;
}