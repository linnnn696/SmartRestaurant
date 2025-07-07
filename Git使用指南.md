# Git 使用指南 by lin

## 一、保存新版本

每当完成一个功能或修复后，按以下步骤保存：

```bash
#（一）本地提交与标签管理
# 1. 查看修改了哪些文件
git status

# 2. 添加修改的文件到暂存区
git add .    # 添加所有修改


# 3. 提交修改（创建新版本）
git commit -m "描述信息"    # 例如：git commit -m "添加购物车功能"

# （可选）4. 创建本地标签（用于标记版本，如发布新版本时）
git tag v版本号    # 例如 git tag v5.3 ，也可结合 -a、-m 细化，如 git tag -a v2.0 -m "完成订单管理功能" 

#（二）推送到远程仓库（GitHub 等
# 1. 推送提交到远程仓库主分支（若之前仅本地提交）
git push origin main  

# （可选）2. 若创建了本地标签，推送标签到远程仓库 
git push origin v版本号    # 例如 git push origin v5.3




 
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

## 六、发布新版本

发布新版本时，建议使用Git标签（tag）来标记版本号。步骤如下：

```bash
# 1. 确保所有更改已提交
git status    # 检查是否有未提交的更改

# 2. 创建新的标签
git tag -a v版本号 -m "版本描述"
# 例如：git tag -a v2.0 -m "完成订单管理功能"

# 3. 推送标签到GitHub
git push origin v版本号
# 例如：git push origin v2.0

# 4. 查看所有标签
git tag    # 显示所有标签列表
```

### 处理大文件问题

如果推送时遇到大文件（>50MB）导致的错误：

1. 将大文件添加到 .gitignore：
```bash
# 在 .gitignore 中添加大文件
echo "大文件路径" >> .gitignore
```

2. 从Git历史中删除大文件：
```bash
# 删除大文件的Git历史
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch 大文件路径' --prune-empty --tag-name-filter cat -- --all

# 强制更新仓库
git push origin --force --all
git push origin --force --tags
```

3. 清理本地Git仓库：
```bash
# 清理和回收空间
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
``` 