import styles from '../../scss/app.scss';
import { useRef, useCallback } from 'react';
import useScript from '../../hooks/useScript';
import { FcGoogle } from 'react-icons/fc';

const SignIn = () => {
	const loginIDRef = useRef<HTMLInputElement>(null);
	const loginPasswordRef = useRef<HTMLInputElement>(null);

	const onClickSignIn = useCallback(() => {
		console.log('로그인');
	}, []);

	const onClickCreate = useCallback(() => {
		console.log('회원가입');
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
					console.log('init success');
				},
				() => {
					console.log('init fail');
				},
			);
		});
	});

	const onClickGoogleSignIn = () => {
		if (googleAuth) {
			googleAuth.grantOfflineAccess().then((authResult: any) => {
				console.log(authResult['code']);
				//https://oauth2.googleapis.com/tokeninfo?id_token= id_token
				// 로그인 서버로 전달
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

			<div className={styles['c-account-signIn-other']}>
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
