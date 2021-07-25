/* CRUD, PGPD */
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// 받아온 데이터로 재 렌더링 할 경우 사용
const useFetch = (url: string) => {
	const [data, setData] = useState<AxiosResponse<any>>();

	useEffect(() => {
		axios
			.get(url)
			.then(res => {
				setData(res.data);
			})
			.catch(err => console.log(err));
	}, [url]);

	return data;
};

export default useFetch;
