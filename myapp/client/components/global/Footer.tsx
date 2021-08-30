import ClickCounter from './ClickCounter';
import styles from '../../scss/app.scss';

const Footer = () => {
	return (
		<footer className={styles['c-global-footer']}>
			<ClickCounter className={styles['c-global-footer-clickCounter']} />
			<div className={styles['c-global-footer-description']}>
				<span>문지현</span>&nbsp;|&nbsp;<span>answlgus1122@gmail.com</span>&nbsp;|&nbsp;
				<span>ⓒ 2021 Moon JiHyeon. All rights reserved.</span>
			</div>
		</footer>
	);
};

export default Footer;
