if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderListPage_Params {
    orders?: Order[];
    currentIndex?: number;
    isLoading?: boolean;
    newOrderId?: string;
    errorMessage?: string;
    loadOrdersTimer?: number | null;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { OrderService, OrderStatus } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import type { OrderItem, Order } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
interface RouterParams {
    newOrderId?: string;
}
export class OrderListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__orders = new ObservedPropertyObjectPU([], this, "orders");
        this.__currentIndex = new ObservedPropertySimplePU(1, this, "currentIndex");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__newOrderId = new ObservedPropertySimplePU('', this, "newOrderId");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.loadOrdersTimer = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderListPage_Params) {
        if (params.orders !== undefined) {
            this.orders = params.orders;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.newOrderId !== undefined) {
            this.newOrderId = params.newOrderId;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.loadOrdersTimer !== undefined) {
            this.loadOrdersTimer = params.loadOrdersTimer;
        }
    }
    updateStateVars(params: OrderListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__orders.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__newOrderId.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__orders.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__newOrderId.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __orders: ObservedPropertyObjectPU<Order[]>;
    get orders() {
        return this.__orders.get();
    }
    set orders(newValue: Order[]) {
        this.__orders.set(newValue);
    }
    private __currentIndex: ObservedPropertySimplePU<number>; // 当前选中的是订单页面
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __newOrderId: ObservedPropertySimplePU<string>;
    get newOrderId() {
        return this.__newOrderId.get();
    }
    set newOrderId(newValue: string) {
        this.__newOrderId.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private loadOrdersTimer: number | null;
    aboutToAppear() {
        // 首次加载订单
        this.loadOrders();
    }
    aboutToDisappear() {
        // 清理定时器
        if (this.loadOrdersTimer !== null) {
            clearTimeout(this.loadOrdersTimer);
            this.loadOrdersTimer = null;
        }
    }
    onPageShow() {
        // 页面显示时，如果不是首次加载，延迟刷新订单列表
        if (this.orders.length > 0) {
            this.loadOrdersTimer = setTimeout(() => {
                this.loadOrders();
            }, 500) as number;
        }
    }
    async loadOrders() {
        // 如果正在加载中，不重复加载
        if (this.isLoading) {
            return;
        }
        try {
            this.isLoading = true;
            this.errorMessage = '';
            // 从后端获取订单列表
            const orderList = await OrderService.getAllOrders();
            // 检查返回数据的有效性
            if (!Array.isArray(orderList)) {
                throw new Error('返回的订单数据格式无效');
            }
            this.orders = orderList;
            // 获取路由参数中的新订单ID
            const params: RouterParams = router.getParams() as RouterParams;
            if (params?.newOrderId) {
                this.newOrderId = params.newOrderId;
                // 3秒后清除高亮效果
                const timer: number = setTimeout(() => {
                    this.newOrderId = '';
                }, 3000) as number;
            }
        }
        catch (error) {
            console.error('加载订单失败:', error);
            this.errorMessage = error instanceof Error ? error.message : '加载订单失败';
            // 显示错误提示
            try {
                await promptAction.showToast({
                    message: this.errorMessage,
                    duration: 3000,
                    bottom: 50
                });
            }
            catch (toastError) {
                console.error('显示错误提示失败:', toastError);
            }
        }
        finally {
            this.isLoading = false;
        }
    }
    OrderStatusTag(status: OrderStatus, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(status === OrderStatus.PENDING ? '待处理' :
                status === OrderStatus.PREPARING ? '进行中' :
                    status === OrderStatus.COMPLETED ? '已完成' : '已取消');
            Text.fontSize(12);
            Text.fontColor(status === OrderStatus.PREPARING ? '#FF6B6B' :
                status === OrderStatus.COMPLETED ? '#67C23A' :
                    status === OrderStatus.CANCELLED ? '#909399' : '#E6A23C');
            Text.backgroundColor(status === OrderStatus.PREPARING ? '#FFF0F0' :
                status === OrderStatus.COMPLETED ? '#F0F9EB' :
                    status === OrderStatus.CANCELLED ? '#F4F4F5' : '#FDF6EC');
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
    }
    OrderItemRow(item: OrderItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.name);
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`x${item.quantity}`);
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(item.price * item.quantity).toFixed(2)}`);
            Text.fontSize(14);
            Text.fontColor('#FF6B6B');
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
    }
    getStatusText(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDING:
                return '待支付';
            case OrderStatus.PREPARING:
                return '制作中';
            case OrderStatus.COMPLETED:
                return '已完成';
            case OrderStatus.CANCELLED:
                return '已取消';
            default:
                return '未知状态';
        }
    }
    getStatusColor(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PREPARING:
                return '#FF6B6B';
            case OrderStatus.COMPLETED:
                return '#52C41A';
            case OrderStatus.CANCELLED:
                return '#999999';
            case OrderStatus.PENDING:
                return '#FF9500';
            default:
                return '#999999';
        }
    }
    OrderItem(order: Order, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(this.newOrderId === order.id ? '#FFF0F0' : Color.White);
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
            Column.onClick(() => {
                try {
                    router.pushUrl({
                        url: 'pages/OrderTrackPage',
                        params: { orderId: order.id }
                    }).catch((error: Error) => {
                        console.error('导航到订单跟踪页面失败:', error);
                        promptAction.showToast({
                            message: '页面跳转失败',
                            duration: 2000
                        });
                    });
                }
                catch (error) {
                    console.error('导航错误:', error);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`订单号：${order.id}`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText(order.status));
            Text.fontSize(14);
            Text.fontColor(this.getStatusColor(order.status));
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 订单商品列表
            Column.create();
            // 订单商品列表
            Column.width('100%');
            // 订单商品列表
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (Array.isArray(order.items) && order.items.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.OrderItemRow.bind(this)(item);
                        };
                        this.forEachUpdateFunction(elmtId, order.items, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无商品信息');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // 订单商品列表
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#EEEEEE');
            Divider.margin({ bottom: 12 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`下单时间：${order.createdAt || '未知'}`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`共${order.items?.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0) || 0}件商品`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`合计：¥${(order.totalAmount || 0).toFixed(2)}`);
            Text.fontSize(16);
            Text.fontColor('#FF6B6B');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
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
            Text.create('我的订单');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载中状态
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
                        LoadingProgress.width(32);
                        LoadingProgress.height(32);
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
            // 错误状态
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
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
                        Button.onClick(() => this.loadOrders());
                        Button.margin({ top: 16 });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            // 空状态
            else if (this.orders.length === 0) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                        Image.width(120);
                        Image.height(120);
                        Image.fillColor('#CCCCCC');
                        Image.margin({ bottom: 16 });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无订单');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            // 订单列表
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.width('100%');
                        List.layoutWeight(1);
                        List.padding({ left: 16, right: 16, top: 12 });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const order = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.OrderItem.bind(this)(order);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.orders, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
