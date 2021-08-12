import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import ModalWrapper from './ModalWrapper';

const ModalUpload = ({ callBack, handleCloseModal }: { callBack: Function; handleCloseModal: Function }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);

	const {
		state: { value },
	} = useContext(UserContext)!;

	useEffect(() => {
		if (value?.accessToken && value.userID) {
			setIsUploading(true);
			callBack()
				.then((res: any) => {
					console.log(res);
				})
				.catch((err: any) => {
					alert(err);
				})
				.finally(() => {
					setIsUploading(false);
					setIsUploaded(true);
					setTimeout(() => {
						handleCloseModal();
					}, 1000);
				});
		}
	}, [value]);

	return (
		<>
			<ModalWrapper isVisible={!value?.accessToken || !value.userID} handleCloseModal={handleCloseModal}>
				가입창
			</ModalWrapper>
			<ModalWrapper isVisible={isUploading}>업로드 중</ModalWrapper>
			<ModalWrapper isVisible={isUploaded}>업로드 완료</ModalWrapper>
		</>
	);
};

export default ModalUpload;
