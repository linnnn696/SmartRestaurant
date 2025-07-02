import router from '@ohos.router';

@Entry
@Component
struct Index {
  @State dinerCount: number = 1

  build() {
    Column() {
      // Header
      Text('选择就餐人数')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 40, bottom: 60 })

      // Counter display
      Row() {
        Button('-')
          .width(60)
          .height(60)
          .fontSize(24)
          .backgroundColor('#f0f0f0')
          .fontColor('#333')
          .onClick(() => {
            if (this.dinerCount > 1) {
              this.dinerCount--
            }
          })

        Text(this.dinerCount.toString())
          .fontSize(36)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 40, right: 40 })

        Button('+')
          .width(60)
          .height(60)
          .fontSize(24)
          .backgroundColor('#f0f0f0')
          .fontColor('#333')
          .onClick(() => {
            if (this.dinerCount < 20) {
              this.dinerCount++
            }
          })
      }
      .margin({ bottom: 60 })

      // Confirm button
      Button('确认人数，扫码点餐')
        .width('80%')
        .height(50)
        .backgroundColor('#007DFF')
        .fontColor(Color.White)
        .onClick(() => {
          router.pushUrl({
            url: 'pages/ScanPage',
            params: {
              dinerCount: this.dinerCount
            }
          })
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}