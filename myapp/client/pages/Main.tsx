import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import PageCardList from '../components/page/main/PageCardList';
import DivisionLine from '../components/util/DivisionLine';
import Moon from '../assets/images/moon.png';
import styles from '../scss/app.scss';

export default function Main({ handleSetCurrentRoute }: { handleSetCurrentRoute: Function }) {
	const { path } = useRouteMatch();

	useEffect(() => {
		window.scrollTo(0, 0);
		handleSetCurrentRoute(path);
	}, []);

	return (
		<section>
			<section className={styles['p-main-background-wrapper']} style={{ height: window.innerHeight }}>
				<div className={styles['p-main-background-inner']}>
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
					<img className={styles['p-main-img-moon']} src={Moon} />
				</div>
				<div className={styles['p-main-phrase']}>
					<span>Practice is better than theory.</span>
				</div>
			</section>
			<PageCardList className={styles['p-main-pagecard-list']} />
			<DivisionLine />
			<div style={{ height: '1000px' }} />
		</section>
	);
}
