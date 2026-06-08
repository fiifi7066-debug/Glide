export type Role = "RIDER" | "DRIVER"

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  avatar?: string | null
}

export interface DriverData {
  id: string
  userId: string
  licenseNumber: string
  vehicleModel: string
  vehicleColor: string
  licensePlate: string
  isAvailable: boolean
  currentLat?: number | null
  currentLng?: number | null
  rating: number
  totalTrips: number
}

export interface RiderData {
  id: string
  userId: string
  paymentMethod?: string | null
  savedLocations?: string | null
}

export type TripStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"

export interface TripData {
  id: string
  riderId: string
  driverId?: string | null
  driver?: DriverData & { user: AuthUser } | null
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  pickupAddress: string
  dropoffAddress: string
  status: TripStatus
  fare?: number | null
  distance?: number | null
  duration?: number | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
}

export type DeliveryStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"

export interface DeliveryData {
  id: string
  senderId: string
  driverId?: string | null
  driver?: DriverData & { user: AuthUser } | null
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  pickupAddress: string
  dropoffAddress: string
  parcelDescription: string
  parcelWeight?: number | null
  status: DeliveryStatus
  fare?: number | null
  distance?: number | null
  duration?: number | null
  createdAt: string
  completedAt?: string | null
}

export interface PaymentData {
  id: string
  tripId?: string | null
  deliveryId?: string | null
  amount: number
  method: string
  status: string
  transactionId?: string | null
  createdAt: string
}

export interface RatingData {
  id: string
  tripId: string
  raterId: string
  rateeId: string
  score: number
  comment?: string | null
  createdAt: string
  rater?: AuthUser
  ratee?: AuthUser
}

export interface NearbyDriver {
  id: string
  userId: string
  name: string
  phone: string
  vehicleModel: string
  vehicleColor: string
  licensePlate: string
  rating: number
  totalTrips: number
  distance: number
  currentLat: number
  currentLng: number
}

export interface LatLng {
  lat: number
  lng: number
}

export interface MatchResult {
  driverId: string
  score: number
  distance: number
  eta: number
}
