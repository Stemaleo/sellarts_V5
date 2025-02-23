import { Ticket } from "./type.d";
import { CardDescription } from "@/components/ui/card";
import { PageableResponse } from "./api";

export interface ApiResponse<T> {
  sort(arg0: (a: any, b: any) => number): unknown;
  message: string;
  errors: Error[];
  success: boolean;
  data: T;
}

export interface Error {
  field: string;
  errorMessage: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  authorities: Authority[];
  username: string;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  enabled: boolean;
  profileImageUrl: string;
  artistProfile?: ArtistProfile;
  verified: boolean;
}

export interface UserInfoDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  type: string;
  profileUrl: string;
  registeredAt: Date;
}

export interface Authority {
  authority: "ROLE_ADMIN";
}

export interface ArtistProfile {
  id: number;
  bio: string;
  location: string;
  portfolioUrl: string;
  coverUrl: string;
  noOfArtWorks: number;
  noOfOrders: number;
  userInfo?: UserInfoDTO;
  artistType: "GALLERY" | "ARTIST";
}

export interface FeaturedArtist {
  artist: ArtistProfile;
  artwork: ArtWorkDTO;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  user: User;
}

export interface ArtWork {
  id: string;
  title: string;
  description: string;
  paintingTypeId: string;
  materialTypeId: string;
  // methodId: string;
  // styleId: string;
  width: string;
  height: string;
  price: number;
  size: number;
  artistId?: string | null;
}

export interface ArtWorkWithRelatedToArtWorkDTO {
  id: string;
  title: string;
  description: string;
  paintingType: PaintingType;
  materialType: MaterialType;
  width: number;
  height: number;
  size: number;
  price: number;
  ownerName: string;
  mediaUrls: string[];
  stock: number;
  inStock: boolean;
  createdAt: Date;
  fav: boolean;
  artistProfile: ArtistProfile;
  credits: ArtistProfile;
  artistName: string;
  featured: boolean;
}


export interface ArtWorkDTO {
  id: string;
  title: string;
  description: string;
  paintingType: PaintingType;
  materialType: MaterialType;
  // metodeType: MethodType;
  // styleType: StyleType;
  width: number;
  height: number;
  size: number;
  price: number;
  ownerName: string;
  mediaUrls: string[];
  stock: number;
  inStock: boolean;
  createdAt: Date;
  fav: boolean;
  artistProfile: ArtistProfile;
  credits: ArtistProfile;
  artistName: string;
  featured: boolean;
}

export interface ArtWorkWithRelated {
  artwork: ArtWorkDTO;
  relatedArtworks: ArtWorkDTO[];
}

export interface PaintingType {
  id: number;
  name: string;
}

export interface MethodType {
  id: number;
  name: string;
}

export interface StyleType {
  id: number;
  name: string;
}

export interface BlogType {
  id?: string;
  title?: string;
  publish?: boolean;
  author?: string;
  content: string;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TicketType {
  id?: string;
  title?: string;
  description?: string;
  User?: User;
  status?: TicketStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TicketStatus {
  OPEN,
  CLOSED,
}

export interface MaterialType {
  id: number;
  name: string;
}

export interface CartItem {
  id: string;
  artwork: ArtWorkDTO;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  orderItems: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  status: "WAITING_PAYMENT" | "PENDING" | "ACCEPTED" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELED";
  billing: boolean;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  artistShare: number;
  adminShare: number;
  owner?: User;
  payments: Payment[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  artistShare: number;
  adminShare: number;
  order: Order;
  artWork: ArtWorkDTO;
}

export interface OrderOverview {
  count: number;
  total: number; //artist total
  adminShare: number;
  totalAmount: number;
  ordersPage: PageableResponse<OrderItem>;
}

export interface Address {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Payment {
  id: number;
  paymentId: string;
  orderStatus: string;
  orderId: number;
  createdAt: Date;
  ownerId: number;
  amount: number;
  ownerName: string;
}

export interface ArtistProfileDetails {
  user: User;
  artWorks: ArtWorkDTO[];
  noOfArtWorks: number;
  noOfOrders: number;
  subscribed: boolean;
  subscribeCount: number;
}
export interface ArtistProfileOverview {
  noOfArtWorks: number;
  noOfOrders: number;
  totalRevenue: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: "CREDIT" | "DEBIT";
  createdAt: Date;
  description: string;
  initiatorType: string;
}

export interface TransactionOverview {
  totalAmount: number;
  balanceAmount: number;
  transactions: PageableResponse<Transaction>;
}

export interface ColabRequest {
  id: number;
  requester: User;
  artist: User;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

export interface FavStats {
  artwork: ArtWorkDTO;
  count: number;
}

export interface Bid {
  id: number;
  artwork: ArtWorkDTO;
  user: User;
  amount: number;
  status: "APPROVED" | "REJECTED" | "CREATED";
}

export interface Promo {
  id: number;
  code: string;
  amount: number;
  count: number;
  createdAt: Date;
  active: boolean;
  percentage: boolean;
}

export interface Notification {
  id: number;
  message: string;
  description: string;
  readStatus: boolean;
  timestamp: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  maxRegistration: number;
  endDate: Date;
  mediaUrls: string[];
  noOfRegistrations: number;
  amIRegistered: boolean;
  participants: UserInfoDTO[];
}

export interface Post {
  id: number;
  content: string;
  createdAt: Date;
  mediaUrl: string;
  owner: User;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user: User;
}

export interface StoreCatalog {
  name: string;
  description: string;
  artWorkIds: string[];
}

export interface Catalog {
  id: string;
  name: string;
  description: string;
  artWorks: ArtWorkDTO[];
  owner: ArtistProfile;
}

export interface AdminAnalyticsDTO {
  userTotal: number;
  userThisMonth: number;

  artistTotal: number;
  artistLastMonth: number;

  totalOrders: number;

  totalRevenue: string;
  thisMonthRevenueGrowth: number;
  totalOrdersThisMonth: number;
  averageOrderValueThisMonth: number;
  averageOrderValue: number;

  totalArtworksThisMonth: number;
  totalArtworks: number;
  topSellingArtworks: TopSelling[];
}

export interface TopSelling {
  artwork: ArtWorkDTO;
  count: number;
}


