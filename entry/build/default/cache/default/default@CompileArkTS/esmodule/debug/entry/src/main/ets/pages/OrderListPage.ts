if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderListPage_Params {
    orders?: Order[];
    currentIndex?: number;
    orderModel?: OrderModel;
    newOrderId?: string;
}
import router from "@ohos:router";
import { OrderModel } from "@normalized:N&&&entry/src/main/ets/model/OrderModel&";
import type { Order, OrderItem, OrderStatus } from "@normalized:N&&&entry/src/main/ets/model/OrderModel&";
import { SAMPLE_DISHES } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import type { DishItem } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
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
        this.orderModel = OrderModel.getInstance();
        this.__newOrderId = new ObservedPropertySimplePU('', this, "newOrderId");
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
        if (params.orderModel !== undefined) {
            this.orderModel = params.orderModel;
        }
        if (params.newOrderId !== undefined) {
            this.newOrderId = params.newOrderId;
        }
    }
    updateStateVars(params: OrderListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__orders.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__newOrderId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__orders.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__newOrderId.aboutToBeDeleted();
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
    private orderModel: OrderModel;
    private __newOrderId: ObservedPropertySimplePU<string>;
    get newOrderId() {
        return this.__newOrderId.get();
    }
    set newOrderId(newValue: string) {
        this.__newOrderId.set(newValue);
    }
    aboutToAppear() {
        this.refreshOrders();
    }
    onPageShow() {
        // 每次页面显示时刷新订单列表
        this.refreshOrders();
    }
    refreshOrders() {
        // 获取所有订单
        this.orders = this.orderModel.getOrders();
        // 获取路由参数中的新订单ID
        const params = router.getParams() as RouterParams;
        if (params?.newOrderId) {
            this.newOrderId = params.newOrderId;
            // 3秒后清除高亮效果
            setTimeout(() => {
                this.newOrderId = '';
            }, 3000);
        }
    }
    getDish(dishId: number): DishItem | undefined {
        return SAMPLE_DISHES.find(dish => dish.id === dishId);
    }
    OrderStatusTag(status: OrderStatus, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(status === 'pending' ? '待处理' :
                status === 'processing' ? '进行中' :
                    status === 'completed' ? '已完成' : '已取消');
            Text.fontSize(12);
            Text.fontColor(status === 'processing' ? '#FF6B6B' :
                status === 'completed' ? '#67C23A' :
                    status === 'cancelled' ? '#909399' : '#E6A23C');
            Text.backgroundColor(status === 'processing' ? '#FFF0F0' :
                status === 'completed' ? '#F0F9EB' :
                    status === 'cancelled' ? '#F4F4F5' : '#FDF6EC');
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
            case 'pending':
                return '待支付';
            case 'processing':
                return '制作中';
            case 'completed':
                return '已完成';
            case 'cancelled':
                return '已取消';
            default:
                return '未知状态';
        }
    }
    getStatusColor(status: OrderStatus): string {
        switch (status) {
            case 'processing':
                return '#FF6B6B';
            case 'completed':
                return '#52C41A';
            case 'cancelled':
                return '#999999';
            case 'pending':
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
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.OrderItemRow.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, order.items, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
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
            Text.create(`下单时间：${order.createTime}`);
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
            Text.create(`共${order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`合计：¥${order.totalAmount.toFixed(2)}`);
            Text.fontSize(16);
            Text.fontColor('#FF6B6B');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    BottomTabs(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => {
                router.replaceUrl({ url: 'pages/HomePage' });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点餐');
            Text.fontSize(12);
            Text.margin({ top: 4 });
            Text.fontColor(this.currentIndex === 0 ? '#FF4081' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => {
                // 已经在订单页面，不需要操作
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.fontSize(12);
            Text.margin({ top: 4 });
            Text.fontColor(this.currentIndex === 1 ? '#FF4081' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => {
                router.replaceUrl({ url: 'pages/ProfilePage' });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人中心');
            Text.fontSize(12);
            Text.margin({ top: 4 });
            Text.fontColor(this.currentIndex === 2 ? '#FF4081' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
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
            Text.create('我的订单');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.orders.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
