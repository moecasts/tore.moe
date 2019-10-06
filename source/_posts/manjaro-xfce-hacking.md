---
title: Manjaro Xfce 折腾日志
slug: manjaro-xfce-hacking
date: 2019-08-18 12:59:28
thumbnail: https://s2.ax1x.com/2019/10/06/ug3ywR.png
categories:
- Hacking
tags:
- Manjaro
- Linux
- Hacking
---

## 安装系统

### 准备

[rufus](https://rufus.ie/)
[manjaro xfce](https://manjaro.org/download/xfce/)
[>=4G 的 U盘]



### 写入镜像

使用 rufus 根据提示写入镜像。



### 安装

重启，进入 bios，选择写入镜像的启动盘。

启动后，即可进入安装界面。

根据提示设置即可。

> 安装时请选英文作为默认语言，以免后期出现不必要的麻烦（文件夹名等）。

## 配置

### 设置官方镜像源

```bash
# 更新镜像排行
sudo pacman-mirrors -i -c China -m rank
# 更新数据源
sudo pacman -Syy
# 更新 archlinux 签名
sudo pacman -S archlinux-keyring
```

### 设置 archlinuxcn 源

```bash
# 修改配置文件
sudo vi /etc/pacman.conf

# 在文件末尾添加
[archlinuxcn]
SigLevel = Optional TrustedOnly
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch

# 关闭并保存文件
:wq!

# 导入GPG Key
sudo pacman -Syy
sudo pacman -S archlinuxcn-keyring
```



## 常用工具

### Yay

[Arch User Repository](https://wiki.archlinux.org/index.php/Arch_User_Repository) （常被称作 AUR），是一个为 Arch 用户而生的社区驱动软件仓库。

AUR 包含了不直接被 [Arch Linux](https://www.archlinux.org/) 官方所背书的软件。如果有人想在 Arch 上发布软件或者包，它可以通过这个社区仓库提供。这让最终用户们可以使用到比默认仓库里更多的软件。

 [yay](https://github.com/Jguer/yay) 是下一个最好的 AUR 助手。它使用 Go 语言写成，宗旨是提供最少化用户输入的 `pacman` 界面、yaourt 式的搜索，而几乎没有任何依赖软件。

```bash
# 安装
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```



### Vim

```bash
sudo pacman -S vim
```



### Oh My Zsh!

超受欢迎的，漂亮的命令行配置。

```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```



### 搜狗输入法

- 安装

```bash
sudo pacman -S fcitx-im #默认全部安装
sudo pacman -S fcitx-configtool
sudo pacman -S fcitx-sogoupinyin
```

- 配置

```bash
# sudo vim ~/.xprofile # 如果使用 bash 作为默认 shell
sudo vim ~/.zprofile # 如果使用 zsh 作为默认 shell

# 添加一下内容
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
# 关闭并保存文件
:wq!
```

配置完成后即可以使用 `ctrl+space`切换到搜狗输入法。

- 可能出现的问题

若提示 `请删除.config/SogouPY 并重启` ，则运行

```bash
# 查看错误
sogou-qimpanel

# 如果提示找不到libfcitx-qt.so，安装fcitx-qt4就可以成功解决上述问题。
sudo pacman -S fcitx-qt4
```




### Typora

Linux 平台上超实用 markdown 编辑器。

```bash
sudo pacman -S typora
```



### Google Chrome

```bash
sudo pacman -S google-chrome
```



### 网易云音乐

```bash
sudo pacman -S netease-cloud-music
```



### 深度截图

```bash
sudo pacman -S deepin-screenshot
```



### Tim

由于 deepin-wine-tim 是 AUR 中的软件，所以用 Yay 来安装。

```bash
# 请勿使用 root 身份运行。
yay -S deepin-wine-tim
```



### 微信

和 Tim 一样，用 Yay 安装

```we
# 请勿使用 root 身份运行。
yay -S deepin-wine-wechat
```



### 快速搜索

类似于 Mac 上的 Spotlight，快速搜索，可以自行在配置中添加快捷键。

```bash
yay -S albert
```

> 本文将持续更新。。。
