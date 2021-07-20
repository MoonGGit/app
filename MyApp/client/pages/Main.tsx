import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

import a from './test.scss';

export default function Main() {
	return (
		<div className={`${a.a}`}>
			Hello world, React typescript test yeah!
			<span className={`${a.c}`}>divvvv tag</span>
			<Button>boot strap test ttt</Button>
			<Button>boot strap test ttt</Button>
		</div>
	);
}
