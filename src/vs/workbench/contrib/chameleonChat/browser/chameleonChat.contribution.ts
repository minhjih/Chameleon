/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, IViewsRegistry, IViewDescriptor, IViewDescriptorService } from '../../../common/views.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ChameleonChatView } from './chameleonChatViewImpl.js';
// import { VIEW_ID, CONTAINER_ID, CONTAINER_TITLE } from '../common/chameleonChat.js';
const CONTAINER_TITLE = 'Chameleon Chat';
const VIEW_ID = 'workbench.view.chameleonChat.view.v3';
const CONTAINER_ID = 'workbench.view.chameleonChat.v3';
import { Codicon } from '../../../../base/common/codicons.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class ChameleonChatViewPaneContainer extends ViewPaneContainer {
    constructor(
        @IInstantiationService instantiationService: IInstantiationService,
        @IConfigurationService configurationService: IConfigurationService,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IContextMenuService contextMenuService: IContextMenuService,
        @ITelemetryService telemetryService: ITelemetryService,
        @IExtensionService extensionService: IExtensionService,
        @IThemeService themeService: IThemeService,
        @IStorageService storageService: IStorageService,
        @IWorkspaceContextService contextService: IWorkspaceContextService,
        @IViewDescriptorService viewDescriptorService: IViewDescriptorService,
        @ILogService logService: ILogService,
    ) {
        super(CONTAINER_ID, { mergeViewWithContainerWhenSingleView: false }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);
    }
}

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const viewContainer = viewContainerRegistry.registerViewContainer({
    id: CONTAINER_ID,
    title: { value: CONTAINER_TITLE, original: CONTAINER_TITLE },
    icon: Codicon.commentDiscussion, // Use an existing icon for now
    ctorDescriptor: new SyncDescriptor(ChameleonChatViewPaneContainer),
    storageId: CONTAINER_ID,
    hideIfEmpty: false,
    order: 0
}, ViewContainerLocation.Sidebar);

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);
viewsRegistry.registerViews([{
    id: VIEW_ID,
    name: { value: CONTAINER_TITLE, original: CONTAINER_TITLE },
    containerIcon: Codicon.commentDiscussion,
    ctorDescriptor: new SyncDescriptor(ChameleonChatView),
    canToggleVisibility: true,
    workspace: true,
    canMoveView: true
}], viewContainer);
