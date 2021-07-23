import cn from 'classnames';
import bs from './scss/init.scss';
import { RiRocketLine } from 'react-icons/ri';

const FixedTopButton = () => {
	return (
		// todo-check : 웹표준 태그 및 속성
		<a
			href="#"
			className={cn(bs['btn'], bs['btn-secondary'], bs['btn-lg'], bs['fixedTopButton'], bs['op-4'])}
			role="link"
		>
			<RiRocketLine />
		</a>
	);
};

export default FixedTopButton;
