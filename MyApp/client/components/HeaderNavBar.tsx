import { useCallback, useState } from 'react';
import bs from './scss/init.scss';
import cn from 'classnames';
import { BiMenu } from 'react-icons/bi';

const HeaderNavBar = () => {
	const [navBarToggle, setNavBarToggle] = useState(false);
	const onClickNavBarToggle = useCallback(() => {
		setNavBarToggle(!navBarToggle);
	}, []);

	return (
		<nav className={cn(bs['navbar-expand-md'], bs['navbar-light'])}>
			<button className={bs['navbar-toggler']} onClick={onClickNavBarToggle}>
				<span>
					<BiMenu />
				</span>
			</button>

			<ul
				id="navbarToggleContent"
				className={cn(
					// hamburger mode
					bs['v-invisible'],
					bs['col'],
					bs['text-end'],
					bs['position-absolute'],
					bs['xr-1'],
					{ [bs['navBarToggle-lt-md']]: navBarToggle },
					// expanded mode
					bs['v-md-visible'],
					bs['d-md-flex'],
					bs['position-md-static'],
					bs['fs-5'],
					bs['mb-0'],
				)}
			>
				<li className={cn(bs['nav-link'])}>
					<a href="#">BLOG</a>
				</li>
				<li className={cn(bs['nav-link'])}>
					<a href="#">GIT</a>
				</li>
			</ul>
		</nav>
	);
};

export default HeaderNavBar;
