import ModalWrapper from '../util/ModalWrapper';
import styles from '../../scss/app.scss';

const Success = ({ isVisible }: { isVisible: boolean }) => {
	return (
		<ModalWrapper isVisible={isVisible}>
			<div className={styles['c-loading-success']}>
				<div>✓</div>
				<div />
			</div>
		</ModalWrapper>
	);
};

export default Success;
