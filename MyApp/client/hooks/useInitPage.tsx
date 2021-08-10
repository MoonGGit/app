import { useEffect } from 'react';
import { clickCounterDispatch } from '../context/ClickCounterContext';
import { userDispatch } from '../context/UserContext';
import axios from 'axios';
// import io from 'socket.io-client';
import { globalValue } from '../helper/init';

const useInitPage = () => {
	useEffect(() => {
		axios
			.get('/init')
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					console.log('init received data : ', value);
					const { click_counts, visitor_name, access_token, user_id } = value;

					clickCounterDispatch({ type: 'INIT', value: click_counts });
					userDispatch({ type: 'INIT', value: { accessToken: access_token, userID: user_id } });
					globalValue.socketVisitorName = visitor_name;
				} else {
					alert(message);
				}
			})
			.catch(err => alert(err));

		// const socket = io('/room_click', {
		// 	transports: ['websocket'],
		// 	upgrade: false,
		// });
		// socket.on('someone_clicked', res => {
		// 	// socket은 res로 데이터가 바로 넘어옴
		// 	const { visitorName } = res;
		// 	if (visitorName != global_value.socket_visitorName) clickCounterDispatch({ type: 'INCREMENT' });
		// });
	}, []);
};

export default useInitPage;
