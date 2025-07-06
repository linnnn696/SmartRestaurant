import { HttpService } from './HttpService';

export interface Review {
  review_id: number;
  order_id: number;
  taste_rating: number;
  service_rating: number;
  environment_rating: number;
  overall_rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  order_id: number;
  taste_rating: number;
  service_rating: number;
  environment_rating: number;
  overall_rating: number;
  comment: string;
}

export class ReviewService {
  /**
   * 创建评价
   */
  static async createReview(data: CreateReviewRequest): Promise<Review> {
    console.info('[ReviewService] 开始创建评价:', JSON.stringify(data));
    const response = await HttpService.post<Review>('/reviews', data);
    console.info('[ReviewService] 评价创建成功:', JSON.stringify(response));
    return response;
  }

  /**
   * 获取订单的评价
   */
  static async getOrderReview(orderId: number): Promise<Review | null> {
    try {
      console.info('[ReviewService] 获取订单评价:', orderId);
      const response = await HttpService.get<Review[]>(`/reviews?order_id=${orderId}`);
      console.info('[ReviewService] 获取评价结果:', JSON.stringify(response));
      return response && response.length > 0 ? response[0] : null;
    } catch (error) {
      console.error('[ReviewService] 获取评价失败:', error);
      return null;
    }
  }

  /**
   * 计算综合评分
   */
  static calculateOverallRating(taste: number, service: number, environment: number): number {
    return Math.round((taste + service + environment) / 3);
  }
} 