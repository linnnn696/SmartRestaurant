if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ScanPage_Params {
    hasPermission?: boolean;
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
        this.__hasPermission = new ObservedPropertySimplePU(false, this, "hasPermission");
        this.__scanResult = new ObservedPropertySimplePU('', this, "scanResult");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ScanPage_Params) {
        if (params.hasPermission !== undefined) {
            this.hasPermission = params.hasPermission;
        }
        if (params.scanResult !== undefined) {
            this.scanResult = params.scanResult;
        }
    }
    updateStateVars(params: ScanPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__hasPermission.purgeDependencyOnElmtId(rmElmtId);
        this.__scanResult.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__hasPermission.aboutToBeDeleted();
        this.__scanResult.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __hasPermission: ObservedPropertySimplePU<boolean>;
    get hasPermission() {
        return this.__hasPermission.get();
    }
    set hasPermission(newValue: boolean) {
        this.__hasPermission.set(newValue);
    }
    private __scanResult: ObservedPropertySimplePU<string>;
    get scanResult() {
        return this.__scanResult.get();
    }
    set scanResult(newValue: string) {
        this.__scanResult.set(newValue);
    }
    aboutToAppear() {
        // 检查相机权限
        this.checkPermission();
    }
    async checkPermission() {
        try {
            // 实际项目中需要添加权限检查逻辑
            this.hasPermission = true;
        }
        catch (error) {
            console.error('Failed to check camera permission:', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ScanPage.ets(30:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ScanPage.ets(32:7)", "entry");
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 顶部导航栏
            Row.padding(15);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/ScanPage.ets(33:9)", "entry");
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('扫码点餐');
            Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(35:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.hasPermission) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 相机预览区域（占位）
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ScanPage.ets(43:9)", "entry");
                        // 相机预览区域（占位）
                        Column.width('100%');
                        // 相机预览区域（占位）
                        Column.height('70%');
                        // 相机预览区域（占位）
                        Column.backgroundColor('#000000');
                        // 相机预览区域（占位）
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('相机预览区域');
                        Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(44:11)", "entry");
                        Text.fontSize(16);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('扫描二维码即可点餐');
                        Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(47:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    // 相机预览区域（占位）
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 无权限提示
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ScanPage.ets(57:9)", "entry");
                        // 无权限提示
                        Column.width('100%');
                        // 无权限提示
                        Column.height('70%');
                        // 无权限提示
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('需要相机权限才能扫码点餐');
                        Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(58:11)", "entry");
                        Text.fontSize(16);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('授权相机权限');
                        Button.debugLine("entry/src/main/ets/pages/ScanPage.ets(61:11)", "entry");
                        Button.onClick(() => this.checkPermission());
                    }, Button);
                    Button.pop();
                    // 无权限提示
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 扫描结果展示
            if (this.scanResult) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ScanPage.ets(71:9)", "entry");
                        Column.padding(15);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('扫描结果：');
                        Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(72:11)", "entry");
                        Text.fontSize(16);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.scanResult);
                        Text.debugLine("entry/src/main/ets/pages/ScanPage.ets(75:11)", "entry");
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
            Button.createWithLabel('手动输入桌号');
            Button.debugLine("entry/src/main/ets/pages/ScanPage.ets(82:7)", "entry");
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
