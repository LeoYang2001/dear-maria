export interface ChecklistItem {
  id: number;
  title: string;
  description?: string;
  completedBy: ("maria" | "leo")[];
  photos?: string[];
}

export const checklistMockData: ChecklistItem[] = [
  {
    id: 1,
    title: "Visit the place where we first met",
    completedBy: ["maria", "leo"],
    photos: [],
  },
  {
    id: 2,
    title: "Cook a meal together",
    completedBy: ["maria"],
    photos: [],
  },
  {
    id: 3,
    title: "Take a trip to the mountains",
    completedBy: [],
    photos: [],
  },
  {
    id: 4,
    title: "Learn something new together",
    completedBy: ["leo"],
    photos: [],
  },
  {
    id: 5,
    title: "Have a picnic under the stars",
    completedBy: [],
    photos: [],
  },
  {
    id: 6,
    title: "Watch our favorite movie together",
    completedBy: ["maria", "leo"],
    photos: [],
  },
];
