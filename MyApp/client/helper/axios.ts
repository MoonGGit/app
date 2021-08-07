import axios from 'axios';

const customAxios = (url: string, method: string, data: JSON) => {
	axios({})
		.then(res => res.data)
		.catch(err => err);
};
