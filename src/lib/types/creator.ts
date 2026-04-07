export type CreatorListItem = {
  id: string;
  username: string;
  displayName: string;
  age?: number | null;
  avatarUrl: string | null;
  verified: boolean;
  location: string | null;
  cardImage: string | null;
  galleryThumbnail: string | null;
};

export type CreatorPostItem = {
  id: string;
  caption: string | null;
  previewUrl: string;
  mediaUrl?: string | null;
  mediaType: string;
  isLocked: boolean;
  unlockPriceCents: number;
  likeCount: number;
  commentCount?: number;
  createdAt: string;
};

export type CreatorProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  height: string | null;
  weight: string | null;
  verified: boolean;
  followerCount: number;
  subscriberCount: number;
  earnedCents: number;
  rating: number;
  totalTipsCents: number;
  totalLikes: number;
  photoCount: number;
  videoCount: number;
  gallery: { id: string; url: string; type: string }[];
  posts: CreatorPostItem[];
};
