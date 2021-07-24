import { createElement } from 'react';
import { ClickCounterProvider } from './ClickCounterContext';

// contexts: React.Provider<any>[] ts가 허용안함
const AppProvider =
	(providers: any[]) =>
	({ children }: { children: React.ReactNode }) =>
		providers.reduce((prev, provider) => createElement(provider, { children: prev }), children);

export default AppProvider([ClickCounterProvider]);
