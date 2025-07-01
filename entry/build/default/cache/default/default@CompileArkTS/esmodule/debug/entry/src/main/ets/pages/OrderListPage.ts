if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderListPage_Params {
}
export class OrderListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderListPage_Params) {
    }
    updateStateVars(params: OrderListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.padding(15);
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 订单列表
            List.create();
            // 订单列表
            List.width('100%');
            // 订单列表
            List.layoutWeight(1);
            // 订单列表
            List.backgroundColor('#F5F5F5');
        }, List);
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
                ListItem.margin({ bottom: 8 });
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('100%');
                    Column.padding({ left: 15, right: 15 });
                    Column.backgroundColor(Color.White);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding({ top: 12, bottom: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('订单号：123456');
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Medium);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('进行中');
                    Text.fontSize(14);
                    Text.fontColor('#FF6B6B');
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding({ bottom: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('宫保鸡丁 x1');
                    Text.fontSize(14);
                    Text.fontColor('#666666');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('水煮鱼片 x1');
                    Text.fontSize(14);
                    Text.fontColor('#666666');
                    Text.margin({ left: 8 });
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding({ bottom: 12 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('2024-03-19 12:30');
                    Text.fontSize(12);
                    Text.fontColor('#999999');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('￥96.00');
                    Text.fontSize(16);
                    Text.fontColor('#333333');
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        // 订单列表
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
