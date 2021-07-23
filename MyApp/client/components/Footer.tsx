import cn from 'classnames';
import bs from './scss/init.scss';

const Footer = () => {
	return (
		<footer className={cn(bs['d-flex'], bs['align-items-end'], bs['justify-content-center'], bs['footer'])}>
			<div
				className={cn(
					bs['d-flex'],
					bs['justify-content-center'],
					bs['flex-wrap'],
					bs['efs-2'],
					bs['fw-bolder'],
					bs['mb-2'],
				)}
			>
				<span>문지현</span>&nbsp;|&nbsp;<span>answlgus1122@gmail.com</span>&nbsp;|&nbsp;
				<span>ⓒ 2021 Moon JiHyeon. All rights reserved.</span>
			</div>
		</footer>
	);
};

export default Footer;
