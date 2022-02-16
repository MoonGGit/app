import { useEffect, useRef, useState } from 'react';
import { Switch, Route, useRouteMatch, useParams, Link, Redirect, useHistory } from 'react-router-dom';
import styles from '../scss/app.scss';
import axios from 'axios';
import MainLogo from '../assets/images/logo_white_back.png';
import ChatRoomCard from '.././components/page/chat/ChatRoomCard';
import cn from 'classnames';
import { AiOutlineReload } from 'react-icons/ai';

// import io from 'socket.io-client';

// data

interface Message {
	id: string;
	nickname: string;
	ip: string;
	content: string;
	date: string;
	visible: boolean | 'banned' | 'deleted';
}

const room1Chat: Message[] = [
	{
		id: 'id1',
		nickname: 'nick1',
		ip: '1.1.1.1',
		content: '안녕하세요1',
		date: '9.16 11:11',
		visible: true,
	},
	{
		id: 'id2',
		nickname: 'nick2',
		ip: '1.1.1.2',
		content: '안녕하세요2',
		date: '9.16 11:11',

		visible: true,
	},
	{
		id: 'id1',
		nickname: 'nick1',
		ip: '1.1.1.1',
		content: '',
		date: '9.16 11:11',
		visible: 'deleted',
	},
	{
		id: 'id2',
		nickname: 'nick2',
		ip: '1.1.1.2',
		content: '',
		date: '9.16 11:11',
		visible: 'banned',
	},
	{
		id: 'id3',
		nickname: 'nick3',
		ip: '1.1.1.3',
		content: '안녕하세요3',
		date: '9.16 11:11',
		visible: true,
	},
];

interface EnteredRoom {
	no: number;
	unreadMessages: number;
	messages: Message[] | [];
}

const _enteredRooms: EnteredRoom[] = [
	{ no: 1, unreadMessages: 2, messages: room1Chat },
	{ no: 2, unreadMessages: 0, messages: room1Chat },
	{ no: 3, unreadMessages: 200, messages: [] },
];
const roomInfo = [
	{
		no: 1,
		title: 'room1 title',
		joinedNumOfUser: 3,
		maxNumOfUser: 4,
		password: true,
		host: 'host1',
	},
	{
		no: 2,
		title: 'room2 title',
		joinedNumOfUser: 3,
		maxNumOfUser: 4,
		password: false,
		host: 'host2',
	},
	{
		no: 3,
		title: 'room3 title',
		joinedNumOfUser: 3,
		maxNumOfUser: 4,
		password: true,
		host: 'host3',
	},
	{
		no: 4,
		title: 'room4 title',
		joinedNumOfUser: 3,
		maxNumOfUser: 4,
		password: false,
		host: 'host4',
	},
];
const allUsers = ['user1123123123', 'user2', 'user3', 'user4', 'user9'];

const room1Users = ['user3', 'user4', 'user5', 'user7'];

const Chat = ({ handleSetCurrentRoute }: { handleSetCurrentRoute: Function }) => {
	const { url, path } = useRouteMatch();
	const [enteredRooms, setEnteredRooms] = useState<EnteredRoom[]>([]);
	const [users, setUsers] = useState<string[]>([]);
	const [roomsInfo, setRoomsInfo] = useState<any[]>([]);
	const [selectedRoomNo, setSelectedRoomNo] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const history = useHistory();
	const [searchRoom, setSearchRoom] = useState<string>('');
	const inputSearchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		handleSetCurrentRoute(path);
		setEnteredRooms(_enteredRooms);
		onClickSearchRoom();
	}, []);

	const handleEnterRoom = (no: number) => {
		if (enteredRooms.map(enteredRoom => enteredRoom.no).includes(no)) {
			setUsers(room1Users);
			setSelectedRoomNo(no);
			setMessages(enteredRooms.filter(enteredRoom => enteredRoom.no == no)[0].messages);
			history.push(`${url}/${no}`);
		}
	};
	console.log(messages);

	const onClickEnteredRoom = (event: React.MouseEvent<HTMLAnchorElement>) => {
		setUsers(room1Users);
		const href = event.currentTarget.href;
		const roomNo = href.slice(href.lastIndexOf('/'))[1];
		setSelectedRoomNo(parseInt(roomNo));
	};

	const onClickSearchRoom = () => {
		setUsers(allUsers);
		setRoomsInfo(roomInfo);
		setSelectedRoomNo(null);
	};

	const onChangeSearchRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchRoom(event.currentTarget.value);
	};

	const onClickTest = () => {
		axios({
			url: '/chat/room/QaskdnqA1',
			method: 'GET',
		})
			.then(res => {
				console.log(res);
			})
			.catch(err => console.log(err));
	};

	// const socket = io('/room_click', {
	// 	transports: ['websocket'],
	// 	upgrade: false,
	// });
	// socket.on('someone_clicked', res => {
	// 	// socket은 res로 데이터가 바로 넘어옴
	// 	const { visitorName } = res;
	// 	if (visitorName != global_value.socket_visitorName) clickCounterDispatch({ type: 'INCREMENT' });
	// });

	// axios.put('/click').catch(err => console.log('clickEffect : ', err));
	// 중복요청으로 세션엉킴
	// todo : 소켓서버
	// socket.emit('click', { visitorName: global_value.socket_visitorName });
	return (
		<div className={styles['p-chat-container']}>
			<nav>
				<header>
					<Link to="/">
						<img src={MainLogo} />
					</Link>
				</header>
				<div>
					<ul>
						{enteredRooms.map(room => {
							return (
								<li key={room.no}>
									<Link to={`${url}/${room.no}`} onClick={onClickEnteredRoom}>
										<div>
											<span>{room.no}</span>
										</div>
										{room.unreadMessages > 99 ? <div>99</div> : room.unreadMessages == 0 ? '' : <div>{room.unreadMessages}</div>}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>

			<div className={styles['p-chat-visitors']}>
				<header>
					<span>{selectedRoomNo ? `${selectedRoomNo}번 방 참여자(${users.length})` : `접속유저(${users.length})`}</span>
				</header>
				<div>
					<ul>
						{users.map(user => {
							return (
								<li key={user} title={user}>
									{user}
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<main>
				<header>
					{selectedRoomNo ? (
						<>
							<Link to={`${url}`} onClick={onClickSearchRoom}>
								방 찾기
							</Link>
							<div>navMenu</div>
						</>
					) : (
						<>
							<input type="text" placeholder=" 방 제목 검색" ref={inputSearchRef} onChange={onChangeSearchRoom} />
							{/* <button onClick={onClickSearchRoom} className={styles['gc-button-grey']}> */}
							<button onClick={onClickTest} className={styles['gc-button-grey']}>
								<AiOutlineReload />
							</button>
						</>
					)}
				</header>
				<Switch>
					<Route exact path={path}>
						<div className={styles['p-chat-roomList-container']}>
							{searchRoom
								? roomsInfo.filter(roomInfo => roomInfo.title.includes(searchRoom)).map(roomInfo => {
									return <ChatRoomCard key={roomInfo.no} handleEnterRoom={handleEnterRoom} roomInfo={roomInfo} />;})
								: roomsInfo.map(roomInfo => {
										return <ChatRoomCard key={roomInfo.no} handleEnterRoom={handleEnterRoom} roomInfo={roomInfo} />;
								  })}
						</div>
					</Route>
					<Route path={`${path}/:room`}>
						<div className={styles['p-chat-room-message-container']}>
							{messages.map((message, i) => {
								const myMessage = i == 3;

								return (
									<div key={i} className={cn(styles['p-chat-room-message-wrapper'], { [styles['p-chat-room-message-self']]: myMessage })}>
										<div>
											<span>{message.nickname}</span>
											<span>ip:{message.ip}</span>
										</div>
										<br />
										<div>
											<span>{message.visible == true ? message.content : message.visible == 'banned' ? 'banned' : 'deleted'}</span>
											<span>{message.date}</span>
										</div>
									</div>
								);
							})}
						</div>
					</Route>
				</Switch>
			</main>
		</div>
	);
};

export default Chat;
