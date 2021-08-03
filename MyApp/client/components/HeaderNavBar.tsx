import { useState } from 'react';
import bs from './scss/init.scss';
import cn from 'classnames';
import { BiMenu } from 'react-icons/bi';
import { IoLogoGithub } from 'react-icons/Io';
import AccountBox from './AccountBox';

const HeaderNavBar = () => {
	const [navBarToggle, setNavBarToggle] = useState(false);
	const onClickNavBarToggle = () => {
		setNavBarToggle(!navBarToggle);
	};

	return (
		<nav className={cn(bs['navbar-expand-md'], bs['navbar-light'])}>
			<button className={bs['navbar-toggler']} onClick={onClickNavBarToggle}>
				<span>
					<BiMenu />
				</span>
			</button>

			<ul
				className={cn(
					// hamburger mode
					bs['v-invisible'],
					bs['text-center'],
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
					<a href="https://github.com/MoonGGit/app">
						<IoLogoGithub />
					</a>
				</li>
				<li className={cn(bs['nav-link'])}>
					{/* todo : 열린상태서 햄버거누르면 유지... */}
					<AccountBox className={cn({ [bs['v-invisible']]: !navBarToggle })} />
				</li>
			</ul>
		</nav>
	);
};

export default HeaderNavBar;
