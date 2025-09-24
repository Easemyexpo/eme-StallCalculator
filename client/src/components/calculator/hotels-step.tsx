import { HotelSelection } from "./hotel-selection";

interface HotelsStepProps {
  formData: any;
  selectedHotel: any;
  setSelectedHotel: (hotel: any) => void;
}

export function HotelsStep({ formData, selectedHotel, setSelectedHotel }: HotelsStepProps) {
  return <HotelSelection 
    formData={formData}
    selectedHotel={selectedHotel}
    onHotelSelect={setSelectedHotel}
  />;
}