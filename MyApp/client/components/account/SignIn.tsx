import styles from '../../scss/app.scss';
import { useRef, useCallback } from 'react';
import useScript from '../../hooks/useScript';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { userDispatch } from '../../context/UserContext';

const SignIn = ({ handleCreateAccount }: { handleCreateAccount: Function }) => {
	const loginIDRef = useRef<HTMLInputElement>(null);
	const loginPasswordRef = useRef<HTMLInputElement>(null);

	const onClickSignIn = useCallback(() => {
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
					const { access_token, user_id, nickname } = value;

					userDispatch({ type: 'LOGIN', value: { accessToken: access_token, userID: user_id, nickname: nickname } });
					alert(`Login success : ${message}`);
				} else {
					alert(`Login error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, []);

	const onClickCreate = useCallback(() => {
		handleCreateAccount();
	}, []);

	let googleAuth: any;

	useScript('https://apis.google.com/js/platform.js?onload=renderButton', true, () => {
		const gapi = window.gapi;

		gapi.load('auth2', () => {
			googleAuth = gapi.auth2.init({
				client_id: '597424002882-s2af1s95ee3m3rkj53uv0n6leopd1e82.apps.googleusercontent.com',
			});

			googleAuth.then(
				() => {
					console.log('Gauth init success');
				},
				() => {
					console.log('Gauth init fail');
				},
			);
		});
	});

	const onClickGoogleSignIn = () => {
		if (googleAuth) {
			googleAuth.grantOfflineAccess().then((authResult: any) => {
				axios({
					url: '/user',
					method: 'POST',
					data: {
						oauth: 'GOOGLE',
						authorizationCode: authResult['code'],
					},
				})
					.then(res => {
						const { success, message, value } = res.data;

						if (success) {
							const { access_token, user_id, nickname, oauth } = value;
							userDispatch({ type: 'LOGIN', value: { accessToken: access_token, userID: user_id, nickname: nickname, oauth: oauth } });

							alert(`Login success : ${message}`);
						} else {
							alert(`Login error : ${message}`);
						}
					})
					.catch(err => alert(err));
			});
		}
	};

	return (
		<div className={styles['c-account-signIn']}>
			<div>
				<span>Username</span>
				<input ref={loginIDRef} type="text" />
			</div>
			<div>
				<span>Password</span>
				<input ref={loginPasswordRef} type="text" />
			</div>
			<button onClick={onClickSignIn} className={styles['c-account-signIn-btn']}>
				Sign In
			</button>
			<div>
				<span>회원가입</span>
				<button onClick={onClickCreate} className={styles['c-account-signIn-btn-create']}>
					Create an account
				</button>
			</div>

			<div className={styles['c-account-signIn-others']}>
				<span>다른 계정으로 로그인</span>
				<button onClick={onClickGoogleSignIn}>
					<span>
						<FcGoogle />
					</span>
					Sign in with Google
				</button>
			</div>

			<div></div>
		</div>
	);
};

export default SignIn;
