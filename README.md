# Chameleon IDE 🦎

<p align="center">
  <b>The AI-Native IDE for the Agentic Era</b>
</p>

Chameleon IDE is a cutting-edge fork of **Visual Studio Code**, re-engineered to integrate **Agentic AI** directly into the core workbench. Unlike traditional extensions, Chameleon's AI capabilities are burnt into the editor itself, providing faster, safer, and deeper integration.

## Key Features

### 🤖 Native AI Chat
A powerful chat interface built directly into the Activity Bar.
- **Agentic Design**: Designed to not just answer questions, but to actively modify your codebase.
- **Model Flexibility**: Choose between high-performance local models (Qwen, DeepSeek) or cloud APIs.
- **Trusted UI**: Built with full VS Code Trusted Types compliance for security and performance.

### 🧪 Model Studio
A dedicated dashboard for customizing your AI experience.
- **Fine-Tuning**: Create custom datasets from documentation URLs and fine-tune models directly within the IDE.
- **Model Management**: Switch between base models like `Qwen/Qwen3-Coder` or `DeepSeek-Coder-V2` instantly.
- **Local Control**: Run models locally for privacy and zero latency.

### ⚡ Inline AI Edit
Trigger AI edits right where you code.
- **Shortcut**: `Cmd+K` (macOS) / `Ctrl+K` (Windows/Linux).
- **Context Aware**: The agent understands your cursor position and surrounding code context.

## Build & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   # Starts the IDE with hot-reloading
   npm run watch
   ```

## License & Credits

**Chameleon IDE** is forked from [microsoft/vscode](https://github.com/microsoft/vscode).

- **Original Code**: Copyright (c) 2015 - present Microsoft Corporation.
- **Chameleon Modifications**: Copyright (c) 2025 Chameleon Team.

Licensed under the [MIT License](LICENSE.txt).
