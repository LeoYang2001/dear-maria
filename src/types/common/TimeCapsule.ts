export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdDate: string;
  emailAddress?: string;
  createdBy: "Maria" | "Leo";
  picture?: string;
}
