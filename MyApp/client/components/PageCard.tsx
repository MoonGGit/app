import { Link } from 'react-router-dom';
import bs from './scss/init.scss';
import cn from 'classnames';
import { useState, useEffect } from 'react';

interface CardList {
	no: number;
	link: string;
	imagePath: string;
	title?: string;
	description1?: any;
	description2?: any;
}

const PageCard = (props: CardList) => {
	const [image, setImage] = useState();

	useEffect(() => {
		import('../assets/images/' + props.imagePath).then(v => setImage(v.default)).catch();
	}, []);
	// 경로의 부분 명시가 필요함
	// 상단에서 소스를 import할 경우에는 첫 글자가 capital이어야함

	return (
		<Link to={props.link} className={cn(bs['card'], bs['mb-4'], bs['pageCard'])}>
			<div className={cn(bs['row'], bs['g-0'], bs['flex-nowrap'], bs['overflow-auto'])}>
				<div className={cn(bs['col-4'], bs['overflow-hidden'], bs['align-items-center'], bs['d-flex'])}>
					<img src={image} alt="image" className={cn(bs['w-100'], bs['h-auto'])} />
				</div>
				<div
					className={cn(
						bs['col-8'],
						bs['card-body'],
						bs['pb-0'],
						bs['p-3'],
						bs['p-md-4'],
						bs['pb-md-0'],
						bs['p-lg-5'],
						bs['pb-lg-0'],
						bs['overflow-auto'],
					)}
				>
					<h3 className={bs['card-title']}>{props.title}</h3>
					<ul className={cn(bs['my-2'], bs['my-md-4'])}>
						<li>{props.description1}</li>
						<li>{props.description2}</li>
					</ul>
				</div>
			</div>
		</Link>
	);
};

export default PageCard;
export { CardList };
