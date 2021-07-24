import { useReducer, createContext, useMemo } from 'react';

// 타입 지정
interface Action {
	type: 'IMPLEMENT' | null;
	value?: number;
}

interface State extends Action {
	payload?: any;
	error: false | true;
	meta?: string;
}

// 리듀서
const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'IMPLEMENT':
			action.value ? action.value++ : state.value!++;
			// useReducer의 reducer 리턴타입이 있어서 무조건 리턴시켜줘야함
			return {
				...state,
				...action,
			};
		default:
			throw new Error('Unhandled action');
	}
};

// 컨텍스트 생성
// consumer는 useContext로 사용
const ClickCounterContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

/* state변경 시, 재렌더링 대상
	- Provider컴포넌트 자신 
	- Provider에서 제공하는 state와 dispatch를 사용하는 컴포넌트와 그 하위 컴포넌트 모두 
 */
const ClickCounterProvider = ({ children }: { children: React.ReactNode }) => {
	// 초기값
	const initState: State = useMemo(() => {
		return { type: null, value: 0, error: false };
	}, []);

	// 디스패치 생성, 컴포넌트 안에서만 사용가능
	const [state, dispatch] = useReducer(reducer, initState);

	return <ClickCounterContext.Provider value={{ state, dispatch }}>{children}</ClickCounterContext.Provider>;
};

export { ClickCounterProvider, ClickCounterContext };
