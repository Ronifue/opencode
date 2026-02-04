# OpenCode 配置指南 (opencode.json)

本文档详细介绍了 OpenCode 的 `opencode.json`（或 `opencode.jsonc`）配置文件的结构和各项参数，特别针对自定义供应商和模型微调进行了深入讲解。

---

## 一、 全局结构

`opencode.json` 是 OpenCode 的核心配置文件，支持 JSONC 格式（带注释的 JSON）。其主要模块如下：

- **`model`**: 指定主 Agent 使用的默认模型（格式：`provider/model`）。
- **`provider`**: 定义自定义供应商及模型（本文重点）。
- **`agent`**: 配置不同模式（如 `build`, `plan`）下的模型、提示词和权限。
- **`permission`**: 细粒度工具权限控制。
- **`mcp`**: Model Context Protocol 服务器配置。
- **`keybinds`**: 终端快捷键自定义。

---

## 二、 供应商配置 (`provider`)

这是配置 OpenAI 兼容接口（如火山引擎、Ollama、DeepSeek 等）的核心部分。

### 1. 供应商级别参数

```jsonc
"provider": {
  "custom-name": {
    "api": "https://api.example.com/v1", // API 基准地址 (baseURL)
    "npm": "@ai-sdk/openai-compatible", // 驱动包名，OpenAI 兼容接口必填此项
    "options": {
      "apiKey": "{env:API_KEY}",       // 从环境变量获取 Key
      "headers": {                     // 自定义 HTTP 请求头
        "X-Custom-Header": "value"
      },
      "timeout": 30000                 // 请求超时时间（毫秒）
    }
  }
}
```

### 2. 模型级别参数 (`models`)

在供应商的 `models` 对象中，你可以定义多个模型：

| 配置项 | 对应 API 字段 / 作用 |
| :--- | :--- |
| **`id`** | 远程 API 实际的模型标识符（如 `doubao-1.8-pro`）。 |
| **`name`** | 在 OpenCode UI 中显示的友好名称。 |
| **`reasoning`** | 布尔值。为 `true` 时启用推理链处理逻辑。 |
| **`limit`** | `context`: 上下文窗口总量；`output`: 单次最大输出 Token。 |
| **`modalities`** | 多模态支持。`input`: `["text", "image", "video", "pdf"]`。 |
| **`options`** | **透传参数集**。直接影响发送给 API 的请求体。 |

---

## 三、 API 参数映射逻辑

当你配置模型下的 `options` 时，OpenCode 会将其映射为底层的请求参数：

1.  **`thinking`**:
    *   对应 Anthropic 或兼容接口的思维链配置。
    *   常用子项：`type` ("enabled"/"disabled"), `budgetTokens` (思考 Token 预算)。
2.  **`reasoningEffort`**:
    *   对应 OpenAI O1/O3 等模型的推理强度。
    *   可选值：`low`, `medium`, `high`, `minimal`, `none`。
3.  **`max_completion_tokens`**:
    *   现代模型用来控制总输出（含思维链内容）的上限，优先于旧版的 `max_tokens`。
4.  **`temperature` / `topP` / `topK`**:
    *   控制生成的随机性和多样性。

---

## 四、 模型变体 (`variants`)

变体允许你为同一模型创建不同的配置快照，并在 OpenCode 中快速切换。

```jsonc
"variants": {
  "creative": {
    "temperature": 0.9,
    "reasoningEffort": "low"
  },
  "analytical": {
    "reasoningEffort": "high",
    "options": {
      "thinking": { "type": "enabled", "budgetTokens": 16000 }
    }
  }
}
```

---

## 五、 火山引擎 Doubao-Seed-1.8 配置示例

以下是一个针对火山引擎（Volcengine）豆包模型的完整配置示例，涵盖了您要求的各项参数：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "volcengine/doubao-1.8",
  "provider": {
    "volcengine": {
      "api": "https://ark.cn-beijing.volces.com/api/v3",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "apiKey": "{env:VOLC_API_KEY}"
      },
      "models": {
        "doubao-1.8": {
          "id": "ep-2025xxxxxx-xxxxx", // 此处填写您的接入点 Endpoint ID
          "name": "豆包-1.8-满血版",
          "reasoning": true,
          "limit": {
            "context": 256000,
            "output": 64000
          },
          "modalities": {
            "input": ["text", "image", "video"],
            "output": ["text"]
          },
          "options": {
            "max_completion_tokens": 64000,
            "thinking": {
              "type": "enabled",
              "budgetTokens": 32000
            },
            "reasoningEffort": "high"
          },
          "variants": {
            "fast": {
              "reasoningEffort": "low",
              "options": { "thinking": { "type": "disabled" } }
            },
            "expert": {
              "reasoningEffort": "high",
              "options": { "thinking": { "type": "enabled", "budgetTokens": 32000 } }
            }
          }
        }
      }
    }
  }
}
```

---

## 六、 查看已连接供应商的模型与使用“隐藏模型”

如果您已经通过 `auth` 连接了供应商（例如 SiliconFlow），但想查看其所有可用模型的具体 ID，或者想使用官方列表（`opencode models`）中未列出的模型，可以按照以下方法操作。

### 1. 查看模型 ID
在终端运行以下命令来过滤特定供应商的模型：
```bash
opencode models siliconflow
```
或者在 OpenCode 交互界面中：
- 输入 `/models` 并回车。
- 使用快捷键 `Ctrl+X` 然后按 `M`。

### 2. 使用“隐藏模型” (手动覆盖/扩展)
如果您知道供应商支持某个模型（例如新发布的测试版），但 OpenCode 的官方列表中没有它，您可以在 `opencode.json` 中手动将其“注入”到该供应商下。

即使供应商是通过 `auth` 自动连接的，您依然可以在配置文件中通过同名的供应商 ID（如 `siliconflow`）扩展它：

```jsonc
{
  "provider": {
    "siliconflow": {
      "models": {
        "DeepSeek-V3-Hidden": { // 您自定义的显示名称
          "id": "deepseek-ai/DeepSeek-V3", // 这里填写供应商要求的真实模型 ID
          "name": "DeepSeek V3 (手动注入)",
          "reasoning": true,
          "limit": {
            "context": 64000,
            "output": 8000
          }
        }
      }
    }
  }
}
```

**原理说明：**
- 当 OpenCode 加载配置时，如果 `opencode.json` 中的供应商 ID 与已通过 `auth` 连接的供应商匹配，它会将您在配置文件中定义的 `models` 合并到该供应商的模型列表中。
- 这样，您就可以在 UI 中选择并使用这个“隐藏”模型了。
