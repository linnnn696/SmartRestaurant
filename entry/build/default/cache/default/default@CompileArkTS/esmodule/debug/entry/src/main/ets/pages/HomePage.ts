if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    currentIndex?: number;
    selectedCategory?: string;
    dinerCount?: number;
    tableId?: string;
    cartItemCount?: number;
    dishes?: MenuItem[];
    recommendedDishes?: MenuItem[];
    isLoading?: boolean;
    isRefreshing?: boolean;
    cartModel?: CartModel;
    categories?: CategoryItem[];
    allDishes?: MenuItem[];
    cartUpdateCallback?;
    animatingItems?: Set<string>;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { DISH_CATEGORIES, CartModel, eventBus } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import type { CategoryItem } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import { MenuService } from "@normalized:N&&&entry/src/main/ets/service/MenuService&";
import type { MenuItem } from "@normalized:N&&&entry/src/main/ets/service/MenuService&";
interface RouterParams {
    dinerCount?: number;
    tableId?: string;
}
export class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__selectedCategory = new ObservedPropertySimplePU('热菜', this, "selectedCategory");
        this.__dinerCount = new ObservedPropertySimplePU(1, this, "dinerCount");
        this.__tableId = new ObservedPropertySimplePU('33', this, "tableId");
        this.__cartItemCount = new ObservedPropertySimplePU(0, this, "cartItemCount");
        this.__dishes = new ObservedPropertyObjectPU([], this, "dishes");
        this.__recommendedDishes = new ObservedPropertyObjectPU([], this, "recommendedDishes");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.cartModel = CartModel.getInstance();
        this.__categories = new ObservedPropertyObjectPU(DISH_CATEGORIES, this, "categories");
        this.allDishes = [];
        this.cartUpdateCallback = () => {
            this.cartItemCount = this.cartModel.getTotalCount();
        };
        this.__animatingItems = new ObservedPropertyObjectPU(new Set<string>()
        // 加载所有菜品数据
        , this, "animatingItems");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.selectedCategory !== undefined) {
            this.selectedCategory = params.selectedCategory;
        }
        if (params.dinerCount !== undefined) {
            this.dinerCount = params.dinerCount;
        }
        if (params.tableId !== undefined) {
            this.tableId = params.tableId;
        }
        if (params.cartItemCount !== undefined) {
            this.cartItemCount = params.cartItemCount;
        }
        if (params.dishes !== undefined) {
            this.dishes = params.dishes;
        }
        if (params.recommendedDishes !== undefined) {
            this.recommendedDishes = params.recommendedDishes;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.cartModel !== undefined) {
            this.cartModel = params.cartModel;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.allDishes !== undefined) {
            this.allDishes = params.allDishes;
        }
        if (params.cartUpdateCallback !== undefined) {
            this.cartUpdateCallback = params.cartUpdateCallback;
        }
        if (params.animatingItems !== undefined) {
            this.animatingItems = params.animatingItems;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__dinerCount.purgeDependencyOnElmtId(rmElmtId);
        this.__tableId.purgeDependencyOnElmtId(rmElmtId);
        this.__cartItemCount.purgeDependencyOnElmtId(rmElmtId);
        this.__dishes.purgeDependencyOnElmtId(rmElmtId);
        this.__recommendedDishes.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__animatingItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__dinerCount.aboutToBeDeleted();
        this.__tableId.aboutToBeDeleted();
        this.__cartItemCount.aboutToBeDeleted();
        this.__dishes.aboutToBeDeleted();
        this.__recommendedDishes.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        this.__animatingItems.aboutToBeDeleted();
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
    private __selectedCategory: ObservedPropertySimplePU<string>;
    get selectedCategory() {
        return this.__selectedCategory.get();
    }
    set selectedCategory(newValue: string) {
        this.__selectedCategory.set(newValue);
    }
    private __dinerCount: ObservedPropertySimplePU<number>;
    get dinerCount() {
        return this.__dinerCount.get();
    }
    set dinerCount(newValue: number) {
        this.__dinerCount.set(newValue);
    }
    private __tableId: ObservedPropertySimplePU<string>;
    get tableId() {
        return this.__tableId.get();
    }
    set tableId(newValue: string) {
        this.__tableId.set(newValue);
    }
    private __cartItemCount: ObservedPropertySimplePU<number>;
    get cartItemCount() {
        return this.__cartItemCount.get();
    }
    set cartItemCount(newValue: number) {
        this.__cartItemCount.set(newValue);
    }
    private __dishes: ObservedPropertyObjectPU<MenuItem[]>;
    get dishes() {
        return this.__dishes.get();
    }
    set dishes(newValue: MenuItem[]) {
        this.__dishes.set(newValue);
    }
    private __recommendedDishes: ObservedPropertyObjectPU<MenuItem[]>;
    get recommendedDishes() {
        return this.__recommendedDishes.get();
    }
    set recommendedDishes(newValue: MenuItem[]) {
        this.__recommendedDishes.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isRefreshing: ObservedPropertySimplePU<boolean>;
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue: boolean) {
        this.__isRefreshing.set(newValue);
    }
    private cartModel: CartModel;
    private __categories: ObservedPropertyObjectPU<CategoryItem[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: CategoryItem[]) {
        this.__categories.set(newValue);
    }
    private allDishes: MenuItem[];
    private cartUpdateCallback;
    private __animatingItems: ObservedPropertyObjectPU<Set<string>>;
    get animatingItems() {
        return this.__animatingItems.get();
    }
    set animatingItems(newValue: Set<string>) {
        this.__animatingItems.set(newValue);
    }
    // 加载所有菜品数据
    private async loadAllDishes() {
        try {
            this.isLoading = true;
            // 获取所有菜品数据
            this.allDishes = await MenuService.getAllMenuItems();
            // 更新当前分类显示
            this.updateDisplayedDishes();
            // 更新推荐菜品
            this.updateRecommendedDishes();
        }
        catch (error) {
            console.error('获取菜品数据失败:', error);
            promptAction.showToast({
                message: '获取菜品数据失败，请检查网络连接',
                duration: 2000
            });
        }
        finally {
            this.isLoading = false;
            this.isRefreshing = false;
        }
    }
    // 更新当前显示的菜品
    private updateDisplayedDishes() {
        this.dishes = this.allDishes.filter(dish => dish.category === this.selectedCategory);
    }
    // 更新推荐菜品
    private updateRecommendedDishes() {
        this.recommendedDishes = this.allDishes
            .filter(dish => dish.tag?.includes('推荐') || dish.tag?.includes('特色') || dish.tag?.includes('招牌'))
            .slice(0, 4);
    }
    async aboutToAppear() {
        // 获取路由参数中的就餐人数和桌号
        const params = router.getParams() as RouterParams;
        if (params?.dinerCount) {
            this.dinerCount = params.dinerCount;
        }
        if (params?.tableId) {
            this.tableId = params.tableId;
        }
        // 更新购物车数量
        this.cartItemCount = this.cartModel.getTotalCount();
        // 添加购物车更新事件监听
        eventBus.on('cart-updated', this.cartUpdateCallback);
        // 加载数据
        await this.loadAllDishes();
    }
    aboutToDisappear() {
        // 移除事件监听
        eventBus.off('cart-updated', this.cartUpdateCallback);
    }
    TopBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor(Color.White);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('超级无敌好吃大饭店');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontFamily('HarmonyHeiTi');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`桌号：${this.tableId} | ${this.dinerCount}人`);
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
    }
    RecommendedDishes(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ bottom: 8 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('！！！店长主推 不好吃不要钱！！！');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontFamily('HarmonyHeiTi-Medium');
            Text.fontStyle(FontStyle.Normal);
            Text.margin({ left: 16, bottom: 4 });
            Text.decoration({ type: TextDecorationType.None });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.width('100%');
            Scroll.padding({ left: 16 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const dish = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width(150);
                    Column.padding(6);
                    Column.margin({ right: 8 });
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(12);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(dish.image);
                    Image.width(150);
                    Image.height(100);
                    Image.borderRadius(8);
                    Image.objectFit(ImageFit.Cover);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (dish.tag) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(dish.tag);
                                Text.fontSize(12);
                                Text.fontColor(Color.White);
                                Text.backgroundColor('#FF4081');
                                Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                Text.borderRadius({ topLeft: 8, bottomRight: 8 });
                                Text.position({ x: 0, y: 0 });
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
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.alignItems(HorizontalAlign.Start);
                    Column.width('100%');
                    Column.padding({ top: 4 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(dish.name);
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Medium);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(dish.description);
                    Text.fontSize(12);
                    Text.fontColor('#999999');
                    Text.margin({ top: 2 });
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`¥${dish.price.toFixed(2)}`);
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor('#FF4081');
                    Text.margin({ top: 2 });
                }, Text);
                Text.pop();
                Column.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.recommendedDishes, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        Column.pop();
    }
    CategoryTabs(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor(Color.White);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 4, bottom: 4 });
            Row.borderRadius(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width(48);
                    Column.height(44);
                    Column.backgroundColor(this.selectedCategory === category.name ? '#FFF0F0' : '#F8F8F8');
                    Column.borderRadius(8);
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => {
                        this.selectedCategory = category.name;
                        this.updateDisplayedDishes();
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category.icon);
                    Text.fontSize(16);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category.name);
                    Text.fontSize(12);
                    Text.fontColor(this.selectedCategory === category.name ? '#FF6B6B' : '#666666');
                    Text.fontWeight(this.selectedCategory === category.name ? FontWeight.Bold : FontWeight.Normal);
                    Text.margin({ top: 2 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    DishGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.width('100%');
            Grid.padding(12);
            Grid.columnsTemplate('1fr 1fr');
            Grid.columnsGap(8);
            Grid.rowsGap(8);
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
                            Column.width('100%');
                            Column.backgroundColor(Color.White);
                            Column.borderRadius(12);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(item.image);
                            Image.width('100%');
                            Image.height(140);
                            Image.borderRadius({ topLeft: 12, topRight: 12 });
                            Image.objectFit(ImageFit.Cover);
                        }, Image);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item.tag) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.tag);
                                        Text.fontSize(12);
                                        Text.fontColor(Color.White);
                                        Text.backgroundColor('#FF4081');
                                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                        Text.borderRadius({ topLeft: 12, bottomRight: 12 });
                                        Text.position({ x: 0, y: 0 });
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
                        Stack.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.width('100%');
                            Column.padding(8);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.name);
                            Text.fontSize(16);
                            Text.fontWeight(FontWeight.Medium);
                            Text.margin({ top: 6 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item.description) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.description);
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                        Text.margin({ top: 2 });
                                        Text.maxLines(1);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
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
                            Row.create();
                            Row.width('100%');
                            Row.margin({ top: 6 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`¥${item.price.toFixed(2)}`);
                            Text.fontSize(18);
                            Text.fontWeight(FontWeight.Bold);
                            Text.fontColor('#FF4081');
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Blank.create();
                        }, Blank);
                        Blank.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Button.createWithChild({ type: ButtonType.Circle });
                            Button.width(24);
                            Button.height(24);
                            Button.scale(this.animatingItems.has(item.id) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 });
                            Button.onClick(() => {
                                this.cartModel.addToCart(item.id);
                                eventBus.emit('cart-updated');
                                this.animatingItems.add(item.id);
                                Context.animateTo({ duration: 300, curve: Curve.Smooth }, () => {
                                    this.animatingItems.delete(item.id);
                                });
                            });
                        }, Button);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Circle.create();
                            Circle.width(24);
                            Circle.height(24);
                            Circle.fill('#FF4081');
                        }, Circle);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create('+');
                            Text.fontSize(18);
                            Text.fontWeight(FontWeight.Bold);
                            Text.fontColor(Color.White);
                        }, Text);
                        Text.pop();
                        Stack.pop();
                        Button.pop();
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.margin({ top: 2 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`月售${item.sales || 0}`);
                            Text.fontSize(12);
                            Text.fontColor('#999999');
                        }, Text);
                        Text.pop();
                        Row.pop();
                        Column.pop();
                        Column.pop();
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.dishes, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
    }
    CartButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(48);
            Button.height(48);
            Button.position({ x: '85%', y: '80%' });
            Button.backgroundColor('#FF4081');
            Button.borderRadius(24);
            Button.onClick(() => {
                router.pushUrl({
                    url: 'pages/CartPage',
                    params: {
                        dinerCount: this.dinerCount,
                        tableId: this.tableId
                    }
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.cartItemCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.cartItemCount.toString());
                        Text.fontSize(12);
                        Text.fontColor(Color.White);
                        Text.backgroundColor('#FF4081');
                        Text.borderRadius(10);
                        Text.padding(4);
                        Text.position({ x: 12, y: -8 });
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
        Stack.pop();
        Button.pop();
    }
    handleAddToCart(dish: MenuItem) {
        this.cartModel.addToCart(dish.id);
        this.cartItemCount = this.cartModel.getTotalCount();
        promptAction.showToast({ message: `已添加${dish.name}` });
    }
    handleRemoveFromCart(dish: MenuItem) {
        this.cartModel.removeFromCart(dish.id);
        this.cartItemCount = this.cartModel.getTotalCount();
        promptAction.showToast({ message: `已减少${dish.name}` });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.TopBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('80%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(32);
                        LoadingProgress.height(32);
                        LoadingProgress.margin({ bottom: 12 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在加载菜品数据...');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Refresh.create({ refreshing: { value: this.isRefreshing, changeEvent: newValue => { this.isRefreshing = newValue; } } });
                        Refresh.onRefreshing(async () => {
                            await this.loadAllDishes();
                        });
                    }, Refresh);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollBar(BarState.Off);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.RecommendedDishes.bind(this)();
                    this.CategoryTabs.bind(this)();
                    this.DishGrid.bind(this)();
                    Column.pop();
                    Scroll.pop();
                    Refresh.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 购物车按钮
            if (this.cartItemCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(80);
                        Button.height(40);
                        Button.backgroundColor('#FF4081');
                        Button.borderRadius(20);
                        Button.margin({ bottom: 16 });
                        Button.onClick(() => {
                            router.pushUrl({
                                url: 'pages/CartPage',
                                params: {
                                    dinerCount: this.dinerCount,
                                    tableId: this.tableId
                                }
                            });
                        });
                        Button.position({ x: '50%', y: '90%' });
                        Button.translate({ x: '-50%', y: '-50%' });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.cartItemCount}`);
                        Text.fontSize(16);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
