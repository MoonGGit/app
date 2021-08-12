import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../scss/app.scss';
import cn from 'classnames';

const ModalWapper = ({
	children,
	isVisible,
	handleCloseModal,
	headerText,
	headerStyle,
}: {
	children: React.ReactNode;
	isVisible: boolean;
	handleCloseModal?: Function;
	headerText?: string;
	headerStyle?: string;
}) => {
	const onClickCloseModal: React.MouseEventHandler<HTMLButtonElement> = useCallback(
		event => {
			handleCloseModal!();
		},
		[handleCloseModal],
	);

	return isVisible
		? createPortal(
				<div className={styles['c-util-modal-wrapper']}>
					<div>
						{handleCloseModal ? (
							<div className={cn(styles['c-util-modal-header'], headerStyle)}>
								<span>{headerText}</span>
								<button onClick={onClickCloseModal}>X</button>
							</div>
						) : null}
						<div className={styles['c-util-modal-body']}>{children}</div>
					</div>
				</div>,
				document.getElementById('modal-root')!,
		  )
		: null;
};

export default ModalWapper;
