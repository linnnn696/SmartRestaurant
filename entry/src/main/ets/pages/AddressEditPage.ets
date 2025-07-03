import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { Address } from './AddressPage';

interface RouterParams {
  address?: Address;
  isEdit?: boolean;
}

@Entry
@Component
struct AddressEditPage {
  @State name: string = '';
  @State phone: string = '';
  @State address: string = '';
  @State isDefault: boolean = false;
  @State isEdit: boolean = false;

  aboutToAppear() {
    const params = router.getParams() as RouterParams;
    if (params?.address) {
      this.name = params.address.name;
      this.phone = params.address.phone;
      this.address = params.address.address;
      this.isDefault = params.address.isDefault;
      this.isEdit = params.isEdit || false;
    }
  }

  @Builder InputField(label: string, value: string, onChange: (value: string) => void) {
    Column() {
      Text(label)
        .fontSize(14)
        .fontColor('#666666')
        .margin({ bottom: 8 })
      TextInput({ text: value })
        .width('100%')
        .height(48)
        .fontSize(16)
        .padding({ left: 16, right: 16 })
        .backgroundColor(Color.White)
        .border({ width: 1, color: '#EEEEEE', radius: 8 })
        .onChange((value: string) => {
          onChange(value);
        })
    }
    .alignItems(HorizontalAlign.Start)
    .margin({ bottom: 20 })
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

        Text(this.isEdit ? '编辑收货地址' : '新增收货地址')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 表单内容
      Column() {
        this.InputField('收货人', this.name, (value: string) => {
          this.name = value;
        })

        this.InputField('手机号码', this.phone, (value: string) => {
          this.phone = value;
        })

        this.InputField('详细地址', this.address, (value: string) => {
          this.address = value;
        })

        Row() {
          Text('设为默认地址')
            .fontSize(16)
            .fontColor('#333333')
          Toggle({ type: ToggleType.Switch, isOn: this.isDefault })
            .selectedColor('#FF4081')
            .switchPointColor('#FFFFFF')
            .onChange((isOn: boolean) => {
              this.isDefault = isOn;
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
        .padding({ top: 12, bottom: 12 })
      }
      .padding({ left: 16, right: 16, top: 20 })

      Blank()

      // 底部保存按钮
      Button('保存')
        .width('90%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .backgroundColor('#FF4081')
        .margin({ bottom: 20 })
        .onClick(() => {
          if (!this.name.trim()) {
            promptAction.showToast({ message: '请输入收货人姓名' });
            return;
          }
          if (!this.phone.trim()) {
            promptAction.showToast({ message: '请输入手机号码' });
            return;
          }
          if (!this.address.trim()) {
            promptAction.showToast({ message: '请输入详细地址' });
            return;
          }

          // TODO: 保存地址信息
          promptAction.showToast({ message: '保存成功' });
          router.back();
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 