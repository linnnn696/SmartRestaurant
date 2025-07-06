if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DishDetailPage_Params {
    dish?: DishItem | undefined;
    cartModel?: CartModel;
}
import router from "@ohos:router";
import { CartModel, SAMPLE_DISHES } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
import type { DishItem } from "@normalized:N&&&entry/src/main/ets/model/DishModel&";
interface RouteParams {
    dishId: string;
}
class DishDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__dish = new ObservedPropertyObjectPU(undefined, this, "dish");
        this.cartModel = CartModel.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DishDetailPage_Params) {
        if (params.dish !== undefined) {
            this.dish = params.dish;
        }
        if (params.cartModel !== undefined) {
            this.cartModel = params.cartModel;
        }
    }
    updateStateVars(params: DishDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__dish.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__dish.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __dish: ObservedPropertyObjectPU<DishItem | undefined>;
    get dish() {
        return this.__dish.get();
    }
    set dish(newValue: DishItem | undefined) {
        this.__dish.set(newValue);
    }
    private cartModel: CartModel;
    aboutToAppear() {
        try {
            const params = router.getParams() as RouteParams;
            if (params?.dishId) {
                this.dish = SAMPLE_DISHES.find(d => d.id === params.dishId);
            }
        }
        catch (error) {
            console.error('Failed to get router params:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header with back button
            Row.create();
            // Header with back button
            Row.width('100%');
            // Header with back button
            Row.height(56);
            // Header with back button
            Row.padding({ left: 16, right: 16 });
            // Header with back button
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.onClick(() => router.back());
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('菜品详情');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        // Header with back button
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.dish) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // Dish image
                        if (typeof this.dish.image === 'string') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 使用纯色背景
                                    Row.create();
                                    // 使用纯色背景
                                    Row.width('100%');
                                    // 使用纯色背景
                                    Row.height(240);
                                    // 使用纯色背景
                                    Row.backgroundColor(this.dish.image);
                                }, Row);
                                // 使用纯色背景
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.dish.image);
                                    Image.width('100%');
                                    Image.height(240);
                                    Image.objectFit(ImageFit.Cover);
                                }, Image);
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Dish info
                        Column.create();
                        // Dish info
                        Column.width('100%');
                        // Dish info
                        Column.padding(20);
                        // Dish info
                        Column.backgroundColor(Color.White);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.dish.name);
                        Text.fontSize(24);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ top: 20, bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.dish.description);
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.dish.sales) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('月售 ' + this.dish.sales);
                                    Text.fontSize(14);
                                    Text.fontColor('#999999');
                                    Text.margin({ bottom: 12 });
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
                        Text.create('¥' + this.dish.price.toFixed(2));
                        Text.fontSize(24);
                        Text.fontColor('#F36D6F');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // Dish info
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Add to cart button
                        Button.createWithLabel('加入购物车');
                        // Add to cart button
                        Button.width('90%');
                        // Add to cart button
                        Button.height(48);
                        // Add to cart button
                        Button.fontSize(18);
                        // Add to cart button
                        Button.backgroundColor('#F36D6F');
                        // Add to cart button
                        Button.margin({ top: 20 });
                        // Add to cart button
                        Button.onClick(() => {
                            if (this.dish) {
                                this.cartModel.addToCart(this.dish.id);
                                router.back();
                            }
                        });
                    }, Button);
                    // Add to cart button
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Error state
                        Text.create('菜品不存在');
                        // Error state
                        Text.fontSize(16);
                        // Error state
                        Text.fontColor('#999999');
                        // Error state
                        Text.margin({ top: 40 });
                    }, Text);
                    // Error state
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DishDetailPage";
    }
}
registerNamedRoute(() => new DishDetailPage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/DishDetailPage", pageFullPath: "entry/src/main/ets/pages/DishDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
