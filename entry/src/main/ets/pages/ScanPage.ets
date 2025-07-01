import router from '@ohos.router';

interface TableData {
  tableId: string;
}

@Entry
@Component
struct ScanPage {
  @State scanResult: string = '';

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
        }
        .backgroundColor(Color.Transparent)
        .onClick(() => router.back())
        
        Text('扫码点餐')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .padding(15)

      // 扫码区域（占位）
      Column() {
        Image($r('app.media.scan_frame'))
          .width('70%')
          .height('70%')
          .objectFit(ImageFit.Contain)
        
        Text('扫描二维码即可点餐')
          .fontSize(16)
          .margin({ top: 20 })
          .fontColor('#666666')
      }
      .width('100%')
      .height('70%')
      .backgroundColor('#F5F5F5')
      .justifyContent(FlexAlign.Center)

      // 扫描结果展示
      if (this.scanResult) {
        Column() {
          Text('扫描结果：')
            .fontSize(16)
            .margin({ bottom: 10 })
          Text(this.scanResult)
            .fontSize(14)
        }
        .padding(15)
      }

      // 手动输入按钮
      Button('手动输入桌号', { type: ButtonType.Normal })
        .width('80%')
        .height(40)
        .backgroundColor('#007DFF')
        .onClick(() => {
          // 模拟扫描结果
          this.handleScanResult(JSON.stringify({ tableId: 'A001' }));
        })
        .margin({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  handleScanResult(result: string) {
    this.scanResult = result;
    try {
      const data = JSON.parse(result) as TableData;
      if (data && typeof data === 'object' && data.tableId && typeof data.tableId === 'string') {
        // 跳转到点餐页面
        router.pushUrl({
          url: 'pages/HomePage',
          params: {
            tableId: data.tableId
          }
        });
      }
    } catch (error) {
      console.error('Invalid QR code content:', error instanceof Error ? error.message : 'Parse error');
    }
  }
} 