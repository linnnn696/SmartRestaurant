import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { DishItem, DISH_CATEGORIES, CategoryItem, CartModel, eventBus } from '../model/DishModel';
import { MenuService, MenuItem } from '../service/MenuService';

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
  @State dishes: MenuItem[] = [];
  @State recommendedDishes: MenuItem[] = [];
  @State isLoading: boolean = true;
  @State isRefreshing: boolean = false;
  private cartModel: CartModel = CartModel.getInstance();
  @State categories: CategoryItem[] = DISH_CATEGORIES;
  private allDishes: MenuItem[] = [];
  private cartUpdateCallback = () => {
    this.cartItemCount = this.cartModel.getTotalCount();
  };

  @State private animatingItems: Set<string> = new Set<string>()

  // 加载所有菜品数据
  private async loadAllDishes() {
    try {
      this.isLoading = true;
      // 获取所有菜品数据
      this.allDishes = await MenuService.getAllMenuItems();
      
      // 更新当前分类显示
      this.updateDisplayedDishes();
      
      // 更新推荐菜品
      this.updateRecommendedDishes();
    } catch (error) {
      console.error('获取菜品数据失败:', error);
      promptAction.showToast({
        message: '获取菜品数据失败，请检查网络连接',
        duration: 2000
      });
    } finally {
      this.isLoading = false;
      this.isRefreshing = false;
    }
  }

  // 更新当前显示的菜品
  private updateDisplayedDishes() {
    this.dishes = this.allDishes.filter(dish => dish.category === this.selectedCategory);
  }

  // 更新推荐菜品
  private updateRecommendedDishes() {
    this.recommendedDishes = this.allDishes
      .filter(dish => dish.tag?.includes('推荐') || dish.tag?.includes('特色') || dish.tag?.includes('招牌'))
      .slice(0, 4);
  }

  async aboutToAppear() {
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

    // 加载数据
    await this.loadAllDishes();
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
      Text('！！！店长主推 不好吃不要钱！！！')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontFamily('HarmonyHeiTi-Medium')
        .fontStyle(FontStyle.Normal)
        .margin({ left: 16, bottom: 4 })
        .decoration({ type: TextDecorationType.None })

      Scroll() {
        Row() {
          ForEach(this.recommendedDishes, (dish: MenuItem) => {
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
                  .margin({ top: 2 })
              }
              .alignItems(HorizontalAlign.Start)
              .width('100%')
              .padding({ top: 4 })
            }
            .width(150)
            .padding(6)
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
    .margin({ bottom: 8 })
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
            .margin({ top: 2 })
        }
        .width(48)
        .height(44)
        .backgroundColor(this.selectedCategory === category.name ? '#FFF0F0' : '#F8F8F8')
        .borderRadius(8)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          this.selectedCategory = category.name;
          this.updateDisplayedDishes();
        })
      })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    .backgroundColor(Color.White)
    .justifyContent(FlexAlign.SpaceEvenly)
    .margin({ top: 4, bottom: 4 })
    .borderRadius(16)
  }

  @Builder DishGrid() {
    Grid() {
      ForEach(this.dishes, (item: MenuItem) => {
        GridItem() {
          Column() {
            Stack() {
              Image(item.image)
                .width('100%')
                .height(140)
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
                .margin({ top: 6 })
              
              if (item.description) {
                Text(item.description)
                  .fontSize(12)
                  .fontColor('#999999')
                  .margin({ top: 2 })
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
              .margin({ top: 6 })

              Row() {
                Text(`月售${item.sales || 0}`)
                  .fontSize(12)
                  .fontColor('#999999')
              }
              .margin({ top: 2 })
            }
            .width('100%')
            .padding(8)
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius(12)
        }
      })
    }
    .width('100%')
    .padding(12)
    .columnsTemplate('1fr 1fr')
    .columnsGap(8)
    .rowsGap(8)
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

  handleAddToCart(dish: MenuItem) {
    this.cartModel.addToCart(dish.id);
    this.cartItemCount = this.cartModel.getTotalCount();
    promptAction.showToast({ message: `已添加${dish.name}` });
  }

  handleRemoveFromCart(dish: MenuItem) {
    this.cartModel.removeFromCart(dish.id);
    this.cartItemCount = this.cartModel.getTotalCount();
    promptAction.showToast({ message: `已减少${dish.name}` });
  }

  build() {
    Column() {
      this.TopBar()

      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(32)
            .height(32)
            .margin({ bottom: 12 })
          Text('正在加载菜品数据...')
            .fontSize(14)
            .fontColor('#666666')
        }
        .width('100%')
        .height('80%')
        .justifyContent(FlexAlign.Center)
      } else {
        Refresh({ refreshing: $$this.isRefreshing }) {
          Scroll() {
            Column() {
              this.RecommendedDishes()
              this.CategoryTabs()
              this.DishGrid()
            }
          }
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        }
        .onRefreshing(async () => {
          await this.loadAllDishes();
        })
      }

      // 购物车按钮
      if (this.cartItemCount > 0) {
        Button() {
          Row() {
            Image($r('app.media.ic_cart'))
              .width(24)
              .height(24)
              .fillColor(Color.White)
            Text(`${this.cartItemCount}`)
              .fontSize(16)
              .fontColor(Color.White)
              .margin({ left: 8 })
          }
        }
        .width(80)
        .height(40)
        .backgroundColor('#FF4081')
        .borderRadius(20)
        .margin({ bottom: 16 })
        .onClick(() => {
          router.pushUrl({
            url: 'pages/CartPage',
            params: {
              dinerCount: this.dinerCount,
              tableId: this.tableId
            }
          });
        })
        .position({ x: '50%', y: '90%' })
        .translate({ x: '-50%', y: '-50%' })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}