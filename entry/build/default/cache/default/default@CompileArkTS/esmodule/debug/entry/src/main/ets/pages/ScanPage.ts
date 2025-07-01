if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ScanPage_Params {
    scanResult?: string;
}
import router from "@ohos:router";
interface TableData {
    tableId: string;
}
class ScanPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__scanResult = new ObservedPropertySimplePU('', this, "scanResult");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ScanPage_Params) {
        if (params.scanResult !== undefined) {
            this.scanResult = params.scanResult;
        }
    }
    updateStateVars(params: ScanPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__scanResult.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__scanResult.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __scanResult: ObservedPropertySimplePU<string>;
    get scanResult() {
        return this.__scanResult.get();
    }
    set scanResult(newValue: string) {
        this.__scanResult.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 顶部导航栏
            Row.padding(15);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => router.back());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('扫码点餐');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 扫码区域（占位）
            Column.create();
            // 扫码区域（占位）
            Column.width('100%');
            // 扫码区域（占位）
            Column.height('70%');
            // 扫码区域（占位）
            Column.backgroundColor('#F5F5F5');
            // 扫码区域（占位）
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width('70%');
            Image.height('70%');
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('扫描二维码即可点餐');
            Text.fontSize(16);
            Text.margin({ top: 20 });
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 扫码区域（占位）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 扫描结果展示
            if (this.scanResult) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding(15);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('扫描结果：');
                        Text.fontSize(16);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.scanResult);
                        Text.fontSize(14);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            // 手动输入按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手动输入按钮
            Button.createWithLabel('手动输入桌号', { type: ButtonType.Normal });
            // 手动输入按钮
            Button.width('80%');
            // 手动输入按钮
            Button.height(40);
            // 手动输入按钮
            Button.backgroundColor('#007DFF');
            // 手动输入按钮
            Button.onClick(() => {
                // 模拟扫描结果
                this.handleScanResult(JSON.stringify({ tableId: 'A001' }));
            });
            // 手动输入按钮
            Button.margin({ top: 20 });
        }, Button);
        // 手动输入按钮
        Button.pop();
        Column.pop();
    }
    handleScanResult(result: string) {
        this.scanResult = result;
        try {
            const data = JSON.parse(result) as TableData;
            if (data && typeof data === 'object' && data.tableId && typeof data.tableId === 'string') {
                // 跳转到点餐页面
                router.pushUrl({
                    url: 'pages/HomePage',
                    params: {
                        tableId: data.tableId
                    }
                });
            }
        }
        catch (error) {
            console.error('Invalid QR code content:', error instanceof Error ? error.message : 'Parse error');
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ScanPage";
    }
}
registerNamedRoute(() => new ScanPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/ScanPage", pageFullPath: "entry/src/main/ets/pages/ScanPage", integratedHsp: "false", moduleType: "followWithHap" });
