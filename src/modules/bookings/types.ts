export interface BookingPayload {
  name: string;
  phone: string;
  whatsapp?: string;
  date: string;
  pickup_address?: string;
  route?: string;
  vehicle?: string;
  passengers?: string;
  type?: 'Booking' | 'Inquiry';
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  booking: {
    id: string;
    name: string;
    phone: string;
    type: string;
    status: string;
  };
  message?: string;
}
