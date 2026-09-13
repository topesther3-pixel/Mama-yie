/**
 * Official Mama Yie WhatsApp Channel & Integration Configuration
 *
 * The WhatsApp Channel is a one-way broadcast channel for maternal-health tips,
 * pregnancy preparation, Earn & Save updates, and community news.
 *
 * NOTE: The channel is NOT a private medical consultation service.
 * Mothers are never asked to post sensitive medical information publicly.
 */

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || {};

export const WHATSAPP_CONFIG = {
  // Official Channel Name & Tagline
  channelName: 'MAMA YIE 💗 | Care. Connect. Earn. Save.',
  channelHandle: '@MamaYieGhana',

  // Placeholder until official channel is created, configurable via environment or Firestore
  channelUrl: metaEnv.VITE_WHATSAPP_CHANNEL_URL || 'https://whatsapp.com/channel/placeholder',

  // Official Channel Description
  description:
    'Care, support and practical resources for mothers in Ghana. Get maternal-health education, Earn & Save opportunities, partner updates and community news from Mama Yie.',

  // Broadcast topics included on the channel
  channelTopics: [
    'Maternal-health education & trimester wellness tips',
    'Pregnancy delivery preparation checklists',
    'Earn & Save partner opportunities (Numa Organics, etc.)',
    'Vetted healthcare partner updates & discounts',
    'Kumasi & Ashanti community announcements',
    'Direct links back to your Mama Yie Motherhood Fund',
  ],

  // Safety & Privacy Safeguards
  safeguards: [
    'One-way broadcast channel — no personal numbers visible',
    'Never used as a private medical consultation service',
    'Never asks mothers to post sensitive medical information publicly',
    'Emergency symptoms are always directed to hospital labor wards',
  ],

  // Future Two-Way WhatsApp AI Companion
  twoWayService: {
    status: 'COMING_SOON',
    title: 'Need personal help?',
    subtitle: 'Two-way Mama Yie support on WhatsApp is coming soon.',
    badge: 'COMING SOON',
    plannedCapabilities: [
      'Ask Mama Yie (Ama AI) maternal planning questions',
      'Find nearby verified maternal hospitals & midwives',
      'Check Motherhood Fund balance and weekly savings goals',
      'Receive pregnancy milestone & clinic appointment reminders',
      'Find partner Earn & Save referral opportunities',
      'Quick USSD & SMS navigation support',
    ],
  },
};
