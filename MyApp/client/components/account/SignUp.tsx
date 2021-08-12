import styles from '../../scss/app.scss';
import { useRef, useCallback } from 'react';
import useScript from '../../hooks/useScript';
import cn from 'classnames';
import { FcGoogle } from 'react-icons/fc';

const SignIn = ({ handleReturnLogin }: { handleReturnLogin: Function }) => {
	const loginIDRef = useRef<HTMLInputElement>(null);
	const loginPasswordRef = useRef<HTMLInputElement>(null);
	const loginPasswordReRef = useRef<HTMLInputElement>(null);
	const reCaptchaHiddenRef = useRef<HTMLInputElement>(null);

	useScript('https://www.google.com/recaptcha/api.js', true);

	window.onClickRecaptcha = useCallback((token: string) => {
		if (reCaptchaHiddenRef.current) reCaptchaHiddenRef.current.value = token;
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

	const onClickGoogleSignUp = () => {
		if (googleAuth) {
			googleAuth.grantOfflineAccess().then((authResult: any) => {
				console.log(authResult['code']);
				//https://oauth2.googleapis.com/tokeninfo?id_token= id_token
				// 회원가입 서버로 전달
			});
		}
	};

	const onClickSignUp = useCallback(() => {
		console.log('회원가입');
	}, []);

	const onClickReturnLogin = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		handleReturnLogin();
	};

	return (
		<div className={styles['c-account-signUp']}>
			<div>
				<input ref={loginIDRef} type="text" placeholder="Username" />
				<input ref={loginPasswordRef} type="password" placeholder="Password" />
			</div>

			<div>
				<span>Password 재입력</span>
				<input ref={loginPasswordReRef} type="password" placeholder="Password" />
			</div>

			<div>
				<div
					className={cn('g-recaptcha', styles['c-account-signUp-g-recaptcha'])}
					data-sitekey="6LeGl_YbAAAAACp7UWxqCH6SM0oboxpYyVtw5ztc"
					data-callback="onClickRecaptcha"
					data-theme="dark"
				/>
				<input ref={reCaptchaHiddenRef} type="text" hidden readOnly />
				<button onClick={onClickSignUp} className={styles['c-account-signUp-btn-create']}>
					Create an account
				</button>
			</div>

			<div className={styles['c-account-signUp-other']}>
				<span>다른 계정으로 회원가입</span>
				<button onClick={onClickGoogleSignUp}>
					<span>
						<FcGoogle />
					</span>
					Sign Up with Google
				</button>
			</div>

			<div>
				다시 <span onClick={onClickReturnLogin}>로그인</span>하러 가기
			</div>
		</div>
	);
};

export default SignIn;
