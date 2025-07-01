# Git 使用指南 by lin

## 一、保存新版本

每当完成一个功能或修复后，按以下步骤保存：

```bash
# 1. 查看修改了哪些文件
git status

# 2. 添加修改的文件到暂存区
git add .    # 添加所有修改
# 或者
git add 文件名    # 添加特定文件

# 3. 提交修改（创建新版本）
git commit -m "描述信息"    # 例如：git commit -m "添加购物车功能"

# 4. 推送到GitHub
git push origin main
```

## 二、查看版本历史

```bash
# 查看提交历史
git log    # 显示详细信息
# 或者
git log --oneline    # 显示简洁版本
```

## 三、版本回退

### 方式一：回退到上一个版本

```bash
# 回退到上一个版本
git reset --hard HEAD^    # 一个^表示上一个版本
# 或者
git reset --hard HEAD~1   # 数字1表示回退1个版本

# 强制推送到GitHub（因为回退了，需要强制推送）
git push -f origin main
```

### 方式二：回退到指定版本

```bash
# 1. 先查看提交历史
git log --oneline

# 2. 找到想回退的版本的哈希值（commit ID）
# 例如：abc1234 添加购物车功能

# 3. 回退到该版本
git reset --hard abc1234    # 替换为实际的哈希值

# 4. 强制推送到GitHub
git push -f origin main
```

### 如果回退错了想反悔

```bash
# 1. 查看所有操作历史（包括回退的记录）
git reflog

# 2. 找到想恢复的版本的哈希值
# 3. 使用reset恢复
git reset --hard 版本哈希值
```

## 四、重要提示

1. 提交版本时，commit信息要写清楚做了什么修改
2. 回退版本是危险操作，确保重要代码已经保存
3. 使用`git push -f`要小心，它会覆盖远程仓库的历史
4. 建议重要功能开发时创建新分支，这样主分支始终保持稳定

## 五、常见commit信息规范

- feat: 新功能
- fix: 修复bug
- docs: 文档更改
- style: 代码格式修改
- refactor: 重构代码
- test: 测试用例修改
- chore: 其他修改

例如：
- git commit -m "feat: 添加购物车功能"
- git commit -m "fix: 修复订单页面显示bug"
- git commit -m "docs: 更新README文档" 