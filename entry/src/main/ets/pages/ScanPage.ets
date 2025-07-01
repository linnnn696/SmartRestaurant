import router from '@ohos.router';
import camera from '@ohos.multimedia.camera';
import image from '@ohos.multimedia.image';

interface TableData {
  tableId: string;
}

@Entry
@Component
struct ScanPage {
  @State hasPermission: boolean = false;
  @State scanResult: string = '';

  aboutToAppear() {
    // 检查相机权限
    this.checkPermission();
  }

  async checkPermission() {
    try {
      // 实际项目中需要添加权限检查逻辑
      this.hasPermission = true;
    } catch (error) {
      console.error('Failed to check camera permission:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button('返回')
          .onClick(() => router.back())
        Text('扫码点餐').fontSize(20).fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .padding(15)

      if (this.hasPermission) {
        // 相机预览区域（占位）
        Column() {
          Text('相机预览区域')
            .fontSize(16)
            .margin({ bottom: 20 })
          Text('扫描二维码即可点餐')
            .fontSize(14)
            .fontColor('#666666')
        }
        .width('100%')
        .height('70%')
        .backgroundColor('#000000')
        .justifyContent(FlexAlign.Center)
      } else {
        // 无权限提示
        Column() {
          Text('需要相机权限才能扫码点餐')
            .fontSize(16)
            .margin({ bottom: 20 })
          Button('授权相机权限')
            .onClick(() => this.checkPermission())
        }
        .width('100%')
        .height('70%')
        .justifyContent(FlexAlign.Center)
      }

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
      Button('手动输入桌号')
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