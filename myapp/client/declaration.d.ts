declare module '*.scss';
declare module '*.css';
declare module '*.png';
declare module '*.jpg';

declare interface Window {
	Kakao: any;
	onClickRecaptcha: any;
	onExpiredRecaptcha: any;
	grecaptcha: any;
	gapi: any;
}
