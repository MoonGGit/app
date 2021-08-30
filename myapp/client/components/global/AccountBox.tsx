import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import cn from 'classnames';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext, userDispatch } from '../../context/UserContext';
import axios from 'axios';
import { getCookie } from '../../helper/init';
import styles from '../../scss/app.scss';
import ModalLoginBox from '../util/ModalLogin';
import ModalWrapper from '../util/ModalWrapper';
import Archive from '../account/Archive';

const AccountBox = ({ className, parentVisible }: { className?: string; parentVisible: boolean }) => {
	const [accountBoxToggle, setAccountBoxToggle] = useState(false);
	const [yourAccountToggle, setYourAccountToggle] = useState(false);
	const [archiveToggle, setArchiveToggle] = useState(false);

	const onClickAccountBoxToggle = () => setAccountBoxToggle(!accountBoxToggle);
	const onClickYourAccount = () => setYourAccountToggle(!yourAccountToggle);
	const onClickArchive = () => setArchiveToggle(!archiveToggle);

	const changePasswordRef = useRef<HTMLInputElement>(null);
	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;
	const { accessToken, userID, nickname, oauth } = userContextValue!;

	// 로그아웃
	const onClickLogOut = useCallback(() => {
		axios({
			url: '/user/board',
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message } = res.data;

				if (success) {
					userDispatch({ type: 'LOGOUT' });
				} else {
					userDispatch({ type: 'LOGOUT' });
				}
			})
			.catch(err => {
				userDispatch({ type: 'LOGOUT' });
			});
	}, [accessToken]);

	// 탈퇴
	const onClickDeactivate = useCallback(() => {
		axios({
			url: '/user/board',
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message } = res.data;

				if (success) {
					userDispatch({ type: 'LOGOUT' });
					alert(`Deactivate success : ${message}`);
				} else {
					alert(`Deactivate error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, [accessToken]);

	// 비밀번호 변경 - todo :수정
	const onClickChange = useCallback(() => {
		const newPassword = changePasswordRef?.current!.value;

		axios({
			url: '/user/board',
			method: 'PATCH',
			data: {
				newPassword: newPassword,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					if (value.access_token) {
						userDispatch({ type: 'SET_ACCESS_TOKEN', value: { accessToken: value.access_token } });
					} else {
						setYourAccountToggle(false);
					}
					alert(`Change success : ${message}`);
				} else {
					alert(`Change error : ${message}`);
				}
			})
			.catch(err => alert(err));
	}, [accessToken]);

	return (
		<div className={styles['c-global-accountBox']}>
			<button onClick={onClickAccountBoxToggle}>
				<BsPeopleCircle />
			</button>

			{/** 뷰박스 **/}
			{accountBoxToggle ? <ModalLoginBox handleCloseModal={onClickAccountBoxToggle} /> : null}

			<div
				className={cn(
					styles['c-global-accountBox-toggle'],
					{ [styles['c-global-accountBox-toggle-visible']]: accountBoxToggle && accessToken },
					{ [styles['c-global-accountBox-toggle-parent-invisible']]: !parentVisible },
				)}
			>
				{!yourAccountToggle ? (
					<div>
						<strong>'{nickname}'님 환영합니다.</strong>
						<button onClick={onClickYourAccount} disabled={oauth != null}>
							{`Your account ${oauth == null ? '' : '(공사중)'}`}
						</button>
						<button onClick={onClickArchive}>Archive</button>
						<ModalWrapper isVisible={archiveToggle} headerText={'Archive'} handleCloseModal={onClickArchive}>
							<Archive />
						</ModalWrapper>
						<button onClick={onClickLogOut}>Log out</button>
						<button onClick={onClickDeactivate}>Deactivate</button>
					</div>
				) : null}

				{yourAccountToggle ? (
					<div>
						<strong>Change password.</strong>
						<input ref={changePasswordRef} type="text" placeholder="NEW PASSWORD" />
						<button onClick={onClickChange}>Change</button>
						<button onClick={onClickYourAccount}>Back</button>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default AccountBox;
