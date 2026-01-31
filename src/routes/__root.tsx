import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { useState } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Toaster } from 'sonner';
import { NavigationProgress } from '@mantine/nprogress';
import { ModalsProvider } from '@mantine/modals';
import type { QueryClient } from '@tanstack/react-query';
import type { AppThemeName } from '~ui/theme';
import { appCssVariablesResolver, defaultThemeName, themes } from '~ui/theme';
import { ThemeSwitcher } from '~components/theme-switcher';
import appCss from '~styles.css?url';
import {
  getThemeNameFromCookieHeader,
  setThemeCookie,
} from '~ui/theme/theme-storage';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async () => {
    const allowed = Object.keys(themes) as Array<AppThemeName>;
    const cookie =
      typeof document === 'undefined'
        ? (await import('@tanstack/react-start/server')).getRequestHeader(
            'cookie',
          )
        : undefined;
    const themeName =
      getThemeNameFromCookieHeader(cookie, allowed) ?? defaultThemeName;
    return { themeName };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { themeName: initialThemeName } = Route.useLoaderData();
  const [themeName, setThemeName] = useState<AppThemeName>(initialThemeName);
  const theme = themes[themeName] ?? themes[defaultThemeName];

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={appCssVariablesResolver}
          defaultColorScheme="light"
        >
          <ModalsProvider>{children}</ModalsProvider>

          <ThemeSwitcher
            themeName={themeName}
            onChangeTheme={(name) => {
              setThemeCookie(name);
              setThemeName(name);
            }}
          />
          <Toaster position="top-center" richColors />
          <NavigationProgress />
        </MantineProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'React Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
