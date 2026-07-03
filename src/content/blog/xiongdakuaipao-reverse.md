---
title: 记一次对游戏熊大快跑的逆向实操
description: 针对熊出没之熊大快跑这款 IL2CPP Unity 手游，使用 Frida 编写锁血脚本的完整逆向流程记录。
cover: /images/b4a45161fe2670bd56a22905a35901f513d21c4e.jpg@1192w.avif
coverPosition: center 35%
pubDate: 2026-07-03
tags:
  - reverse
  - frida
  - android
  - unity
categories:
  - 笔记
  - 逆向
---

# 前情提要
几周前，我们网络空间安全学院的老师邀请我上台为同学们做一次有关**安卓逆向**的分享。想到我最近学了**frida**，于是我决定针对**熊大快跑**这款游戏写一个**frida脚本**进行分享，这个脚本主要用于实现**锁血**功能（即碰到各类碰撞物不会掉血、不会死亡）。 
# 背景知识
## Unity游戏的编译方式
Unity游戏会有两类**编译方式**，一种是**Mono**，一种是**IL2CPP**。接下来简单介绍一下两种编译方式。
### Mono
**Mono**采用 **即时编译（JIT）** 作为Unity的脚本**执行方式**。在 JIT 模式下，**C# 脚本**编译后生成的是**中间语言（IL）程序集**，这些程序集以**托管 DLL**的形式存储在**Managed目录**下，且未经过**加密**或**混淆**（除非手动处理），自带**Mono虚拟机**。当游戏运行时，JIT 会将这些 IL 代码实时翻译为本地**机器码**。这种Unity即时编译的方式通常意味着逆向的难度不会很高，我们直接利用**dnspy**对游戏的dll进行逆向修改就行，在加载的时候，修改的数据就会生效。

### IL2CPP
**IL2CPP** 是 Unity 主流**脚本后端**，作用是把 **C#** 生成的 **IL 中间语言**转为**C++源码**，再编译成各平台**原生二进制文件**，打包后无**明文C#dll**，仅留存 **GameAssembly二进制**与**global-metadata.dat 元数据**。运行时依靠自研 C++ 运行时完成 GC、反射、托管交互，全程 AOT 编译，不支持 JIT，厂商也会通过为元数据**加壳、加混淆**来防止逆向，逆向更加困难。

## Frida
**Frida**是一种**跨平台**的**动态插桩**工具，核心原理是运行时向目标进程注入**自定义**的**JavaScript代码**，**无需**修改程序二进制、**不用**重打包即可调试。工具分为**设备端** frida-server 与**电脑端**交互程序，通过编写 JSHook 脚本，能够达到**拦截任意函数**，**修改入参、返回值**，**读写进程内存、枚举模块与符号**、**主动调用内部函数**的效果。
# 具体流程
## 一、查看基本信息和相关dll、C#文件
### 基本信息
1. 在**雷电模拟器**中下载安装游戏**熊出没之熊大快跑**，用**MT管理器**查看相关信息：
![](/images/blog/xiongdakuaipao/qq-1782985048428-1.png)
显然**没有加固**。
2. 导出安装包，在win端解压apk，进入**lib文件夹**内查看**so文件**（路径类似于..\熊出没之熊大快跑\lib\arm64-v8a），很明显可以看到有一个叫l**ibil2cpp.so**的so文件，基本可以断定这就是一个**IL2CPP**架构的Unity手游，同时也是一个**ARM64**架构的游戏。
![](/images/blog/xiongdakuaipao/qq-1782985426846.png)
这个**libil2cpp.so**是 Android 平台**IL2CPP**编译Unity游戏的**核心动态库文件**，等同于 Windows 的 **GameAssembly.dll**。
### 相关dll、C#以及配置文件
1. 打开**IL2CppDumper**，选择**libil2cpp.so**，接着选**global-metadata.dat**（路径类似于..\熊出没之熊大快跑\assets\bin\Data\Managed\Metadata\global-metadata.dat），等待几分钟它就会为你dump出**相关dll、C#以及配置文件**在**IL2CppDumper的目录**下：
![](/images/blog/xiongdakuaipao/qq-1782986573568.png)
![](/images/blog/xiongdakuaipao/qq-1782986594558.png)
![](/images/blog/xiongdakuaipao/qq-1782986094116.png)
不过你也可以在**cmd**中选择自己创的**output文件夹**作为**存储对象**：
![](/images/blog/xiongdakuaipao/qq-1782986495262.png)
然后你就会拥有相关dll、C#以及配置文件了。
![](/images/blog/xiongdakuaipao/qq-1782986726473.png)

## 二、静态分析
在获取到相关文件后，我们就可以进行静态分析了，静态分析我这里给出三种方法：
### 1.直接分析dump.cs
我们打开dump.cs这个文件可以直接在这里面看到该游戏用到的**方法名**（看不到具体的方法内容）、**虚拟地址（VA）**、**相对虚拟地址（RVA）**、**偏移地址（offest）**，根据这些信息我们就已经可以写一个frida脚本来hook有关函数实现锁血了。
### 2.利用dnspy分析
同样的我们也可以用分析Mono的方法分析这些dump下来的文件，打开**DummyDll**，用dnspy打开文件**Assembly-CSharp.dll**，但与Mono不同的是我们无法直接通过修改来实现我们的功能，和打开dump.cs的内容差不多，都是只包含用到的**游戏方法名**、**VA**、**RVA**和**offest**。分析这个同样能写出frida脚本来hook有关函数实现锁血。与直接分析dump.cs不同的是，这种方法更**直观**一点也更**容易**分析。
### 3.利用IDA辅助分析
说到逆向里的静态分析，**IDA**肯定是一座绕不过的大山了，我们可以通过IDA分析含有**游戏逻辑**的**libil2cpp.so文件**，然而分析这个so文件时符号表被摘去了，我们很难直接进行去分析，我们同样可以通过IL2CppDumper尽心一个**符号表修复**。
#### 符号表修复
用ida打开**libil2cpp.so**，选择左上角的**File**，选择**Script file**，选择**IL2CppDumper文件夹**下**ida_with_struct_py3.py**,选择我们之前dump下来的**script.json**（这里面是游戏的几乎所有的符号信息），选择**头文件il2cpp.h**，然后等待5-10分钟处理完成。
![](/images/blog/xiongdakuaipao/qq-1783065623735.png)
![](/images/blog/xiongdakuaipao/qq-1783066141043.png)
![](/images/blog/xiongdakuaipao/qq-1783066160971.png)
#### ida分析
完成**符号表修复**后就可以在左边function栏目中选择你想要的函数进行分析了，可以分析其的**真实业务逻辑**（前两种方式分析不到的内容）了。
示例图：
![](/images/blog/xiongdakuaipao/qq-1783066582155.png)
## 三、frida实现锁血
在静态分析游戏的业务逻辑后，我们就可以编写脚本了。这里我给出一个JS脚本：
``` JavaScript
'use strict';

const CONFIG = {
    packageName: 'com.joym.xiongdakuaipao.uc',
    libName: 'libil2cpp.so',
    offsetInvincible: 0xA9,
    offsetLife: 0x1D0,
    hookDelayMs: 500,
    pollIntervalMs: 2000,
    logHooks: true,
    rva: {
        get_life: 0x1234DC0,
        set_life: 0x1234DD0,
        Awake: 0x1234DE0,
        StartGame: 0x1236080,
        SetInvincible: 0x123FBB0,
        OnHitObstacleForScoreRace: 0x123D16C,
        SetDead: 0x1239B64,
        ShowDeadUI: 0x124316C,
        PlayDieAnim: 0x12430E8,
        DoHurt: 0x12487D0,
        ForkHurt: 0x1248AA0,
        playDie: 0x1256AD8,
        BearGameInfimpl_OnHurt: 0xFBAD74,
    },
};  

let maxLife = 3;
let hooksInstalled = false;
let playerInstance = null;
let pollCount = 0; 

function log(msg) {
    console.log('[锁血] ' + msg);
} 

(function antiDetect() {
    const needles = ['frida', 'FRIDA', 'gum-js-loop', 'gmain', 'linjector', 're.frida.server'];
    try {
        const strstr = Module.findExportByName('libc.so', 'strstr');
        if (strstr) {
            Interceptor.attach(strstr, {
                onEnter: function (args) {
                    try { this.n = args[1].readCString(); } catch (e) { this.n = null; }
                },
                onLeave: function (retval) {
                    if (!this.n) return;
                    for (let i = 0; i < needles.length; i++) {
                        if (this.n.indexOf(needles[i]) >= 0) { retval.replace(ptr(0)); break; }
                    }
                },
            });
        }
    } catch (e) { }
})();

function findIl2Cpp() {
    return Process.findModuleByName(CONFIG.libName);
}  

function forceFullHp(self) {
    if (!self || self.isNull()) return;
    try {
        self.add(CONFIG.offsetInvincible).writeU8(1);
        self.add(CONFIG.offsetLife).writeS32(maxLife);
    } catch (e) { }
}
 
function trackPlayer(self) {
    if (self && !self.isNull()) playerInstance = self;
}

function blockIl2CppVoid(addr, name, argTypesBeforeMethodInfo) {
    if (!addr || addr.isNull()) {
        log('跳过 ' + name);
        return;
    }
    const types = ['pointer'].concat(argTypesBeforeMethodInfo || []).concat(['pointer']);
    Interceptor.replace(addr, new NativeCallback(function () {
        const self = arguments[0];
        if (CONFIG.logHooks) log('拦截 ' + name);
        trackPlayer(self);
        forceFullHp(self);
    }, 'void', types));
    log('阻断 ' + name);
} 

function blockIl2CppPtr(addr, name, argTypesBeforeMethodInfo) {
    if (!addr || addr.isNull()) return;
    const types = ['pointer'].concat(argTypesBeforeMethodInfo || []).concat(['pointer']);
    Interceptor.replace(addr, new NativeCallback(function () {
        const self = arguments[0];
        if (CONFIG.logHooks) log('拦截 ' + name);
        trackPlayer(self);
        forceFullHp(self);
        return NULL;
    }, 'pointer', types));
    log('阻断 ' + name);
} 

function installHooks(lib) {
    if (hooksInstalled) return;
    hooksInstalled = true; 
    const base = lib.base;
    log('libil2cpp @ ' + base + '  size=' + lib.size);

    function a(key) { return base.add(CONFIG.rva[key]); }
    ['Awake', 'StartGame'].forEach(function (key) {
        Interceptor.attach(a(key), {
            onEnter: function (args) {
                trackPlayer(args[0]);
                if (CONFIG.logHooks) log('实例 @ ' + key);
            },
        });
    });
    Interceptor.attach(a('set_life'), {
        onEnter: function (args) {
            trackPlayer(args[0]);
            const v = args[1].toInt32();
            if (v > maxLife) maxLife = v;
            if (v < maxLife) {
                if (CONFIG.logHooks) log('set_life ' + v + ' -> ' + maxLife);
                args[1] = ptr(maxLife);
            }
        },
    }); 
    Interceptor.attach(a('get_life'), {
        onLeave: function (retval) {
            const v = retval.toInt32();
            if (v > maxLife) maxLife = v;
        },
    });  
    Interceptor.attach(a('SetInvincible'), {
        onEnter: function (args) {
            trackPlayer(args[0]);
            args[1] = ptr(0x7F7FFFFF);
            forceFullHp(args[0]);
        },
    });
    blockIl2CppVoid(a('DoHurt'), 'DoHurt', []);
    blockIl2CppVoid(a('SetDead'), 'SetDead', ['int']);
    blockIl2CppVoid(a('ShowDeadUI'), 'ShowDeadUI', []);
    blockIl2CppVoid(a('ForkHurt'), 'ForkHurt', ['pointer']);
    blockIl2CppPtr(a('PlayDieAnim'), 'PlayDieAnim', ['int']);
    blockIl2CppVoid(a('OnHitObstacleForScoreRace'), 'OnHitObstacleForScoreRace', []);
    blockIl2CppVoid(a('playDie'), 'ModelControl.playDie', ['int']);
    blockIl2CppVoid(a('BearGameInfimpl_OnHurt'), 'BearGameInfimpl.OnHurt', []);
    setInterval(function () {
        if (playerInstance && !playerInstance.isNull()) forceFullHp(playerInstance);
    }, 500); 
    log('Hook 完成 | maxLife=' + maxLife);
} 

function tryInstall() {
    const lib = findIl2Cpp();
    if (!lib) return false;
    setTimeout(function () {
        try { installHooks(lib); }
        catch (e) { log('Hook 失败: ' + e + '\n' + e.stack); }
    }, CONFIG.hookDelayMs);
    return true;
}

function hookDlopen() {
    [['linker64', 'android_dlopen_ext'], ['linker64', 'dlopen'],
        ['libdl.so', 'android_dlopen_ext'], ['libdl.so', 'dlopen']].forEach(function (p) {
        const addr = Module.findExportByName(p[0], p[1]);
        if (!addr) return;
        Interceptor.attach(addr, {
            onEnter: function (args) {
                try { this.path = args[0].readCString(); } catch (e) { this.path = null; }
            },
            onLeave: function () {
                if (this.path && this.path.indexOf('il2cpp') >= 0) tryInstall();
            },
        });
    });
}

function pollLoop() {
    if (hooksInstalled) return;
    pollCount++;
    if (findIl2Cpp()) {
        log('发现 libil2cpp.so');
        tryInstall();
        return;
    }
    if (pollCount % 3 === 0) {
        log('等待 libil2cpp.so... (请进入跑酷关卡) #' + pollCount);
    }
    setTimeout(pollLoop, CONFIG.pollIntervalMs);
} 
console.log('========================================');
console.log('  熊大快跑 锁血');
console.log('  ' + CONFIG.packageName);
console.log('========================================'); 

hookDlopen();

if (!tryInstall()) pollLoop();
```
然后我们通过frida附加程序的方式，输入命令：
```PowerShell
adb devices   //检查设备
adb shell "su -c '/data/local/tmp/frida-server -D &'"   //推送frida-server程序
frida-ps -U        //检查游戏进程和看游戏PID
frida -U <PID> -l lock_hp.js(脚本名)   //注入脚本
```

然后就成功实现锁血效果了。
## 需要注意的点
- 一定要看自己的**模拟器/真机架构**和**游戏架构**是否是同一种
- frida设备端和电脑端**版本**要一致
- 需要**root**
- 等**libil2cpp.so**加载后再**hook**