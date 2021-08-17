import { RiRocketLine } from 'react-icons/ri';
import styles from '../../scss/app.scss';

const FixedTopButton = () => {
	return (
		// todo-check : 웹표준 태그 및 속성
		<a href="#" className={styles['c-global-fixedTopButton']} role="link">
			<RiRocketLine />
		</a>
	);
};

export default FixedTopButton;
