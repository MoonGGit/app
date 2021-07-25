import { useEffect } from 'react';

const DotsConverter = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<div>
			<div style={{ height: '500px' }} />
			Dots_converter page
			<div style={{ height: '500px' }} />
		</div>
	);
};

export default DotsConverter;
