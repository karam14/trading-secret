// types.ts

export interface Chapter {
  userProgress: any;
  id: string;
  title: string;
  description: string;
  is_free: boolean;
  is_published: boolean;
  video_url: string | null;
  video_name: string | null;
  course_id: string;
  created_at: string;
  updated_at: string;
  cloudinary_data?: cloudinaryData | null;
}

export interface cloudinaryData {
  id: string;
  chapter_id: string;
  public_id: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  is_published: boolean;
  price: number;
  badge: string;
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
  categoryId: string;
}




export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}


export interface UserProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  course_id: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
// This type represents a course with progress and category data included.
export type CourseWithProgressWithCategory = Course & {
  category: Category | null;  // The category associated with the course
  chapters: { id: string }[];  // A list of chapter IDs associated with the course
  progress: number | null;  // The user's progress in the course
};

export interface SafeProfile {
  
  id: string;                  // The user's ID from the session
  email: string;               // The user's email from the session
  role: string | null;         // The role extracted from the JWT token
  name: string;                // The name from the profile or fallback to email
  image_url: string | null;    // The user's profile image URL or null if not set
  created_at: string | null;   // The timestamp when the profile was created, formatted as ISO string
  updated_at: string | null;   // The timestamp when the profile was last updated, formatted as ISO string
}


