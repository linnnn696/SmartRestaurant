import { HomePage } from './HomePage';
import { OrderListPage } from './OrderListPage';
import { ProfilePage } from './ProfilePage';
import router from '@ohos.router';

interface RouterParams {
  activeTab?: number;
  newOrderId?: string;
}

@Entry
@Component
struct MainPage {
  @State activeIndex: number = 0;
  private tabsController: TabsController = new TabsController();

  aboutToAppear() {
    // 获取路由参数
    const params = router.getParams() as RouterParams;
    if (params) {
      // 如果有 activeTab 参数，切换到对应标签页
      if (params.activeTab !== undefined) {
        this.activeIndex = params.activeTab;
        this.tabsController.changeIndex(this.activeIndex);
      }
    }
  }

  @Builder TabBuilder(title: string, index: number, normalIcon: Resource, selectedIcon: Resource) {
    Column() {
      Image(this.activeIndex === index ? selectedIcon : normalIcon)
        .width(24)
        .height(24)
      Text(title)
        .fontSize(12)
        .fontColor(this.activeIndex === index ? '#FF6B6B' : '#999999')
        .margin({ top: 4 })
    }
    .width('100%')
    .height(56)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.activeIndex = index;
      this.tabsController.changeIndex(index);
    })
  }

  build() {
    Tabs({ barPosition: BarPosition.End, controller: this.tabsController }) {
      TabContent() {
        HomePage()
      }
      .padding({ left: 12, right: 12 })
      .backgroundColor('#F5F5F5')
      .tabBar(this.TabBuilder('点餐', 0, $r('app.media.scan'), $r('app.media.scan')))

      TabContent() {
        OrderListPage()
      }
      .padding({ left: 12, right: 12 })
      .backgroundColor('#F5F5F5')
      .tabBar(this.TabBuilder('订单', 1, $r('app.media.order'), $r('app.media.order')))

      TabContent() {
        ProfilePage()
      }
      .padding({ left: 12, right: 12 })
      .backgroundColor('#F5F5F5')
      .tabBar(this.TabBuilder('我的', 2, $r('app.media.profile'), $r('app.media.profile')))
    }
    .scrollable(false)
    .barMode(BarMode.Fixed)
    .onChange((index: number) => {
      this.activeIndex = index;
    })
  }
} 