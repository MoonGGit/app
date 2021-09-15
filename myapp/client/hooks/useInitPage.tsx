import { useEffect } from 'react';
import { clickCounterDispatch } from '../context/ClickCounterContext';
import { userDispatch } from '../context/UserContext';
import axios from 'axios';
import { globalValue } from '../helper/init';
import { getCookie } from '../helper/init';

const useInitPage = () => {
	useEffect(() => {
		axios({
			url: '/init',
			method: 'POST',
			headers: {
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					console.log('init received data : ', value);
					const { click_counts, visitor_name, access_token, user_id, oauth, nickname } = value;

					clickCounterDispatch({ type: 'INIT', value: click_counts });
					userDispatch({ type: 'INIT', value: { accessToken: access_token, userID: user_id, oauth: oauth, nickname: nickname } });
					globalValue.socketVisitorName = visitor_name;
				} else {
					alert(message);
				}
			})
			.catch(err => alert(err));
	}, []);
};

export default useInitPage;
