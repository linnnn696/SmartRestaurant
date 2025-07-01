import router from '@ohos.router';
import common from '@ohos.app.ability.common';

interface RouterParams {
  tableId?: string;
}

@Component
struct OrderList {
  build() {
    Column() {
      Text('我的订单')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 20 })

      // 订单列表（占位）
      Column() {
        Text('暂无订单')
          .fontSize(16)
          .fontColor('#999999')
      }
      .width('100%')
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .padding(20)
  }
}

@Component
struct Profile {
  build() {
    Column() {
      Text('个人中心')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 20 })

      // 个人信息（占位）
      Column() {
        Text('未登录')
          .fontSize(16)
          .fontColor('#999999')
      }
      .width('100%')
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .padding(20)
  }
}

@Entry
@Component
struct HomePage {
  @State tableId: string = '';
  @State currentIndex: number = 0;

  @Builder TabBuilder(title: string, index: number, normalIcon: Resource) {
    Column() {
      Image(normalIcon)
        .width(24)
        .height(24)
        .margin({ bottom: 4 })
        .fillColor(this.currentIndex === index ? '#F36D6F' : '#999999')
      Text(title)
        .fontSize(12)
        .fontColor(this.currentIndex === index ? '#F36D6F' : '#999999')
    }
  }

  @Builder HomeContent() {
    Column() {
      // 顶部栏
      Row() {
        Text('智慧餐厅').fontSize(24).fontWeight(FontWeight.Bold)
        if (this.tableId) {
          Text('桌号：' + this.tableId)
            .fontSize(16)
            .margin({ left: 10 })
        }
        Blank()
        Button('扫码点餐')
          .backgroundColor('#F36D6F')
          .onClick(() => router.pushUrl({ url: 'pages/ScanPage' }))
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 15 })
      .backgroundColor(Color.White)

      // 推荐菜品列表
      Text('推荐菜品')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 15 })
        .padding({ left: 20 })

      ForEach([1, 2, 3], (item: number) => {
        Row() {
          Column() {
            Text('菜品 ' + item)
              .fontSize(18)
              .margin({ bottom: 5 })
            Text('¥ ' + (item * 10).toString() + '.00')
              .fontSize(16)
              .fontColor('#F36D6F')
          }.alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          Button('详情')
            .onClick(() => router.pushUrl({ url: 'pages/DishDetailPage' }))
            .backgroundColor('#F36D6F')
            .margin({ left: 10 })
        }
        .width('100%')
        .padding(15)
        .backgroundColor(Color.White)
        .borderRadius(8)
        .margin({ bottom: 10 })
      })
    }
    .width('100%')
    .height('100%')
    .padding({ left: 20, right: 20, bottom: 20 })
  }

  aboutToAppear() {
    try {
      const params = router.getParams() as RouterParams;
      this.tableId = params?.tableId || '';
    } catch (error) {
      console.error('Failed to get router params:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  build() {
    Tabs({ barPosition: BarPosition.End, index: this.currentIndex }) {
      TabContent() {
        Stack({ alignContent: Alignment.Top }) {
          this.HomeContent()
        }
        .width('100%')
        .backgroundColor('#F5F5F5')
      }
      .tabBar(this.TabBuilder('扫码点餐', 0, $r('app.media.scan')))

      TabContent() {
        OrderList()
      }
      .tabBar(this.TabBuilder('我的订单', 1, $r('app.media.order')))

      TabContent() {
        Profile()
      }
      .tabBar(this.TabBuilder('个人中心', 2, $r('app.media.profile')))
    }
    .onChange((index: number) => {
      this.currentIndex = index;
    })
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 