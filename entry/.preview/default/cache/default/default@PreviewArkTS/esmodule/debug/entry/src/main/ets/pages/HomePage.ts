if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    tableId?: string;
    currentIndex?: number;
}
import router from "@ohos:router";
interface RouterParams {
    tableId?: string;
}
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tableId = new ObservedPropertySimplePU('', this, "tableId");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.tableId !== undefined) {
            this.tableId = params.tableId;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tableId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tableId.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tableId: ObservedPropertySimplePU<string>;
    get tableId() {
        return this.__tableId.get();
    }
    set tableId(newValue: string) {
        this.__tableId.set(newValue);
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    TabBuilder(title: string, index: number, normalIcon: Resource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/HomePage.ets(15:5)", "entry");
            Column.onClick(() => {
                if (this.currentIndex === index) {
                    return;
                }
                this.currentIndex = index;
                switch (index) {
                    case 0:
                        router.replaceUrl({ url: 'pages/HomePage' });
                        break;
                    case 1:
                        router.pushUrl({ url: 'pages/OrderListPage' });
                        break;
                    case 2:
                        router.pushUrl({ url: 'pages/ProfilePage' });
                        break;
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(normalIcon);
            Image.debugLine("entry/src/main/ets/pages/HomePage.ets(16:7)", "entry");
            Image.width(24);
            Image.height(24);
            Image.margin({ bottom: 4 });
            Image.fillColor(this.currentIndex === index ? '#F36D6F' : '#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/HomePage.ets(21:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.currentIndex === index ? '#F36D6F' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
    }
    aboutToAppear() {
        try {
            const params = router.getParams() as RouterParams;
            this.tableId = params?.tableId || '';
        }
        catch (error) {
            console.error('Failed to get router params:', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/HomePage.ets(54:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主内容区域
            Stack.create({ alignContent: Alignment.Top });
            Stack.debugLine("entry/src/main/ets/pages/HomePage.ets(56:7)", "entry");
            // 主内容区域
            Stack.width('100%');
            // 主内容区域
            Stack.layoutWeight(1);
            // 主内容区域
            Stack.backgroundColor('#F5F5F5');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/HomePage.ets(57:9)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 20, right: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(59:11)", "entry");
            // 顶部栏
            Row.width('100%');
            // 顶部栏
            Row.padding({ left: 20, right: 20, top: 15, bottom: 15 });
            // 顶部栏
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧餐厅');
            Text.debugLine("entry/src/main/ets/pages/HomePage.ets(60:13)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.tableId) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('桌号：' + this.tableId);
                        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(62:15)", "entry");
                        Text.fontSize(16);
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/HomePage.ets(66:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('扫码点餐');
            Button.debugLine("entry/src/main/ets/pages/HomePage.ets(67:13)", "entry");
            Button.backgroundColor('#F36D6F');
            Button.onClick(() => router.pushUrl({ url: 'pages/ScanPage' }));
        }, Button);
        Button.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 推荐菜品列表
            Text.create('推荐菜品');
            Text.debugLine("entry/src/main/ets/pages/HomePage.ets(76:11)", "entry");
            // 推荐菜品列表
            Text.fontSize(20);
            // 推荐菜品列表
            Text.fontWeight(FontWeight.Bold);
            // 推荐菜品列表
            Text.margin({ top: 20, bottom: 15 });
            // 推荐菜品列表
            Text.padding({ left: 20 });
        }, Text);
        // 推荐菜品列表
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/HomePage.ets(83:13)", "entry");
                    Row.width('100%');
                    Row.padding(15);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(8);
                    Row.margin({ bottom: 10 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/HomePage.ets(84:15)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('菜品 ' + item);
                    Text.debugLine("entry/src/main/ets/pages/HomePage.ets(85:17)", "entry");
                    Text.fontSize(18);
                    Text.margin({ bottom: 5 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('¥ ' + (item * 10).toString() + '.00');
                    Text.debugLine("entry/src/main/ets/pages/HomePage.ets(88:17)", "entry");
                    Text.fontSize(16);
                    Text.fontColor('#F36D6F');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('详情');
                    Button.debugLine("entry/src/main/ets/pages/HomePage.ets(94:15)", "entry");
                    Button.onClick(() => router.pushUrl({ url: 'pages/DishDetailPage' }));
                    Button.backgroundColor('#F36D6F');
                    Button.margin({ left: 10 });
                }, Button);
                Button.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // 主内容区域
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(115:7)", "entry");
            // 底部导航栏
            Row.width('100%');
            // 底部导航栏
            Row.height(60);
            // 底部导航栏
            Row.backgroundColor(Color.White);
            // 底部导航栏
            Row.justifyContent(FlexAlign.SpaceEvenly);
            // 底部导航栏
            Row.border({ width: { top: 0.5 }, color: '#DDDDDD' });
        }, Row);
        this.TabBuilder.bind(this)('扫码点餐', 0, { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
        this.TabBuilder.bind(this)('我的订单', 1, { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
        this.TabBuilder.bind(this)('个人中心', 2, { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
        // 底部导航栏
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
