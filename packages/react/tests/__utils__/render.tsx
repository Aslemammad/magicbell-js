import { render as TLRender } from '@testing-library/react';
import React, { ReactNode } from 'react';

import MagicBellProvider from '../../src/components/MagicBellProvider';
import { MagicBellThemeProvider } from '../../src/context/MagicBellThemeContext';
import { defaultTheme, IMagicBellTheme } from '../../src/context/Theme';
import { TranslationsProvider } from '../../src/context/TranslationsContext';
import de from '../../src/lib/translations/de';
import es from '../../src/lib/translations/es';
import pt_br from '../../src/lib/translations/pt-br';

const locales = { es, pt_br, de } as const;

type RenderWithProvidersOptions = {
  locale: keyof typeof locales | 'en';
  apiKey: string;
  theme: IMagicBellTheme;
  stores?: any;
};

const defaultOptions: RenderWithProvidersOptions = {
  locale: 'en',
  apiKey: 'fake-api-key',
  theme: defaultTheme,
};

export function renderWithProviders(node: ReactNode, options?: Partial<RenderWithProvidersOptions>) {
  const { apiKey, locale, theme, stores } = Object.assign(defaultOptions, options);

  return TLRender(
    <MagicBellProvider apiKey={apiKey} userEmail="-" stores={stores}>
      <TranslationsProvider value={locales[locale]}>
        <MagicBellThemeProvider value={theme}>{node}</MagicBellThemeProvider>
      </TranslationsProvider>
    </MagicBellProvider>,
  );
}
