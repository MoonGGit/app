import { useState, useCallback, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import ModalWrapper from './ModalWrapper';
import SignIn from '../account/SignIn';
import SignUp from '../account/SignUp';
import styles from '../../scss/app.scss';

const ModalLoginBox = ({ handleCloseModal }: { handleCloseModal: Function }) => {
	const [isCreateAccount, setIsCreateAccount] = useState(false);

	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;

	const handleCreateLoginToggle = useCallback(() => {
		setIsCreateAccount(!isCreateAccount);
	}, [isCreateAccount]);

	return (
		<ModalWrapper
			isVisible={!userContextValue?.accessToken || !userContextValue.userID}
			handleCloseModal={handleCloseModal}
			headerStyle={styles['c-account-modal-header']}
			headerText={isCreateAccount ? '회원가입' : '로그인'}
		>
			{isCreateAccount ? <SignUp handleReturnLogin={handleCreateLoginToggle} /> : <SignIn handleCreateAccount={handleCreateLoginToggle} />}
		</ModalWrapper>
	);
};

export default ModalLoginBox;
