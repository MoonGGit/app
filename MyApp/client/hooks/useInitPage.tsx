import { clickCounterDispatch } from '../context/ClickCounterContext';
import axios from 'axios';

const useInitPage = () => {
	axios
		.get('http://localhost:4000/accessed_ip')
		.then(res => {
			const clickCounts = res.data.reduce(
				(counts: number, cur: { click_counts: string }) => counts + parseInt(cur.click_counts),
				0,
			);
			clickCounterDispatch({ type: 'INIT', value: clickCounts });
		})
		.catch(err => console.log(err));
};

export default useInitPage;
