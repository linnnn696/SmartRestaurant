if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PaymentPage_Params {
}
import router from "@ohos:router";
class PaymentPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PaymentPage_Params) {
    }
    updateStateVars(params: PaymentPage_Params) {
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
            Column.debugLine("entry/src/main/ets/pages/PaymentPage.ets(7:5)", "entry");
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付');
            Text.debugLine("entry/src/main/ets/pages/PaymentPage.ets(8:7)", "entry");
            Text.fontSize(24);
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择支付方式（占位）');
            Text.debugLine("entry/src/main/ets/pages/PaymentPage.ets(9:7)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确认支付');
            Button.debugLine("entry/src/main/ets/pages/PaymentPage.ets(10:7)", "entry");
            Button.margin({ top: 30 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/PaymentPage.ets(11:7)", "entry");
            Button.onClick(() => router.back());
        }, Button);
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
