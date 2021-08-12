import ModalWrapper from '../util/ModalWrapper';
import styles from '../../scss/app.scss';

const Loading = ({ isVisible }: { isVisible: boolean }) => {
	return (
		<ModalWrapper isVisible={isVisible}>
			<div className={styles['c-loading']}>
				<div />
				<div />
				<div />
			</div>
		</ModalWrapper>
	);
};

export default Loading;
