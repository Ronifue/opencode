import { createMemo, createSignal, For } from "solid-js"
import { DEFAULT_THEMES, useTheme } from "@tui/context/theme"

const themeCount = Object.keys(DEFAULT_THEMES).length
const themeTip = `使用 {highlight}/theme{/highlight} 或 {highlight}Ctrl+X T{/highlight} 在 ${themeCount} 个内置主题之间切换`

type TipPart = { text: string; highlight: boolean }

function parse(tip: string): TipPart[] {
  const parts: TipPart[] = []
  const regex = /\{highlight\}(.*?)\{\/highlight\}/g
  const found = Array.from(tip.matchAll(regex))
  const state = found.reduce(
    (acc, match) => {
      const start = match.index ?? 0
      if (start > acc.index) {
        acc.parts.push({ text: tip.slice(acc.index, start), highlight: false })
      }
      acc.parts.push({ text: match[1], highlight: true })
      acc.index = start + match[0].length
      return acc
    },
    { parts, index: 0 },
  )

  if (state.index < tip.length) {
    parts.push({ text: tip.slice(state.index), highlight: false })
  }

  return parts
}

export function Tips() {
  const theme = useTheme().theme
  const parts = parse(TIPS[Math.floor(Math.random() * TIPS.length)])

  return (
    <box flexDirection="row" maxWidth="100%">
      <text flexShrink={0} style={{ fg: theme.warning }}>
        ● 提示{" "}
      </text>
      <text flexShrink={1}>
        <For each={parts}>
          {(part) => <span style={{ fg: part.highlight ? theme.text : theme.textMuted }}>{part.text}</span>}
        </For>
      </text>
    </box>
  )
}

const TIPS = [
  "输入 {highlight}@{/highlight} 后跟文件名即可进行模糊搜索并附加文件",
  "以 {highlight}!{/highlight} 开头发送消息可直接运行 shell 命令 (例如 {highlight}!ls -la{/highlight})",
  "按 {highlight}Tab{/highlight} 在 Build 和 Plan 智能体之间切换",
  "使用 {highlight}/undo{/highlight} 撤销上一条消息和文件更改",
  "使用 {highlight}/redo{/highlight} 恢复之前撤销的消息和文件更改",
  "运行 {highlight}/share{/highlight} 在 opencode.ai 上创建对话的公开链接",
  "将图片拖放到终端中以将其添加为上下文",
  "按 {highlight}Ctrl+V{/highlight} 从剪贴板粘贴图片到提示框",
  "按 {highlight}Ctrl+X E{/highlight} 或输入 {highlight}/editor{/highlight} 在外部编辑器中编写消息",
  "运行 {highlight}/init{/highlight} 根据您的代码库自动生成项目规则",
  "运行 {highlight}/models{/highlight} 或按 {highlight}Ctrl+X M{/highlight} 查看并切换可用的 AI 模型",
  themeTip,
  "按 {highlight}Ctrl+X N{/highlight} 或输入 {highlight}/new{/highlight} 开始新的对话会话",
  "使用 {highlight}/sessions{/highlight} 或按 {highlight}Ctrl+X L{/highlight} 列出并继续之前的对话",
  "运行 {highlight}/compact{/highlight} 在会话接近上下文限制时进行总结",
  "按 {highlight}Ctrl+X X{/highlight} 或输入 {highlight}/export{/highlight} 将对话保存为 Markdown",
  "按 {highlight}Ctrl+X Y{/highlight} 将助手的最后一条消息复制到剪贴板",
  "按 {highlight}Ctrl+P{/highlight} 查看所有可用的操作和命令",
  "运行 {highlight}/connect{/highlight} 为 75 多个受支持的 LLM 提供商添加 API 密钥",
  "引导键是 {highlight}Ctrl+X{/highlight}; 结合其他键可进行快速操作",
  "按 {highlight}F2{/highlight} 快速在最近使用的模型之间切换",
  "按 {highlight}Ctrl+X B{/highlight} 显示/隐藏侧边栏面板",
  "使用 {highlight}PageUp{/highlight}/{highlight}PageDown{/highlight} 浏览对话历史",
  "按 {highlight}Ctrl+G{/highlight} 或 {highlight}Home{/highlight} 跳转到对话开头",
  "按 {highlight}Ctrl+Alt+G{/highlight} 或 {highlight}End{/highlight} 跳转到最新消息",
  "按 {highlight}Shift+Enter{/highlight} 或 {highlight}Ctrl+J{/highlight} 在提示框中添加换行",
  "在输入时按 {highlight}Ctrl+C{/highlight} 可清除输入框",
  "按 {highlight}Escape{/highlight} 可在 AI 响应中途停止",
  "切换到 {highlight}Plan{/highlight} 智能体以获取建议而无需进行实际更改",
  "在提示中使用 {highlight}@智能体名称{/highlight} 以调用专门的子智能体",
  "按 {highlight}Ctrl+X 方向键(右/左){/highlight} 在父子会话之间循环",
  "在项目根目录创建 {highlight}opencode.json{/highlight} 进行项目特定设置",
  "将设置放在 {highlight}~/.config/opencode/opencode.json{/highlight} 中进行全局配置",
  "在配置中添加 {highlight}$schema{/highlight} 以在编辑器中启用自动补全",
  "在配置中设置 {highlight}model{/highlight} 以指定默认模型",
  "通过配置中的 {highlight}keybinds{/highlight} 部分覆盖任何快捷键",
  "将任何快捷键设置为 {highlight}none{/highlight} 以完全禁用它",
  "在 {highlight}mcp{/highlight} 配置部分配置本地或远程 MCP 服务器",
  "OpenCode 自动处理需要身份验证的远程 MCP 服务器的 OAuth",
  "将 {highlight}.md{/highlight} 文件添加到 {highlight}.opencode/command/{/highlight} 以定义可重用的自定义提示",
  "在自定义命令中使用 {highlight}$ARGUMENTS{/highlight}, {highlight}$1{/highlight}, {highlight}$2{/highlight} 进行动态输入",
  "在命令中使用反引号注入 shell 输出 (例如 {highlight}`git status`{/highlight})",
  "将 {highlight}.md{/highlight} 文件添加到 {highlight}.opencode/agent/{/highlight} 以创建专门的 AI 人格",
  "为每个智能体配置 {highlight}edit{/highlight}, {highlight}bash{/highlight} 和 {highlight}webfetch{/highlight} 工具的权限",
  '使用类似 {highlight}"git *": "allow"{/highlight} 的模式设置细粒度的 bash 权限',
  '设置 {highlight}"rm -rf *": "deny"{/highlight} 以阻止破坏性命令',
  '设置 {highlight}"git push": "ask"{/highlight} 以在推送前要求确认',
  "OpenCode 使用 prettier, gofmt, ruff 等工具自动格式化文件",
  '在配置中设置 {highlight}"formatter": false{/highlight} 以禁用所有自动格式化',
  "在配置中为特定文件扩展名定义自定义格式化命令",
  "OpenCode 使用 LSP 服务器进行智能代码分析",
  "在 {highlight}.opencode/tools/{/highlight} 中创建 {highlight}.ts{/highlight} 文件以定义新的 LLM 工具",
  "工具定义可以调用用 Python, Go 等编写的脚本",
  "将 {highlight}.ts{/highlight} 文件添加到 {highlight}.opencode/plugin/{/highlight} 以使用事件钩子",
  "使用插件在会话完成时发送系统通知",
  "创建一个插件以防止 OpenCode 读取敏感文件",
  "使用 {highlight}opencode run{/highlight} 进行非交互式脚本编写",
  "使用 {highlight}opencode --continue{/highlight} 恢复上一个会话",
  "使用 {highlight}opencode run -f file.ts{/highlight} 通过 CLI 附加文件",
  "在脚本中使用 {highlight}--format json{/highlight} 获取机器可读的输出",
  "运行 {highlight}opencode serve{/highlight} 以无头方式访问 OpenCode API",
  "使用 {highlight}opencode run --attach{/highlight} 连接到正在运行的服务器",
  "运行 {highlight}opencode upgrade{/highlight} 升级到最新版本",
  "运行 {highlight}opencode auth list{/highlight} 查看所有配置的提供商",
  "运行 {highlight}opencode agent create{/highlight} 以引导方式创建智能体",
  "在 GitHub Issue/PR 中使用 {highlight}/opencode{/highlight} 触发 AI 操作",
  "运行 {highlight}opencode github install{/highlight} 设置 GitHub 工作流",
  "在 Issue 上评论 {highlight}/opencode fix this{/highlight} 可自动创建 PR",
  "在 PR 代码行上评论 {highlight}/oc{/highlight} 进行针对性的代码审查",
  '使用 {highlight}"theme": "system"{/highlight} 以匹配您终端的颜色',
  "在 {highlight}.opencode/themes/{/highlight} 目录中创建 JSON 主题文件",
  "主题支持深色/浅色两种模式的变体",
  "在自定义主题中引用 0-255 的 ANSI 颜色",
  "在配置中使用 {highlight}{env:变量名}{/highlight} 语法引用环境变量",
  "使用 {highlight}{file:路径}{/highlight} 在配置值中包含文件内容",
  "在配置中使用 {highlight}instructions{/highlight} 加载额外的规则文件",
  "将智能体 {highlight}temperature{/highlight} 设置在 0.0 (专注) 到 1.0 (创意) 之间",
  "配置 {highlight}maxSteps{/highlight} 以限制每个请求的智能体迭代次数",
  '设置 {highlight}"tools": {"bash": false}{/highlight} 以禁用特定工具',
  '设置 {highlight}"mcp_*": false{/highlight} 以禁用来自某个 MCP 服务器的所有工具',
  "在每个智能体配置中覆盖全局工具设置",
  '设置 {highlight}"share": "auto"{/highlight} 以自动分享所有会话',
  '设置 {highlight}"share": "disabled"{/highlight} 以防止任何会话分享',
  "运行 {highlight}/unshare{/highlight} 以取消会话的公开访问",
  "权限 {highlight}doom_loop{/highlight} 可防止无限工具调用循环",
  "权限 {highlight}external_directory{/highlight} 保护项目之外的文件",
  "运行 {highlight}opencode debug config{/highlight} 以排查配置问题",
  "使用 {highlight}--print-logs{/highlight} 标志在 stderr 中查看详细日志",
  "按 {highlight}Ctrl+X G{/highlight} 或输入 {highlight}/timeline{/highlight} 跳转到特定消息",
  "按 {highlight}Ctrl+X H{/highlight} 切换消息中代码块的可见性",
  "按 {highlight}Ctrl+X S{/highlight} 或输入 {highlight}/status{/highlight} 查看系统状态信息",
  "启用 {highlight}tui.scroll_acceleration{/highlight} 以获得平滑的 macOS 风格滚动",
  "通过命令面板 ({highlight}Ctrl+P{/highlight}) 切换聊天中的用户名显示",
  "运行 {highlight}docker run -it --rm ghcr.io/anomalyco/opencode{/highlight} 以在容器中使用",
  "通过 {highlight}/connect{/highlight} 使用 OpenCode Zen 以获取精选且经过测试的模型",
  "将您项目的 {highlight}AGENTS.md{/highlight} 文件提交到 Git 以便团队共享",
  "使用 {highlight}/review{/highlight} 审查未提交的更改、分支或 PR",
  "运行 {highlight}/help{/highlight} 或按 {highlight}Ctrl+X H{/highlight} 显示帮助对话框",
  "使用 {highlight}/details{/highlight} 切换工具执行详情的可见性",
  "使用 {highlight}/rename{/highlight} 重命名当前会话",
  "按 {highlight}Ctrl+Z{/highlight} 挂起终端并返回您的 shell",
]
