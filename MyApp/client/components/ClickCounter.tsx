import { useContext } from 'react';
import { ClickCounterContext } from '../context/ClickCounterContext';

const ClickCounter = ({ className }: { className: string }) => {
	const { state } = useContext(ClickCounterContext)!;

	return <span className={className}>꾹꾹 : {state.value}</span>;
};

export default ClickCounter;
