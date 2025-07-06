if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CartPage_Params {
    cartItems?: CartItem[];
    totalAmount?: number;
    animatingItems?: Set<string>;
    dishes?: Map<string, MenuItem>;
    isLoading?: boolean;
    isSubmitting?: boolean;
    cartModel?: CartModel;
}
import { CartModel } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import type { CartItem } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { MenuService } from "@normalized:N&&&entry/src/main/ets/service/MenuService&";
import type { MenuItem } from "@normalized:N&&&entry/src/main/ets/service/MenuService&";
class CartPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__cartItems = new ObservedPropertyObjectPU([], this, "cartItems");
        this.__totalAmount = new ObservedPropertySimplePU(0, this, "totalAmount");
        this.__animatingItems = new ObservedPropertyObjectPU(new Set(), this, "animatingItems");
        this.__dishes = new ObservedPropertyObjectPU(new Map(), this, "dishes");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isSubmitting = new ObservedPropertySimplePU(false, this, "isSubmitting");
        this.cartModel = CartModel.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CartPage_Params) {
        if (params.cartItems !== undefined) {
            this.cartItems = params.cartItems;
        }
        if (params.totalAmount !== undefined) {
            this.totalAmount = params.totalAmount;
        }
        if (params.animatingItems !== undefined) {
            this.animatingItems = params.animatingItems;
        }
        if (params.dishes !== undefined) {
            this.dishes = params.dishes;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isSubmitting !== undefined) {
            this.isSubmitting = params.isSubmitting;
        }
        if (params.cartModel !== undefined) {
            this.cartModel = params.cartModel;
        }
    }
    updateStateVars(params: CartPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__cartItems.purgeDependencyOnElmtId(rmElmtId);
        this.__totalAmount.purgeDependencyOnElmtId(rmElmtId);
        this.__animatingItems.purgeDependencyOnElmtId(rmElmtId);
        this.__dishes.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isSubmitting.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__cartItems.aboutToBeDeleted();
        this.__totalAmount.aboutToBeDeleted();
        this.__animatingItems.aboutToBeDeleted();
        this.__dishes.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isSubmitting.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __cartItems: ObservedPropertyObjectPU<CartItem[]>;
    get cartItems() {
        return this.__cartItems.get();
    }
    set cartItems(newValue: CartItem[]) {
        this.__cartItems.set(newValue);
    }
    private __totalAmount: ObservedPropertySimplePU<number>;
    get totalAmount() {
        return this.__totalAmount.get();
    }
    set totalAmount(newValue: number) {
        this.__totalAmount.set(newValue);
    }
    private __animatingItems: ObservedPropertyObjectPU<Set<string>>;
    get animatingItems() {
        return this.__animatingItems.get();
    }
    set animatingItems(newValue: Set<string>) {
        this.__animatingItems.set(newValue);
    }
    private __dishes: ObservedPropertyObjectPU<Map<string, MenuItem>>;
    get dishes() {
        return this.__dishes.get();
    }
    set dishes(newValue: Map<string, MenuItem>) {
        this.__dishes.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isSubmitting: ObservedPropertySimplePU<boolean>;
    get isSubmitting() {
        return this.__isSubmitting.get();
    }
    set isSubmitting(newValue: boolean) {
        this.__isSubmitting.set(newValue);
    }
    private cartModel: CartModel;
    async aboutToAppear() {
        try {
            // 先获取所有菜品数据
            const allDishes = await MenuService.getAllMenuItems();
            this.dishes = new Map(allDishes.map(dish => [dish.id, dish]));
            this.isLoading = false;
        }
        catch (error) {
            console.error('获取菜品数据失败:', error);
            promptAction.showToast({ message: '获取菜品数据失败' });
        }
        this.updateCart();
    }
    updateCart() {
        this.cartItems = this.cartModel.getItems();
        this.totalAmount = this.cartItems.reduce((total, item) => {
            const dish = this.dishes.get(item.dishId);
            return total + (dish?.price || 0) * item.quantity;
        }, 0);
    }
    getDish(dishId: string): MenuItem | undefined {
        return this.dishes.get(dishId);
    }
    QuantityControl(item: CartItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 减号按钮
            Button.createWithChild({ type: ButtonType.Circle });
            // 减号按钮
            Button.width(28);
            // 减号按钮
            Button.height(28);
            // 减号按钮
            Button.backgroundColor('#FFF0F4');
            // 减号按钮
            Button.scale(this.animatingItems.has(item.dishId) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 });
            // 减号按钮
            Button.onClick(() => {
                this.cartModel.removeFromCart(item.dishId);
                this.animatingItems.add(item.dishId);
                Context.animateTo({ duration: 300, curve: Curve.Smooth }, () => {
                    this.animatingItems.delete(item.dishId);
                });
                this.updateCart();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor('#FF4081');
        }, Image);
        // 减号按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数量显示
            Text.create(item.quantity.toString());
            // 数量显示
            Text.fontSize(16);
            // 数量显示
            Text.margin({ left: 16, right: 16 });
        }, Text);
        // 数量显示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加号按钮
            Button.createWithChild({ type: ButtonType.Circle });
            // 加号按钮
            Button.width(28);
            // 加号按钮
            Button.height(28);
            // 加号按钮
            Button.backgroundColor('#FF4081');
            // 加号按钮
            Button.scale(this.animatingItems.has(`add-${item.dishId}`) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 });
            // 加号按钮
            Button.onClick(() => {
                this.cartModel.addToCart(item.dishId);
                this.animatingItems.add(`add-${item.dishId}`);
                Context.animateTo({ duration: 300, curve: Curve.Smooth }, () => {
                    this.animatingItems.delete(`add-${item.dishId}`);
                });
                this.updateCart();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor(Color.White);
        }, Image);
        // 加号按钮
        Button.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            // 顶部标题栏
            Row.width('100%');
            // 顶部标题栏
            Row.height(56);
            // 顶部标题栏
            Row.padding({ left: 16, right: 16 });
            // 顶部标题栏
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor('transparent');
            Button.onClick(() => router.back());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('购物车');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(32);
                        LoadingProgress.height(32);
                        LoadingProgress.margin({ bottom: 12 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在加载...');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.cartItems.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                        Image.width(120);
                        Image.height(120);
                        Image.fillColor('#cccccc');
                        Image.margin({ bottom: 16 });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('购物车是空的');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('去点餐');
                        Button.margin({ top: 24 });
                        Button.backgroundColor('#ff4081');
                        Button.onClick(() => router.back());
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 购物车列表
                        List.create();
                        // 购物车列表
                        List.layoutWeight(1);
                        // 购物车列表
                        List.margin({ top: 8 });
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
                                        Row.create();
                                        Row.width('100%');
                                        Row.padding(16);
                                        Row.backgroundColor(Color.White);
                                        Row.borderRadius(12);
                                        Row.margin({ bottom: 1 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(this.getDish(item.dishId)?.image || '');
                                        Image.width(80);
                                        Image.height(80);
                                        Image.borderRadius(8);
                                        Image.margin({ right: 12 });
                                        Image.objectFit(ImageFit.Cover);
                                    }, Image);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(this.getDish(item.dishId)?.name || '');
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (this.getDish(item.dishId)?.tag) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(this.getDish(item.dishId)?.tag);
                                                    Text.fontSize(12);
                                                    Text.backgroundColor('#fff0f4');
                                                    Text.fontColor('#ff4081');
                                                    Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                                    Text.borderRadius(4);
                                                    Text.margin({ top: 4 });
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
                                        Text.create('¥' + (this.getDish(item.dishId)?.price || 0).toFixed(2));
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor('#ff4081');
                                        Text.margin({ top: 4 });
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    // 使用数量控制组件
                                    this.QuantityControl.bind(this)(item);
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.cartItems, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 购物车列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部结算栏
            Row.create();
            // 底部结算栏
            Row.width('100%');
            // 底部结算栏
            Row.height(64);
            // 底部结算栏
            Row.padding({ left: 16, right: 16 });
            // 底部结算栏
            Row.backgroundColor(Color.White);
            // 底部结算栏
            Row.position({ y: '100%' });
            // 底部结算栏
            Row.translate({ y: -64 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('合计');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('¥' + this.totalAmount.toFixed(2));
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#ff4081');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('结算');
            Button.width(120);
            Button.height(40);
            Button.backgroundColor(this.cartItems.length > 0 ? '#ff4081' : '#cccccc');
            Button.enabled(this.cartItems.length > 0 && !this.isSubmitting);
            Button.onClick(() => {
                if (this.cartItems.length > 0) {
                    // 跳转到支付页面
                    router.pushUrl({
                        url: 'pages/PaymentPage',
                        params: {
                            amount: this.totalAmount
                        }
                    });
                }
                else {
                    promptAction.showToast({ message: '请先选择商品' });
                }
            });
        }, Button);
        Button.pop();
        // 底部结算栏
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CartPage";
    }
}
registerNamedRoute(() => new CartPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/CartPage", pageFullPath: "entry/src/main/ets/pages/CartPage", integratedHsp: "false", moduleType: "followWithHap" });
