import { useEffect, useState } from 'react';
import styles from '../../../scss/app.scss';

const dd = [
	{
		no: '1',
		title: 'room1 title',
		joinedNumOfUser: '3',
		maxNumOfUser: '4',
		password: true,
		host: 'host1',
	},
];
const ChatRoomCard = ({ roomInfo, handleEnterRoom }: { roomInfo: any; handleEnterRoom: Function }) => {
	const onClickEnterRoom = (event: React.MouseEvent) => {
		handleEnterRoom(roomInfo.no);
	};

	return (
		<div className={styles['c-page-chat-container']} onClick={onClickEnterRoom}>
			<div>
				<span>{`${roomInfo.no}. ${roomInfo.title}`}</span>
				<span>{`(${roomInfo.joinedNumOfUser}/${roomInfo.maxNumOfUser})`}</span>
			</div>
			<div>
				<span>{`방장 : ${roomInfo.host}`}</span>
				{roomInfo.password ? <span>🔒</span> : ''}
			</div>
		</div>
	);
};

export default ChatRoomCard;
