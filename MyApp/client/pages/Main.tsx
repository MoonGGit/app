import { useEffect } from 'react';
import PageCardList from '../components/PageCardList';
import DivisionLine from '../components/DivisionLine';
import bs from '../components/scss/init.scss';
import cn from 'classnames';

export default function Main() {
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<div>
			<div style={{ height: '1000px' }} />
			<PageCardList className={cn(bs['m-3'], bs['m-md-6'], bs['m-xl-9'])} />
			<DivisionLine />
			<div style={{ height: '1000px' }} />
		</div>
	);
}
