import { create } from "zustand"
import type {
  AuthUser,
  TripData,
  DeliveryData,
  NearbyDriver,
  DriverData,
} from "@/types"

interface AppState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  isDriver: boolean

  activeTrip: TripData | null
  setActiveTrip: (trip: TripData | null) => void

  activeDelivery: DeliveryData | null
  setActiveDelivery: (delivery: DeliveryData | null) => void

  nearbyDrivers: NearbyDriver[]
  setNearbyDrivers: (drivers: NearbyDriver[]) => void

  driverLocation: { lat: number; lng: number } | null
  setDriverLocation: (loc: { lat: number; lng: number } | null) => void

  tripHistory: TripData[]
  setTripHistory: (trips: TripData[]) => void

  deliveryHistory: DeliveryData[]
  setDeliveryHistory: (deliveries: DeliveryData[]) => void

  driverData: DriverData | null
  setDriverData: (data: DriverData | null) => void

  pendingRequests: TripData[]
  setPendingRequests: (requests: TripData[]) => void

  pendingDeliveries: DeliveryData[]
  setPendingDeliveries: (deliveries: DeliveryData[]) => void
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user, isDriver: user?.role === "DRIVER" }),
  isDriver: false,

  activeTrip: null,
  setActiveTrip: (activeTrip) => set({ activeTrip }),

  activeDelivery: null,
  setActiveDelivery: (activeDelivery) => set({ activeDelivery }),

  nearbyDrivers: [],
  setNearbyDrivers: (nearbyDrivers) => set({ nearbyDrivers }),

  driverLocation: null,
  setDriverLocation: (driverLocation) => set({ driverLocation }),

  tripHistory: [],
  setTripHistory: (tripHistory) => set({ tripHistory }),

  deliveryHistory: [],
  setDeliveryHistory: (deliveryHistory) => set({ deliveryHistory }),

  driverData: null,
  setDriverData: (driverData) => set({ driverData }),

  pendingRequests: [],
  setPendingRequests: (pendingRequests) => set({ pendingRequests }),

  pendingDeliveries: [],
  setPendingDeliveries: (pendingDeliveries) => set({ pendingDeliveries }),
}))
