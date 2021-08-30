import { useCallback, useEffect, useState } from 'react';

const useScroll = (stopScroll: number | null) => {
	const [scroll, setScroll] = useState(0);

	const onScroll = useCallback(() => {
		const changedScrollY = window.scrollY;
		if (stopScroll ? stopScroll >= changedScrollY : true) {
			setScroll(changedScrollY);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	return scroll;
};

export default useScroll;
