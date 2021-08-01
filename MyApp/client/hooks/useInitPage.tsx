import { useEffect, useContext } from 'react';
import { clickCounterDispatch } from '../context/ClickCounterContext';
import { userDispatch } from '../context/UserContext';
import axios from 'axios';
import io from 'socket.io-client';
import global_value from '../helper/variables';

const useInitPage = () => {
	useEffect(() => {
		axios
			.get('/init')
			.then(res => {
				console.log('init received data : ', res.data);
				const { click_counts, visitorName, userID } = res.data;
				clickCounterDispatch({ type: 'INIT', value: click_counts });
				userDispatch({ type: 'INIT', value: { userID: userID } });
				global_value.socket_visitorName = visitorName;
			})
			.catch(err => console.log('err useInitPage : ', err));

		const socket = io(
			'/room_click' /* , {
			transports: ['websocket'],
		} */,
		);
		socket.on('someone_clicked', res => {
			// socket은 res로 데이터가 바로 넘어옴
			const { visitorName } = res;
			if (visitorName != global_value.socket_visitorName) clickCounterDispatch({ type: 'INCREMENT' });
		});
	}, []);

	return <></>;
};

export default useInitPage;
