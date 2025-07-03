import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

@Entry
@Component
struct AddressPage {
  @State addresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '13812345678',
      address: '北京市朝阳区某某街道1号楼',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '13987654321',
      address: '北京市海淀区某某路2号院',
      isDefault: false
    }
  ];

  @Builder AddressItem(address: Address) {
    Column() {
      Row() {
        Column() {
          Row() {
            Text(address.name)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
            Text(address.phone)
              .fontSize(16)
              .fontColor('#666666')
              .margin({ left: 12 })
          }
          .margin({ bottom: 8 })

          Text(address.address)
            .fontSize(14)
            .fontColor('#666666')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        Image($r('app.media.ic_back'))
          .width(20)
          .height(20)
          .fillColor('#999999')
          .rotate({ angle: 180 })
      }
      .width('100%')
      .padding({ top: 12, bottom: 12 })

      if (address.isDefault) {
        Row() {
          Text('默认地址')
            .fontSize(12)
            .fontColor('#FF4081')
            .backgroundColor('#FFF0F4')
            .padding({ left: 8, right: 8, top: 2, bottom: 2 })
            .borderRadius(4)
        }
        .margin({ top: 8 })
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .onClick(() => {
      router.pushUrl({
        url: 'pages/AddressEditPage',
        params: {
          address: address,
          isEdit: true
        }
      });
    })
  }

  build() {
    Column() {
      // 顶部栏
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
        }
        .backgroundColor('transparent')
        .onClick(() => router.back())

        Text('收货地址')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 地址列表
      List() {
        ForEach(this.addresses, (address: Address) => {
          ListItem() {
            this.AddressItem(address)
          }
          .margin({ bottom: 12 })
        })
      }
      .layoutWeight(1)
      .margin({ top: 12 })

      // 底部添加按钮
      Button('+ 新增收货地址')
        .width('90%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .backgroundColor('#FF4081')
        .margin({ bottom: 20 })
        .onClick(() => {
          router.pushUrl({ url: 'pages/AddressEditPage' });
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 