import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../../../scss/app.scss';

interface Card {
	no: number;
	link: string;
	imagePath: string;
	title?: string;
	description1?: any;
	description2?: any;
}

const PageCard = (card: Card) => {
	const [image, setImage] = useState();

	useEffect(() => {
		import('../../../assets/images/' + card.imagePath).then(res => setImage(res.default)).catch();
	}, []);
	// 경로의 부분 명시가 필요함
	// 상단에서 소스를 import할 경우에는 첫 글자가 capital이어야함

	return (
		<Link to={card.link} className={styles['c-page-main-pageCard']}>
			<div>
				<div className={styles['c-page-main-pageCard-img']}>
					<img src={image} alt="image" />
				</div>

				<div className={styles['c-page-main-pageCard-description']}>
					<h3>{card.title}</h3>
					<ul>
						<li>{card.description1}</li>
						<li>{card.description2}</li>
					</ul>
				</div>
			</div>
		</Link>
	);
};

export default PageCard;
export { Card };
