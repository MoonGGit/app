import { Link } from 'react-router-dom';
import cn from 'classnames';
import bs from './scss/init.scss';
import HeaderNavBar from './HeaderNavBar';

// todo-update : 로고
// todo-update : 탑일땐 투명 , 스크롤 시, 폭 줄이기
const Header = () => {
	return (
		<header
			className={cn(
				bs['d-flex'],
				bs['bg-op-gray-0'],
				bs['border-bottom'],
				bs['border-1'],
				bs['p-1'],
				bs['ps-4'],
				bs['p-md-4'],
				bs['position-fixed'],
				bs['w-100'],
				bs['align-items-center'],
			)}
		>
			<Link to="/" className={cn(bs['me-auto'])}>
				<span className={cn(bs['fs-4'])}>MG DIY</span>
			</Link>
			<HeaderNavBar />
		</header>
	);
};

export default Header;
