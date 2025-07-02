import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

interface RouterParams {
  dinerCount: number;
}

@Entry
@Component
struct ScanPage {
  @State private scanLineTop: number = 0
  @State private dinerCount: number = 1
  private intervalId: number = -1
  private scanFrameHeight: number = 260

  aboutToAppear() {
    // 获取路由参数中的就餐人数
    const params = router.getParams() as RouterParams;
    if (params?.dinerCount) {
      this.dinerCount = params.dinerCount;
    }

    // 开始扫描线动画
    this.intervalId = setInterval(() => {
      this.scanLineTop = (this.scanLineTop + 2) % this.scanFrameHeight;
    }, 20);

    // 模拟2秒后扫码成功
    setTimeout(() => {
      clearInterval(this.intervalId);
      promptAction.showToast({
        message: '扫码成功',
        duration: 2000
      });
      setTimeout(() => {
        router.pushUrl({
          url: 'pages/MainPage',
          params: {
            activeTab: 0,  // 设置初始标签页为点餐页面
            dinerCount: this.dinerCount,  // 传递就餐人数
            tableId: '33'  // 传递桌号
          }
        });
      }, 1000);
    }, 2000);
  }

  aboutToDisappear() {
    clearInterval(this.intervalId);
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        // Header
        Row() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
            .margin({ left: 16 })
            .onClick(() => router.back())
          Text('扫描桌面二维码')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .margin({ left: 16 })
        }
        .width('100%')
        .height(56)
        .backgroundColor(Color.White)

        // Scan area
        Column() {
          Stack() {
            // Scan frame
            Image($r('app.media.scan_frame'))
              .width(280)
              .height(this.scanFrameHeight)
              .objectFit(ImageFit.Contain)

            // Scan line
            Row()
              .width(240)
              .height(2)
              .backgroundColor('#007DFF')
              .position({ x: 20, y: this.scanLineTop })
              .opacity(0.6)
          }
          .width(280)
          .height(this.scanFrameHeight)

          Text('请将二维码放入框内')
            .fontSize(16)
            .fontColor('#999999')
            .margin({ top: 20 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
      .width('100%')
      .height('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#000000')
    .opacity(0.9)
  }
} 