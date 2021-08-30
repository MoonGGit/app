import { useEffect } from 'react';

const useScript = (url: string, async: boolean, callBack: Function | null = null) => {
	useEffect(() => {
		const script = document.createElement('script');
		script.src = url;
		script.async = async;

		if (callBack) {
			script.onload = () => {
				callBack();
			};
		}

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, [url]);
};

export default useScript;
