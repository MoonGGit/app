import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';
import Main from '../pages/Main';
import DotsConverter from '../pages/DotsConverter';
import FixedTopButton from '../components/global/FixedTopButton';
import ClickEffect from '../components/global/ClickEffect';
import AppProvider from '../context/AppProvider';
import useInitPage from '../hooks/useInitPage';

export default function App() {
	useInitPage();

	return (
		<AppProvider>
			<BrowserRouter>
				<Header />
				<Switch>
					<Route exact path="/" component={Main} />
					<Route exact path="/dots-converter" component={DotsConverter} />
					<Redirect path="*" to="/" />
				</Switch>
				<Footer />
			</BrowserRouter>
			<FixedTopButton />
			<ClickEffect />
		</AppProvider>
	);
}
