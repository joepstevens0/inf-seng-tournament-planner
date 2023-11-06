import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { environment } from '../../Environments/environments';
import { createNewMessage, getMessages } from "../../Services/FirebaseFunctions/teamfinder";
import { getUserFromId } from "../../Services/FirebaseFunctions/user";
import { ChatMessage } from '../../typedefs/firebaseTypedefs';
import styles from './ChatBox.module.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Props } from './Props';
import { FireBaseResult } from '../../typedefs/FireBaseResult';

function ChatBox(props: Props) {
	const [ messages, setMessages ] = useState([] as ChatMessage[]);
	const [ textInput, setTextInput ] = useState('');
	const [ usernames, setUsernames ] = useState(new Map<string, string>());

	const messagesRef = useRef(messages);
	const usernameRef = useRef(usernames);

	const chatId = props.chatId;

	const lastMessage = useRef<HTMLDivElement>(null);
	useEffect(
		() => {
			if (chatId === undefined) return;

			// get all messages in the chat
			console.debug('Retrieving all messages from chat...');
			getMessages(chatId).then(async (response: {status: number,body: ChatMessage[]}) => {
				if (response.status !== 200)
					return;
				const allMessages = response.body;
				console.debug('Got messages from database:', allMessages);
				setMessages(allMessages);
				messagesRef.current = allMessages;

				// fetch usernames for new messages
				await addUserNamesFromIds(allMessages);

				// scroll to bottom of chat
				if (allMessages.length > 0) scrollToBottom();
			});

			// subcribe to chat
			console.debug('Connecting to chat...');
			const client = new EventSource(environment.messageStream + chatId + "/" + Cookies.get("userId"));

			client.onopen = () => {
				console.debug('Chat connection opened');
			};
			client.onerror = (error: any) => {
				console.debug('Chat connection error:', error);
			};

			// add new message listener
			client.addEventListener('message', (event) => {
				console.debug('New chat update received', event.data);

				// add new chat messages
				const newmessages = JSON.parse(event.data) as ChatMessage[];
				for (let i = 0; i < newmessages.length; ++i) {
					addMessage(newmessages[i]);
				}

				// fetch usernames for new messages
				addUserNamesFromIds(newmessages);
			});

			return function cleanup() {
				client.close();
				console.debug('Closed chat connection');
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ props.chatId ]
	);

	const messageListElement = useRef<HTMLUListElement>(null);
	useEffect(
		() => {
			// scroll to the bottom when a new message is added and the scrollbar was at the bottom or almost at the bottom
			const ul = messageListElement.current;
			if (!ul) return;
			if (ul.scrollHeight - ul.scrollTop <= ul.clientHeight + 50) {
				scrollToBottom();
			}
		},
		[ messages ]
	);

	/**
     * scrolls to the bottom of the chat
     * @post the last message in the chat is visible
     */
	function scrollToBottom() {
		console.debug('Scrolling chat to the bottom');
		if (lastMessage.current != null) lastMessage.current.scrollIntoView({ behavior: 'smooth' });
	}

	/**
     * adds the username of every unique senderId in messages to the usernames map
     * @post the new username of all senderId's are added to the usernames map
     */
	async function addUserNamesFromIds(messagelist: ChatMessage[]) {
		const userMap = new Map<string, string>(usernameRef.current);

		// for every message
		for (let i = 0; i < messagelist.length; ++i) {
			const m = messagelist[i];

			// if username already in map, return
			if (userMap.has(m.senderId)) continue;

			// get user from database
			await getUserFromId(m.senderId).then((response: any) => {
				// return if user not found
				if (response.status !== 200) return;

				// add username to map
				console.debug('New user in chat: id=' + m.senderId + ', nickname=' + response.body.nickname);
				userMap.set(m.senderId, response.body.nickname);
			});
		}
		usernameRef.current = userMap;
		setUsernames(userMap);
	}

	/**
     * Add a new message to the chat
     * @post message is added to the chat if not already in th chat
     * @param message adding to the chat
     */
	function addMessage(message: ChatMessage) {
		const allMessages = messagesRef.current;
		// test is message already in chat
		let found = false;
		allMessages.forEach((m: ChatMessage)=>{
			if (m.time + '|' + m.senderId === message.time + '|' + message.senderId){
				found = true;
				return;
			}
		});
		// return if already in chat
		if (found)
			return;
		if (!allMessages.includes(message)){
			messagesRef.current = [ ...messages, message ];
			setMessages((messages) => [ ...messages, message ]);
		}
	}

	/**
     * update the textInput value on input
     * @param e input event
     * @post textInput value is changed to the new input
     */
	function handleInputChange(e: any) {
		setTextInput(e.target.value);
	}

	/**
     * send the chat message
     * @pre user is logged in
     * @pre chat message is typed in the textfield
     * @post chat message is added into the database of the chat
     */
	function onSend() {
		if(textInput.length <= 0){
			return
		}

		console.debug('Sending message:', textInput, ',to chat with id:', chatId);

		const message = { time: Date.now(), senderId: Cookies.get('userId'), message: textInput } as ChatMessage;

		createNewMessage(message, chatId).then((response: FireBaseResult)=>{
			if (response.status === 200)
				addMessage(message);
			else{
				alert("Failed to send message, try again");
			}
		});

		scrollToBottom();

		setTextInput('');
	}

	// create message elements
	const messageelements = messages.map((message: ChatMessage) => (
		<li key={message.time + '|' + message.senderId} className={styles.chatmessage}>
			<div className={styles.username}>{usernames.get(message.senderId)}</div>
			<div className={styles.messagetime}>{new Date(message.time).toLocaleTimeString()}</div>
			<div className={styles.messagedata}>{message.message}</div>
		</li>
	));

	return (
		<div className={styles.chatboxdiv}>
			<h3>chatbox</h3>
			<ul className={styles.messagelist} ref={messageListElement}>
				{messageelements}
				<div key={"lastmessage"} ref={lastMessage} />
			</ul>
			<div className={styles.messagecreation}>
				{Cookies.get('userId') !== undefined ? (
					[
						<div key="messagecreation" className={styles.messagecreation_field}>
							<TextField fullWidth={true} value={textInput} onChange={handleInputChange} />
						</div>,
						<div key="messagesend" className={styles.messagecreation_sendbutton}>
							<Button onClick={onSend}>send</Button>
						</div>
					]
				) : (
					<div key="login" className={styles.not_loggedin_text}>
						<Link to="/login">Login to chat</Link>
					</div>
				)}
			</div>
		</div>
	);
}

export default ChatBox;
