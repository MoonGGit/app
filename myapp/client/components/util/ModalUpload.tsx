import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Loading from '../loading/Loading';
import Success from '../loading/Success';
import Fail from '../loading/Fail';
import ModalLoginBox from './ModalLogin';
import { userDispatch } from '../../context/UserContext';

const ModalUpload = ({ callBack, handleCloseModal }: { callBack: Function; handleCloseModal: Function }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);
	const [isUploadSuccess, setIsUploadSuccess] = useState(false);

	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;

	useEffect(() => {
		if (userContextValue?.accessToken && userContextValue.userID) {
			setIsUploading(true);
			callBack()
				.then((res: any) => {
					console.log(res);
					const { success, message, value } = res.data;

					if (success) {
						if (value.access_token) {
							userDispatch({ type: 'SET_ACCESS_TOKEN', value: { accessToken: value.access_token } });
						}

						setIsUploadSuccess(true);
					} else {
						alert(message);
						setIsUploadSuccess(false);
					}

					setIsUploading(false);
					setIsUploaded(true);
				})
				.catch((err: any) => {
					setIsUploading(false);
					setIsUploadSuccess(false);
					setIsUploaded(true);
					alert(err);
				})
				.finally(() => {
					setTimeout(() => {
						handleCloseModal();
					}, 1500);
				});
		}
	}, [userContextValue]);

	return (
		<>
			<ModalLoginBox handleCloseModal={handleCloseModal} />
			<Loading isVisible={isUploading} />
			<Success isVisible={isUploaded && isUploadSuccess} />
			<Fail isVisible={isUploaded && !isUploadSuccess} />
		</>
	);
};

export default ModalUpload;
