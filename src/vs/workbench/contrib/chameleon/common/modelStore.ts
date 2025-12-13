/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';

export interface IChameleonModel {
	id: string;
	name: string;
	description: string;
	isFineTuned: boolean;
}

export class ChameleonModelStore {
	private static instance: ChameleonModelStore;

	// Default Models
	private models: IChameleonModel[] = [
		{ id: 'gpt-4', name: 'GPT-4 (Default)', description: 'Standard base model', isFineTuned: false },
		{ id: 'qwen-30b', name: 'Qwen-Coder-30B', description: 'Local high-performance model', isFineTuned: false },
		{ id: 'deepseek-v2', name: 'DeepSeek-Coder-V2', description: 'Efficient coding model', isFineTuned: false },
	];

	private readonly _onDidChangeModels = new Emitter<void>();
	public readonly onDidChangeModels = this._onDidChangeModels.event;

	private constructor() { }

	public static getInstance(): ChameleonModelStore {
		if (!ChameleonModelStore.instance) {
			ChameleonModelStore.instance = new ChameleonModelStore();
		}
		return ChameleonModelStore.instance;
	}

	public getModels(): IChameleonModel[] {
		return this.models;
	}

	public addModel(model: IChameleonModel): void {
		// Prevent duplicates
		if (!this.models.find(m => m.id === model.id)) {
			this.models.push(model);
			this._onDidChangeModels.fire();
		}
	}
}
