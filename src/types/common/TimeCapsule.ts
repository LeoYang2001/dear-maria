export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdDate: string;
  isRead?: boolean;
  createdBy: "Maria" | "Leo";
  picture?: string;
}
