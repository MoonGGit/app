import { useEffect, useRef } from 'react';
import DivisionLine from '../components/util/DivisionLine';
import DotsConverterMain from '../components/page/dots/DotsConverter';
import styles from '../scss/app.scss';
import Leaves1 from '../assets/images/leaves1.png';
import Leaves2 from '../assets/images/leaves2.png';
import Leaves3 from '../assets/images/leaves3.png';
import Leaves4 from '../assets/images/leaves4.png';

const DotsConverter = () => {
	const backgroundRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<section>
			<div className={styles['p-dots-background-wrapper']} style={{ height: window.innerHeight }}>
				<div ref={backgroundRef} className={styles['p-dots-background-inner']}>
					<img src={Leaves1} alt="" />
					<img src={Leaves2} alt="" />
					<img src={Leaves3} alt="" />
					<img src={Leaves4} alt="" />
				</div>
			</div>
			<DivisionLine />
			<span className={styles['p-dots-title']}>CONVERT! MAKE DOTS! </span>
			<DotsConverterMain />
			<DivisionLine />
			<div style={{ height: '500px' }} />
		</section>
	);
};

export default DotsConverter;
