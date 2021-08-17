import { useState, useCallback, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import ModalWrapper from './ModalWrapper';
import SignIn from '../account/SignIn';
import SignUp from '../account/SignUp';
import styles from '../../scss/app.scss';
import Loading from '../loading/Loading';
import Success from '../loading/Success';
import Fail from '../loading/Fail';

const ModalUpload = ({ callBack, handleCloseModal }: { callBack: Function; handleCloseModal: Function }) => {
	const [isCreateAccount, setIsCreateAccount] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);
	const [isUploadSuccess, setIsUploadSuccess] = useState(false);

	const {
		state: { value },
	} = useContext(UserContext)!;

	useEffect(() => {
		if (value?.accessToken && value.userID) {
			setIsUploading(true);
			callBack()
				.then((res: any) => {
					console.log(res);

					setIsUploading(false);
					setIsUploaded(true);
					setIsUploadSuccess(true);
				})
				.catch((err: any) => {
					setIsUploading(false);
					setIsUploaded(true);
					setIsUploadSuccess(false);
					alert(err);
				})
				.finally(() => {
					setTimeout(() => {
						handleCloseModal();
					}, 1500);
				});
		}
	}, [value]);

	const handleCreateLoginToggle = useCallback(() => {
		setIsCreateAccount(!isCreateAccount);
	}, [isCreateAccount]);

	return (
		<>
			{!value?.accessToken || !value.userID ? (
				<ModalWrapper
					isVisible={!value?.accessToken || !value.userID}
					handleCloseModal={handleCloseModal}
					headerStyle={styles['c-account-modal-header']}
					headerText={isCreateAccount ? '회원가입' : '로그인'}
				>
					{isCreateAccount ? (
						<SignUp handleReturnLogin={handleCreateLoginToggle} />
					) : (
						<SignIn handleCreateAccount={handleCreateLoginToggle} />
					)}
				</ModalWrapper>
			) : null}

			<Loading isVisible={isUploading} />
			<Success isVisible={isUploaded && isUploadSuccess} />
			<Fail isVisible={isUploaded && !isUploadSuccess} />
		</>
	);
};

export default ModalUpload;
