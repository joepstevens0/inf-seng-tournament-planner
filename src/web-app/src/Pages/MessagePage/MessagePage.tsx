import React, { useEffect, useState } from 'react';

import styles from './MessagePage.module.css';

import ChatBox from '../../Components/ChatBox/ChatBox';
import SmallUserCard from '../../Components/SmallUserCard/SmallUserCard';
import { User } from '../../typedefs/firebaseTypedefs';
import { getChatP2PId } from "../../Services/FirebaseFunctions/teamfinder";
import Cookies from 'js-cookie';
import { getAllChatUsers } from '../../Services/FirebaseFunctions/user';

function MessagePage(props: Object) {
  const [userChats, setUserChats] = useState(
    [] as { user: User; chatId: string | null }[]
  );
  const [openIndex, setOpenIndex] = useState(-1 as number);
  const [openChatId, setOpenChatId] = useState(null as string | null);

  // get all users on create
  useEffect(() => {
    getAllChatUsers(Cookies.get("userId")!).then(
      (response: { status: number; body: User[] }) => {
        if (response.status !== 200) {
          console.error("Failed to get users from database");
          return;
        }

        // filter logged in user
        const tc = response.body.filter((user: User) => {
          if (user.id === Cookies.get("userId")) return false;
          return true;
        });

        // set userchats
        const t = tc.map((user: User) => {
          return { user: user, chatId: null };
        });
        setUserChats(t);
      }
    );
  }, []);

  // fetch the chatId if not yet fetched for open chat
  useEffect(() => {
    /**
     * Fetches the chat id from the database for the current open chat
     * @pre openIndex is a valid index for userChats
     * @pre chat not yet fetched
     * @pre user is logged in
     * @post chatId for current open chat is updated to the correct value
     */
    async function fetchChatId() {
      console.debug("Fetching new chat id");
      getChatP2PId(userChats[openIndex].user.id).then((response) => {
        if (response.status !== 200) {
          console.error("Failed to get new chat id");
          return;
        }

        // update userchat
        const newUserChats = [...userChats];
        newUserChats[openIndex].chatId = response.body;
        setUserChats(newUserChats);
        console.debug("Succesfully fetched chat id:", response.body);
      });
    }

    // test if open index is valid
    if (openIndex === -1 || openIndex < 0 || openIndex > userChats.length)
      return;

    // fetch chat if not yet fetched
    if (userChats[openIndex].chatId === null) fetchChatId();

    // change the new open chat id
    setOpenChatId(userChats[openIndex].chatId);
    console.log("opend chat");
  }, [openIndex, userChats]);

  /**
   * Called on click on usercard
   * @param user from the usercard clicked
   * @post changes the openIndex to the index of user in userChats
   */
  function onUserClick(user: User) {
    console.debug("Opening chat with user:", user);
    for (let i = 0; i < userChats.length; ++i) {
      if (userChats[i].user.id === user.id) {
        setOpenIndex(i);
        return;
      }
    }
  }

  // create chat cards
  const usercards = userChats.map(
    (userChat: { user: User; chatId: string | null }) => (
      <div key={userChat.user.id} className={styles.usercard}>
        <SmallUserCard
          highlight={openChatId !== null && openChatId === userChat.chatId}
          onClick={onUserClick}
          user={userChat.user}
        ></SmallUserCard>
      </div>
    )
  );

  return (
    <div className={styles.messagepage}>
      <div className={styles.usercards}>{usercards}</div>
      <div className={styles.chatbox}>
        {openChatId === null ? (
          <div key={"NoChat"}>No open chat</div>
        ) : (
          <ChatBox key={openChatId} chatId={openChatId}></ChatBox>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
