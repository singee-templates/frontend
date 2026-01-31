import { Affix, Paper, Select, Stack, Text } from '@mantine/core';
import type { AppThemeName } from '~ui/theme';
import { themes } from '~ui/theme';

type Props = {
  themeName: AppThemeName;
  onChangeTheme: (name: AppThemeName) => void;
};

export function ThemeSwitcher({ themeName, onChangeTheme }: Props) {
  const data = (Object.keys(themes) as Array<AppThemeName>).map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <Affix position={{ left: 16, bottom: 16 }}>
      <Paper shadow="sm" withBorder p="sm" radius="md">
        <Stack gap={6}>
          <Text size="xs" c="dimmed">
            Theme
          </Text>
          <Select
            aria-label="Theme"
            data={data}
            value={themeName}
            allowDeselect={false}
            onChange={(value) => {
              if (!value) return;
              if (value in themes) onChangeTheme(value as AppThemeName);
            }}
            comboboxProps={{ withinPortal: true }}
          />
        </Stack>
      </Paper>
    </Affix>
  );
}
