if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderListPage_Params {
    orders?: Order[];
    currentIndex?: number;
    isLoading?: boolean;
    newOrderId?: number;
    errorMessage?: string;
    isRefreshing?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { OrderService } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import type { OrderItem, Order } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
interface RouterParams {
    newOrderId?: number;
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
        this.__newOrderId = new ObservedPropertySimplePU(0, this, "newOrderId");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
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
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
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
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__orders.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__newOrderId.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
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
    private __currentIndex: ObservedPropertySimplePU<number>;
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
    private __newOrderId: ObservedPropertySimplePU<number>;
    get newOrderId() {
        return this.__newOrderId.get();
    }
    set newOrderId(newValue: number) {
        this.__newOrderId.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __isRefreshing: ObservedPropertySimplePU<boolean>;
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue: boolean) {
        this.__isRefreshing.set(newValue);
    }
    aboutToAppear(): void {
        // 首次加载订单
        this.loadOrders();
    }
    onPageShow(): void {
        // 页面显示时立即刷新一次
        this.loadOrders();
    }
    async loadOrders(): Promise<void> {
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
                setTimeout(() => {
                    this.newOrderId = 0;
                }, 3000);
            }
        }
        catch {
            this.errorMessage = '加载订单失败';
            // 显示错误提示
            try {
                await promptAction.showToast({
                    message: this.errorMessage,
                    duration: 3000,
                    bottom: 50
                });
            }
            catch {
                console.error('显示错误提示失败');
            }
        }
        finally {
            this.isLoading = false;
            this.isRefreshing = false;
        }
    }
    getStatusColor(status: string): string {
        switch (status) {
            case '制作中':
                return '#FF6B6B';
            case '已完成':
                return '#67C23A';
            case '待取餐':
                return '#409EFF';
            case '已提交':
                return '#E6A23C';
            default:
                return '#909399';
        }
    }
    getStatusBackground(status: string): string {
        switch (status) {
            case '制作中':
                return '#FFF0F0';
            case '已完成':
                return '#F0F9EB';
            case '待取餐':
                return '#ECF5FF';
            case '已提交':
                return '#FDF6EC';
            default:
                return '#F4F4F5';
        }
    }
    OrderStatusTag(status: string, parent = null): void {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(status);
            Text.fontSize(12);
            Text.fontColor(this.getStatusColor(status));
            Text.backgroundColor(this.getStatusBackground(status));
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
    }
    OrderCard(order: Order, parent = null): void {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(this.newOrderId === order.order_id ? '#FFF9F2' : Color.White);
            Column.borderRadius(8);
            Column.margin({ bottom: 12 });
            Column.onClick(() => {
                router.pushUrl({
                    url: 'pages/OrderDetailPage',
                    params: {
                        orderId: order.order_id
                    }
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`订单号：${order.order_id}`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.OrderStatusTag.bind(this)(order.status);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
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
                                Text.create(`¥${item.subtotal.toFixed(2)}`);
                                Text.fontSize(14);
                                Text.fontColor('#FF6B6B');
                            }, Text);
                            Text.pop();
                            Row.pop();
                            Row.pop();
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
            Text.create(`下单时间：${order.created_at}`);
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
            Text.create(`合计：¥${order.total_amount.toFixed(2)}`);
            Text.fontSize(14);
            Text.fontColor('#FF6B6B');
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
            // 订单列表区域
            Refresh.create({ refreshing: { value: this.isRefreshing, changeEvent: newValue => { this.isRefreshing = newValue; } } });
            // 订单列表区域
            Refresh.onRefreshing(() => {
                this.isRefreshing = true;
                this.loadOrders();
            });
        }, Refresh);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.width('100%');
            List.height('100%');
            List.padding({ left: 16, right: 16 });
            List.layoutWeight(1);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading && !this.isRefreshing) {
                this.ifElseBranchUpdateFunction(0, () => {
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
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.height('100%');
                                Column.justifyContent(FlexAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                LoadingProgress.create();
                                LoadingProgress.color('#007DFF');
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
                            ListItem.pop();
                        };
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        ListItem.pop();
                    }
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
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
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.height('100%');
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
                                Text.fontSize(14);
                                Text.fontColor('#999999');
                            }, Text);
                            Text.pop();
                            Column.pop();
                            ListItem.pop();
                        };
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        ListItem.pop();
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
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
                                    this.OrderCard.bind(this)(order);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.orders, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        List.pop();
        // 订单列表区域
        Refresh.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
