export type CreatorListItem = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  verified: boolean;
  location: string | null;
  galleryThumbnail: string | null;
};

export type CreatorProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  height: string | null;
  weight: string | null;
  verified: boolean;
  gallery: { id: string; url: string; type: string }[];
};
