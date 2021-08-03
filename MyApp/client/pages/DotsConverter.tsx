import { useEffect } from 'react';
import DivisionLine from '../components/DivisionLine';
import DotsConverterMain from '../components/DotsConverter';

const DotsConverter = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<div>
			<div style={{ height: '500px' }} />
			<DivisionLine />
			<h1>Dots_converter page </h1>
			<DotsConverterMain className={''} />
			<DivisionLine />
			<div style={{ height: '500px' }} />
		</div>
	);
};

export default DotsConverter;
