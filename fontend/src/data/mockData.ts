// Mock Data for Books
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  categories: string[];
  available: boolean;
  publishedYear: number;
}

export const books: Book[] = [
  {
    id: "book-1",
    title: "The Art of Learning",
    author: "Michael Johnson",
    coverImage: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "A comprehensive guide to effective learning strategies for students of all ages.",
    categories: ["Education", "Self-Help"],
    available: true,
    publishedYear: 2019
  },
  {
    id: "book-2",
    title: "Scientific Method: A History",
    author: "Emily Richardson",
    coverImage: "https://images.pexels.com/photos/2098671/pexels-photo-2098671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Explore the evolution of scientific thinking throughout human history.",
    categories: ["Science", "History"],
    available: true,
    publishedYear: 2017
  },
  {
    id: "book-3",
    title: "Mathematical Principles",
    author: "David Wong",
    coverImage: "https://images.pexels.com/photos/6195666/pexels-photo-6195666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "A fundamental textbook covering advanced mathematical concepts for university students.",
    categories: ["Mathematics", "Textbook"],
    available: false,
    publishedYear: 2020
  },
  {
    id: "book-4",
    title: "World Literature: A Global Perspective",
    author: "Sophia Martinez",
    coverImage: "https://images.pexels.com/photos/3847505/pexels-photo-3847505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "An anthology of literary works from diverse cultures and historical periods.",
    categories: ["Literature", "Cultural Studies"],
    available: true,
    publishedYear: 2018
  },
  {
    id: "book-5",
    title: "Introduction to Political Science",
    author: "Robert Chen",
    coverImage: "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "A comprehensive introduction to the fundamental concepts of political science.",
    categories: ["Politics", "Social Sciences"],
    available: true,
    publishedYear: 2021
  },
  {
    id: "book-6",
    title: "Principles of Economics",
    author: "Laura Thompson",
    coverImage: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "An essential guide to understanding modern economic theories and their applications.",
    categories: ["Economics", "Business"],
    available: true,
    publishedYear: 2019
  },
  {
    id: "book-7",
    title: "Atlas of Human Anatomy",
    author: "Dr. James Wilson",
    coverImage: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "A detailed visual guide to human anatomical structures with explanatory text.",
    categories: ["Medicine", "Biology"],
    available: false,
    publishedYear: 2020
  },
  {
    id: "book-8",
    title: "Digital Age: Technology and Society",
    author: "Alexandra Kumar",
    coverImage: "https://images.pexels.com/photos/3345882/pexels-photo-3345882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "An analysis of how digital technologies are reshaping human societies and institutions.",
    categories: ["Technology", "Sociology"],
    available: true,
    publishedYear: 2022
  }
];

// Mock Courses
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  popular: boolean;
  rating?: number; // Optional rating (0-5)
}

export const courses: Course[] = [
  {
    id: "course-specialized-inspector",
    title: "Inspecteur Technique Spécialisé",
    description: "Formation d'excellence visant à préparer des experts techniques qualifiés dans le domaine des télécommunications.",
    image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Équipe Pédagogique Spécialisée",
    duration: "12 Months",
    category: "transmissionss",
    level: "Advanced",
    popular: true
  },
  {
    id: "course-specialized-assistant",
    title: "Assistant Technique Spécialisé",
    description: "Formation technique visant à préparer des assistants qualifiés dans le domaine du support technique des télécommunications.",
    image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Équipe Pédagogique Technique",
    duration: "12 Months",
    category: "transmissionss",
    level: "Intermediate",
    popular: true
  },
  {
    id: "course-1",
    title: "International Baccalaureate Program",
    description: "A rigorous pre-university course of study that meets the needs of highly motivated students.",
    image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Multiple Faculty",
    duration: "2 Years",
    category: "Diploma",
    level: "Advanced",
    popular: true
  },
  {
    id: "course-2",
    title: "Bilingual Literature Studies",
    description: "Explore literary masterpieces in both English and French, developing critical analysis skills.",
    image: "https://images.pexels.com/photos/2781195/pexels-photo-2781195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Dr. Marie Laurent",
    duration: "1 Year",
    category: "Languages",
    level: "Intermediate",
    popular: true
  },
  {
    id: "course-3",
    title: "Advanced STEM Research",
    description: "Hands-on scientific research program focusing on real-world problem-solving.",
    image: "https://images.pexels.com/photos/8423100/pexels-photo-8423100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Prof. Alan Chen",
    duration: "1 Year",
    category: "Science",
    level: "Advanced",
    popular: true
  },
  {
    id: "course-4",
    title: "Global Citizenship & Ethics",
    description: "Develop understanding of global issues and the ethical responsibilities of global citizens.",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Dr. Sarah Williams",
    duration: "1 Semester",
    category: "Humanities",
    level: "Intermediate",
    popular: false
  },
  {
    id: "course-5",
    title: "Digital Media & Communication",
    description: "Learn to create and analyze digital media content for various platforms and audiences.",
    image: "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Prof. Miguel Santos",
    duration: "1 Year",
    category: "Media Studies",
    level: "Beginner",
    popular: true
  },
  {
    id: "course-6",
    title: "Economic Theory & Practice",
    description: "Explore economic principles and their applications to contemporary global issues.",
    image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    instructor: "Dr. James Wilson",
    duration: "1 Year",
    category: "Economics",
    level: "Intermediate",
    popular: false
  }
];

// Mock Users
export interface MockUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  orders: {
    id: string;
    bookId: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
  }[];
}

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    orders: [
      {
        id: "order-1",
        bookId: "book-1",
        status: "approved",
        date: "2025-02-15T09:24:00Z"
      },
      {
        id: "order-2",
        bookId: "book-4",
        status: "pending",
        date: "2025-03-10T14:32:00Z"
      }
    ]
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    orders: []
  }
];

// Mock Sponsors
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
}

export const sponsors: Sponsor[] = [
  {
    id: "sponsor-1",
    name: "TechInnovate",
    logo: "https://images.pexels.com/photos/20130638/pexels-photo-20130638/free-photo-of-letter-t-design.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "sponsor-2",
    name: "Global Education Fund",
    logo: "https://images.pexels.com/photos/6728/earth-view-hand-leaf.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "sponsor-3",
    name: "Future Leaders Foundation",
    logo: "https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "sponsor-4",
    name: "Academic Excellence",
    logo: "https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "sponsor-5",
    name: "National Research Institute",
    logo: "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

// History Timeline
export interface HistoryItem {
  id: string;
  year: number;
  title: string;
  description: string;
  image?: string;
}

export const historyTimeline: HistoryItem[] = [
  {
    id: "history-1",
    year: 1985,
    title: "Foundation",
    description: "École Internationale was founded by Dr. Marcel Dupont with a vision to create a truly bilingual educational institution.",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "history-2",
    year: 1992,
    title: "Campus Expansion",
    description: "The school expanded to a new, larger campus to accommodate growing enrollment and additional programs.",
    image: "https://images.pexels.com/photos/2763943/pexels-photo-2763943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "history-3",
    year: 2001,
    title: "International Accreditation",
    description: "École Internationale received prestigious international accreditation, recognizing its commitment to excellence.",
    image: "https://images.pexels.com/photos/4560083/pexels-photo-4560083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "history-4",
    year: 2010,
    title: "Introduction of IB Program",
    description: "The International Baccalaureate program was introduced, offering students a globally recognized diploma.",
    image: "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "history-5",
    year: 2020,
    title: "Digital Transformation",
    description: "The school implemented a comprehensive digital strategy, integrating technology across all aspects of education.",
    image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];