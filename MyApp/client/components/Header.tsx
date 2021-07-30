import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';
import bs from './scss/init.scss';
import HeaderNavBar from './HeaderNavBar';
import useScroll from '../hooks/useScroll';

const headerBackgroundStyle: React.CSSProperties = {
	width: '100%',
	height: '100%',
	position: 'absolute',
	backgroundColor: 'rgb(253, 253, 253)',
	top: '0',
	left: '0',
	pointerEvents: 'none',
	zIndex: -1,
};

// todo-update : 로고
const Header = () => {
	const location = useLocation();
	const scrollY = useScroll(window.innerHeight + 250);
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
			header.classList.remove(bs['header']);

			// set font color, black or white on path '/'
			if (location.pathname == '/') header.classList.add(bs['headerColor']);
			else header.classList.remove(bs['headerColor']);
		} else {
			// when scroll to bottom
			// add 'backdrop-filter'
			header.classList.add(bs['header']);

			// set font color 'black' with scrollY on path '/'
			if (location.pathname == '/' && window.scrollY > window.innerHeight) {
				header.classList.remove(bs['headerColor']);
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
		<header
			ref={headerRef}
			className={cn(
				bs['d-flex'],
				bs['border-bottom'],
				bs['border-1'],
				bs['p-1'],
				bs['ps-4'],
				bs['p-md-4'],
				bs['ps-md-9'],
				bs['pe-md-9'],
				bs['position-fixed'],
				bs['w-100'],
				bs['align-items-center'],
				bs['z-999'],
				bs['header'],
			)}
		>
			<div ref={headerBackgroundRef} style={headerBackgroundStyle} />
			<Link to="/" className={cn(bs['me-auto'], bs['fs-4'])}>
				MG DIY
			</Link>
			<HeaderNavBar />
		</header>
	);
};

export default Header;
