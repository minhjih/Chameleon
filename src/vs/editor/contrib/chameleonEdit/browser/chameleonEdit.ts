/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, ServicesAccessor, registerEditorContribution, registerEditorAction, EditorContributionInstantiation } from '../../../browser/editorExtensions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { IContextKeyService, IContextKey, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ZoneWidget } from '../../zoneWidget/browser/zoneWidget.js';

import * as dom from '../../../../base/browser/dom.js';

export const CTX_CHAMELEON_EDIT_VISIBLE = new RawContextKey<boolean>('chameleonEditVisible', false);

class ChameleonEditWidget extends ZoneWidget {
    private _input: HTMLInputElement | null = null;

    constructor(editor: ICodeEditor) {
        super(editor, { showArrow: false, showFrame: true, isAccessible: true });
    }

    protected _fillContainer(container: HTMLElement): void {
        container.style.backgroundColor = 'var(--vscode-editor-background)';
        const wrapper = dom.append(container, dom.$('div.chameleon-edit-wrapper'));
        wrapper.style.padding = '10px';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';

        this._input = dom.append(wrapper, dom.$<HTMLInputElement>('input.chameleon-edit-input'));
        this._input.type = 'text';
        this._input.placeholder = 'Describe your changes... (Command+K)';
        this._input.style.flex = '1';
        this._input.style.padding = '5px';
        this._input.style.background = 'var(--vscode-input-background)';
        this._input.style.color = 'var(--vscode-input-foreground)';
        this._input.style.border = '1px solid var(--vscode-input-border)';

        const btn = dom.append(wrapper, dom.$('button.chameleon-edit-btn'));
        btn.textContent = 'Generate';
        btn.style.padding = '5px 10px';
        btn.onclick = () => this._submit();

        this._input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this._submit();
            } else if (e.key === 'Escape') {
                this.hide();
            }
        };
    }

    private _submit() {
        if (this._input?.value) {
            const val = this._input.value;
            // Mock editing logic
            const editor = this.editor;
            const model = editor.getModel();
            const position = this.position;
            if (model && position) {
                const comment = `\n// AI Suggestion: ${val}`;
                editor.executeEdits('chameleon-ai', [{
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    },
                    text: comment,
                    forceMoveMarkers: true
                }]);
            }
            this.hide();
        }
    }
}

export class ChameleonEditController implements IEditorContribution {
    public static readonly ID = 'editor.contrib.chameleonEdit';

    private readonly _ctxVisible: IContextKey<boolean>;
    private _widget: ChameleonEditWidget | null = null;

    constructor(
        private readonly _editor: ICodeEditor,
        @IContextKeyService contextKeyService: IContextKeyService
    ) {
        this._ctxVisible = CTX_CHAMELEON_EDIT_VISIBLE.bindTo(contextKeyService);
    }

    public show(): void {
        if (!this._widget) {
            this._widget = new ChameleonEditWidget(this._editor);
        }
        const position = this._editor.getPosition();
        if (position) {
            this._widget.show(position, 3);
            this._ctxVisible.set(true);
        }
    }

    public hide(): void {
        this._widget?.hide();
        this._ctxVisible.set(false);
    }

    public dispose(): void {
        this._widget?.dispose();
        this._widget = null;
    }
}

registerEditorContribution(ChameleonEditController.ID, ChameleonEditController, EditorContributionInstantiation.Lazy);

registerEditorAction(class ChameleonEditAction extends EditorAction {
    constructor() {
        super({
            id: 'chameleon.triggerInlineEdit',
            label: 'AI Inline Edit',
            alias: 'AI Inline Edit',
            precondition: undefined,
            kbOpts: {
                kbExpr: null,
                primary: KeyMod.CtrlCmd | KeyCode.KeyK,
                weight: KeybindingWeight.EditorContrib
            }
        });
    }

    public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
        const controller = editor.getContribution<ChameleonEditController>(ChameleonEditController.ID);
        controller?.show();
    }
});
