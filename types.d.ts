interface Books {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  videoUrl: string;
  summary: string;
  isLoanedBook?: boolean;
  coverColor: string;
  coverUrl: string;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}
