import cn from 'classnames';
import PageCard, { Card } from './PageCard';
import styles from '../../../scss/app.scss';

const cardList: Card[] = [
	{
		no: 1,
		link: './dots-converter',
		imagePath: 'pixel.png',
		title: "Image to Dots(Pixels)'s block Converter",
		description1: '이미지를 도트형식으로 변환시켜 드립니다.',
		description2: '',
	},
	{
		no: 2,
		link: './chat',
		imagePath: 'comming_soon.png',
		title: 'chat',
		description1: 'chat 1',
		description2: 'chat 2',
	},
	{
		no: 3,
		link: '#',
		imagePath: 'comming_soon.png',
		title: '',
		description1: '',
		description2: '',
	},
	{
		no: 4,
		link: '#',
		imagePath: 'comming_soon.png',
		title: '',
		description1: '',
		description2: '',
	},
];

const PageCardList = ({ className }: { className: string }) => {
	return (
		<section className={cn(styles['c-page-main-pageCardList'], className)}>
			<div>
				{cardList.map(card => (
					<PageCard key={card.no} {...card} />
				))}
			</div>

			<div className={styles['c-page-main-pageCardList-sticky']}>
				* 공사중 * <br /> * 아직 개발모드 입니다. *
			</div>
		</section>
	);
};

export default PageCardList;
