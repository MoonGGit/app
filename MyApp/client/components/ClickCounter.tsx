import { useContext, useEffect, useRef } from 'react';
import { ClickCounterContext } from '../context/ClickCounterContext';
import bs from '../components/scss/init.scss';

const ClickCounter = ({ className }: { className: string }) => {
	const { state } = useContext(ClickCounterContext)!;
	const spanRef = useRef<HTMLElement>(null);

	useEffect(() => {
		spanRef?.current!.classList.toggle(bs['clickCounter']);
	}, [state]);

	return (
		<span className={className}>
			꾹꾹 : <small ref={spanRef}>{state.value}</small>
		</span>
	);
};

export default ClickCounter;
