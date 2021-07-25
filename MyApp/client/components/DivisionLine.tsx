import bs from '../components/scss/init.scss';
import cn from 'classnames';

const DivisionLine = () => {
	return <h3 className={cn(bs['m-3'], bs['m-md-5'], bs['divisionLine'])}></h3>;
};

export default DivisionLine;
