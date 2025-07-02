import router from '@ohos.router';

@Entry
@Component
export struct ProfilePage {
  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Text('个人中心')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .padding(15)
      .backgroundColor('#FFFFFF')

      // 用户信息
      Column() {
        Image($r('app.media.profile'))
          .width(80)
          .height(80)
          .borderRadius(40)
          .margin({ top: 20, bottom: 12 })
        
        Text('用户名')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .margin({ bottom: 4 })
        
        Text('手机号：138****8888')
          .fontSize(14)
          .fontColor('#666666')
      }
      .width('100%')
      .backgroundColor(Color.White)
      .padding({ bottom: 20 })

      // 功能列表
      List() {
        ListItem() {
          Row() {
            Image($r('app.media.order'))
              .width(24)
              .height(24)
              .margin({ right: 12 })
            Text('历史订单')
              .fontSize(16)
            Blank()
            Image($r('app.media.scan'))
              .width(20)
              .height(20)
          }
          .width('100%')
          .padding(15)
          .onClick(() => {
            router.replaceUrl({ url: 'pages/OrderListPage' });
          })
        }
        .backgroundColor(Color.White)

        ListItem() {
          Row() {
            Image($r('app.media.order'))
              .width(24)
              .height(24)
              .margin({ right: 12 })
            Text('收货地址')
              .fontSize(16)
            Blank()
            Image($r('app.media.scan'))
              .width(20)
              .height(20)
          }
          .width('100%')
          .padding(15)
        }
        .backgroundColor(Color.White)
        .margin({ top: 1 })

        ListItem() {
          Row() {
            Image($r('app.media.order'))
              .width(24)
              .height(24)
              .margin({ right: 12 })
            Text('联系客服')
              .fontSize(16)
            Blank()
            Image($r('app.media.scan'))
              .width(20)
              .height(20)
          }
          .width('100%')
          .padding(15)
        }
        .backgroundColor(Color.White)
        .margin({ top: 1 })
      }
      .width('100%')
      .layoutWeight(1)
      .backgroundColor('#F5F5F5')
    }
    .width('100%')
    .height('100%')
  }
} 