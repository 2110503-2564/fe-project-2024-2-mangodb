// *** GET ***

interface HotelItem {
  success: boolean;
  data: {
    _id: string;
    averageRating: number;
    name: string;
    address: string;
    tel: string;
    imgSrc: string;
    id: string;
  };
}

interface HotelJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: HotelItem[];
}

// GET {{URL}}/api/v1/auth/me
interface UserItem {
  success: boolean;
  data: {
    _id: string;
    name: string;
    tel: string;
    email: string;
    password:string,
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

// GET {{URL}}/api/v1/bookings
interface BookingJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: BookingItem[];
}

interface RatingItem {
  _id: string;
  hotel: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  review: string;
  createdAt: Date;
  upDatedAt: Date;
  __v: number;
}

// GET {{URL}}/api/v1/hotels/:hotel_ID/ratings
interface RatingJson {
  success: boolean;
  count: number;
  averageRating: number;
  pagination: Object;
  data: RatingItem[];
}

interface RoomItem {
  size_desription: {
    adults: number;
    children: number;
  };
  _id: string;
  hotel: string;
  size: number;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  __v: number;
}

// GET {{URL}}/api/v1/hotels/:hotel_ID/rooms
interface RoomJson {
  success: boolean;
  count: number;
  data: RoomItem[];
}

// *** POST & PUT ***

interface createAndUpdateHotel {
  name: string;
  address: string;
  tel: string;
  imgSrc: string;
}

interface createAndUpdateBooking {
  checkInDate: Date;
  checkOutDate: Date;
}

interface createAndUpdateRoom {
  size: number;
  size_description: {
    adults: number;
    children: number;
  };
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  imgSrc: string
}

interface createAndUpdateRating {
  rating: number;
  review: string;
}
