import { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { getCookie } from '../../helper/init';
import { UserContext } from '../../context/UserContext';
import styles from '../../scss/app.scss';

const ArchiveContent = ({ no, handleSelectContent }: { no: number; handleSelectContent: Function }) => {
	const [data, setData] = useState<any>(null);

	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;
	const { accessToken } = userContextValue!;

	useEffect(() => {
		axios({
			url: `/user/archive/${no}`,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message, value } = res.data!;

				if (success) {
					setData({ value: value.data, fileName: value.file_name });
				} else {
					alert(message);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, []);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.stopPropagation();
		handleSelectContent(event);
	}, []);

	return (
		<label htmlFor={`content-select-${no}`}>
			<div>
				{data ? (
					<img src={data.value} data-no={no} data-filename={data.fileName} alt="Thumbnail" />
				) : (
					<div className={styles['gc-loading-wheel-img']} />
				)}
				<input id={`content-select-${no}`} type="checkbox" onChange={onChange} />
			</div>
		</label>
	);
};

export default ArchiveContent;
