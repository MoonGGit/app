import { useState } from 'react';
import cn from 'classnames';
import { BiMenu } from 'react-icons/bi';
import { IoLogoGithub } from 'react-icons/Io';
import AccountBox from './AccountBox';
import styles from '../../scss/app.scss';

const HeaderNavBar = () => {
	const [navBarToggle, setNavBarToggle] = useState(false);
	const onClickNavBarToggle = () => setNavBarToggle(!navBarToggle);

	return (
		<nav className={cn(styles['c-global-headerNavBar'])}>
			<button onClick={onClickNavBarToggle}>
				<span>
					<BiMenu />
				</span>
			</button>

			<ul className={cn({ [styles['c-global-headerNavBar-visible']]: navBarToggle })}>
				<li>
					<a href="#">BLOG</a>
				</li>
				<li>
					<a href="https://github.com/MoonGGit/app">
						<IoLogoGithub />
					</a>
				</li>
				<li>
					{/* todo : 열린상태서 햄버거누르면 유지... */}
					<AccountBox parentVisible={navBarToggle} />
				</li>
			</ul>
		</nav>
	);
};

export default HeaderNavBar;
