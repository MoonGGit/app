import { clickCounterDispatch } from '../context/ClickCounterContext';
import axios from 'axios';
import io from 'socket.io-client';

const useInitPage = () => {
	axios
		.get('/init')
		.then(res => {
			const clickCounts = res.data.click_counts;
			clickCounterDispatch({ type: 'INIT', value: clickCounts });
		})
		.catch(err => console.log(err));

	const socket = io('/room_click');
	socket.on('someone_clicked', res => {
		/* todo : 자기자신은 제외 */
		clickCounterDispatch({ type: 'INCREMENT' });
	});
};

export default useInitPage;
