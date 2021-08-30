import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderNavBar from './HeaderNavBar';
import useScroll from '../../hooks/useScroll';
import styles from '../../scss/app.scss';

// todo-update : 로고
const Header = () => {
	const location = useLocation();
	const scrollY = useScroll(window.innerHeight + 400);
	const headerBackgroundRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const headerBackground = headerBackgroundRef?.current!;
		const header = headerRef?.current!;

		// opacity, max 0.7
		let opacity = scrollY / 250;
		if (opacity > 0.7) opacity = 0.7;

		headerBackground.style.opacity = String(opacity);

		// when scroll to top
		if (opacity < 0.1) {
			// remove 'backdrop-filter'
			header.classList.remove(styles['c-global-header-toggle-filter']);

			// set font color, black or white on path '/'
			// if (location.pathname == '/')
			header.classList.add(styles['c-global-header-toggle-color']);
			// else header.classList.remove(bs['headerColor']);
		} else {
			// when scroll to bottom
			// add 'backdrop-filter'
			header.classList.add(styles['c-global-header-toggle-filter']);

			// set font color 'black' with scrollY on path '/'
			if (/* location.pathname == '/' && */ window.scrollY > window.innerHeight) {
				header.classList.remove(styles['c-global-header-toggle-color']);
			}
		}

		// header size
		if (header.offsetWidth >= 768 && header.offsetHeight >= 50) {
			let headerHeight = 95 - scrollY / 10;

			if (headerHeight < 50) headerHeight = 50;

			header.style.height = headerHeight + 'px';
		}
	}, [scrollY, location]);

	return (
		<header ref={headerRef} className={styles['c-global-header']}>
			<div ref={headerBackgroundRef} className={styles['c-global-header-background']} />
			<a href="http://dayfly.kr" className={styles['c-global-header-logo']}>
				MG DIY
			</a>
			<HeaderNavBar />
		</header>
	);
};

export default Header;
