import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { DishItem, SAMPLE_DISHES, DISH_CATEGORIES, CategoryItem, CartModel, eventBus } from '../model/DishModel';

interface RouterParams {
  dinerCount?: number;
  tableId?: string;
}

@Component
export struct HomePage {
  @State currentIndex: number = 0;
  @State selectedCategory: string = '热菜';
  @State dinerCount: number = 1;
  @State tableId: string = '33';
  @State cartItemCount: number = 0;
  @State dishes: DishItem[] = [];
  @State recommendedDishes: DishItem[] = SAMPLE_DISHES
    .filter(dish => dish.tag === '推荐' || dish.tag === '特色' || dish.tag === '招牌')
    .slice(0, 4);
  private cartModel: CartModel = CartModel.getInstance();
  @State categories: CategoryItem[] = DISH_CATEGORIES;
  private cartUpdateCallback = () => {
    this.cartItemCount = this.cartModel.getTotalCount();
  };

  @State private animatingItems: Set<number> = new Set<number>()

  aboutToAppear() {
    // 获取路由参数中的就餐人数和桌号
    const params = router.getParams() as RouterParams;
    if (params?.dinerCount) {
      this.dinerCount = params.dinerCount;
    }
    if (params?.tableId) {
      this.tableId = params.tableId;
    }
    
    // 更新购物车数量
    this.cartItemCount = this.cartModel.getTotalCount();

    // 添加购物车更新事件监听
    eventBus.on('cart-updated', this.cartUpdateCallback);

    // 初始化显示热菜分类
    this.dishes = SAMPLE_DISHES.filter(dish => dish.category === this.selectedCategory);
  }

  aboutToDisappear() {
    // 移除事件监听
    eventBus.off('cart-updated', this.cartUpdateCallback);
  }

  @Builder
  TopBar() {
    Row() {
      Text('超级无敌好吃大饭店')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontFamily('HarmonyHeiTi')
      Row() {
        Text(`桌号：${this.tableId} | ${this.dinerCount}人`)
          .fontSize(14)
          .fontColor('#666666')
      }
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .justifyContent(FlexAlign.SpaceBetween)
  }

  @Builder RecommendedDishes() {
    Column() {
      Text('推荐菜品')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontFamily('HarmonyHeiTi-Medium')
        .fontStyle(FontStyle.Normal)
        .margin({ left: 16, bottom: 6 })
        .decoration({ type: TextDecorationType.None })

      Scroll() {
        Row() {
          ForEach(this.recommendedDishes, (dish: DishItem) => {
            Column() {
              Stack() {
                Image(dish.image)
                  .width(150)
                  .height(100)
                  .borderRadius(8)
                  .objectFit(ImageFit.Cover)
                if (dish.tag) {
                  Text(dish.tag)
                    .fontSize(12)
                    .fontColor(Color.White)
                    .backgroundColor('#FF4081')
                    .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                    .borderRadius({ topLeft: 8, bottomRight: 8 })
                    .position({ x: 0, y: 0 })
                }
              }

              Column() {
                Text(dish.name)
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                Text(dish.description)
                  .fontSize(12)
                  .fontColor('#999999')
                  .margin({ top: 2 })
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                Text(`¥${dish.price.toFixed(2)}`)
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#FF4081')
                  .margin({ top: 4 })
              }
              .alignItems(HorizontalAlign.Start)
              .width('100%')
              .padding({ top: 8 })
            }
            .width(150)
            .padding(8)
            .margin({ right: 8 })
            .backgroundColor(Color.White)
            .borderRadius(12)
          })
        }
      }
      .scrollable(ScrollDirection.Horizontal)
      .width('100%')
      .padding({ left: 16 })
    }
    .margin({ bottom: 12 })
    .width('100%')
  }

  @Builder
  CategoryTabs() {
    Row() {
      ForEach(this.categories, (category: CategoryItem) => {
        Column() {
          Text(category.icon)
            .fontSize(16)
          Text(category.name)
            .fontSize(12)
            .fontColor(this.selectedCategory === category.name ? '#FF6B6B' : '#666666')
            .fontWeight(this.selectedCategory === category.name ? FontWeight.Bold : FontWeight.Normal)
            .margin({ top: 4 })
        }
        .width(48)
        .height(48)
        .backgroundColor(this.selectedCategory === category.name ? '#FFF0F0' : '#F8F8F8')
        .borderRadius(8)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          this.selectedCategory = category.name;
          this.dishes = SAMPLE_DISHES.filter(dish => dish.category === category.name);
        })
      })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor(Color.White)
    .justifyContent(FlexAlign.SpaceEvenly)
    .margin({ top: 8, bottom: 8 })
    .borderRadius(16)
  }

  @Builder DishGrid() {
    Grid() {
      ForEach(this.dishes, (item: DishItem) => {
        GridItem() {
          Column() {
            Stack() {
              Image(item.image)
                .width('100%')
                .height(160)
                .borderRadius({ topLeft: 12, topRight: 12 })
                .objectFit(ImageFit.Cover)

              if (item.tag) {
                Text(item.tag)
                  .fontSize(12)
                  .fontColor(Color.White)
                  .backgroundColor('#FF4081')
                  .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                  .borderRadius({ topLeft: 12, bottomRight: 12 })
                  .position({ x: 0, y: 0 })
              }
            }

            Column() {
              Text(item.name)
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ top: 8 })
              
              if (item.description) {
                Text(item.description)
                  .fontSize(12)
                  .fontColor('#999999')
                  .margin({ top: 4 })
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
              }

              Row() {
                Text(`¥${item.price.toFixed(2)}`)
                  .fontSize(18)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#FF4081')
                Blank()
                Button({ type: ButtonType.Circle }) {
                  Stack() {
                    Circle()
                      .width(24)
                      .height(24)
                      .fill('#FF4081')
                    Text('+')
                      .fontSize(18)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(Color.White)
                  }
                }
                .width(24)
                .height(24)
                .scale(this.animatingItems.has(item.id) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 })
                .onClick(() => {
                  this.cartModel.addToCart(item.id);
                  eventBus.emit('cart-updated');
                  this.animatingItems.add(item.id);
                  animateTo({ duration: 300, curve: Curve.Smooth }, () => {
                    this.animatingItems.delete(item.id);
                  });
                })
              }
              .width('100%')
              .margin({ top: 8 })

              Row() {
                Text(`月售${item.sales || 0}`)
                  .fontSize(12)
                  .fontColor('#999999')
              }
              .margin({ top: 2 })
            }
            .width('100%')
            .padding(12)
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius(12)
        }
      })
    }
    .width('100%')
    .padding(16)
    .columnsTemplate('1fr 1fr')
    .columnsGap(12)
    .rowsGap(12)
  }

  @Builder CartButton() {
    Button() {
      Stack() {
        Image($r('app.media.ic_cart'))
          .width(24)
          .height(24)
        if (this.cartItemCount > 0) {
          Text(this.cartItemCount.toString())
            .fontSize(12)
            .fontColor(Color.White)
            .backgroundColor('#FF4081')
            .borderRadius(10)
            .padding(4)
            .position({ x: 12, y: -8 })
        }
      }
    }
    .width(48)
    .height(48)
    .position({ x: '85%', y: '80%' })
    .backgroundColor('#FF4081')
    .borderRadius(24)
    .onClick(() => {
      router.pushUrl({
        url: 'pages/CartPage',
        params: {
          dinerCount: this.dinerCount,
          tableId: this.tableId
        }
      });
    })
  }

  handleAddToCart(dish: DishItem) {
    this.cartModel.addToCart(dish.id);
    this.cartItemCount = this.cartModel.getTotalCount();
    promptAction.showToast({ message: `已添加${dish.name}` });
  }

  handleRemoveFromCart(dish: DishItem) {
    this.cartModel.removeFromCart(dish.id);
    this.cartItemCount = this.cartModel.getTotalCount();
    promptAction.showToast({ message: `已减少${dish.name}` });
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column() {
        this.TopBar()
        
        Scroll() {
          Column() {
            this.RecommendedDishes()
            this.CategoryTabs()
            this.DishGrid()
          }
        }
        .scrollBar(BarState.Off)
        .scrollable(ScrollDirection.Vertical)
        .layoutWeight(1)
        .backgroundColor('#F5F5F5')
      }
      .width('100%')
      .height('100%')

      this.CartButton()
    }
  }
}