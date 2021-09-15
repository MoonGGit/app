import { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';
import Main from '../pages/Main';
import DotsConverter from '../pages/DotsConverter';
import Chat from '../pages/Chat';
import FixedTopButton from '../components/global/FixedTopButton';
import ClickEffect from '../components/global/ClickEffect';
import AppProvider from '../context/AppProvider';
import useInitPage from '../hooks/useInitPage';

export default function App() {
	const [currentRoute, setCurrentRoute] = useState<string>();
	useInitPage();

	const handleSetCurrentRoute = useCallback(
		(path: string) => {
			setCurrentRoute(path);
		},
		[currentRoute],
	);

	const ignoreHeaderUrl = useMemo(() => ['/chat'], []);

	return (
		<AppProvider>
			<Router>
				<Switch>
					<Route exact path="/">
						<Main handleSetCurrentRoute={handleSetCurrentRoute} />
					</Route>
					<Route path="/dots-converter">
						<DotsConverter handleSetCurrentRoute={handleSetCurrentRoute} />
					</Route>
					<Route path="/chat">
						<Chat handleSetCurrentRoute={handleSetCurrentRoute} />
					</Route>
					<Redirect path="*" to="/" />
				</Switch>
				{currentRoute && !ignoreHeaderUrl.includes(currentRoute) ? (
					<>
						<Header />
						<Footer />
						<FixedTopButton />
					</>
				) : (
					''
				)}
				<ClickEffect />
			</Router>
		</AppProvider>
	);
}
