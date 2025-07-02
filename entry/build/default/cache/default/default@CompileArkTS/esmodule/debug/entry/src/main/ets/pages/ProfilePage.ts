if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
}
import router from "@ohos:router";
export class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
    }
    updateStateVars(params: ProfilePage_Params) {
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
            Text.create('个人中心');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息
            Column.create();
            // 用户信息
            Column.width('100%');
            // 用户信息
            Column.backgroundColor(Color.White);
            // 用户信息
            Column.padding({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
            Image.width(80);
            Image.height(80);
            Image.borderRadius(40);
            Image.margin({ top: 20, bottom: 12 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('手机号：138****8888');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 用户信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能列表
            List.create();
            // 功能列表
            List.width('100%');
            // 功能列表
            List.layoutWeight(1);
            // 功能列表
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
                ListItem.backgroundColor(Color.White);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(15);
                    Row.onClick(() => {
                        router.replaceUrl({ url: 'pages/OrderListPage' });
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(24);
                    Image.height(24);
                    Image.margin({ right: 12 });
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('历史订单');
                    Text.fontSize(16);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(20);
                    Image.height(20);
                }, Image);
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
                ListItem.backgroundColor(Color.White);
                ListItem.margin({ top: 1 });
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(15);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(24);
                    Image.height(24);
                    Image.margin({ right: 12 });
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('收货地址');
                    Text.fontSize(16);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(20);
                    Image.height(20);
                }, Image);
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
                ListItem.backgroundColor(Color.White);
                ListItem.margin({ top: 1 });
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(15);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(24);
                    Image.height(24);
                    Image.margin({ right: 12 });
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('联系客服');
                    Text.fontSize(16);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.smartrestaurant", "moduleName": "entry" });
                    Image.width(20);
                    Image.height(20);
                }, Image);
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        // 功能列表
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProfilePage";
    }
}
registerNamedRoute(() => new ProfilePage(undefined, {}), "", { bundleName: "com.example.smartrestaurant", moduleName: "entry", pagePath: "pages/ProfilePage", pageFullPath: "entry/src/main/ets/pages/ProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
