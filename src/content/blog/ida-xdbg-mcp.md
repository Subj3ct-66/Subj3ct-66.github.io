---
title: 如何利用MCP协议来实现agent自动逆向
description: 这篇文章旨在帮助我们实现agent自动逆向.
cover: /images/ca02e2d6753440e1fbf62be6300f4c95503d54d7.jpg@1192w.avif
pubDate: 2026-05-22
tags:
  - mcp
  - agent
  - reverse
categories:
  - 教程
---

# 什么是MCP

简单来说 **MCP协议** 就像是一个**USB接口**,是让 **LLM(大模型)** 可以通过这个USB接口实现调用工具(例如我们今天要搭建的 **IDA Pro MCP** 和 **x64dbg MCP**，就和电脑接上鼠标后就可以控制光标操作一样， **LLM** 也可以读取**IDA pro** 和 **x64dbg** 的**信息**，以及实现**下断点**、**动调**等功能)。
# IDA  Pro MCP的搭建
## 关于IDA Pro版本的选择
我这里使用的是8.3和9.3的版本(因为有的插件只能在低版本上运行)，总体流程都差不多。
### 关于8.3的版本安装
这里使用的是吾爱破解提供的安装包:
<https://down.52pojie.cn/Tools/Disassemblers/IDA_Pro_v8.3_Portable.zip>
下载后使用 **`IDA_Pro_8.3_绿化工具.exe`** 完成8.3版本的安装。
### 关于9.3的版本安装
这里使用的是看雪社区提供的安装包:
<[[分享]【全平台】IDA Pro 9.3 泄露版+注册机-安全工具-看雪安全社区｜专业技术交流与安全研究论坛](https://bbs.kanxue.com/thread-289611.htm)>
解压完后运行脚本 **`All_Platform_93idakeygen.py`** 完成9.3版本的安装。
## 关于ida-pro-mcp的安装
这里提供一个github上关于ida mcp的项目链接:
<[mrexodia/ida-pro-mcp: AI-powered reverse engineering assistant that bridges IDA Pro with language models through MCP.](https://github.com/mrexodia/ida-pro-mcp)>
 以这个链接提供的内容为例，接下来介绍相关步骤：
 1. 在 `..\IDA_Pro_v8.3_Portable\python311` 的路径里打开`cmd` ,输入下面的指令：
 ``` cmd
 python -m pip install https://github.com/mrexodia/ida-pro-mcp/archive/refs/heads/main.zip
 ```
 2. 下载完后进入script文件夹，找到 `ida-pro-mcp.exe` ，打开`cmd`,输入指令:
 ``` cmd
 ida-pro-mcp --install
 ```
 然后选择 **`Streamable HTTP`** ,接着选 **`Project`** ,最后选择 **`cursor`**(我这里使用的是 **`cursor`** ，选什么其实无所谓，不知道选什么选 **`VS Code`** )
 3. 下载完后在 `cmd` 中输入
 ``` cmd
 ida-pro-mcp --config
 ```
 查看相关参数，我这里是
 ``` cmd
 {
  "mcpServers": {
    "ida-pro-mcp": {
      "type": "http",
      "url": "http://127.0.0.1:13337/mcp"
    }
  }
}
 ```
## 关于IDA MCP在agent上的配置
我这里使用的是cursor,就以cursor为例(下面都是)，其他的像Cloude，Trae等都差不多。
1. 打开设置，找到 **Tools & Mcp** ,点击 **New Mcp server** ，将之前获得的**相关参数**粘贴进去(注意格式) ，保存退出。
``` json
{
 "mcpServers": {
   "ida-pro-mcp": {
     "type": "http",
     "url": "http://127.0.0.1:13337/mcp"
   }
 }
}
```
1. 用ida打开一个PE文件，看下方**Output**栏目里Mcp有没有加载成功，成功标志大致如下(每个人打开的文件和路径不一样，所以会有偏差)，且cursor中显示绿色可以正常使用工具(不是绿色手动开关下mcp服务试试)。
``` text
[MCP] Autostarting server...
  Config: http://127.0.0.1:13337/config.html
[MCP] Registered instance: PixelMaze.exe (pid=23540, port=13337)
  Discovery file: C:\Users\ASUS\AppData\Roaming\Hex-Rays\IDA Pro\mcp\instances\instance_13337.json
```
3. 至此IDA的MCP服务就搭建完毕了。
# x64dbg MCP的搭建
## 关于x64dbg的安装
这里提供一个吾爱破解的x64dbg下载链接:
<https://down.52pojie.cn/Tools/Debuggers/x64dbg_2026_04_20.zip>
注意x64dbg中不仅有x64dbg，也有x32dbg，它们合称x64dbg。
## 关于x64dbg Mcp的安装
这里提供一个github上关于x64dbg mcp的项目链接:
<[AgentSmithers/x64DbgMCPServer: x64DbgMCPServer made from c# with Claude, Windsurf and Cursor support](https://github.com/AgentSmithers/x64DbgMCPServer)>
在Releases中下载32位(x86)和64位(x64)压缩包，解压后将里面所有的.dll文件全部剪切到对应的xdbg的plugins文件夹下，至此x64dbg Mcp就安装好了。
## 关于x64dbg Mcp在agent上的配置
仍然在之前的地方继续添加:
``` json
{

  "mcpServers": {
    "AgentSmithers X64Dbg MCP Server": {
      "url": "http://127.0.0.1:50300/sse"
    },
    "IDA MCP": {
      "type": "http",
      "url": "http://127.0.0.1:13337/mcp"

    }
  }
}

```
这里建议将 **`AgentSmithers X64Dbg MCP Server`** 改的短一点，不然cursor会爆黄提示名称太长可能影响工具调用，这里我改为X64Dbg MCP。
``` json
{

  "mcpServers": {
    "X64Dbg MCP": {
      "url": "http://127.0.0.1:50300/sse"
    },
    "IDA MCP": {
      "type": "http",
      "url": "http://127.0.0.1:13337/mcp"
    }
  }
}
```
现在打开xdbg，查看日志会显示,并且cursor会显示绿色可以正常使用工具(不是绿色手动开关下mcp服务试试)。
``` text
[pluginload] x64DbgMCPServer  
[插件,MCP - Agent Smithers] 命令 "MCP_-_Agent_Smithers" 已经注册！  
[插件,MCP - Agent Smithers] 命令 "StartMCPServer" 已经注册！  
[插件,MCP - Agent Smithers] 命令 "StopMCPServer" 已经注册！  
[插件,MCP - Agent Smithers] 命令 "ExecuteDebuggerCommandDirect" 已经注册！  
[插件,MCP - Agent Smithers] 表达式函数“DotNetAdd”已经注册！  
[PLUGIN, MCP - Agent Smithers] Event callback CB_INITDEBUG registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_STOPDEBUG registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_CREATEPROCESS registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_LOADDLL registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_DEBUGEVENT registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_OUTPUTDEBUGSTRING registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_BREAKPOINT registered!  
[PLUGIN, MCP - Agent Smithers] Event callback CB_SYSTEMBREAKPOINT registered!  
[PLUGIN, MCP - Agent Smithers] PluginHandle: 2  
[插件] MCP - Agent Smithers v1 已经载入！  
Starting MCPServer  
MCP server lising on +:50300  
MCP server started. CurrentlyDebugging: True IsRunning: True  
MCPServer Started
```
至此x64dbg的MCP服务就搭建完成了。
# 之后
现在我们已经为agent搭建好了IDA Pro和x64dbg的MCP服务，你的agent已经具有了独立完成Windows逆向工作的能力了，快去试试吧`\o/\o/\o/`!!!