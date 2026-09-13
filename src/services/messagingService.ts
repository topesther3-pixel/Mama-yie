import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseConversation, FirebaseDirectMessage } from '../types';

export async function getUserConversations(userId: string): Promise<FirebaseConversation[]> {
  try {
    const colRef = collection(db, 'conversations');
    const q = query(colRef, where('participantIds', 'array-contains', userId));
    const snap = await getDocs(q);
    const conversations: FirebaseConversation[] = [];
    snap.forEach((d) => {
      conversations.push({ id: d.id, ...d.data() } as FirebaseConversation);
    });
    return conversations;
  } catch (err) {
    console.warn('Error fetching conversations:', err);
    return [];
  }
}

export async function getConversationMessages(conversationId: string): Promise<FirebaseDirectMessage[]> {
  try {
    const msgRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(msgRef, orderBy('createdAt', 'asc'), limit(50));
    const snap = await getDocs(q);
    const messages: FirebaseDirectMessage[] = [];
    snap.forEach((d) => {
      messages.push({ id: d.id, ...d.data() } as FirebaseDirectMessage);
    });
    return messages;
  } catch (err) {
    console.warn('Error fetching conversation messages:', err);
    return [];
  }
}

export async function sendDirectMessage(params: {
  conversationId: string;
  senderId: string;
  text: string;
}): Promise<{ success: boolean; message?: FirebaseDirectMessage; error?: string }> {
  try {
    const messageId = `msg_${Date.now()}`;
    const msgRef = doc(db, 'conversations', params.conversationId, 'messages', messageId);
    const now = new Date().toISOString();
    const msgData: FirebaseDirectMessage = {
      id: messageId,
      senderId: params.senderId,
      text: params.text,
      read: false,
      createdAt: now,
    };
    await setDoc(msgRef, msgData);

    // Update conversation updatedAt and lastMessage
    const convRef = doc(db, 'conversations', params.conversationId);
    await setDoc(convRef, {
      lastMessage: params.text,
      updatedAt: now,
    }, { merge: true });

    return { success: true, message: msgData };
  } catch (err: any) {
    console.warn('Error sending direct message:', err);
    return { success: false, error: err?.message || 'Failed to send message' };
  }
}
