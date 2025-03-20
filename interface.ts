interface HotelItem {
  success: boolean;
  data: {
    _id: string;
    averageRating: number;
    name: string;
    address: string;
    tel: string;
    id: string;
  };
}

interface HotelJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: HotelItem[];
}

//{{URL}}/api/v1/auth/me
interface UserItem {
  success: boolean;
  data: {
    _id: string;
    name: string;
    tel: string;
    email: string;
    role: string;
    createdAt: Date;
    __v: number;
  };
}

interface BookingItem {
  success: boolean;
  data: {
    _id: string;
    user: string;
    hotel: {
      _id: string;
      name: string;
      tel: string;
      id: string;
    };
    checkInDate: Date;
    checkOutDate: Date;
    createdAt: Date;
    __v: number;
  };
}

interface BookingJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: BookingItem[];
}

interface RatingJson {
  success: boolean;
  count: number;
  averageRating: number;
  pagination: Object;
  data: [];
}
