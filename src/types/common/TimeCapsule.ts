export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdDate: string;
  isRead?: boolean;
  createdBy: "maria" | "leo";
  picture?: string;
}
