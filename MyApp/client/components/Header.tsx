import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import bs from './scss/init.scss';
import HeaderNavBar from './HeaderNavBar';
import useScroll from '../hooks/useScroll';

const headerStyle: React.CSSProperties = {
	width: '100%',
	height: '100%',
	position: 'absolute',
	backgroundColor: 'rgb(253, 253, 253)',
	top: '0',
	left: '0',
	pointerEvents: 'none',
	zIndex: -1,
};
const opacityDegree = 250;

// todo-update : 로고
const Header = () => {
	const scrollY = useScroll(opacityDegree * 2);
	const headerBackgroundRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const headerBackground = headerBackgroundRef?.current!;
		const header = headerRef?.current!;

		headerBackground.style.opacity = String(scrollY / opacityDegree);

		if (header.offsetWidth >= 768 && header.offsetHeight >= 50 && header.offsetHeight <= 95) {
			header.style.height = 95 - scrollY / 10 + 'px';
			if (header.offsetHeight < 50) header.style.height = 50 + 'px';
			if (header.offsetHeight > 95) header.style.height = 95 + 'px';
		}

		console.log(scrollY);
	}, [scrollY]);

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
				bs['position-fixed'],
				bs['w-100'],
				bs['align-items-center'],
				bs['z-999'],
			)}
		>
			<div ref={headerBackgroundRef} style={headerStyle} />
			<Link to="/" className={cn(bs['me-auto'])}>
				<span className={cn(bs['fs-4'])}>MG DIY</span>
			</Link>
			<HeaderNavBar />
		</header>
	);
};

export default Header;
