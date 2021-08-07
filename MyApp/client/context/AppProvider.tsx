import { createElement } from 'react';
import { ClickCounterProvider } from './ClickCounterContext';
import { UserContextProvider } from './UserContext';

const AppProvider =
	(providers: any[]) =>
	({ children }: { children: React.ReactNode }) =>
		providers.reduce((prev, provider) => createElement(provider, { children: prev }), children);

export default AppProvider([ClickCounterProvider, UserContextProvider]);
