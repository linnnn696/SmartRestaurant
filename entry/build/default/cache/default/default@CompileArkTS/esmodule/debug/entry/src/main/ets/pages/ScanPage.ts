if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ScanPage_Params {
    scanLineTop?: number;
    dinerCount?: number;
    intervalId?: number;
    scanFrameHeight?: number;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
interface RouterParams {
    dinerCount: number;
}
class ScanPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__scanLineTop = new ObservedPropertySimplePU(0, this, "scanLineTop");
        this.__dinerCount = new ObservedPropertySimplePU(1, this, "dinerCount");
        this.intervalId = -1;
        this.scanFrameHeight = 260;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ScanPage_Params) {
        if (params.scanLineTop !== undefined) {
            this.scanLineTop = params.scanLineTop;
        }
        if (params.dinerCount !== undefined) {
            this.dinerCount = params.dinerCount;
        }
        if (params.intervalId !== undefined) {
            this.intervalId = params.intervalId;
        }
        if (params.scanFrameHeight !== undefined) {
            this.scanFrameHeight = params.scanFrameHeight;
        }
    }
    updateStateVars(params: ScanPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__scanLineTop.purgeDependencyOnElmtId(rmElmtId);
        this.__dinerCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__scanLineTop.aboutToBeDeleted();
        this.__dinerCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __scanLineTop: ObservedPropertySimplePU<number>;
    get scanLineTop() {
        return this.__scanLineTop.get();
    }
    set scanLineTop(newValue: number) {
        this.__scanLineTop.set(newValue);
    }
    private __dinerCount: ObservedPropertySimplePU<number>;
    get dinerCount() {
        return this.__dinerCount.get();
    }
    set dinerCount(newValue: number) {
        this.__dinerCount.set(newValue);
    }
    private intervalId: number;
    private scanFrameHeight: number;
    aboutToAppear() {
        // 获取路由参数中的就餐人数
        const params = router.getParams() as RouterParams;
        if (params?.dinerCount) {
            this.dinerCount = params.dinerCount;
        }
        // 开始扫描线动画
        this.intervalId = setInterval(() => {
            this.scanLineTop = (this.scanLineTop + 2) % this.scanFrameHeight;
        }, 20);
        // 模拟2秒后扫码成功
        setTimeout(() => {
            clearInterval(this.intervalId);
            promptAction.showToast({
                message: '扫码成功',
                duration: 2000
            });
            setTimeout(() => {
                router.pushUrl({
                    url: 'pages/MainPage',
                    params: {
                        activeTab: 0,
                        dinerCount: this.dinerCount,
                        tableId: '33' // 传递桌号
                    }
                });
            }, 1000);
        }, 2000);
    }
    aboutToDisappear() {
        clearInterval(this.intervalId);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor('#000000');
            Stack.opacity(0.9);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header
            Row.create();
            // Header
            Row.width('100%');
            // Header
            Row.height(56);
            // Header
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.margin({ left: 16 });
            Image.onClick(() => router.back());
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('扫描桌面二维码');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        // Header
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Scan area
            Column.create();
            // Scan area
            Column.width('100%');
            // Scan area
            Column.layoutWeight(1);
            // Scan area
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(280);
            Stack.height(this.scanFrameHeight);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Scan frame
            Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            // Scan frame
            Image.width(280);
            // Scan frame
            Image.height(this.scanFrameHeight);
            // Scan frame
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Scan line
            Row.create();
            // Scan line
            Row.width(240);
            // Scan line
            Row.height(2);
            // Scan line
            Row.backgroundColor('#007DFF');
            // Scan line
            Row.position({ x: 20, y: this.scanLineTop });
            // Scan line
            Row.opacity(0.6);
        }, Row);
        // Scan line
        Row.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请将二维码放入框内');
            Text.fontSize(16);
            Text.fontColor('#999999');
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        // Scan area
        Column.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ScanPage";
    }
}
registerNamedRoute(() => new ScanPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/ScanPage", pageFullPath: "entry/src/main/ets/pages/ScanPage", integratedHsp: "false", moduleType: "followWithHap" });
