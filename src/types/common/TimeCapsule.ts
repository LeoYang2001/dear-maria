export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdDate: string;
  emailNotification: boolean;
  createdBy: "Maria" | "Leo";
  picture?: string;
}
