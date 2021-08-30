import { useContext, useEffect, useRef } from 'react';
import { ClickCounterContext } from '../../context/ClickCounterContext';
import styles from '../../scss/app.scss';

const ClickCounter = ({ className }: { className: string }) => {
	const { state } = useContext(ClickCounterContext)!;
	const spanRef = useRef<HTMLElement>(null);

	useEffect(() => {
		spanRef?.current!.classList.toggle(styles['c-global-clickCounter']);
	}, [state]);

	return (
		<span className={className}>
			꾹꾹 : <small ref={spanRef}>{state.value}</small>
		</span>
	);
};

export default ClickCounter;
