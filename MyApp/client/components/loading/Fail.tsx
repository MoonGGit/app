import ModalWrapper from '../util/ModalWrapper';
import styles from '../../scss/app.scss';

const Fail = ({ isVisible }: { isVisible: boolean }) => {
	return (
		<ModalWrapper isVisible={isVisible}>
			<div className={styles['c-loading-fail']}>
				<div>X</div>
				<div />
			</div>
		</ModalWrapper>
	);
};

export default Fail;
