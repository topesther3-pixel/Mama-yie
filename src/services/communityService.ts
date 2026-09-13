import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  FirebaseCommunityGroup,
  FirebaseCommunityPost,
  FirebaseCommunityComment,
  FirebaseCommunityReport,
} from '../types';

export const INITIAL_GROUPS: FirebaseCommunityGroup[] = [
  {
    id: 'circle_march_2027',
    name: 'Kumasi March 2027 Due Date Circle',
    description: 'Expecting mothers due March 2027 in Kumasi & Ashanti Region. Sharing tips, antenatal check-ins, and savings motivation.',
    memberCount: 28,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_first_time_moms',
    name: 'Ashanti First-Time Mothers Circle',
    description: 'Safe community for first-time expectant mothers discussing birth preparations, delivery checklists, and postpartum recovery.',
    memberCount: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_market_traders',
    name: 'Kejetia & Adum Market Traders Mothers',
    description: 'Balancing business and maternal health. Peer tips on avoiding market fatigue and saving daily via Motherhood Fund.',
    memberCount: 35,
    createdAt: new Date().toISOString(),
  },
];

export async function getCommunityGroups(): Promise<FirebaseCommunityGroup[]> {
  try {
    const colRef = collection(db, 'communityGroups');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const groups: FirebaseCommunityGroup[] = [];
      snap.forEach((d) => {
        groups.push({ id: d.id, ...d.data() } as FirebaseCommunityGroup);
      });
      return groups;
    }
  } catch (err) {
    console.warn('Error reading community groups from Firestore:', err);
  }
  return INITIAL_GROUPS;
}

export async function getGroupPosts(groupId: string): Promise<FirebaseCommunityPost[]> {
  try {
    const postsRef = collection(db, 'communityGroups', groupId, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(30));
    const snap = await getDocs(q);
    const posts: FirebaseCommunityPost[] = [];
    snap.forEach((d) => {
      posts.push({ id: d.id, ...d.data() } as FirebaseCommunityPost);
    });
    return posts;
  } catch (err) {
    console.warn(`Error fetching posts for group ${groupId}:`, err);
    return [];
  }
}

export async function createCommunityPost(params: {
  groupId: string;
  userId: string;
  userName: string;
  content: string;
}): Promise<{ success: boolean; post?: FirebaseCommunityPost; error?: string }> {
  try {
    const postId = `post_${Date.now()}`;
    const postRef = doc(db, 'communityGroups', params.groupId, 'posts', postId);
    const now = new Date().toISOString();
    const postData: FirebaseCommunityPost = {
      id: postId,
      userId: params.userId,
      userName: params.userName,
      content: params.content,
      likeCount: 0,
      commentCount: 0,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(postRef, postData);
    return { success: true, post: postData };
  } catch (err: any) {
    console.warn('Error creating community post:', err);
    return { success: false, error: err?.message || 'Failed to publish post' };
  }
}

export async function likeCommunityPost(groupId: string, postId: string): Promise<boolean> {
  try {
    const postRef = doc(db, 'communityGroups', groupId, 'posts', postId);
    await updateDoc(postRef, {
      likeCount: increment(1),
    });
    return true;
  } catch (err) {
    console.warn('Error liking post:', err);
    return false;
  }
}

export async function addCommunityComment(params: {
  groupId: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
}): Promise<{ success: boolean; comment?: FirebaseCommunityComment; error?: string }> {
  try {
    const commentId = `comment_${Date.now()}`;
    const commentRef = doc(db, 'communityGroups', params.groupId, 'posts', params.postId, 'comments', commentId);
    const commentData: FirebaseCommunityComment = {
      id: commentId,
      userId: params.userId,
      userName: params.userName,
      content: params.content,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    await setDoc(commentRef, commentData);

    // Increment post comment count
    const postRef = doc(db, 'communityGroups', params.groupId, 'posts', params.postId);
    await updateDoc(postRef, {
      commentCount: increment(1),
    }).catch(() => {});

    return { success: true, comment: commentData };
  } catch (err: any) {
    console.warn('Error adding comment:', err);
    return { success: false, error: err?.message || 'Failed to post comment' };
  }
}

export async function reportCommunityContent(params: {
  reporterId: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  reason: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const reportId = `rep_${Date.now()}`;
    const reportRef = doc(db, 'reports', reportId);
    const reportData: FirebaseCommunityReport = {
      id: reportId,
      reporterId: params.reporterId,
      targetType: params.targetType,
      targetId: params.targetId,
      reason: params.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    await setDoc(reportRef, reportData);
    return { success: true };
  } catch (err: any) {
    console.warn('Error submitting report to Firestore:', err);
    return { success: false, error: err?.message || 'Failed to submit report' };
  }
}
