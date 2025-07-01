import router from '@ohos.router';

@Entry
@Component
struct Index {
  build() {
    router.replaceUrl({ url: 'pages/HomePage' });
    // 可选：返回一个空页面
    Column() {}
  }
}