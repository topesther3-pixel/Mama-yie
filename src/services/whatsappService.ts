import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import QRCode from 'qrcode';

export interface WhatsAppChannelInfo {
  channelUrl: string;
  channelName: string;
  description: string;
  enabled: boolean;
  updatedAt?: string;
}

/**
 * Fetch official WhatsApp Channel configuration from Firestore or fallback config
 */
export async function getWhatsAppChannelConfig(): Promise<WhatsAppChannelInfo> {
  try {
    const configDocRef = doc(db, 'appConfig', 'social');
    const docSnap = await getDoc(configDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.whatsapp) {
        return {
          channelUrl: data.whatsapp.channelUrl || WHATSAPP_CONFIG.channelUrl,
          channelName: data.whatsapp.channelName || WHATSAPP_CONFIG.channelName,
          description: data.whatsapp.description || WHATSAPP_CONFIG.description,
          enabled: data.whatsapp.enabled !== false,
          updatedAt: data.whatsapp.updatedAt,
        };
      }
    }

    // Auto-seed public social config with official placeholder
    await setDoc(
      configDocRef,
      {
        whatsapp: {
          channelUrl: WHATSAPP_CONFIG.channelUrl,
          channelName: WHATSAPP_CONFIG.channelName,
          description: WHATSAPP_CONFIG.description,
          enabled: true,
          updatedAt: new Date().toISOString(),
        },
      },
      { merge: true }
    ).catch((e) => console.log('Auto-seed social config note:', e?.message));

    return {
      channelUrl: WHATSAPP_CONFIG.channelUrl,
      channelName: WHATSAPP_CONFIG.channelName,
      description: WHATSAPP_CONFIG.description,
      enabled: true,
    };
  } catch (err) {
    console.warn('Failed to fetch WhatsApp config from Firestore, using local config:', err);
    return {
      channelUrl: WHATSAPP_CONFIG.channelUrl,
      channelName: WHATSAPP_CONFIG.channelName,
      description: WHATSAPP_CONFIG.description,
      enabled: true,
    };
  }
}

/**
 * Generate a high-resolution QR code data URL for the WhatsApp channel link
 */
export async function generateChannelQrCode(channelUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(channelUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1E232B', // Mama Yie brand charcoal
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generating WhatsApp QR code:', err);
    return '';
  }
}
