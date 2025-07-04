if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PaymentPage_Params {
    selectedPayment?: string;
    cartModel?: CartModel;
    orderModel?: OrderModel;
    totalAmount?: number;
}
import router from "@ohos:router";
import { CartModel, SAMPLE_DISHES } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import { OrderModel } from "@normalized:N&&&entry/src/main/ets/model/OrderModel&";
import { OrderService, OrderStatus } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import type { OrderItem } from "@normalized:N&&&entry/src/main/ets/service/OrderService&";
import promptAction from "@ohos:promptAction";
interface RouterParams {
    activeTab: number;
    newOrderId: string;
}
const PAYMENT_DELAY = 1500;
const TOAST_DURATION = 1000;
const NAVIGATION_DELAY = 1000;
class PaymentPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedPayment = new ObservedPropertySimplePU('', this, "selectedPayment");
        this.cartModel = CartModel.getInstance();
        this.orderModel = OrderModel.getInstance();
        this.__totalAmount = new ObservedPropertySimplePU(0, this, "totalAmount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PaymentPage_Params) {
        if (params.selectedPayment !== undefined) {
            this.selectedPayment = params.selectedPayment;
        }
        if (params.cartModel !== undefined) {
            this.cartModel = params.cartModel;
        }
        if (params.orderModel !== undefined) {
            this.orderModel = params.orderModel;
        }
        if (params.totalAmount !== undefined) {
            this.totalAmount = params.totalAmount;
        }
    }
    updateStateVars(params: PaymentPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedPayment.purgeDependencyOnElmtId(rmElmtId);
        this.__totalAmount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedPayment.aboutToBeDeleted();
        this.__totalAmount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedPayment: ObservedPropertySimplePU<string>;
    get selectedPayment() {
        return this.__selectedPayment.get();
    }
    set selectedPayment(newValue: string) {
        this.__selectedPayment.set(newValue);
    }
    private cartModel: CartModel;
    private orderModel: OrderModel;
    private __totalAmount: ObservedPropertySimplePU<number>;
    get totalAmount() {
        return this.__totalAmount.get();
    }
    set totalAmount(newValue: number) {
        this.__totalAmount.set(newValue);
    }
    aboutToAppear() {
        this.totalAmount = this.cartModel.getTotalAmount();
    }
    async handlePayment() {
        if (!this.selectedPayment) {
            promptAction.showToast({ message: '请选择支付方式' });
            return;
        }
        try {
            // 显示处理中状态
            promptAction.showToast({
                message: '订单处理中...',
                duration: TOAST_DURATION
            });
            // 准备订单数据
            const cartItems = this.cartModel.getItems();
            const orderItems: OrderItem[] = cartItems.map(item => {
                const dish = SAMPLE_DISHES.find(d => d.id === item.dishId);
                return {
                    menuItemId: item.dishId,
                    name: dish?.name || '未知商品',
                    price: dish?.price || 0,
                    quantity: item.quantity
                } as OrderItem;
            });
            // 创建订单并直接设置为制作中状态
            const order = await OrderService.createOrder(orderItems, "1", OrderStatus.PREPARING);
            // 清空购物车
            this.cartModel.clearCart();
            // 显示成功提示
            promptAction.showToast({
                message: '订单已提交！',
                duration: TOAST_DURATION
            });
            // 跳转到订单页面
            setTimeout(() => {
                router.pushUrl({
                    url: 'pages/MainPage',
                    params: {
                        activeTab: 1,
                        newOrderId: order.id
                    }
                });
            }, NAVIGATION_DELAY);
        }
        catch (error) {
            console.error('订单创建失败:', error);
            promptAction.showToast({
                message: '订单创建失败，请重试',
                duration: TOAST_DURATION
            });
        }
    }
    PaymentMethodItem(icon: Resource, name: string, id: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(80);
            Row.padding({ left: 20, right: 20 });
            Row.backgroundColor(Color.White);
            Row.borderRadius(16);
            Row.margin({ bottom: 12 });
            Row.onClick(() => {
                this.selectedPayment = id;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.width(40);
            Image.height(40);
            Image.objectFit(ImageFit.Contain);
            Image.margin({ right: 16 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(id === 'alipay' ? '推荐使用支付宝支付' : '推荐使用微信支付');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: id, group: 'payment' });
            Radio.checked(this.selectedPayment === id);
            Radio.onChange((isChecked: boolean) => {
                if (isChecked) {
                    this.selectedPayment = id;
                }
            });
        }, Radio);
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
            Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 支付金额展示
            Column.create();
            // 支付金额展示
            Column.width('100%');
            // 支付金额展示
            Column.padding({ top: 24, bottom: 24, left: 20, right: 20 });
            // 支付金额展示
            Column.margin({ top: 12 });
            // 支付金额展示
            Column.backgroundColor(Color.White);
            // 支付金额展示
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付金额');
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.totalAmount.toFixed(2)}`);
            Text.fontSize(36);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        // 支付金额展示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 支付方式选择
            Column.create();
            // 支付方式选择
            Column.width('100%');
            // 支付方式选择
            Column.padding(20);
            // 支付方式选择
            Column.margin({ top: 12 });
            // 支付方式选择
            Column.backgroundColor(Color.White);
            // 支付方式选择
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择支付方式');
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        // TODO: 需要添加支付宝和微信支付的图标资源
        this.PaymentMethodItem.bind(this)({ "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, '支付宝支付', 'alipay');
        this.PaymentMethodItem.bind(this)({ "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, '微信支付', 'wechat');
        // 支付方式选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部确认按钮
            Button.createWithLabel('确认支付');
            // 底部确认按钮
            Button.width('90%');
            // 底部确认按钮
            Button.height(50);
            // 底部确认按钮
            Button.fontSize(18);
            // 底部确认按钮
            Button.fontWeight(FontWeight.Medium);
            // 底部确认按钮
            Button.backgroundColor(this.selectedPayment ? '#2D7AF6' : '#CCCCCC');
            // 底部确认按钮
            Button.margin({ top: 32 });
            // 底部确认按钮
            Button.onClick(() => {
                this.handlePayment();
            });
        }, Button);
        // 底部确认按钮
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PaymentPage";
    }
}
registerNamedRoute(() => new PaymentPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/PaymentPage", pageFullPath: "entry/src/main/ets/pages/PaymentPage", integratedHsp: "false", moduleType: "followWithHap" });
