import { useReducer, createContext, useMemo } from 'react';

interface Action {
	type: 'LOGIN' | 'INIT' | 'LOGOUT' | 'SET_ACCESS_TOKEN' | null;
	value?: {
		accessToken: string | null;
		userID?: string | null;
	};
}

interface State extends Action {
	payload?: any;
	error: false | true;
	meta?: string;
}

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				...action,
			};

		case 'INIT':
			return {
				...state,
				...action,
			};

		case 'LOGOUT':
			return {
				...state,
				value: { ...state.value, accessToken: null, userID: null },
			};

		case 'SET_ACCESS_TOKEN':
			return {
				...state,
				value: { ...state.value, accessToken: action.value?.accessToken! },
			};

		default:
			throw new Error('Unhandled action');
	}
};

const UserContext = createContext<{ state: State } | null>(null);
let userDispatch: React.Dispatch<Action>;

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const initState: State = useMemo(() => {
		return { type: null, value: { accessToken: null, userID: null }, error: false };
	}, []);

	const [state, dispatch] = useReducer(reducer, initState);
	userDispatch = dispatch;

	return <UserContext.Provider value={{ state }}>{children}</UserContext.Provider>;
};

export { UserContextProvider, UserContext, userDispatch };
