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
import {
  subscribeToAuth,
  signOutCurrentUser,
  formatGhanaPhoneNumber,
} from '../services/authService';
import {
  getUserProfile,
  saveUserProfile,
  updateUserProfileDoc,
} from '../services/userService';
import {
  getSavingsProfile,
  initSavingsProfile,
  getUserTransactions,
  claimDemoCommissionViaBackend,
  requestWithdrawal,
} from '../services/savingsService';
import { getPartnersFromFirestore } from '../services/partnerService';
import { seedDemoDataIfEmpty } from '../services/seedService';
import { requestConsultationBooking } from '../services/consultantService';
import { createCommunityPost, reportCommunityContent } from '../services/communityService';

export type AppView =
  | 'login'
  | 'otp'
  | 'onboarding'
  | 'home'
  | 'ama'
  | 'earn'
  | 'care'
  | 'ussd'
  | 'landing'
  | 'dashboard'
  | 'circles'
  | 'admin';

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
  firebaseUid: string | null;
  isAuthenticated: boolean;
  handleAuthSuccess: (uid: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  careSubTab: 'partners' | 'locator';
  setCareSubTab: (tab: 'partners' | 'locator') => void;
  openHospitalLocator: () => void;
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
  simulateReferralPurchase: (product: PartnerProduct, customerName?: string, partnerName?: string) => Promise<void>;
  redeemSavingsForCare: (service: HealthcareService, amountToRedeem: number) => boolean;
  requestFundWithdrawal: (amount: number, method: 'MOBILE_MONEY' | 'BANK', momoPhone?: string, network?: 'MTN' | 'Telecel' | 'AT') => Promise<{ success: boolean; error?: string }>;
  bookConsultation: (params: { consultantId: string; consultantName?: string; reason: string; date: string; time: string; fee: number }) => Promise<{ success: boolean; error?: string }>;
  submitPost: (content: string) => Promise<{ success: boolean; error?: string }>;
  reportContent: (targetType: 'post' | 'comment' | 'user', targetId: string, reason: string) => Promise<{ success: boolean; error?: string }>;
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
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
  const [careSubTab, setCareSubTab] = useState<'partners' | 'locator'>('locator');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const [referralSuccess, setReferralSuccess] = useState<ReferralSuccessInfo>({
    isOpen: false,
    amount: 5,
    productName: 'Shea Butter Body Care Bundle',
    partnerName: 'Numa Organics',
  });

  const openHospitalLocator = () => {
    setCareSubTab('locator');
    setCurrentView('care');
  };

  // Initialize Firestore collections & load verified partners on boot
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await seedDemoDataIfEmpty();
        const firestorePartners = await getPartnersFromFirestore();
        if (isMounted && firestorePartners && firestorePartners.length > 0) {
          setPartners(firestorePartners);
        }
      } catch (err) {
        console.warn('Initial data load note:', err);
      }
    })();

    // Subscribe to Firebase Auth
    const unsubscribe = subscribeToAuth(async (firebaseUser, fallbackUid) => {
      const activeUid = firebaseUser?.uid || fallbackUid;
      if (activeUid) {
        setFirebaseUid(activeUid);
        setIsAuthenticated(true);
        // Load user profile & savings from Firestore
        const profile = await getUserProfile(activeUid);
        if (profile && isMounted) {
          setUser((prev) => ({
            ...prev,
            id: activeUid,
            name: profile.name || prev.name,
            region: profile.location || prev.region,
            facility: profile.facility || prev.facility,
            pregnancyMonth: profile.dueWeeks ? Math.floor(profile.dueWeeks / 4.3) : prev.pregnancyMonth,
          }));
        }
        // Load verified savings profile
        const savings = await getSavingsProfile(activeUid);
        if (savings && isMounted) {
          setUser((prev) => ({
            ...prev,
            currentSavings: savings.currentBalance,
            targetPreparationAmount: savings.goalAmount,
          }));
        }
        // Load user transactions
        const userTxs = await getUserTransactions(activeUid);
        if (userTxs.length > 0 && isMounted) {
          setTransactions(userTxs);
        }
      } else {
        if (isMounted) {
          setFirebaseUid(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleAuthSuccess = async (uid: string, phone?: string) => {
    setFirebaseUid(uid);
    setIsAuthenticated(true);

    const formattedPhone = phone ? formatGhanaPhoneNumber(phone) : '+233245550192';

    // 1. Persist or fetch user profile in Firestore
    let existingProfile = await getUserProfile(uid);
    if (!existingProfile) {
      await saveUserProfile({
        uid,
        name: user.name || 'Akosua',
        phoneNumber: formattedPhone,
        location: user.region || 'Kumasi, Ashanti Region',
        motherStatus: 'Expecting Mother',
        facility: user.facility || 'Suntreso Government Hospital',
        dueWeeks: 22,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. Initialize or fetch savings profile in Firestore
    let savings = await getSavingsProfile(uid);
    if (!savings) {
      savings = await initSavingsProfile(uid, user.currentSavings || 120, user.targetPreparationAmount || 600);
    }

    if (savings) {
      setUser((prev) => ({
        ...prev,
        id: uid,
        currentSavings: savings.currentBalance,
        targetPreparationAmount: savings.goalAmount,
      }));
    } else {
      setUser((prev) => ({ ...prev, id: uid }));
    }
  };

  const signOut = async () => {
    await signOutCurrentUser();
    setFirebaseUid(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (firebaseUid) {
        updateUserProfileDoc(firebaseUid, {
          name: updated.name,
          location: updated.region,
          facility: updated.facility,
          dueWeeks: updated.pregnancyMonth * 4,
        }).catch((e) => console.warn('Firestore user update note:', e));
      }
      return updated;
    });
  };

  // Secure Financial Logic: Server-authoritative demo commission
  const simulateReferralPurchase = async (
    product: PartnerProduct,
    customerName = 'Customer in Kumasi Adum',
    partnerName?: string
  ) => {
    if (!product) return;

    const partnerObj = partners.find((p) => p.id === product.partnerId);
    const resolvedPartnerName = partnerName || partnerObj?.name || 'Demo Partner';
    const activeUserId = user.id || firebaseUid || 'user_akosua_01';

    // Unique conversion event key for idempotency
    const idempotencyKey = `ref_conv_${activeUserId}_${product.id}_${Date.now()}`;

    // Call trusted server-side commission endpoint
    const backendResult = await claimDemoCommissionViaBackend({
      userId: activeUserId,
      partnerId: product.partnerId,
      productId: product.id,
      customerName,
      partnerName: resolvedPartnerName,
      idempotencyKey,
    });

    const earning = backendResult.commission || product.demoCommission || 5;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (backendResult.alreadyProcessed) {
      // Prevent duplicate crediting
      alert('This demo purchase has already been credited to your Motherhood Fund.');
      return;
    }

    // Update verified balance from server
    const verifiedBalance = backendResult.newBalance !== undefined
      ? backendResult.newBalance
      : user.currentSavings + earning;

    const newTx: SavingsTransaction = {
      id: backendResult.transactionId || `tx_${Date.now()}`,
      userId: activeUserId,
      type: 'PARTNER_COMMISSION',
      amount: earning,
      source: resolvedPartnerName,
      description: `Commission from ${product.name} (Ref: ${user.referralCode})`,
      status: 'CONFIRMED',
      createdAt: `Today, ${timeString}`,
    };

    const newRef: Referral = {
      id: `ref_${Date.now()}`,
      userId: activeUserId,
      partnerId: product.partnerId,
      productId: product.id,
      productName: product.name,
      referralCode: user.referralCode,
      status: 'PURCHASED',
      commission: earning,
      customerName,
      createdAt: `Today, ${timeString}`,
    };

    const newCommission: DemoCommission = {
      id: `comm_${Date.now()}`,
      userId: activeUserId,
      partnerId: product.partnerId,
      productId: product.id,
      amount: earning,
      status: 'DEMO',
      createdAt: now.toISOString(),
    };

    setUser((prev) => ({
      ...prev,
      currentSavings: verifiedBalance,
    }));

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

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E61964', '#2E7D46', '#F8B4C8', '#FFF'],
      });
    } catch (e) {
      // safe fallback
    }

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

  const requestFundWithdrawal = async (
    amount: number,
    method: 'MOBILE_MONEY' | 'BANK',
    momoPhone?: string,
    network?: 'MTN' | 'Telecel' | 'AT'
  ) => {
    return await requestWithdrawal({
      userId: user.id || firebaseUid || 'user_akosua_01',
      amount,
      method,
      phoneNumber: momoPhone || phoneNumber,
      momoNetwork: network || 'MTN',
    });
  };

  const bookConsultation = async (params: {
    consultantId: string;
    consultantName?: string;
    reason: string;
    date: string;
    time: string;
    fee: number;
  }) => {
    return await requestConsultationBooking({
      userId: user.id || firebaseUid || 'user_akosua_01',
      consultantId: params.consultantId,
      consultantName: params.consultantName,
      reason: params.reason,
      requestedDate: params.date,
      requestedTime: params.time,
      fee: params.fee,
    });
  };

  const submitPost = async (content: string) => {
    const activeGroupId = user.supportCircleId || 'circle_march_2027';
    const res = await createCommunityPost({
      groupId: activeGroupId,
      userId: user.id || firebaseUid || 'user_akosua_01',
      userName: user.name,
      content,
    });
    if (res.success && res.post) {
      addSupportCircleMessage(content);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const reportContent = async (targetType: 'post' | 'comment' | 'user', targetId: string, reason: string) => {
    return await reportCommunityContent({
      reporterId: user.id || firebaseUid || 'user_akosua_01',
      targetType,
      targetId,
      reason,
    });
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
        firebaseUid,
        isAuthenticated,
        handleAuthSuccess,
        signOut,
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
        careSubTab,
        setCareSubTab,
        openHospitalLocator,
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
        requestFundWithdrawal,
        bookConsultation,
        submitPost,
        reportContent,
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
