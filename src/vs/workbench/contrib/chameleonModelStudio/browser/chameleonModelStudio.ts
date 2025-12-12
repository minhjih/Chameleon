/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { WebviewView } from '../../webviewView/browser/webviewViewService.js';


export class ChameleonModelStudioProvider {
	public static readonly viewType = 'chameleon.modelStudio';
	private _view?: WebviewView;

	constructor() { }

	public resolve(webviewView: WebviewView, context: CancellationToken): Promise<void> {
		this._view = webviewView;
		this._view.webview.options = {
			enableFindWidget: true,
		};
		this._view.webview.contentOptions = {
			allowScripts: true,
			localResourceRoots: []
		};


		webviewView.webview.setHtml(this._getHtmlForWebview());
		return Promise.resolve(); // Added return for Promise<void>
	}

	private _getHtmlForWebview(): string {
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Chameleon Studio</title>
			<style>
				:root {
					--container-paddding: 20px;
					--input-padding: 10px;
					--card-bg: var(--vscode-editor-background);
					--border-color: var(--vscode-widget-border);
				}
				body {
					font-family: var(--vscode-font-family);
					color: var(--vscode-foreground);
					background-color: var(--vscode-sideBar-background);
					padding: var(--container-paddding);
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 24px;
				}

				/* Header & Toggle */
				.header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1px solid var(--border-color);
					padding-bottom: 16px;
				}
				h1 {
					font-size: 18px;
					font-weight: 600;
					margin: 0;
					color: var(--vscode-foreground);
				}

				.toggle-container {
					display: flex;
					align-items: center;
					gap: 8px;
					font-size: 12px;
				}
				.switch {
					position: relative;
					display: inline-block;
					width: 36px;
					height: 20px;
				}
				.switch input { opacity: 0; width: 0; height: 0; }
				.slider {
					position: absolute;
					cursor: pointer;
					top: 0; left: 0; right: 0; bottom: 0;
					background-color: var(--vscode-input-background);
					transition: .4s;
					border: 1px solid var(--border-color);
					border-radius: 20px;
				}
				.slider:before {
					position: absolute;
					content: "";
					height: 14px;
					width: 14px;
					left: 2px;
					bottom: 2px;
					background-color: var(--vscode-foreground);
					transition: .4s;
					border-radius: 50%;
				}
				input:checked + .slider {
					background-color: var(--vscode-button-background);
				}
				input:checked + .slider:before {
					transform: translateX(16px);
					background-color: var(--vscode-button-foreground);
				}

				/* Cards & Sections */
				.section-title {
					font-size: 13px;
					text-transform: uppercase;
					font-weight: 600;
					opacity: 0.8;
					margin-bottom: 12px;
				}

				.card {
					background: var(--card-bg);
					border: 1px solid var(--border-color);
					border-radius: 6px;
					padding: 16px;
				}

				/* Form Inputs */
				.input-group {
					margin-bottom: 16px;
				}
				label {
					display: block;
					font-size: 12px;
					margin-bottom: 6px;
					opacity: 0.9;
				}
				input[type="text"] {
					width: 100%;
					padding: var(--input-padding);
					background: var(--vscode-input-background);
					color: var(--vscode-input-foreground);
					border: 1px solid var(--vscode-input-border);
					border-radius: 4px;
					box-sizing: border-box;
				}
				input[type="text"]:focus, select:focus {
					border-color: var(--vscode-focusBorder);
					outline: none;
				}
				select {
					width: 100%;
					padding: var(--input-padding);
					background: var(--vscode-dropdown-background);
					color: var(--vscode-dropdown-foreground);
					border: 1px solid var(--vscode-dropdown-border);
					border-radius: 4px;
					box-sizing: border-box;
					appearance: none; /* Custom dropdown styling reset */
					cursor: pointer;
				}

				/* Buttons */
				.btn-primary {
					width: 100%;
					padding: 10px;
					background: var(--vscode-button-background);
					color: var(--vscode-button-foreground);
					border: none;
					border-radius: 4px;
					cursor: pointer;
					font-weight: 500;
				}
				.btn-primary:hover {
					background: var(--vscode-button-hoverBackground);
				}

				/* Model List */
				.model-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 12px;
					border-bottom: 1px solid var(--border-color);
				}
				.model-item:last-child {
					border-bottom: none;
				}
				.model-info h3 {
					margin: 0;
					font-size: 14px;
					font-weight: 500;
				}
				.model-info p {
					margin: 4px 0 0 0;
					font-size: 11px;
					opacity: 0.7;
				}
				.status-badge {
					font-size: 10px;
					padding: 2px 8px;
					border-radius: 10px;
					background: var(--vscode-badge-background);
					color: var(--vscode-badge-foreground);
				}

				/* Progress */
				.progress-container {
					margin-top: 16px;
					display: none;
				}
				.progress-bar {
					height: 4px;
					background: var(--vscode-progressBar-background);
					width: 0%;
					transition: width 0.3s;
				}
				.status-text {
					font-size: 12px;
					margin-bottom: 8px;
					display: block;
				}
			</style>
		</head>
		<body>
			<div class="header">
				<h1>Chameleon Studio</h1>
				<div class="toggle-container">
					<span>Local Server</span>
					<label class="switch">
						<input type="checkbox" id="localServerToggle">
						<span class="slider"></span>
					</label>
				</div>
			</div>

			<!-- Fine-tuning Form -->
			<div class="card">
				<div class="section-title">New Fine-tuning Job</div>

				<div class="input-group">
					<label>Knowledge Source (Docs URL)</label>
					<input type="text" id="docUrl" placeholder="e.g. https://docs.framework.dev">
				</div>

				<div class="input-group">
					<label>Base Model ID</label>
					<select id="modelId">
						<option value="" disabled selected>Select a base model...</option>
						<option value="Qwen/Qwen3-Coder-30B-A3B-Instruct">Qwen/Qwen3-Coder-30B-A3B-Instruct</option>
						<option value="unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF">unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF</option>
						<option value="deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct">deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct</option>
						<option value="Qwen/Qwen2.5-Coder-7B-Instruct-GGUF">Qwen/Qwen2.5-Coder-7B-Instruct-GGUF</option>
					</select>
				</div>

				<button class="btn-primary" id="trainBtn">Start Training</button>

				<div class="progress-container" id="progressContainer">
					<span class="status-text" id="statusText">Initializing...</span>
					<div style="background: var(--vscode-input-background); height: 4px; border-radius: 2px;">
						<div class="progress-bar" id="progressBar"></div>
					</div>
				</div>
			</div>

			<!-- Model List -->
			<div>
				<div class="section-title">My Models</div>
				<div class="card" style="padding: 0;" id="modelList">
					<div class="model-item">
						<div class="model-info">
							<h3>custom-react-v1</h3>
							<p>Llama-2-7b • Fine-tuned on React Docs</p>
						</div>
						<span class="status-badge">Ready</span>
					</div>
					<!-- Additional items will be added here dynamically -->
				</div>
			</div>

			<script>
				const vscode = acquireVsCodeApi();

				// Elements
				const trainBtn = document.getElementById('trainBtn');
				const progressContainer = document.getElementById('progressContainer');
				const progressBar = document.getElementById('progressBar');
				const statusText = document.getElementById('statusText');
				const modelList = document.getElementById('modelList');

				// State
				let isTraining = false;

				trainBtn.addEventListener('click', () => {
					if(isTraining) return;

					const url = document.getElementById('docUrl').value;
					const model = document.getElementById('modelId').value;

					if (url && model) {
						startTrainingSimulation(model);
					}
				});

				function startTrainingSimulation(modelName) {
					isTraining = true;
					trainBtn.disabled = true;
					trainBtn.style.opacity = '0.7';
					trainBtn.textContent = 'Training in Progress...';

					progressContainer.style.display = 'block';
					let progress = 0;

					const steps = [
						{ p: 10, text: 'Scraping Documentation...' },
						{ p: 30, text: 'Processing Vectors...' },
						{ p: 50, text: 'Fine-tuning (Epoch 1/3)...' },
						{ p: 70, text: 'Fine-tuning (Epoch 3/3)...' },
						{ p: 90, text: 'Validating Model...' }
					];

					let stepIndex = 0;

					const interval = setInterval(() => {
						progress += 1;
						progressBar.style.width = progress + '%';

						// Update text based on progress
						if (stepIndex < steps.length && progress >= steps[stepIndex].p) {
							statusText.textContent = steps[stepIndex].text;
							stepIndex++;
						}

						if (progress >= 100) {
							clearInterval(interval);
							completeTraining(modelName);
						}
					}, 100); // Fast simulation
				}

				function completeTraining(baseModelName) {
					statusText.textContent = 'Training Complete';
					isTraining = false;
					trainBtn.textContent = 'Start Training';
					trainBtn.disabled = false;
					trainBtn.style.opacity = '1';

					setTimeout(() => {
						progressContainer.style.display = 'none';
						addModelToList('fine-tuned-' + Math.floor(Math.random() * 1000), baseModelName);
					}, 1000);
				}

				function addModelToList(name, base) {
					const item = document.createElement('div');
					item.className = 'model-item';
					item.innerHTML = \`
						<div class="model-info">
							<h3>\${name}</h3>
							<p>\${base} • Just now</p>
						</div>
						<span class="status-badge">Ready</span>
					\`;
					modelList.prepend(item);
				}
			</script>
		</body>
		</html>`;
	}
}
