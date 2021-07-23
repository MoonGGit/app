import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../pages/Main';
import Dots_converter from '../pages/Dots_converter';
import FixedTopButton from '../components/FixedTopButton';
import ClickEffect from '../components/ClickEffect';

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Switch>
					<Route exact path="/" component={Main} />
					<Route exact path="/dots-converter" component={Dots_converter} />
					<Redirect path="*" to="/" />
				</Switch>
				<Footer />
			</BrowserRouter>
			<FixedTopButton />
			<ClickEffect />
		</>
	);
}
