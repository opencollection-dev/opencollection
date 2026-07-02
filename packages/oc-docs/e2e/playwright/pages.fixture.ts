import { test as base } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { EnvironmentsPage } from '../pages/environments.page';
import { RequestPage } from '../pages/request.page';
import { ScriptPage } from '../pages/script.page';
import { UnsupportedRequestPage } from '../pages/unsupported-request.page';
import { SidebarComponent } from '../components/sidebar.component';
import { ThemeToggleComponent } from '../components/layout/theme-toggle.component';
import { PageHeaderComponent } from '../components/layout/page-header.component';
import { SearchComponent } from '../components/search/search.component';


type Fixtures = {
  overviewPage: OverviewPage;
  environmentsPage: EnvironmentsPage;
  requestPage: RequestPage;
  scriptPage: ScriptPage;
  unsupportedRequestPage: UnsupportedRequestPage;
  sidebar: SidebarComponent;
  pageHeader: PageHeaderComponent;
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
  unsupportedRequestPage: async ({ page }, use) => {
    await use(new UnsupportedRequestPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  pageHeader: async ({ page }, use) => {
    await use(new PageHeaderComponent(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  },
  search: async ({ page }, use) => {
    await use(new SearchComponent(page));
  }
});
