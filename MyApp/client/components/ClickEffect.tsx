import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TiStar, TiStarOutline } from 'react-icons/ti';
import bs from './scss/init.scss';
import { clickCounterDispatch } from '../context/ClickCounterContext';
import axios from 'axios';
// import io from 'socket.io-client';
import global_value from '../helper/variables';

const effectList = [TiStar, TiStarOutline];
// const socket = io('/room_click');

// todo-update : effect와 class를 파라미터로 받기
const Effect = ({ x, y }: { x: number; y: number }) => {
	const [endOfEffect, setEndOfEffect] = useState(false);
	const effectRef = useRef<HTMLElement>(null);

	const RandomEffect = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * effectList.length);
		return effectList[randomIndex];
	}, []);

	useEffect(() => {
		clickCounterDispatch({ type: 'INCREMENT' });
		// axios.put('/click').catch(err => console.log('clickEffect : ', err));
		// 중복요청으로 세션엉킴
		// todo : 소켓서버
		// socket.emit('click', { visitorName: global_value.socket_visitorName });

		const target = effectRef?.current!;
		const toX = x - target.offsetWidth / 2;
		const toY = y - target.offsetHeight / 2;

		target.style.left = toX + 'px';
		target.style.top = toY + 'px';
		console.log('꾹');
		setTimeout(() => {
			setEndOfEffect(true);
		}, 1500);
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
	// todo-update : 유지 이펙트의 garbageCollection 비우기(참조없애기) 추가

	const setEffect = useCallback((event: MouseEvent) => {
		let x = event.clientX;
		let y = event.clientY;

		setGarbageCollection(p => {
			const EffectElement = <Effect x={x} y={y} key={p.length} />;

			return [...p, EffectElement];
		});
	}, []);

	useEffect(() => {
		document.body.addEventListener('click', setEffect);
		return () => {
			document.body.removeEventListener('click', setEffect);
		};
	}, []);

	return <>{garbageCollection.map((v, i) => v)}</>;
};

export default ClickEffect;
