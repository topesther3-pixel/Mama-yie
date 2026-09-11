export type PhoneType = 'basic' | 'smartphone' | 'both';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  dueDate: string;
  pregnancyMonth: number;
  region: string;
  facility: string;
  phoneType: PhoneType;
  startingSavings: number;
  currentSavings: number;
  weeklyTarget: number;
  targetPreparationAmount: number;
  riskProfile: string;
  supportCircleId: string;
  referralCode: string;
}

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface PartnerProduct {
  id: string;
  partnerId: string;
  name: string;
  image: string;
  description: string;
  retailPrice: number; // in GHS (GH₵)
  price?: number; // alias for retailPrice
  demoCommission: number; // in GHS (GH₵)
  commissionNote?: string;
  productUrl?: string;
  category?: 'belly_care' | 'skincare' | 'baby_essentials' | 'wellness' | string;
  demoMode?: boolean;
  active?: boolean;
  status?: 'ACTIVE' | 'OUT_OF_STOCK';
}

export interface Partner {
  id: string;
  name: string;
  website: string;
  category?: string;
  logo: string;
  image?: string;
  description: string;
  foundedLocation?: string;
  verificationStatus?: VerificationStatus;
  isPotentialPartner?: boolean;
  demoPartner?: boolean;
  active?: boolean;
  products: PartnerProduct[];
}

export interface Referral {
  id: string;
  userId: string;
  partnerId: string;
  productId: string;
  productName: string;
  referralCode: string;
  status: 'CLICKED' | 'PURCHASED' | 'PENDING';
  commission: number;
  customerName?: string;
  createdAt: string;
}

export interface DemoCommission {
  id: string;
  userId: string;
  partnerId: string;
  productId: string;
  amount: number;
  status: 'DEMO' | 'CONFIRMED';
  createdAt: string;
}

export interface SavingsTransaction {
  id: string;
  userId: string;
  type: 'PARTNER_COMMISSION' | 'REFERRAL_EARNING' | 'PERSONAL_DEPOSIT' | 'CARE_REDEMPTION';
  amount: number;
  source: string;
  description: string;
  status: 'CONFIRMED' | 'PROCESSING' | 'DEMO';
  createdAt: string;
}

export interface HealthcareService {
  id: string;
  name: string;
  description: string;
  directPrice: number;
  negotiatedPrice: number;
  canUseSavings: boolean;
  category: 'consultation' | 'delivery' | 'scan' | 'antenatal';
}

export interface HealthcarePartner {
  id: string;
  name: string;
  type: 'MIDWIFE_CLINIC' | 'MATERNAL_HOSPITAL' | 'DIAGNOSTIC_CENTER' | 'SPECIALIST_CLINIC';
  location: string;
  region: string;
  verificationStatus: VerificationStatus;
  founderVetted: boolean;
  rating: number;
  phone: string;
  services: HealthcareService[];
}

export interface SupportCircleMember {
  id: string;
  name: string;
  pregnancyMonth: number;
  location: string;
  weeklyTargetReached: boolean;
  isDemoUser?: boolean;
}

export interface SupportCircleMessage {
  id: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface SupportCircle {
  id: string;
  name: string;
  dueMonth: string;
  region: string;
  members: SupportCircleMember[];
  collectiveSavings: number;
  collectiveTarget: number;
  messages: SupportCircleMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'ama' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionKey: string;
  }[];
}

export interface CostEstimateBreakdown {
  minEstimate: number;
  maxEstimate: number;
  facilityFeeRange: string;
  maternityKitRange: string;
  antenatalLabsRange: string;
  transportBufferRange: string;
  explanation: string;
}
