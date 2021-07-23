import { useEffect, useRef, useState } from 'react';
import { TiStar, TiAdjustBrightness, TiAnchor } from 'react-icons/ti';
import bs from './scss/init.scss';

const effectList = [TiStar, TiAdjustBrightness, TiAnchor];

// todo-update : effect와 class를 파라미터로 받기
const Effect = ({ x, y }: { x: number; y: number }) => {
	const [endOfEffect, setEndOfEffect] = useState(false);
	const effectRef = useRef<HTMLElement>(null);

	const randomIndex = Math.floor(Math.random() * 3);
	const RandomEffect = effectList[randomIndex];

	useEffect(() => {
		const target = effectRef?.current!;
		const toX = x - target.offsetWidth / 2;
		const toY = y - target.offsetHeight / 2;

		target.style.left = toX + 'px';
		target.style.top = toY + 'px';
		console.log('꾹');
		setTimeout(() => {
			setEndOfEffect(true);
		}, 700);
	}, []);

	return !endOfEffect ? (
		<span ref={effectRef} className={bs['clickEffect']}>
			<RandomEffect />
		</span>
	) : (
		<></>
	);
};

const ClickEffect = () => {
	const [garbageCollection, setGarbageCollection] = useState<JSX.Element[]>([]);
	// todo-update : 유지 이펙트의 garbageCollection 비우기(참조없애기)

	const setEffect = (event: MouseEvent) => {
		let x = event.clientX;
		let y = event.clientY;

		// todo-check
		// setGarbageCollection([...garbageCollection, EffectElement]); 안됨
		// 컴포넌트 콜백과 리스너 콜백의 지역변수 저장 유무... 차이?
		setGarbageCollection(p => {
			const EffectElement = <Effect x={x} y={y} key={p.length} />;

			return [...p, EffectElement];
		});
	};

	useEffect(() => {
		document.body.addEventListener('click', setEffect);
		return () => {
			document.body.removeEventListener('click', setEffect);
		};
	}, []);

	return <>{garbageCollection.map((v, i) => v)}</>;
};

export default ClickEffect;
