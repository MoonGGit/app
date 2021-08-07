import { useReducer, createContext, useMemo } from 'react';

interface Action {
	type: 'INCREMENT' | 'INIT' | null;
	value?: number;
}

interface State extends Action {
	payload?: any;
	error: false | true;
	meta?: string;
}

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'INCREMENT':
			action.value ? action.value++ : state.value!++;
			return {
				...state,
				...action,
			};

		case 'INIT':
			return {
				...state,
				...action,
			};

		default:
			throw new Error('Unhandled action');
	}
};

const ClickCounterContext = createContext<{ state: State } | null>(null);
let clickCounterDispatch: React.Dispatch<Action>;

/* state변경 시, 재렌더링 대상
	- Provider컴포넌트 자신
	- Provider에서 제공하는 값을 사용하는 컴포넌트와 그 하위 컴포넌트 모두 
 */
const ClickCounterProvider = ({ children }: { children: React.ReactNode }) => {
	const initState: State = useMemo(() => {
		return { type: null, value: 0, error: false };
	}, []);

	const [state, dispatch] = useReducer(reducer, initState);
	clickCounterDispatch = dispatch;

	return <ClickCounterContext.Provider value={{ state }}>{children}</ClickCounterContext.Provider>;
};

export { ClickCounterProvider, ClickCounterContext, clickCounterDispatch };
