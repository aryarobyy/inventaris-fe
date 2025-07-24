export const Role = {
  PENDING: 'pending',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const

export type Role = typeof Role[keyof typeof Role]

export const ItemCategory = {
  COMPUTER: 'computer',
  WEB_CAM: 'web_cam',
  PRINTER: 'printer',
  PROJECTOR: 'projector',
  CABLE: 'cable',
  MOUSE: 'mouse',
  KEYBOARD: 'keyboard',
  HEADSET: 'headset',
  MONITOR: 'monitor',
  LAPTOP: 'laptop'
} as const;

export type ItemCategory = typeof ItemCategory[keyof typeof ItemCategory];

export const ItemCondition = {
  GOOD: 'good',
  DAMAGED: 'damaged',
  REPAIR: 'repair',
  LOST: 'lost'
} as const;

export type ItemCondition = typeof ItemCondition[keyof typeof ItemCondition];

export const ItemAvailability = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired'
} as const;

export type ItemAvailability = typeof ItemAvailability[keyof typeof ItemAvailability];

export const LoanStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
} as const;

export type LoanStatus = typeof LoanStatus[keyof typeof LoanStatus];

export const RoomStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
} as const;

export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export const BookingStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];