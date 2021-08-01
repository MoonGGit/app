import { useEffect } from 'react';
import { clickCounterDispatch } from '../context/ClickCounterContext';
import { userDispatch } from '../context/UserContext';
import axios from 'axios';
import io from 'socket.io-client';

const useInitPage = () => {
	useEffect(() => {
		axios
			.get('/init')
			.then(res => {
				console.log('init received data : ', res.data);
				const { click_counts, visitorName, userID } = res.data;
				clickCounterDispatch({ type: 'INIT', value: click_counts });
				userDispatch({ type: 'INIT', value: { visitorName: visitorName, userID: userID } });
			})
			.catch(err => console.log('useInitPage : ', err));

		const socket = io(
			'/room_click' /* , {
			transports: ['websocket'],
		} */,
		);
		socket.on('someone_clicked', res => {
			console.log('someone_clicked data : ', res.data);
			/* todo : 자기자신은 제외 */
			clickCounterDispatch({ type: 'INCREMENT' });
		});
	}, []);
};

export default useInitPage;
