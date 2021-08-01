import { useEffect, useState, useContext, useRef } from 'react';
import bs from './scss/init.scss';
import cn from 'classnames';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext, userDispatch } from '../context/UserContext';
import axios from 'axios';

// todo : 리팩토링, useFetch를 활용? reducer를 활용?
const AccountBox = ({ className }: { className: string }) => {
	const [navBarToggle, setNavBarToggle] = useState(false);
	const onClickNavBarToggle = () => {
		setNavBarToggle(!navBarToggle);
	};

	// 로그인 창
	const [loginToggle, setLoginToggle] = useState(true);

	// 등록 창
	const [registerToggle, setRegisterToggle] = useState(false);

	const loginIDRef = useRef<HTMLInputElement>(null);
	const loginPasswordRef = useRef<HTMLInputElement>(null);
	const registerIDRef = useRef<HTMLInputElement>(null);
	const registerPasswordRef = useRef<HTMLInputElement>(null);

	const { state } = useContext(UserContext)!;
	const userID = state.value?.userID;

	// 로그인 정보가 세션에 남아있거나, 로그인 되엇을 경우
	useEffect(() => {
		if (userID) {
			setLoginToggle(false);
			setRegisterToggle(false);
		} else {
			// 로그아웃 시
			setLoginToggle(true);
			setRegisterToggle(false);
		}
	}, [userID]);

	// 로그인처리
	const onClickLogin = () => {
		const userID = loginIDRef?.current!.value;
		const password = loginPasswordRef?.current!.value;

		axios
			.post('/user/login', {
				userID: userID,
				password: password,
			})
			.then(res => {
				const { success, message, value } = res.data;
				console.log(success, message, value);
				if (success) {
					userDispatch({ type: 'LOGIN', value: { userID: value.userID } });
					alert(`Login success : ${message}`);
				} else {
					alert(`Login error : ${message}`);
				}
			})
			.catch(err => {
				alert(`Login error : ${err}`);
			});
	};

	// 등록창 열기
	const onClickSignUp = () => {
		setLoginToggle(false);
		setRegisterToggle(true);
	};

	// 로그아웃 -> 로그인창 열기 -> 유저 아이디 삭제
	const onClickLogOut = () => {
		axios
			.get('/user/logout')
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
				alert(`Logout error : ${err}`);
			});

		setLoginToggle(true);
		setRegisterToggle(false);
	};

	// 회원가입처리 -> 로그인창 이동
	const onClickRegister = () => {
		const userID = registerIDRef?.current!.value;
		const password = registerPasswordRef?.current!.value;

		axios
			.post('/user/post', {
				userID: userID,
				password: password,
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
				alert(`Register error : ${err}`);
			});

		setLoginToggle(true);
		setRegisterToggle(false);
	};

	// 탈퇴 처리
	const onClickDeactivate = () => {
		axios
			.post('/user/delete', {
				userID: userID,
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
				alert(`Deactivate error : ${err}`);
			});
	};

	// todo : 수정 창 추가
	return (
		<div className={cn(bs['position-absolute'])}>
			<button
				className={cn(bs['navbar-toggler'], bs['border-0'])}
				onClick={onClickNavBarToggle}
				style={{ cursor: 'pointer', display: 'contents' }}
			>
				<BsPeopleCircle />
			</button>

			{/** 뷰박스 **/}
			<div
				className={cn(
					bs['border'],
					bs['v-invisible'],
					bs['position-absolute'],
					{ [bs['loginBarToggle']]: navBarToggle },
					bs['overflow-hidden'],
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

				{!loginToggle && !registerToggle && userID ? (
					<div>
						<strong>'{userID}'님 환영합니다. </strong>
						<button>Your account</button>
						<button>Archive</button>
						<button onClick={onClickLogOut}>Log out</button>
						<button onClick={onClickDeactivate}>Deactivate</button>
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
