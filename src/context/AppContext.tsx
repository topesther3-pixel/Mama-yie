import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Partner,
  HealthcarePartner,
  SupportCircle,
  SavingsTransaction,
  Referral,
  PartnerProduct,
  HealthcareService,
  VerificationStatus,
  DemoCommission,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PARTNERS,
  INITIAL_HEALTHCARE_PARTNERS,
  INITIAL_SUPPORT_CIRCLE,
  INITIAL_TRANSACTIONS,
  INITIAL_REFERRALS,
} from '../data/initialData';

export type AppView =
  | 'login'
  | 'otp'
  | 'onboarding'
  | 'home'
  | 'ama'
  | 'earn'
  | 'care'
  | 'ussd';

export interface ReferralSuccessInfo {
  isOpen: boolean;
  amount: number;
  productName: string;
  partnerName?: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otpCode: string;
  setOtpCode: (otp: string) => void;
  partners: Partner[];
  healthcarePartners: HealthcarePartner[];
  supportCircle: SupportCircle;
  transactions: SavingsTransaction[];
  referrals: Referral[];
  commissions: DemoCommission[];
  activeModal: 'none' | 'judgeMoment' | 'onboarding' | 'shareProduct' | 'useSavingsModal' | 'careSuccessModal';
  setActiveModal: (modal: 'none' | 'judgeMoment' | 'onboarding' | 'shareProduct' | 'useSavingsModal' | 'careSuccessModal') => void;
  activeProductForShare: PartnerProduct | null;
  setActiveProductForShare: (prod: PartnerProduct | null) => void;
  activeCareService: HealthcareService | null;
  setActiveCareService: (service: HealthcareService | null) => void;
  lastEarningAmount: number;
  redeemedCareAmount: number;
  referralSuccess: ReferralSuccessInfo;
  setReferralSuccess: (info: ReferralSuccessInfo) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isTourActive: boolean;
  tourStep: number;
  startDemoTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  simulateReferralPurchase: (product: PartnerProduct, customerName?: string, partnerName?: string) => void;
  redeemSavingsForCare: (service: HealthcareService, amountToRedeem: number) => boolean;
  addPartner: (partner: Partner) => void;
  updatePartnerStatus: (partnerId: string, status: VerificationStatus) => void;
  updateHealthcareStatus: (partnerId: string, status: VerificationStatus) => void;
  resetToDefaultDemo: () => void;
  addSupportCircleMessage: (text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [phoneNumber, setPhoneNumber] = useState<string>('024 555 0192');
  const [otpCode, setOtpCode] = useState<string>('');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [healthcarePartners, setHealthcarePartners] = useState<HealthcarePartner[]>(INITIAL_HEALTHCARE_PARTNERS);
  const [supportCircle, setSupportCircle] = useState<SupportCircle>(INITIAL_SUPPORT_CIRCLE);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>(INITIAL_TRANSACTIONS);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [commissions, setCommissions] = useState<DemoCommission[]>([]);

  const [activeModal, setActiveModal] = useState<'none' | 'judgeMoment' | 'onboarding' | 'shareProduct' | 'useSavingsModal' | 'careSuccessModal'>('none');
  const [activeProductForShare, setActiveProductForShare] = useState<PartnerProduct | null>(null);
  const [activeCareService, setActiveCareService] = useState<HealthcareService | null>(null);
  const [lastEarningAmount, setLastEarningAmount] = useState<number>(0);
  const [redeemedCareAmount, setRedeemedCareAmount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [referralSuccess, setReferralSuccess] = useState<ReferralSuccessInfo>({
    isOpen: false,
    amount: 5,
    productName: 'Shea Butter Body Care Bundle',
    partnerName: 'Numa Organics',
  });

  // Guided Judge Presentation Mode state
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // The Crucial Financial Logic: AI never touches money directly
  const simulateReferralPurchase = (
    product: PartnerProduct,
    customerName = 'Customer in Kumasi Adum',
    partnerName?: string
  ) => {
    if (!product || typeof product.demoCommission !== 'number' || product.demoCommission <= 0) {
      return;
    }

    const earning = product.demoCommission;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const partnerObj = partners.find((p) => p.id === product.partnerId);
    const resolvedPartnerName = partnerName || partnerObj?.name || 'Demo Partner';

    // 1. Create transaction ledger entry
    const newTx: SavingsTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'PARTNER_COMMISSION',
      amount: earning,
      source: resolvedPartnerName,
      description: `Commission from ${product.name} (Ref: ${user.referralCode})`,
      status: 'CONFIRMED',
      createdAt: `Today, ${timeString}`,
    };

    // 2. Create referral tracking entry
    const newRef: Referral = {
      id: `ref_${Date.now()}`,
      userId: user.id,
      partnerId: product.partnerId,
      productId: product.id,
      productName: product.name,
      referralCode: user.referralCode,
      status: 'PURCHASED',
      commission: earning,
      customerName,
      createdAt: `Today, ${timeString}`,
    };

    // 3. Create commission record
    const newCommission: DemoCommission = {
      id: `comm_${Date.now()}`,
      userId: user.id,
      partnerId: product.partnerId,
      productId: product.id,
      amount: earning,
      status: 'DEMO',
      createdAt: now.toISOString(),
    };

    // 4. Update financial balance
    setUser((prev) => ({
      ...prev,
      currentSavings: prev.currentSavings + earning,
    }));

    // 5. Update collective circle fund
    setSupportCircle((prev) => ({
      ...prev,
      collectiveSavings: prev.collectiveSavings + earning,
      messages: [
        {
          id: `msg_earn_${Date.now()}`,
          senderName: `${user.name} (You)`,
          text: `Just earned GH₵${earning} from a ${resolvedPartnerName} referral! It went straight into my Motherhood Fund ✨`,
          timestamp: 'Just now',
          isSystem: false,
        },
        ...prev.messages,
      ],
    }));

    setTransactions((prev) => [newTx, ...prev]);
    setReferrals((prev) => [newRef, ...prev]);
    setCommissions((prev) => [newCommission, ...prev]);
    setLastEarningAmount(earning);

    // 6. Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E8824A', '#2D6A4F', '#D97706', '#FFF'],
      });
    } catch (e) {
      // safe fallback if canvas not ready
    }

    // 7. Set referral success state for clean mobile modal
    setReferralSuccess({
      isOpen: true,
      amount: earning,
      productName: product.name,
      partnerName: resolvedPartnerName,
    });
  };

  const redeemSavingsForCare = (service: HealthcareService, amountToRedeem: number): boolean => {
    if (user.currentSavings < amountToRedeem || amountToRedeem <= 0) {
      return false;
    }

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newTx: SavingsTransaction = {
      id: `tx_redeem_${Date.now()}`,
      userId: user.id,
      type: 'CARE_REDEMPTION',
      amount: -amountToRedeem,
      source: service.name,
      description: `Redeemed savings voucher for ${service.name}`,
      status: 'CONFIRMED',
      createdAt: `Today, ${timeString}`,
    };

    setUser((prev) => ({
      ...prev,
      currentSavings: Math.max(0, prev.currentSavings - amountToRedeem),
    }));

    setTransactions((prev) => [newTx, ...prev]);
    setRedeemedCareAmount(amountToRedeem);
    setActiveCareService(service);
    setActiveModal('careSuccessModal');
    return true;
  };

  const addPartner = (newPartner: Partner) => {
    setPartners((prev) => [newPartner, ...prev]);
  };

  const updatePartnerStatus = (partnerId: string, status: VerificationStatus) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, verificationStatus: status } : p))
    );
  };

  const updateHealthcareStatus = (partnerId: string, status: VerificationStatus) => {
    setHealthcarePartners((prev) =>
      prev.map((hp) => (hp.id === partnerId ? { ...hp, verificationStatus: status } : hp))
    );
  };

  const addSupportCircleMessage = (text: string) => {
    setSupportCircle((prev) => ({
      ...prev,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderName: `${user.name} (You)`,
          text,
          timestamp: 'Just now',
        },
        ...prev.messages,
      ],
    }));
  };

  const resetToDefaultDemo = () => {
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setReferrals(INITIAL_REFERRALS);
    setSupportCircle(INITIAL_SUPPORT_CIRCLE);
    setPartners(INITIAL_PARTNERS);
    setHealthcarePartners(INITIAL_HEALTHCARE_PARTNERS);
    setCurrentView('landing');
    setActiveModal('none');
    setIsTourActive(false);
    setTourStep(0);
  };

  // Tour / Hackathon Presentation Mode methods
  const startDemoTour = () => {
    setIsTourActive(true);
    setTourStep(1);
    setCurrentView('landing');
  };

  const nextTourStep = () => {
    setTourStep((prev) => prev + 1);
  };

  const prevTourStep = () => {
    setTourStep((prev) => Math.max(1, prev - 1));
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  // Synchronize view during tour steps
  useEffect(() => {
    if (!isTourActive) return;

    switch (tourStep) {
      case 1:
        setCurrentView('landing');
        break;
      case 2:
        setCurrentView('onboarding');
        break;
      case 3:
        setCurrentView('ama');
        break;
      case 4:
        setCurrentView('dashboard');
        break;
      case 5:
        setCurrentView('earn');
        break;
      case 6:
        // Trigger simulated purchase if user has 0 savings
        if (user.currentSavings === 0 && partners[0]?.products[0]) {
          simulateReferralPurchase(partners[0].products[0]);
        }
        break;
      case 7:
        setCurrentView('dashboard');
        break;
      case 8:
        setCurrentView('circles');
        break;
      case 9:
        setCurrentView('care');
        break;
      case 10:
        setCurrentView('ussd');
        break;
      case 11:
        setCurrentView('admin');
        break;
      case 12:
        setCurrentView('landing');
        break;
      default:
        break;
    }
  }, [tourStep, isTourActive]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        updateUserProfile,
        phoneNumber,
        setPhoneNumber,
        otpCode,
        setOtpCode,
        partners,
        healthcarePartners,
        supportCircle,
        transactions,
        referrals,
        commissions,
        activeModal,
        setActiveModal,
        activeProductForShare,
        setActiveProductForShare,
        activeCareService,
        setActiveCareService,
        lastEarningAmount,
        redeemedCareAmount,
        referralSuccess,
        setReferralSuccess,
        isMenuOpen,
        setIsMenuOpen,
        isTourActive,
        tourStep,
        startDemoTour,
        nextTourStep,
        prevTourStep,
        endTour,
        simulateReferralPurchase,
        redeemSavingsForCare,
        addPartner,
        updatePartnerStatus,
        updateHealthcareStatus,
        resetToDefaultDemo,
        addSupportCircleMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
