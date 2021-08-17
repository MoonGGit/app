import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import cn from 'classnames';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext, userDispatch } from '../../context/UserContext';
import axios from 'axios';
import { getCookie } from '../../helper/init';
import styles from '../../scss/app.scss';

const AccountBox = ({ className, parentVisible }: { className?: string; parentVisible: boolean }) => {
	const [navBarToggle, setNavBarToggle] = useState(false);
	const onClickNavBarToggle = () => setNavBarToggle(!navBarToggle);

	const [loginToggle, setLoginToggle] = useState(true);
	const [registerToggle, setRegisterToggle] = useState(false);
	const [yourAccountToggle, setYourAccountToggle] = useState(false);

	const loginIDRef = useRef<HTMLInputElement>(null);
	const loginPasswordRef = useRef<HTMLInputElement>(null);
	const registerIDRef = useRef<HTMLInputElement>(null);
	const registerPasswordRef = useRef<HTMLInputElement>(null);
	const changePasswordRef = useRef<HTMLInputElement>(null);

	const { state } = useContext(UserContext)!;
	const { accessToken, userID, nickname } = state.value!;

	// 새 접속/로그인 or 로그아웃
	useEffect(() => {
		if (accessToken && userID) {
			setLoginToggle(false);
			setRegisterToggle(false);
			setYourAccountToggle(false);
		} else {
			setLoginToggle(true);
			setRegisterToggle(false);
		}
	}, [accessToken, userID]);

	// 등록창 열기
	const onClickSignUp = () => {
		setLoginToggle(false);
		setRegisterToggle(true);
	};

	// 정보 수정창 열기
	const onClickYourAccount = () => {
		setYourAccountToggle(true);
	};

	// 수정창 뒤로
	const onClickBack = () => {
		setYourAccountToggle(false);
	};

	// 로그인 - todo : 수정
	const onClickLogin = useCallback(() => {
		const userID = loginIDRef?.current!.value;
		const password = loginPasswordRef?.current!.value;

		axios({
			url: '/user',
			method: 'POST',
			data: {
				userID: userID,
				password: password,
			},
		})
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					const { access_token, user_id } = value;

					userDispatch({ type: 'LOGIN', value: { accessToken: access_token, userID: user_id } });
					alert(`Login success : ${message}`);
				} else {
					alert(`Login error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, []);

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
					alert(`Logout success : ${message}`);
				} else {
					alert(`Logout error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});

		setLoginToggle(true);
		setRegisterToggle(false);
	}, [accessToken, userID]);

	// 회원가입 - todo : 수정
	const onClickRegister = useCallback(() => {
		const userID = registerIDRef?.current!.value;
		const password = registerPasswordRef?.current!.value;

		axios({
			url: '/user/new',
			method: 'POST',
			data: {
				userID: userID,
				password: password,
			},
		})
			.then(res => {
				const { success, message } = res.data;

				if (success) {
					alert(`Register success : ${message}`);
				} else {
					alert(`Register error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});

		setLoginToggle(true);
		setRegisterToggle(false);
	}, []);

	// 탈퇴
	const onClickDeactivate = useCallback(() => {
		axios({
			url: '/user/board',
			method: 'POST',
			data: {
				userID: userID,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message } = res.data;

				if (success) {
					userDispatch({ type: 'LOGOUT' });
					setLoginToggle(true);
					setRegisterToggle(false);
					alert(`Deactivate success : ${message}`);
				} else {
					alert(`Deactivate error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, [accessToken, userID]);

	// 비밀번호 변경 - todo :수정
	const onClickChange = useCallback(() => {
		const newPassword = changePasswordRef?.current!.value;

		axios({
			url: '/user/board',
			method: 'PATCH',
			data: {
				newPassword: newPassword,
				userID: userID,
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
	}, [accessToken, userID]);

	return (
		<div className={styles['c-global-accountBox']}>
			<button onClick={onClickNavBarToggle}>
				<BsPeopleCircle />
			</button>

			{/** 뷰박스 **/}
			<div
				className={cn(
					styles['c-global-accountBox-toggle'],
					{ [styles['c-global-accountBox-toggle-visible']]: navBarToggle },
					{ [styles['c-global-accountBox-toggle-parent-invisible']]: !parentVisible },
				)}
			>
				{loginToggle ? (
					<div>
						<input ref={loginIDRef} type="text" placeholder="ID" />
						<input ref={loginPasswordRef} type="text" placeholder="PASSWORD" />
						<button onClick={onClickLogin}>LOGIN</button>
						<button onClick={onClickSignUp}>SIGN UP</button>
					</div>
				) : (
					<></>
				)}

				{!loginToggle && !registerToggle && !yourAccountToggle && accessToken && userID && nickname ? (
					<div>
						<strong>'{nickname}'님 환영합니다.</strong>
						<button onClick={onClickYourAccount}>Your account</button>
						<button>Archive</button>
						<button onClick={onClickLogOut}>Log out</button>
						<button onClick={onClickDeactivate}>Deactivate</button>
					</div>
				) : (
					<></>
				)}

				{yourAccountToggle && accessToken && userID ? (
					<div>
						<strong>Change password.</strong>
						<input ref={changePasswordRef} type="text" placeholder="NEW PASSWORD" />
						<button onClick={onClickChange}>Change</button>
						<button onClick={onClickBack}>Back</button>
					</div>
				) : (
					<></>
				)}

				{registerToggle ? (
					<div>
						<input ref={registerIDRef} type="text" placeholder="ID" />
						<input ref={registerPasswordRef} type="text" placeholder="PASSWORD" />
						<button onClick={onClickRegister}>Register</button>
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default AccountBox;
