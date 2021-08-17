import styles from '../../scss/app.scss';
import { useState, useEffect } from 'react';

const data = [
	{
		no: '1',
		image: 'test1',
	},
	{
		no: '2',
		image: 'test1',
	},
	{
		no: '3',
		image: 'test1',
	},
	{
		no: '4',
		image: 'test1',
	},
	{
		no: '5',
		image: 'test1',
	},
	{
		no: '50',
		image: 'test1',
	},
	{
		no: '6',
		image: 'test1',
	},
	{
		no: '7',
		image: 'test1',
	},
	{
		no: '8',
		image: 'test1',
	},
	{
		no: '9',
		image: 'test1',
	},
	{
		no: '10',
		image: 'test1',
	},
	{
		no: '11',
		image: 'test1',
	},
	{
		no: '12',
		image: 'test1',
	},
	{
		no: '13',
		image: 'test1',
	},
	{
		no: '14',
		image: 'test1',
	},
	{
		no: '15',
		image: 'test1',
	},
	{
		no: '16',
		image: 'test1',
	},
];

const Archive = () => {
	const [selectedContents, SetSelectedContens] = useState([]);

	useEffect(() => {
		// 데이터 받아오고
	}, []);

	return (
		<div className={styles['c-account-archive']}>
			<div className={styles['c-account-archive-contents']}>
				{data.map(cur => (
					<label htmlFor={`content-select-${cur.no}`} key={cur.no}>
						<div>
							{/* <img
								style={{
									width: '100%',
									height: '100px',
									backgroundColor: 'cornflowerblue',
								}}
								src=""
								alt={cur.image}
							/> */}
							<div
								style={{
									width: '110px',
									height: '100px',
									backgroundColor: 'cornflowerblue',
								}}
							></div>

							<input id={`content-select-${cur.no}`} type="checkbox" />
						</div>
					</label>
				))}
			</div>
			<div className={styles['c-account-archive-controllbox']}>
				<div>
					<input id="select-all" type="checkbox" />
					<label htmlFor="select-all">전체 선택</label>
				</div>

				<div>
					<button>download</button>
					<button>delete</button>
				</div>
			</div>
		</div>
	);
};

export default Archive;
