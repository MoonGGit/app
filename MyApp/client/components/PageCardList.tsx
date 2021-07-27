import bs from '../components/scss/init.scss';
import cn from 'classnames';
import PageCard, { Card } from './PageCard';

const cardList: Card[] = [
	{
		no: 1,
		link: './dots-converter',
		imagePath: 'test.jpg',
		title: "Image to Dots(Pixels)'s block Converter",
		description1: '이미지를 다트형식으로 변환시켜 드립니다.',
		description2: (
			<div>
				<br /> <br /> <span>* 업데이트 중 *</span>{' '}
			</div>
		),
	},
	{
		no: 2,
		link: '#',
		imagePath: 'comming_soon.png',
		title: '',
		description1: '',
		description2: '',
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
		<div className={cn(bs['row'], bs['col-md'], className)}>
			<div className={cn(bs['col-12'], bs['col-md-9'])}>
				{cardList.map(card => (
					<PageCard key={card.no} {...card} />
				))}
			</div>
			<div className={cn(bs['col-12'], bs['col-md-3'], bs['p-4'], bs['pt-2'], bs['v-invisible'], bs['v-md-visible'])}>
				test info
			</div>
		</div>
	);
};

export default PageCardList;
