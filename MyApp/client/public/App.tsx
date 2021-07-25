import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../pages/Main';
import DotsConverter from '../pages/DotsConverter';
import FixedTopButton from '../components/FixedTopButton';
import ClickEffect from '../components/ClickEffect';
import AppProvider from '../context/AppProvider';

export default function App() {
	return (
		<>
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
		</>
	);
}
