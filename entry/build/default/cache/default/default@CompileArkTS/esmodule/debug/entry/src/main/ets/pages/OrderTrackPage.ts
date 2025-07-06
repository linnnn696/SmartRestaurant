if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderTrackPage_Params {
    isLoading?: boolean;
    isSubmitting?: boolean;
    tasteRating?: number;
    serviceRating?: number;
    environmentRating?: number;
    comment?: string;
    hasReview?: boolean;
    errorMessage?: string;
    order?: Order | null;
    review?: Review | null;
    orderId?: string;
    isPageMounted?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { OrderService, OrderStatus } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import type { Order, OrderItem } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import { ReviewService } from "@normalized:N&&&entry/src/main/ets/service/ReviewService&";
import type { CreateReviewRequest, Review } from "@normalized:N&&&entry/src/main/ets/service/ReviewService&";
interface RouteParams {
    orderId: string;
}
class OrderTrackPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isSubmitting = new ObservedPropertySimplePU(false, this, "isSubmitting");
        this.__tasteRating = new ObservedPropertySimplePU(0, this, "tasteRating");
        this.__serviceRating = new ObservedPropertySimplePU(0, this, "serviceRating");
        this.__environmentRating = new ObservedPropertySimplePU(0, this, "environmentRating");
        this.__comment = new ObservedPropertySimplePU('', this, "comment");
        this.__hasReview = new ObservedPropertySimplePU(false, this, "hasReview");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__order = new ObservedPropertyObjectPU(null, this, "order");
        this.__review = new ObservedPropertyObjectPU(null, this, "review");
        this.orderId = '';
        this.isPageMounted = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderTrackPage_Params) {
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isSubmitting !== undefined) {
            this.isSubmitting = params.isSubmitting;
        }
        if (params.tasteRating !== undefined) {
            this.tasteRating = params.tasteRating;
        }
        if (params.serviceRating !== undefined) {
            this.serviceRating = params.serviceRating;
        }
        if (params.environmentRating !== undefined) {
            this.environmentRating = params.environmentRating;
        }
        if (params.comment !== undefined) {
            this.comment = params.comment;
        }
        if (params.hasReview !== undefined) {
            this.hasReview = params.hasReview;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.order !== undefined) {
            this.order = params.order;
        }
        if (params.review !== undefined) {
            this.review = params.review;
        }
        if (params.orderId !== undefined) {
            this.orderId = params.orderId;
        }
        if (params.isPageMounted !== undefined) {
            this.isPageMounted = params.isPageMounted;
        }
    }
    updateStateVars(params: OrderTrackPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isSubmitting.purgeDependencyOnElmtId(rmElmtId);
        this.__tasteRating.purgeDependencyOnElmtId(rmElmtId);
        this.__serviceRating.purgeDependencyOnElmtId(rmElmtId);
        this.__environmentRating.purgeDependencyOnElmtId(rmElmtId);
        this.__comment.purgeDependencyOnElmtId(rmElmtId);
        this.__hasReview.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__order.purgeDependencyOnElmtId(rmElmtId);
        this.__review.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__isSubmitting.aboutToBeDeleted();
        this.__tasteRating.aboutToBeDeleted();
        this.__serviceRating.aboutToBeDeleted();
        this.__environmentRating.aboutToBeDeleted();
        this.__comment.aboutToBeDeleted();
        this.__hasReview.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__order.aboutToBeDeleted();
        this.__review.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isSubmitting: ObservedPropertySimplePU<boolean>;
    get isSubmitting() {
        return this.__isSubmitting.get();
    }
    set isSubmitting(newValue: boolean) {
        this.__isSubmitting.set(newValue);
    }
    private __tasteRating: ObservedPropertySimplePU<number>;
    get tasteRating() {
        return this.__tasteRating.get();
    }
    set tasteRating(newValue: number) {
        this.__tasteRating.set(newValue);
    }
    private __serviceRating: ObservedPropertySimplePU<number>;
    get serviceRating() {
        return this.__serviceRating.get();
    }
    set serviceRating(newValue: number) {
        this.__serviceRating.set(newValue);
    }
    private __environmentRating: ObservedPropertySimplePU<number>;
    get environmentRating() {
        return this.__environmentRating.get();
    }
    set environmentRating(newValue: number) {
        this.__environmentRating.set(newValue);
    }
    private __comment: ObservedPropertySimplePU<string>;
    get comment() {
        return this.__comment.get();
    }
    set comment(newValue: string) {
        this.__comment.set(newValue);
    }
    private __hasReview: ObservedPropertySimplePU<boolean>;
    get hasReview() {
        return this.__hasReview.get();
    }
    set hasReview(newValue: boolean) {
        this.__hasReview.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __order: ObservedPropertyObjectPU<Order | null>;
    get order() {
        return this.__order.get();
    }
    set order(newValue: Order | null) {
        this.__order.set(newValue);
    }
    private __review: ObservedPropertyObjectPU<Review | null>;
    get review() {
        return this.__review.get();
    }
    set review(newValue: Review | null) {
        this.__review.set(newValue);
    }
    private orderId: string;
    private isPageMounted: boolean;
    aboutToAppear() {
        this.isPageMounted = true;
        this.initializeData();
    }
    aboutToDisappear() {
        this.isPageMounted = false;
    }
    private async initializeData() {
        try {
            // 获取并验证路由参数
            const params = router.getParams() as Record<string, string>;
            console.info('[OrderTrackPage] 路由参数:', JSON.stringify(params));
            if (!params?.orderId) {
                this.handleError('订单参数错误');
                return;
            }
            this.orderId = params.orderId;
            await this.loadOrderData();
        }
        catch (error) {
            this.handleError('初始化失败');
        }
    }
    private async loadOrderData() {
        if (!this.isPageMounted)
            return;
        try {
            this.isLoading = true;
            this.errorMessage = '';
            // 获取订单详情
            const orderData = await OrderService.getOrderDetail(this.orderId);
            if (!this.isPageMounted)
                return;
            if (!orderData) {
                this.handleError('订单不存在');
                return;
            }
            // 检查订单状态
            if (orderData.status !== OrderStatus.COMPLETED) {
                this.handleError('只能查看已完成订单的详情');
                return;
            }
            this.order = orderData;
            // 获取评价信息
            const review = await ReviewService.getOrderReview(Number(this.orderId));
            if (!this.isPageMounted)
                return;
            if (review) {
                this.review = review;
                this.hasReview = true;
                this.tasteRating = review.taste_rating;
                this.serviceRating = review.service_rating;
                this.environmentRating = review.environment_rating;
                this.comment = review.comment;
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('[OrderTrackPage] 加载数据失败:', errorMessage);
            if (errorMessage.includes('HTTP')) {
                this.errorMessage = '网络请求失败，请重试';
            }
            else {
                this.handleError('加载数据失败');
            }
        }
        finally {
            if (this.isPageMounted) {
                this.isLoading = false;
            }
        }
    }
    private handleError(message: string) {
        if (!this.isPageMounted)
            return;
        this.errorMessage = message;
        promptAction.showToast({ message });
        router.back();
    }
    private async submitReview() {
        if (!this.isPageMounted || this.isSubmitting || !this.order)
            return;
        if (this.tasteRating === 0 || this.serviceRating === 0 || this.environmentRating === 0) {
            promptAction.showToast({ message: '请完成所有评分项' });
            return;
        }
        try {
            this.isSubmitting = true;
            const reviewData: CreateReviewRequest = {
                order_id: Number(this.order.id),
                taste_rating: this.tasteRating,
                service_rating: this.serviceRating,
                environment_rating: this.environmentRating,
                overall_rating: ReviewService.calculateOverallRating(this.tasteRating, this.serviceRating, this.environmentRating),
                comment: this.comment.trim()
            };
            const response = await ReviewService.createReview(reviewData);
            if (!this.isPageMounted)
                return;
            this.review = response;
            this.hasReview = true;
            promptAction.showToast({ message: '评价提交成功' });
        }
        catch (error) {
            if (!this.isPageMounted)
                return;
            console.error('[OrderTrackPage] 提交评价失败:', error);
            promptAction.showToast({ message: '提交评价失败，请重试' });
        }
        finally {
            if (this.isPageMounted) {
                this.isSubmitting = false;
            }
        }
    }
    private renderStars(rating: number, type: 'taste' | 'service' | 'environment', parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const star = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777267, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(24);
                    Image.height(24);
                    Image.fillColor(rating >= star ? '#FFD700' : '#CCCCCC');
                    Image.margin({ right: 8 });
                    Image.enabled(!this.hasReview);
                    Image.onClick(() => {
                        if (!this.hasReview) {
                            switch (type) {
                                case 'taste':
                                    this.tasteRating = star;
                                    break;
                                case 'service':
                                    this.serviceRating = star;
                                    break;
                                case 'environment':
                                    this.environmentRating = star;
                                    break;
                            }
                        }
                    });
                }, Image);
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3, 4, 5], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部栏
            Row.create();
            // 顶部栏
            Row.width('100%');
            // 顶部栏
            Row.height(56);
            // 顶部栏
            Row.padding({ left: 16, right: 16 });
            // 顶部栏
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor('transparent');
            Button.onClick(() => router.back());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('订单详情');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.color('#007DFF');
                        LoadingProgress.width(30);
                        LoadingProgress.height(30);
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777242, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                        Image.width(120);
                        Image.height(120);
                        Image.fillColor('#CCCCCC');
                        Image.margin({ bottom: 16 });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重试');
                        Button.onClick(() => this.loadOrderData());
                        Button.margin({ top: 16 });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else if (this.order) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单信息卡片
                        Column.create();
                        // 订单信息卡片
                        Column.padding(16);
                        // 订单信息卡片
                        Column.backgroundColor(Color.White);
                        // 订单信息卡片
                        Column.borderRadius(8);
                        // 订单信息卡片
                        Column.margin({ bottom: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`订单号：${this.order.id}`);
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.order.createTime);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单状态
                        Text.create(`订单状态：${this.order.status}`);
                        // 订单状态
                        Text.fontSize(16);
                        // 订单状态
                        Text.fontWeight(FontWeight.Medium);
                        // 订单状态
                        Text.margin({ bottom: 12 });
                    }, Text);
                    // 订单状态
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单商品列表
                        Column.create();
                        // 订单商品列表
                        Column.margin({ bottom: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.name);
                                Text.fontSize(14);
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`x${item.quantity}`);
                                Text.fontSize(14);
                                Text.margin({ right: 8 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`¥${(item.price * item.quantity).toFixed(2)}`);
                                Text.fontSize(14);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.order.items, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 订单商品列表
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 总价
                        Row.create();
                        // 总价
                        Row.width('100%');
                        // 总价
                        Row.justifyContent(FlexAlign.End);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('总计');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${this.order.totalAmount.toFixed(2)}`);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // 总价
                    Row.pop();
                    // 订单信息卡片
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 评价区域
                        Column.create();
                        // 评价区域
                        Column.padding(16);
                        // 评价区域
                        Column.backgroundColor(Color.White);
                        // 评价区域
                        Column.borderRadius(8);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.hasReview ? '我的评价' : '订单评价');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: 16 });
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 评分项
                        Column.create();
                        // 评分项
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('口味');
                        Text.fontSize(14);
                        Text.width(60);
                    }, Text);
                    Text.pop();
                    this.renderStars.bind(this)(this.tasteRating, 'taste');
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('服务');
                        Text.fontSize(14);
                        Text.width(60);
                    }, Text);
                    Text.pop();
                    this.renderStars.bind(this)(this.serviceRating, 'service');
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('环境');
                        Text.fontSize(14);
                        Text.width(60);
                    }, Text);
                    Text.pop();
                    this.renderStars.bind(this)(this.environmentRating, 'environment');
                    Row.pop();
                    // 评分项
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.hasReview) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 评价输入框
                                    TextArea.create({
                                        placeholder: '请输入您的评价建议（可选）',
                                        text: this.comment
                                    });
                                    // 评价输入框
                                    TextArea.height(100);
                                    // 评价输入框
                                    TextArea.backgroundColor('#F5F5F5');
                                    // 评价输入框
                                    TextArea.margin({ bottom: 20 });
                                    // 评价输入框
                                    TextArea.onChange((value: string) => {
                                        this.comment = value;
                                    });
                                }, TextArea);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 提交按钮
                                    Button.createWithLabel('提交评价');
                                    // 提交按钮
                                    Button.width('100%');
                                    // 提交按钮
                                    Button.height(44);
                                    // 提交按钮
                                    Button.backgroundColor('#007DFF');
                                    // 提交按钮
                                    Button.enabled(!this.isSubmitting);
                                    // 提交按钮
                                    Button.onClick(() => this.submitReview());
                                }, Button);
                                // 提交按钮
                                Button.pop();
                            });
                        }
                        else if (this.comment) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.comment);
                                    Text.fontSize(14);
                                    Text.fontColor('#666666');
                                    Text.margin({ top: 8 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 评价区域
                    Column.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "OrderTrackPage";
    }
}
registerNamedRoute(() => new OrderTrackPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/OrderTrackPage", pageFullPath: "entry/src/main/ets/pages/OrderTrackPage", integratedHsp: "false", moduleType: "followWithHap" });
