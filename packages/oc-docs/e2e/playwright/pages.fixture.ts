import { test as base } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { EnvironmentsPage } from '../pages/environments.page';
import { RequestPage } from '../pages/request.page';
import { ScriptPage } from '../pages/script.page';
import { FolderPage } from '../pages/folder.page';
import { UnsupportedRequestPage } from '../pages/unsupported-request.page';
import { SidebarComponent } from '../components/sidebar.component';
import { TooltipComponent } from '../components/tooltip.component';
import { PlaygroundComponent } from '../components/playground.component';
import { ThemeToggleComponent } from '../components/layout/theme-toggle.component';
import { PageHeaderComponent } from '../components/layout/page-header.component';
import { SearchComponent } from '../components/search/search.component';
import { EnvSwitcherComponent } from '../components/layout/env-switcher.component';

type Fixtures = {
  overviewPage: OverviewPage;
  environmentsPage: EnvironmentsPage;
  requestPage: RequestPage;
  scriptPage: ScriptPage;
  folderPage: FolderPage;
  unsupportedRequestPage: UnsupportedRequestPage;
  sidebar: SidebarComponent;
  tooltip: TooltipComponent;
  playground: PlaygroundComponent;
  pageHeader: PageHeaderComponent;
  envSwitcher: EnvSwitcherComponent;
  themeToggle: ThemeToggleComponent;
  search: SearchComponent;
};

export const test = base.extend<Fixtures>({
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },
  environmentsPage: async ({ page }, use) => {
    await use(new EnvironmentsPage(page));
  },
  requestPage: async ({ page }, use) => {
    await use(new RequestPage(page));
  },
  scriptPage: async ({ page }, use) => {
    await use(new ScriptPage(page));
  },
  folderPage: async ({ page }, use) => {
    await use(new FolderPage(page));
  },
  unsupportedRequestPage: async ({ page }, use) => {
    await use(new UnsupportedRequestPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  tooltip: async ({ page }, use) => {
    await use(new TooltipComponent(page));
  },
  pageHeader: async ({ page }, use) => {
    await use(new PageHeaderComponent(page));
  },
  envSwitcher: async ({ page }, use) => {
    await use(new EnvSwitcherComponent(page));
  },
  playground: async ({ page }, use) => {
    await use(new PlaygroundComponent(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  },
  search: async ({ page }, use) => {
    await use(new SearchComponent(page));
  }
});
