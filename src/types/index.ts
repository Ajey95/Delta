// types/index.ts

export interface UserData {
    id?: string;
    name: string;
    avatar?: string;
    initials: string;
    title: string;
    badges?: string[];
    expertise?: string[];
    firstName?: string;
  }
  
  export interface Notification {
    id: string | number;
    title: string;
    message?: string;
    time: string;
    read: boolean;
  }
  
  export interface Achievement {
    id: string | number;
    title: string;
    progress: number;
  }
  
  export interface Insight {
    id: string | number;
    title: string;
    type: string;
  }
  
  export interface Course {
    id?: string | number;
    name: string;
    description: string;
    link: string;
  }
  
  export interface Resource {
    id: string | number;
    title: string;
    description: string;
    category: string;
    tags?: string;
    rating?: number;
    duration?: string;
    members?: number;
  }
  
  export interface Stats {
    [key: string]: string | number;
  }
  
  export interface FundingResource {
    uploaded_at: string;
    amount: number;
  }
  
  export interface SuccessStory {
    title: string;
    description: string;
    amount: number;
  }
  
  export interface ChartData {
    month: string;
    totalAmount: number;
    count: number;
  }
  
  export interface FilterState {
    type: string;
    duration: string;
    rating: string;
  }