import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

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
