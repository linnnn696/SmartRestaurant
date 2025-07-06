if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
    currentIndex?: number;
    userName?: string;
    phoneNumber?: string;
    orderModel?: OrderModel;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { OrderModel } from "@normalized:N&&&entry/src/main/ets/model/OrderModel&";
export class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(2, this, "currentIndex");
        this.__userName = new ObservedPropertySimplePU('用户名', this, "userName");
        this.__phoneNumber = new ObservedPropertySimplePU('138****8888', this, "phoneNumber");
        this.orderModel = OrderModel.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.userName !== undefined) {
            this.userName = params.userName;
        }
        if (params.phoneNumber !== undefined) {
            this.phoneNumber = params.phoneNumber;
        }
        if (params.orderModel !== undefined) {
            this.orderModel = params.orderModel;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__userName.purgeDependencyOnElmtId(rmElmtId);
        this.__phoneNumber.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__userName.aboutToBeDeleted();
        this.__phoneNumber.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>; // 当前选中的是个人中心页面
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __userName: ObservedPropertySimplePU<string>;
    get userName() {
        return this.__userName.get();
    }
    set userName(newValue: string) {
        this.__userName.set(newValue);
    }
    private __phoneNumber: ObservedPropertySimplePU<string>;
    get phoneNumber() {
        return this.__phoneNumber.get();
    }
    set phoneNumber(newValue: string) {
        this.__phoneNumber.set(newValue);
    }
    private orderModel: OrderModel;
    MenuItem(icon: Resource, title: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor(Color.White);
            Row.onClick(onClick);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.width(24);
            Image.height(24);
            Image.margin({ right: 12 });
            Image.fillColor('#666666');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor('#999999');
            Image.rotate({ angle: 180 });
        }, Image);
        Row.pop();
    }
    // 呼叫服务员
    callWaiter() {
        promptAction.showDialog({
            title: '呼叫服务员',
            message: '服务员马上就到，请稍候',
            buttons: [
                {
                    text: '确定',
                    color: '#FF4081'
                }
            ]
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部用户信息区域
            Column.create();
            // 顶部用户信息区域
            Column.width('100%');
            // 顶部用户信息区域
            Column.padding({ top: 48, bottom: 32 });
            // 顶部用户信息区域
            Column.backgroundColor(Color.White);
            // 顶部用户信息区域
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(80);
            Image.height(80);
            Image.fillColor('#CCCCCC');
            Image.margin({ bottom: 16 });
            Image.borderRadius(40);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.userName);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`手机号：${this.phoneNumber}`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 顶部用户信息区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 呼叫服务员按钮
            Button.createWithChild();
            // 呼叫服务员按钮
            Button.width('90%');
            // 呼叫服务员按钮
            Button.height(48);
            // 呼叫服务员按钮
            Button.margin({ top: 20, bottom: 12 });
            // 呼叫服务员按钮
            Button.backgroundColor('#FF4081');
            // 呼叫服务员按钮
            Button.onClick(() => this.callWaiter());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.margin({ right: 8 });
            Image.fillColor(Color.White);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('呼叫服务员');
            Text.fontSize(16);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Row.pop();
        // 呼叫服务员按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能列表
            Column.create();
            // 功能列表
            Column.margin({ top: 12 });
            // 功能列表
            Column.backgroundColor(Color.White);
        }, Column);
        this.MenuItem.bind(this)({ "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, '餐后评价', () => {
            router.pushUrl({
                url: 'pages/ReviewPage',
                params: {}
            }).catch((err: Error) => {
                console.error(`Failed to navigate to ReviewPage: ${err.message}`);
                promptAction.showToast({ message: '页面跳转失败，请重试' });
            });
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F5F5F5');
            Divider.height(1);
        }, Divider);
        this.MenuItem.bind(this)({ "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, '联系客服', () => {
            promptAction.showToast({
                message: '客服电话：400-123-4567',
                duration: 2000
            });
        });
        // 功能列表
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
