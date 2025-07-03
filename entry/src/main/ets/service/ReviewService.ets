import { HttpService } from './HttpService';

export interface Review {
  id: string;
  userId: string;
  orderId: string;
  rating: number;
  content: string;
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  orderId: string;
  rating: number;
  content: string;
}

export class ReviewService extends HttpService {
  /**
   * 获取所有评价
   */
  static async getAllReviews(): Promise<Review[]> {
    return this.get<Review[]>('/api/reviews');
  }

  /**
   * 创建评价
   */
  static async createReview(data: CreateReviewRequest): Promise<Review> {
    return this.post<Review>('/api/reviews', data);
  }

  /**
   * 获取评价详情
   */
  static async getReviewDetail(reviewId: string): Promise<Review> {
    return this.get<Review>(`/api/reviews/${reviewId}`);
  }

  /**
   * 商家回复评价
   */
  static async replyReview(reviewId: string, reply: string): Promise<Review> {
    return this.put<Review>(`/api/reviews/${reviewId}/reply`, { reply });
  }
} 