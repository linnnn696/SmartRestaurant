if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    currentIndex?: number;
    tableId?: string;
    recommendedDishes?: Array<DishItem>;
    categories?: Array<CategoryItem>;
    menuItems?: Array<DishItem>;
}
interface Profile_Params {
}
interface OrderList_Params {
}
import router from "@ohos:router";
import { OrderListPage } from "@normalized:N&&&entry/src/main/ets/pages/OrderListPage&";
import { ProfilePage } from "@normalized:N&&&entry/src/main/ets/pages/ProfilePage&";
interface RouterParams {
    tableId?: string;
}
class OrderList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderList_Params) {
    }
    updateStateVars(params: OrderList_Params) {
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
            Column.backgroundColor('#F5F5F5');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 订单列表（占位）
            Column.create();
            // 订单列表（占位）
            Column.width('100%');
            // 订单列表（占位）
            Column.layoutWeight(1);
            // 订单列表（占位）
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('暂无订单');
            Text.fontSize(16);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 订单列表（占位）
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class Profile extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Profile_Params) {
    }
    updateStateVars(params: Profile_Params) {
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
            Column.backgroundColor('#F5F5F5');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人中心');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 个人信息（占位）
            Column.create();
            // 个人信息（占位）
            Column.width('100%');
            // 个人信息（占位）
            Column.layoutWeight(1);
            // 个人信息（占位）
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('未登录');
            Text.fontSize(16);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 个人信息（占位）
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__tableId = new ObservedPropertySimplePU('', this, "tableId");
        this.__recommendedDishes = new ObservedPropertyObjectPU([
            { id: 1, name: '特色红烧肉', price: 48.00, description: '精选五花肉，传统工艺', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, tag: '招牌' },
            { id: 2, name: '清炒时蔬', price: 22.00, description: '新鲜应季蔬菜', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, tag: '特惠' },
            { id: 3, name: '麻婆豆腐', price: 32.00, description: '川味十足，口感细腻', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, tag: '推荐' },
        ], this, "recommendedDishes");
        this.__categories = new ObservedPropertyObjectPU([
            { id: 1, name: '热菜', icon: '🔥' },
            { id: 2, name: '凉菜', icon: '❄️' },
            { id: 3, name: '主食', icon: '🍚' },
            { id: 4, name: '汤类', icon: '🥣' },
            { id: 5, name: '饮品', icon: '🥤' }
        ], this, "categories");
        this.__menuItems = new ObservedPropertyObjectPU([
            { id: 1, name: '宫保鸡丁', price: 38.00, description: '口感鲜辣，搭配花生', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, category: '热菜' },
            { id: 2, name: '水煮鱼片', price: 58.00, description: '新鲜草鱼，麻辣鲜香', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, category: '热菜' },
            { id: 3, name: '凉拌黄瓜', price: 18.00, description: '爽口开胃', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, category: '凉菜' },
            { id: 4, name: '蒜蓉粉丝', price: 28.00, description: '蒜香四溢', image: { "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" }, category: '热菜' },
        ], this, "menuItems");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.tableId !== undefined) {
            this.tableId = params.tableId;
        }
        if (params.recommendedDishes !== undefined) {
            this.recommendedDishes = params.recommendedDishes;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.menuItems !== undefined) {
            this.menuItems = params.menuItems;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__tableId.purgeDependencyOnElmtId(rmElmtId);
        this.__recommendedDishes.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__menuItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__tableId.aboutToBeDeleted();
        this.__recommendedDishes.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        this.__menuItems.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __tableId: ObservedPropertySimplePU<string>;
    get tableId() {
        return this.__tableId.get();
    }
    set tableId(newValue: string) {
        this.__tableId.set(newValue);
    }
    private __recommendedDishes: ObservedPropertyObjectPU<Array<DishItem>>;
    get recommendedDishes() {
        return this.__recommendedDishes.get();
    }
    set recommendedDishes(newValue: Array<DishItem>) {
        this.__recommendedDishes.set(newValue);
    }
    private __categories: ObservedPropertyObjectPU<Array<CategoryItem>>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: Array<CategoryItem>) {
        this.__categories.set(newValue);
    }
    private __menuItems: ObservedPropertyObjectPU<Array<DishItem>>;
    get menuItems() {
        return this.__menuItems.get();
    }
    set menuItems(newValue: Array<DishItem>) {
        this.__menuItems.set(newValue);
    }
    TabBuilder(title: string, index: number, normalIcon: Resource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(normalIcon);
            Image.width(24);
            Image.height(24);
            Image.margin({ bottom: 4 });
            Image.fillColor(this.currentIndex === index ? '#F36D6F' : '#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(12);
            Text.fontColor(this.currentIndex === index ? '#F36D6F' : '#999999');
        }, Text);
        Text.pop();
        Column.pop();
    }
    HomeContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 20, right: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部栏
            Row.create();
            // 顶部栏
            Row.width('100%');
            // 顶部栏
            Row.padding({ left: 20, right: 20, top: 15, bottom: 15 });
            // 顶部栏
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧餐厅');
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
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('扫码点餐');
            Button.backgroundColor('#F36D6F');
            Button.onClick(() => router.pushUrl({ url: 'pages/ScanPage' }));
        }, Button);
        Button.pop();
        // 顶部栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 推荐菜品列表
            Text.create('推荐菜品');
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
                    Row.width('100%');
                    Row.padding(15);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(8);
                    Row.margin({ bottom: 10 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('菜品 ' + item);
                    Text.fontSize(18);
                    Text.margin({ bottom: 5 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('¥ ' + (item * 10).toString() + '.00');
                    Text.fontSize(16);
                    Text.fontColor('#F36D6F');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('详情');
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
    }
    MenuPage(parent = null) {
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
            Row.padding(15);
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(32);
            Image.height(32);
            Image.margin({ right: 8 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧餐厅');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor(Color.Transparent);
            Button.margin({ right: 8 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('扫码点餐', { type: ButtonType.Capsule });
            Button.backgroundColor('#FF6B6B');
            Button.height(32);
        }, Button);
        Button.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 推荐菜品横向滚动
            Text.create('推荐菜品');
            // 推荐菜品横向滚动
            Text.fontSize(18);
            // 推荐菜品横向滚动
            Text.fontWeight(FontWeight.Bold);
            // 推荐菜品横向滚动
            Text.margin({ top: 16, bottom: 12, left: 15 });
        }, Text);
        // 推荐菜品横向滚动
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 12, scroller: new Scroller() });
            List.width('100%');
            List.height(240);
            List.listDirection(Axis.Horizontal);
            List.margin({ left: 15 });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
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
                            Column.width(280);
                            Column.backgroundColor(Color.White);
                            Column.borderRadius(12);
                            Column.padding(12);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(item.image);
                            Image.width('100%');
                            Image.height(160);
                            Image.borderRadius(8);
                            Image.objectFit(ImageFit.Cover);
                        }, Image);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.tag);
                            Text.fontSize(12);
                            Text.backgroundColor('#FF6B6B');
                            Text.fontColor(Color.White);
                            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                            Text.borderRadius({ topLeft: 8, bottomRight: 8 });
                            Text.position({ x: 0, y: 0 });
                        }, Text);
                        Text.pop();
                        Stack.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.name);
                            Text.fontSize(16);
                            Text.fontWeight(FontWeight.Medium);
                            Text.margin({ top: 8, bottom: 4 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.description);
                            Text.fontSize(14);
                            Text.fontColor('#666666');
                            Text.margin({ bottom: 4 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`￥${item.price.toFixed(2)}`);
                            Text.fontSize(16);
                            Text.fontColor('#FF6B6B');
                        }, Text);
                        Text.pop();
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.recommendedDishes, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类标签横向滚动
            Row.create();
            // 分类标签横向滚动
            Row.width('100%');
            // 分类标签横向滚动
            Row.height(90);
            // 分类标签横向滚动
            Row.margin({ top: 20, bottom: 20 });
            // 分类标签横向滚动
            Row.justifyContent(FlexAlign.SpaceEvenly);
            // 分类标签横向滚动
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width(64);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.margin({ left: item.id === 1 ? 12 : 0, right: 12 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.icon);
                    Text.fontSize(28);
                    Text.margin({ bottom: 8 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.name);
                    Text.fontSize(14);
                    Text.fontColor('#333333');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 分类标签横向滚动
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 菜品网格
            Grid.create();
            // 菜品网格
            Grid.width('100%');
            // 菜品网格
            Grid.height('100%');
            // 菜品网格
            Grid.columnsTemplate('1fr 1fr');
            // 菜品网格
            Grid.columnsGap(12);
            // 菜品网格
            Grid.rowsGap(12);
            // 菜品网格
            Grid.margin({ top: 16, left: 15, right: 15 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.backgroundColor(Color.White);
                            Column.borderRadius(12);
                            Column.padding(12);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(item.image);
                            Image.width('100%');
                            Image.height(120);
                            Image.borderRadius(8);
                            Image.objectFit(ImageFit.Cover);
                        }, Image);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.name);
                            Text.fontSize(16);
                            Text.fontWeight(FontWeight.Medium);
                            Text.margin({ top: 8, bottom: 4 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.description);
                            Text.fontSize(14);
                            Text.fontColor('#666666');
                            Text.margin({ bottom: 4 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width('100%');
                            Row.alignItems(VerticalAlign.Center);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`￥${item.price.toFixed(2)}`);
                            Text.fontSize(16);
                            Text.fontColor('#FF6B6B');
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Blank.create();
                        }, Blank);
                        Blank.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                            Button.width(24);
                            Button.height(24);
                            Button.backgroundColor('#FF6B6B');
                        }, Button);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create('+');
                            Text.fontSize(20);
                            Text.fontWeight(FontWeight.Bold);
                            Text.fontColor('#FFFFFF');
                        }, Text);
                        Text.pop();
                        Button.pop();
                        Row.pop();
                        Column.pop();
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.menuItems, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 菜品网格
        Grid.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    OrderListBuilder(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new OrderListPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 314, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "OrderListPage" });
        }
    }
    ProfileBuilder(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ProfilePage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 318, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ProfilePage" });
        }
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
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.MenuPage.bind(this)();
                });
            }
            else if (this.currentIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.OrderListBuilder.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.ProfileBuilder.bind(this)();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部导航栏
            Row.create();
            // 底部导航栏
            Row.width('100%');
            // 底部导航栏
            Row.height(56);
            // 底部导航栏
            Row.backgroundColor(Color.White);
            // 底部导航栏
            Row.position({ x: 0, y: '100%' });
            // 底部导航栏
            Row.translate({ y: -56 });
            // 底部导航栏
            Row.borderColor('#E3E3E3');
            // 底部导航栏
            Row.borderWidth({ top: 0.5 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => this.currentIndex = 0);
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.currentIndex === 0 ? '#FF6B6B' : '#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('扫码点餐');
            Text.fontSize(12);
            Text.fontColor(this.currentIndex === 0 ? '#FF6B6B' : '#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => this.currentIndex = 1);
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.currentIndex === 1 ? '#FF6B6B' : '#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.fontSize(12);
            Text.fontColor(this.currentIndex === 1 ? '#FF6B6B' : '#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onClick(() => this.currentIndex = 2);
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(this.currentIndex === 2 ? '#FF6B6B' : '#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人中心');
            Text.fontSize(12);
            Text.fontColor(this.currentIndex === 2 ? '#FF6B6B' : '#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
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
interface DishItem {
    id: number;
    name: string;
    price: number;
    description: string;
    image: Resource;
    tag?: string;
    category?: string;
}
interface CategoryItem {
    id: number;
    name: string;
    icon: string;
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
