import { useEffect } from 'react';
import PageCardList from '../components/PageCardList';
import DivisionLine from '../components/DivisionLine';
import bs from '../components/scss/init.scss';
import cn from 'classnames';
import Moon from '../assets/images/moon.png';

export default function Main() {
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<section>
			<section
				className={cn(
					bs['overflow-hidden'],
					bs['position-relative'],
					bs['d-flex'],
					bs['align-items-center'],
					bs['justify-content-center'],
				)}
				style={{ height: window.innerHeight }}
			>
				<div className={cn(bs['position-absolute'], bs['mainBackground'], bs['w-100'], bs['h-100'], bs['z--1'])}>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
					<img
						className={cn(bs['position-absolute'], bs['xr-9'], bs['yb-200'], bs['xr-md-200'], bs['z--1'], bs['moon'])}
						src={Moon}
					/>
				</div>
				<div className={bs['mainPhrase']}>
					<span className={cn(bs['efs-4'], bs['efs-md-9'])}>Practice is better than theory.</span>
				</div>
			</section>
			<PageCardList className={cn(bs['m-0'], bs['mt-6'], bs['m-md-6'], bs['m-xl-9'])} />
			<DivisionLine />
			<div style={{ height: '1000px' }} />
		</section>
	);
}
