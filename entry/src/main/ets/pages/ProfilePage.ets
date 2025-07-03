import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderModel, Order } from '../model/OrderModel';

@Component
export struct ProfilePage {
  @State currentIndex: number = 2;  // 当前选中的是个人中心页面
  @State userName: string = '用户名';
  @State phoneNumber: string = '138****8888';
  private orderModel: OrderModel = OrderModel.getInstance();

  @Builder MenuItem(icon: Resource, title: string, onClick: () => void) {
    Row() {
      Row() {
        Image(icon)
          .width(24)
          .height(24)
          .margin({ right: 12 })
          .fillColor('#666666')
        Text(title)
          .fontSize(16)
          .fontColor('#333333')
      }
      .layoutWeight(1)

      Image($r('app.media.ic_back'))
        .width(20)
        .height(20)
        .fillColor('#999999')
        .rotate({ angle: 180 })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .onClick(onClick)
  }

  // 呼叫服务员
  callWaiter() {
    promptAction.showDialog({
      title: '呼叫服务员',
      message: '服务员马上就到，请稍候',
      buttons: [
        {
          text: '确定',
          color: '#FF4081'
        }
      ]
    });
  }

  build() {
    Column() {
      // 顶部用户信息区域
      Column() {
        Image($r('app.media.profile'))
          .width(80)
          .height(80)
          .fillColor('#CCCCCC')
          .margin({ bottom: 16 })
          .borderRadius(40)

        Text(this.userName)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 8 })

        Text(`手机号：${this.phoneNumber}`)
          .fontSize(14)
          .fontColor('#666666')
      }
      .width('100%')
      .padding({ top: 48, bottom: 32 })
      .backgroundColor(Color.White)
      .alignItems(HorizontalAlign.Center)

      // 呼叫服务员按钮
      Button() {
        Row() {
          Image($r('app.media.profile')) // 这里可以替换成服务员图标
            .width(24)
            .height(24)
            .margin({ right: 8 })
            .fillColor(Color.White)
          Text('呼叫服务员')
            .fontSize(16)
            .fontColor(Color.White)
        }
      }
      .width('90%')
      .height(48)
      .margin({ top: 20, bottom: 12 })
      .backgroundColor('#FF4081')
      .onClick(() => this.callWaiter())

      // 功能列表
      Column() {
        this.MenuItem($r('app.media.profile'), '餐后评价', () => {
          router.pushUrl({
            url: 'pages/ReviewPage',
            params: {}
          }).catch((err: Error) => {
            console.error(`Failed to navigate to ReviewPage: ${err.message}`);
            promptAction.showToast({ message: '页面跳转失败，请重试' });
          });
        })
        Divider().color('#F5F5F5').height(1)

        this.MenuItem($r('app.media.profile'), '联系客服', () => {
          promptAction.showToast({
            message: '客服电话：400-123-4567',
            duration: 2000
          });
        })
      }
      .margin({ top: 12 })
      .backgroundColor(Color.White)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 