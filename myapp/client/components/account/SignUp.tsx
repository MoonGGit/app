import styles from '../../scss/app.scss';
import { useRef, useCallback } from 'react';
import useScript from '../../hooks/useScript';
import cn from 'classnames';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const SignUp = ({ handleReturnLogin }: { handleReturnLogin: Function }) => {
	const signUpIDRef = useRef<HTMLInputElement>(null);
	const signUpNicknameRef = useRef<HTMLInputElement>(null);
	const signUpPasswordRef = useRef<HTMLInputElement>(null);
	const signUpPasswordReRef = useRef<HTMLInputElement>(null);
	const reCaptchaHiddenRef = useRef<HTMLInputElement>(null);

	useScript('https://www.google.com/recaptcha/api.js', true);

	window.onClickRecaptcha = useCallback((token: string) => {
		if (reCaptchaHiddenRef.current) reCaptchaHiddenRef.current.value = token;
	}, []);

	window.onExpiredRecaptcha = useCallback(() => {
		if (reCaptchaHiddenRef.current) reCaptchaHiddenRef.current.value = '';
	}, []);

	let googleAuth: any = null;
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

	const onClickGoogleSignUp = () => {
		if (googleAuth) {
			googleAuth.grantOfflineAccess().then((authResult: any) => {
				axios({
					url: '/user/new',
					method: 'POST',
					data: {
						oauth: 'GOOGLE',
						authorizationCode: authResult['code'],
					},
				})
					.then(res => {
						const { success, message } = res.data;

						if (success) {
							alert(`Register success : ${message}`);
							handleReturnLogin();
						} else {
							alert(`Register error : ${message}`);
							window.grecaptcha.reset();
						}
					})
					.catch(err => {
						alert(err);
						window.grecaptcha.reset();
					});
			});
		}
	};

	const onClickSignUp = useCallback(() => {
		const userID = signUpIDRef.current!.value;
		const nickname = signUpNicknameRef.current!.value;
		const password = signUpPasswordRef.current!.value;
		const rePassword = signUpPasswordReRef.current!.value;
		const reCaptcha = reCaptchaHiddenRef.current!.value;

		if (!userID) {
			alert('???????????? ??????????????????');
			signUpIDRef.current?.focus();
		} else if (!nickname) {
			alert('???????????? ??????????????????');
			signUpNicknameRef.current?.focus();
		} else if (!password) {
			alert('??????????????? ??????????????????');
			signUpPasswordRef.current?.focus();
		} else if (password !== rePassword) {
			alert('??????????????? ???????????? ????????????.');
			signUpPasswordRef?.current?.focus();
		} else if (!reCaptcha) {
			alert('????????????????');
		} else {
			axios({
				url: '/user/new',
				method: 'POST',
				data: {
					userID: userID,
					password: password,
					nickname: nickname,
					reCaptcha: reCaptcha,
				},
			})
				.then(res => {
					const { success, message } = res.data;

					if (success) {
						alert(`Register success : ${message}`);
						handleReturnLogin();
					} else {
						alert(`Register error : ${message}`);
					}
				})
				.catch(err => alert(err));
		}
	}, []);

	const onClickReturnLogin = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		handleReturnLogin();
	};

	return (
		<div className={styles['c-account-signUp']}>
			<div>
				<input ref={signUpIDRef} type="text" placeholder="Username" />
				<input ref={signUpNicknameRef} type="text" placeholder="Nickname" />
				<input ref={signUpPasswordRef} type="password" placeholder="Password" />
			</div>

			<div>
				<span>Password ?????????</span>
				<input ref={signUpPasswordReRef} type="password" placeholder="Password" />
			</div>

			<div>
				<div
					className={cn('g-recaptcha', styles['c-account-signUp-g-recaptcha'])}
					data-sitekey="6LeGl_YbAAAAACp7UWxqCH6SM0oboxpYyVtw5ztc"
					data-callback="onClickRecaptcha"
					data-expired-callback="onExpiredRecaptcha"
					data-theme="dark"
				/>
				<input ref={reCaptchaHiddenRef} type="text" hidden readOnly />
				<button onClick={onClickSignUp} className={styles['c-account-signUp-btn-create']}>
					Create an account
				</button>
			</div>

			<div className={styles['c-account-signUp-others']}>
				<span>?????? ???????????? ????????????</span>
				<button onClick={onClickGoogleSignUp}>
					<span>
						<FcGoogle />
					</span>
					Sign Up with Google
				</button>
			</div>

			<div>
				?????? <span onClick={onClickReturnLogin}>?????????</span>?????? ??????
			</div>
		</div>
	);
};

export default SignUp;
