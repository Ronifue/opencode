# OpenCode CLI 汉化指南

本文档旨在说明如何手动汉化 OpenCode CLI 的 TUI 界面，并分析其面临的覆盖风险。

## 1. 汉化核心文件

由于 TUI 界面目前主要采用硬编码（Hardcoded）的英文文本，你需要手动修改 `packages/opencode/src/cli/cmd/tui/` 目录下的源码文件。

### 关键修改位置：

*   **主菜单与命令面板**：`packages/opencode/src/cli/cmd/tui/app.tsx`
    *   定义了所有全局操作的名称，如 `"Switch session"`、`"New session"`、`"Help"` 等。
*   **启动提示 (Tips)**：`packages/opencode/src/cli/cmd/tui/component/tips.tsx`
    *   修改 `TIPS` 数组中的英文描述。
*   **帮助界面**：`packages/opencode/src/cli/cmd/tui/ui/dialog-help.tsx`
    *   汉化快捷键说明和帮助引导文本。
*   **权限确认**：`packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx`
    *   翻译诸如 `"Always allow"`、`"Confirm"`、`"Reject"` 等交互按钮。
*   **状态与对话框**：
    *   `packages/opencode/src/cli/cmd/tui/component/dialog-status.tsx`
    *   `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx`

## 2. 编译与打包步骤

修改源码后，你需要重新编译生成适用于你平台的二进制文件。

1.  **环境准备**：确保已安装 [Bun](https://bun.sh/)。
2.  **安装依赖**：
    ```bash
    bun install
    ```
3.  **编译二进制**：
    进入 `packages/opencode` 目录并运行：
    ```bash
    bun run script/build.ts --single
    ```
4.  **替换程序**：
    编译产物位于 `packages/opencode/dist/opencode-<platform>-<arch>/bin/opencode`。将该文件替换你系统中现有的 `opencode` 可执行文件。

## 3. 热更新与覆盖风险分析

### 3.1 覆盖风险（高）
OpenCode 具有内置的升级机制。当你运行 `opencode upgrade` 时，官方会下载最新的预编译二进制文件并**直接覆盖**你的本地汉化版。

### 3.2 自动更新（需禁用）
CLI 默认会检查版本更新。为了防止汉化被意外覆盖，建议在全局配置 `~/.config/opencode/opencode.json` 中禁用自动更新：

```json
{
  "autoupdate": false
}
```

### 3.3 热更新（Web 代理）
OpenCode CLI 会代理 Web UI（`https://app.opencode.ai`）。这部分内容是动态加载的：
*   **TUI 界面字符串**：固化在二进制中，不会被动态热更新。
*   **Web 侧页面**：由云端控制，无法通过修改本地二进制来汉化。

## 4. 维护建议
建议将你的汉化修改记录在 Git 补丁中。每次官方发布新版本时：
1. 拉取最新源码。
2. 应用汉化补丁。
3. 重新编译二进制。

## 附录：关于运行环境的常见问题

### 为什么必须使用 Bun 而不能用 Node.js？
OpenCode 深度集成了 **Bun** 的专属特性：
*   **原生 API**：代码中大量使用了 `Bun.file`、`Bun.serve`、`Bun.spawn` 等高性能原生 API。
*   **TUI 性能**：TUI 框架 `@opentui/solid` 专为 Bun 的事件循环优化。
*   **启动速度**：作为 CLI 工具，Bun 的毫秒级启动速度远优于 Node.js。

### 为什么必须通过编译封装（Build）运行？
虽然可以在开发环境下通过 `bun src/index.ts` 运行，但正式发布版通过编译封装有以下优势：
*   **零依赖分发**：将所有依赖和静态解析器打包进一个 100MB 左右的单文件，用户无需配置环境。
*   **资源嵌入**：TUI 所需的解析器等二进制组件会嵌入在可执行文件中，确保运行时的完整性。
