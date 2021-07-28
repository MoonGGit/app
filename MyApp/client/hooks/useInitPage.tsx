import { clickCounterDispatch } from '../context/ClickCounterContext';
import axios from 'axios';

const useInitPage = () => {
	axios
		.get('/init')
		.then(res => {
			const clickCounts = res.data.click_counts;
			clickCounterDispatch({ type: 'INIT', value: clickCounts });
		})
		.catch(err => console.log(err));
};

export default useInitPage;
