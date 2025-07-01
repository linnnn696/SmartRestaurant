import router from '@ohos.router';
import common from '@ohos.app.ability.common';
import { OrderListPage } from './OrderListPage';
import { ProfilePage } from './ProfilePage';

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
  @State currentIndex: number = 0;
  @State tableId: string = '';
  @State recommendedDishes: Array<DishItem> = [
    { id: 1, name: '特色红烧肉', price: 48.00, description: '精选五花肉，传统工艺', image: $r('app.media.background'), tag: '招牌' },
    { id: 2, name: '清炒时蔬', price: 22.00, description: '新鲜应季蔬菜', image: $r('app.media.background'), tag: '特惠' },
    { id: 3, name: '麻婆豆腐', price: 32.00, description: '川味十足，口感细腻', image: $r('app.media.background'), tag: '推荐' },
  ];

  @State categories: Array<CategoryItem> = [
    { id: 1, name: '热菜', icon: '🔥' },
    { id: 2, name: '凉菜', icon: '❄️' },
    { id: 3, name: '主食', icon: '🍚' },
    { id: 4, name: '汤类', icon: '🥣' },
    { id: 5, name: '饮品', icon: '🥤' }
  ];

  @State menuItems: Array<DishItem> = [
    { id: 1, name: '宫保鸡丁', price: 38.00, description: '口感鲜辣，搭配花生', image: $r('app.media.background'), category: '热菜' },
    { id: 2, name: '水煮鱼片', price: 58.00, description: '新鲜草鱼，麻辣鲜香', image: $r('app.media.background'), category: '热菜' },
    { id: 3, name: '凉拌黄瓜', price: 18.00, description: '爽口开胃', image: $r('app.media.background'), category: '凉菜' },
    { id: 4, name: '蒜蓉粉丝', price: 28.00, description: '蒜香四溢', image: $r('app.media.background'), category: '热菜' },
  ];

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

  @Builder MenuPage() {
    Column() {
      // 顶部导航栏
      Row() {
        Image($r('app.media.startIcon'))
          .width(32)
          .height(32)
          .margin({ right: 8 })
        Text('智慧餐厅')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
        Blank()
        Button() {
          Image($r('app.media.scan'))
            .width(24)
            .height(24)
        }
        .backgroundColor(Color.Transparent)
        .margin({ right: 8 })
        Button('扫码点餐', { type: ButtonType.Capsule })
          .backgroundColor('#FF6B6B')
          .height(32)
      }
      .width('100%')
      .padding(15)
      .backgroundColor('#FFFFFF')

      Scroll() {
        Column() {
          // 推荐菜品横向滚动
          Text('推荐菜品')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .margin({ top: 16, bottom: 12, left: 15 })
          
          List({ space: 12, scroller: new Scroller() }) {
            ForEach(this.recommendedDishes, (item: DishItem) => {
              ListItem() {
                Column() {
                  Stack() {
                    Image(item.image)
                      .width('100%')
                      .height(160)
                      .borderRadius(8)
                      .objectFit(ImageFit.Cover)
                    Text(item.tag)
                      .fontSize(12)
                      .backgroundColor('#FF6B6B')
                      .fontColor(Color.White)
                      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
                      .borderRadius({ topLeft: 8, bottomRight: 8 })
                      .position({ x: 0, y: 0 })
                  }
                  Text(item.name)
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .margin({ top: 8, bottom: 4 })
                  Text(item.description)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ bottom: 4 })
                  Text(`￥${item.price.toFixed(2)}`)
                    .fontSize(16)
                    .fontColor('#FF6B6B')
                }
                .width(280)
                .backgroundColor(Color.White)
                .borderRadius(12)
                .padding(12)
              }
            })
          }
          .width('100%')
          .height(240)
          .listDirection(Axis.Horizontal)
          .margin({ left: 15 })

          // 分类标签横向滚动
          Row() {
            ForEach(this.categories, (item: CategoryItem) => {
              Column() {
                Text(item.icon)
                  .fontSize(28)
                  .margin({ bottom: 8 })
                Text(item.name)
                  .fontSize(14)
                  .fontColor('#333333')
              }
              .width(64)
              .alignItems(HorizontalAlign.Center)
              .margin({ left: item.id === 1 ? 12 : 0, right: 12 })
            })
          }
          .width('100%')
          .height(90)
          .margin({ top: 20, bottom: 20 })
          .justifyContent(FlexAlign.SpaceEvenly)
          .backgroundColor(Color.White)

          // 菜品网格
          Grid() {
            ForEach(this.menuItems, (item: DishItem) => {
              GridItem() {
                Column() {
                  Image(item.image)
                    .width('100%')
                    .height(120)
                    .borderRadius(8)
                    .objectFit(ImageFit.Cover)
                  Text(item.name)
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .margin({ top: 8, bottom: 4 })
                  Text(item.description)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ bottom: 4 })
                  Row() {
                    Text(`￥${item.price.toFixed(2)}`)
                      .fontSize(16)
                      .fontColor('#FF6B6B')
                    Blank()
                    Button({ type: ButtonType.Circle, stateEffect: true }) {
                      Text('+')
                        .fontSize(20)
                        .fontWeight(FontWeight.Bold)
                        .fontColor('#FFFFFF')
                    }
                    .width(24)
                    .height(24)
                    .backgroundColor('#FF6B6B')
                  }
                  .width('100%')
                  .alignItems(VerticalAlign.Center)
                }
                .backgroundColor(Color.White)
                .borderRadius(12)
                .padding(12)
              }
            })
          }
          .width('100%')
          .height('100%')
          .columnsTemplate('1fr 1fr')
          .columnsGap(12)
          .rowsGap(12)
          .margin({ top: 16, left: 15, right: 15 })
        }
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder OrderListBuilder() {
    OrderListPage()
  }

  @Builder ProfileBuilder() {
    ProfilePage()
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
    Column() {
      if (this.currentIndex === 0) {
        this.MenuPage()
      } else if (this.currentIndex === 1) {
        this.OrderListBuilder()
      } else {
        this.ProfileBuilder()
      }

      // 底部导航栏
      Row() {
        Column() {
          Image($r('app.media.scan'))
            .width(24)
            .height(24)
            .fillColor(this.currentIndex === 0 ? '#FF6B6B' : '#999999')
          Text('扫码点餐')
            .fontSize(12)
            .fontColor(this.currentIndex === 0 ? '#FF6B6B' : '#999999')
            .margin({ top: 4 })
        }
        .onClick(() => this.currentIndex = 0)
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)

        Column() {
          Image($r('app.media.order'))
            .width(24)
            .height(24)
            .fillColor(this.currentIndex === 1 ? '#FF6B6B' : '#999999')
          Text('我的订单')
            .fontSize(12)
            .fontColor(this.currentIndex === 1 ? '#FF6B6B' : '#999999')
            .margin({ top: 4 })
        }
        .onClick(() => this.currentIndex = 1)
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)

        Column() {
          Image($r('app.media.profile'))
            .width(24)
            .height(24)
            .fillColor(this.currentIndex === 2 ? '#FF6B6B' : '#999999')
          Text('个人中心')
            .fontSize(12)
            .fontColor(this.currentIndex === 2 ? '#FF6B6B' : '#999999')
            .margin({ top: 4 })
        }
        .onClick(() => this.currentIndex = 2)
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
      .width('100%')
      .height(56)
      .backgroundColor(Color.White)
      .position({ x: 0, y: '100%' })
      .translate({ y: -56 })
      .borderColor('#E3E3E3')
      .borderWidth({ top: 0.5 })
    }
    .width('100%')
    .height('100%')
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