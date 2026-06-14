---
title: DES算法原理解析
description: 从 IP 置换、16 轮迭代到 IP⁻¹ 逆置换，梳理 DES 分组对称加密的核心流程与密钥调度过程。
cover: /images/b9c0817b25c9ff172674694ff445331e6faeae36.jpg@1192w.avif
coverPosition: center 35%
pubDate: 2026-06-14
tags:
  - crypto
  - des
  - security
categories:
  - 笔记
  - 密码学
---

# 简单介绍

DES 算法是一种分组加密的对称加密算法。

# 流程图

![DES 整体流程图](/images/blog/des/des-flow-overview.png)

# 具体过程

## 一.IP置换

### IP置换表

![IP 置换表](/images/blog/des/des-ip-table.png)

### 置换过程

第一位是 58，就是将原始数据的第五十八位移至第一位，横向以此类推，将所有的原始数据进行 IP 置换。

## 二.迭代

### 迭代流程图（i 从 1 开始）

![DES 迭代流程图](/images/blog/des/des-iteration-flow.png)

其中 Li=Ri-1，Ri=Li-1⊕f(Ri-1,Ki)。

### 迭代具体过程

#### (一)E扩展置换

##### 置换表

![E 扩展置换表](/images/blog/des/des-e-expansion-table.png)

##### 原理

###### 图示

![E 扩展置换图示](/images/blog/des/des-e-expansion-diagram.png)

###### 例子

![E 扩展置换例子](/images/blog/des/des-e-expansion-example.png)

以第二个为例：100010 的原始数据是 0001，增加的前一位 1 是上一个数据 (1101) 的最后一位 1，增加的后一位 0 是下一个数据 (0011) 的第一位 0，以此类推进行 E 扩展置换（第一个与最后一个相连）。

#### (二)与密钥异或

将扩展后的 Ri 与生成的密钥 Ki 异或。

##### 密钥 Ki 的生成

64 位密钥，除去奇偶校验位（第 8、16、24、32、40、48、56、64 位），参与运算的有 56 位。

###### 流程图

![密钥 Ki 生成流程图](/images/blog/des/des-key-schedule-flow.png)

###### 1.置换一(PC-1)

将密钥按表进行置换（置换规则同上）：

![PC-1 置换表](/images/blog/des/des-pc1-table.png)

###### 2.移位

先将原始的 56 bit 密钥分为两个 28 bit 的 Ci-1 和 Di-1，然后按照下表进行移位得到 Ci 和 Di：

![密钥移位表](/images/blog/des/des-key-shift-table.png)

如第一次迭代中 C1 是 C0 左移一位得到的，D1 同理；第三次迭代中 C3 是 C2 左移两位得到的。

最后将 Ci、Di 拼接到一起得到待处理的密钥。

###### 3.置换二(PC-2)

将待处理的密钥按下表进行置换得到密钥 Ki（置换规则同上）：

![PC-2 置换表](/images/blog/des/des-pc2-table.png)

#### (三)S盒压缩

##### 原理图

![S 盒压缩原理图](/images/blog/des/des-sbox-diagram.png)

##### 具体实现（以原始数据 111111 为例）

将两头的 11 拿出来转换为十进制数 3，中间的转化为十进制数 15，得到一个位置 3 行 5 列。

然后按照下表进行转换得到十进制数 13 即 1101：

![S 盒转换表](/images/blog/des/des-sbox-table.png)

#### (四)P置换

按下表进行置换：

![P 盒置换表](/images/blog/des/des-p-box-table.png)

#### (五)将 P 盒置换结果与 Li-1 异或得到 Ri，完成第一次迭代

## 三.IP-1逆置换

将迭代后的数据按下表进行逆置换得到密文：

![IP-1 逆置换表](/images/blog/des/des-ip-inverse-table.png)
