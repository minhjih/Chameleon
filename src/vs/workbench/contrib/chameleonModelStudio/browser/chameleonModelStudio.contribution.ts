/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, IViewsRegistry } from '../../../common/views.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ChameleonModelStudioProvider } from './chameleonModelStudio.js';
import { Codicon } from '../../../../base/common/codicons.js';

const VIEW_CONTAINER_ID = 'workbench.view.chameleonModelStudio';
const VIEW_ID = ChameleonModelStudioProvider.viewType;

import { WebviewViewPane } from '../../webviewView/browser/webviewViewPane.js';

import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const viewContainer = viewContainerRegistry.registerViewContainer({
    id: VIEW_CONTAINER_ID,
    title: { value: 'Chameleon Studio', original: 'Chameleon Studio' },
    icon: Codicon.beaker,
    ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
    storageId: VIEW_CONTAINER_ID,
    hideIfEmpty: false,
    order: 1
}, ViewContainerLocation.Sidebar);

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);
viewsRegistry.registerViews([{
    id: VIEW_ID,
    name: { value: 'Chameleon Studio', original: 'Chameleon Studio' },
    containerIcon: Codicon.beaker,
    canToggleVisibility: true,
    workspace: true,
    canMoveView: true,
    ctorDescriptor: new SyncDescriptor(WebviewViewPane)
}], viewContainer);

// Correction: To register a WebviewView, we usually use `registerWebviewViewProvider` in a Workbench contribution.
// But for static contribution, we need a ViewPane that hosts the webview.
// Alternatively, simpler: Register a normal ViewPane and implement renderBody. But we wanted Webview.
// Let's use the explicit `WebviewView` contribution pattern used in extensions.
// In core, we can just use `IWebviewViewService.resolve`.
// But we need to register the provider.

// Let's create a WorkbenchContribution that registers the provider.
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IWebviewViewService } from '../../webviewView/browser/webviewViewService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

class ChameleonModelStudioContribution implements IWorkbenchContribution {
    constructor(
        @IWebviewViewService webviewViewService: IWebviewViewService,
        @IInstantiationService instantiationService: IInstantiationService
    ) {
        const provider = instantiationService.createInstance(ChameleonModelStudioProvider);
        webviewViewService.register(VIEW_ID, provider);
    }
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ChameleonModelStudioContribution, LifecyclePhase.Restored);
