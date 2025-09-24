import { RealTimeTravel } from "./real-time-travel";

interface FlightsStepProps {
  formData: any;
  selectedFlights: any;
  setSelectedFlights: (flights: any) => void;
  showReturnFlights: boolean;
  setShowReturnFlights: (show: boolean) => void;
}

export function FlightsStep({ 
  formData, 
  selectedFlights, 
  setSelectedFlights, 
  showReturnFlights, 
  setShowReturnFlights 
}: FlightsStepProps) {
  return <RealTimeTravel 
    formData={formData}
    selectedFlights={selectedFlights}
    setSelectedFlights={setSelectedFlights}
    showReturnFlights={showReturnFlights}
    setShowReturnFlights={setShowReturnFlights}
  />;
}