/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IViewDescriptorService } from '../../../common/views.js';
import * as dom from '../../../../base/browser/dom.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';

export class ChameleonChatView extends ViewPane {

    private messagesContainer!: HTMLElement;
    private input!: HTMLTextAreaElement;

    constructor(
        options: IViewPaneOptions,
        @IKeybindingService keybindingService: IKeybindingService,
        @IContextMenuService contextMenuService: IContextMenuService,
        @IConfigurationService configurationService: IConfigurationService,
        @IContextKeyService contextKeyService: IContextKeyService,
        @IViewDescriptorService viewDescriptorService: IViewDescriptorService,
        @IInstantiationService instantiationService: IInstantiationService,
        @IOpenerService openerService: IOpenerService,
        @IThemeService themeService: IThemeService,
        @IHoverService hoverService: IHoverService,
        @ICodeEditorService private readonly codeEditorService: ICodeEditorService,
    ) {
        super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
    }

    protected override renderBody(container: HTMLElement): void {
        super.renderBody(container);
        container.classList.add('chameleon-chat-view');

        // CSS Styles
        const style = dom.append(container, dom.$('style'));
        style.textContent = `
            .chameleon-chat-view {
                display: flex;
                flex-direction: column;
                height: 100%;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }
            .chat-empty-state {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
                opacity: 0.9;
            }
            .chat-icon-large {
                font-size: 40px;
                margin-bottom: 20px;
                color: #cccccc;
            }
            .chat-title {
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 8px;
                color: #e0e0e0;
            }
            .chat-subtitle {
                font-size: 13px;
                color: #8b949e;
                margin-bottom: 8px;
            }
            .chat-link {
                font-size: 13px;
                color: #4daafc;
                text-decoration: none;
                cursor: pointer;
                margin-bottom: 30px;
            }
            .chat-link:hover {
                text-decoration: underline;
            }
            .suggested-actions {
                display: flex;
                gap: 12px;
                margin-top: 10px;
            }
            .action-chip {
                background: #2b2d31;
                color: #cccccc;
                padding: 6px 14px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                border: 1px solid #3c3e42;
                transition: background 0.2s;
            }
            .action-chip:hover {
                background: #3c3e42;
            }
            .messages-container {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .message {
                max-width: 90%;
                line-height: 1.5;
                font-size: 14px;
            }
            .message.user {
                align-self: flex-end;
                background-color: #2b3a4a; /* Dark blueish for user */
                padding: 10px 14px;
                border-radius: 8px;
                color: #ffffff;
            }
            .message.ai {
                align-self: flex-start;
                padding: 0 10px;
                color: #e0e0e0;
            }
            .input-area {
                padding: 16px;
            }
            .input-box {
                background: #1e1e1e;
                border: 1px solid #3c3e42;
                border-radius: 8px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .input-box:focus-within {
                border-color: #007fd4;
            }
            .input-top {
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            .context-btn {
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 8px;
                background: #2b2d31;
                border: 1px solid #3c3e42;
                border-radius: 4px;
                cursor: pointer;
                color: #cccccc;
            }
            .context-btn:hover { background: #3c3e42; }
            .chat-input {
                flex: 1;
                border: none;
                background: transparent;
                color: #ffffff;
                outline: none;
                font-family: inherit;
                resize: none;
                min-height: 20px;
                font-size: 14px;
            }
            .input-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 4px;
            }
            .left-controls {
                display: flex;
                gap: 10px;
            }
            .dropdown-btn {
                background: transparent;
                color: #8b949e;
                border: none;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .dropdown-btn:hover { color: #ffffff; }
            .send-btn {
                color: #8b949e;
                cursor: pointer;
                padding: 4px;
            }
            .send-btn:hover { color: #ffffff; }
        `;

        // Header removed in favor of input area controls




        // Empty State (Initial View)
        const emptyState = dom.append(container, dom.$('.chat-empty-state'));

        const iconContainer = dom.append(emptyState, dom.$('.chat-icon-large'));
        dom.append(iconContainer, dom.$('span.codicon.codicon-comment-discussion'));

        const title = dom.append(emptyState, dom.$('.chat-title'));
        title.textContent = 'Build with Agent';

        const subtitle = dom.append(emptyState, dom.$('.chat-subtitle'));
        subtitle.textContent = 'AI responses may be inaccurate.';

        const linkContainer = dom.append(emptyState, dom.$('div')); // Container for text + link
        const link = dom.append(linkContainer, dom.$('a.chat-link'));
        link.textContent = 'Generate Agent Instructions';
        const linkText = dom.append(linkContainer, dom.$('span'));
        linkText.textContent = ' to onboard AI onto your codebase.';

        const actions = dom.append(emptyState, dom.$('.suggested-actions'));
        const action1 = dom.append(actions, dom.$('.action-chip'));
        action1.textContent = 'Ask @vscode';
        const action2 = dom.append(actions, dom.$('.action-chip'));
        action2.textContent = 'Create Project';

        // Messages Container
        this.messagesContainer = dom.append(container, dom.$('.messages-container'));
        this.messagesContainer.style.display = 'none';

        // Input Area
        const inputArea = dom.append(container, dom.$('.input-area'));
        const inputBox = dom.append(inputArea, dom.$('.input-box'));
        const inputTop = dom.append(inputBox, dom.$('.input-top'));

        const contextBtn = dom.append(inputTop, dom.$('.context-btn'));
        dom.append(contextBtn, dom.$('span.codicon.codicon-attach'));
        const contextText = dom.append(contextBtn, dom.$('span'));
        contextText.textContent = ' Add Context...';

        this.input = dom.append(inputBox, dom.$('textarea.chat-input'));
        this.input.rows = 1;
        this.input.placeholder = 'Describe what to build next';

        const inputBottom = dom.append(inputBox, dom.$('.input-bottom'));
        const leftControls = dom.append(inputBottom, dom.$('.left-controls'));

        const agentBtn = dom.append(leftControls, dom.$('button.dropdown-btn'));
        agentBtn.textContent = 'Agent ';
        dom.append(agentBtn, dom.$('span.codicon.codicon-chevron-down'));

        const autoBtn = dom.append(leftControls, dom.$('button.dropdown-btn'));
        autoBtn.textContent = 'Auto ';
        dom.append(autoBtn, dom.$('span.codicon.codicon-chevron-down'));

        const toolsBtn = dom.append(leftControls, dom.$('.dropdown-btn'));
        toolsBtn.style.borderLeft = '1px solid #3c3e42';
        toolsBtn.style.paddingLeft = '10px';
        toolsBtn.style.marginLeft = '5px';
        dom.append(toolsBtn, dom.$('span.codicon.codicon-tools'));

        const sendBtn = dom.append(inputBottom, dom.$('.send-btn'));
        dom.append(sendBtn, dom.$('span.codicon.codicon-send'));

        // Model Selector Logic
        let currentModel = 'GPT-4 (Default)';
        const models = [
            'GPT-4 (Default)',
            'Qwen/Qwen3-Coder-30B-A3B-Instruct',
            'unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF',
            'deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct',
            'Qwen/Qwen2.5-Coder-7B-Instruct-GGUF',
            'Chameleon-Pro (Fine-tuned)'
        ];
        let modelIndex = 0;

        agentBtn.onclick = () => {
            modelIndex = (modelIndex + 1) % models.length;
            currentModel = models[modelIndex];
            agentBtn.textContent = '';
            // Truncate long names for display
            const displayModel = currentModel.length > 20 ? currentModel.substring(0, 18) + '...' : currentModel;
            agentBtn.append(displayModel + ' ');
            dom.append(agentBtn, dom.$('span.codicon.codicon-chevron-down'));
        };

        // --- Copilot-Compatible API Interfaces ---
        interface IChatMessage {
            role: 'system' | 'user' | 'assistant';
            content: string;
        }

        interface IChatCompletionRequest {
            model: string;
            messages: IChatMessage[];
            temperature: number;
            stream: boolean;
        }

        const sendMessage = () => {
            const text = this.input.value;
            if (text.trim()) {
                emptyState.style.display = 'none';
                this.messagesContainer.style.display = 'flex';

                this.addMessage('user', text);
                this.input.value = '';

                // 1. Build Context (Simulating System Prompt)
                const activeEditor = this.codeEditorService.getActiveCodeEditor();
                let systemContext = 'You are a helpful AI assistant for coding.';

                if (activeEditor && activeEditor.hasModel()) {
                    const uri = activeEditor.getModel().uri.path;
                    const filename = uri.split('/').pop();
                    const selection = activeEditor.getSelection();
                    const selectedText = activeEditor.getModel().getValueInRange(selection);

                    systemContext += `\n\nActive File: ${filename} (${uri})`;
                    if (selectedText && !selection.isEmpty()) {
                        systemContext += `\n\nSelected Code:\n\`\`\`\n${selectedText}\n\`\`\``;
                    }
                }

                // 2. Construct Payload (Standard Format)
                const requestPayload: IChatCompletionRequest = {
                    model: currentModel,
                    messages: [
                        { role: 'system', content: systemContext },
                        { role: 'user', content: text }
                    ],
                    temperature: 0.1,
                    stream: true
                };

                // Log payload for debugging/verification of structure
                console.log('[Chameleon Chat] Sending Request:', JSON.stringify(requestPayload, null, 2));

                // 3. Simulate Response (Mock)
                setTimeout(() => {
                    const responseContent = `[Using **${requestPayload.model}**]\nI received your request formatted as a standard API payload.\n\n**System Context**:\n\`${systemContext.substring(0, 50)}...\`\n\nI am ready for fine-tuning!`;
                    this.addMessage('ai', responseContent);
                }, 800);
            }
        };

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);
    }

    private addMessage(role: 'user' | 'ai' | 'system', text: string) {
        const msg = dom.append(this.messagesContainer, dom.$(`.message.${role}`));
        msg.textContent = text;
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    protected override layoutBody(height: number, width: number): void {
        super.layoutBody(height, width);
        // Resizing logic if needed
    }
}
