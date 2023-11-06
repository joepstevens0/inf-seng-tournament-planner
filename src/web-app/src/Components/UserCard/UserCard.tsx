import React from "react";
import styles from "./UserCard.module.css";
import { Props } from "./Props";

function UserCard(props: Props) {
  const user = props.user;

  /**
   * called when usercard is clicked, calles the onClick prop
   * @post onClick prop function is called
   */
  function onClick() {
    if (props.onClick !== undefined) props.onClick(user);
  }

  /**
   * Checks whether a JSX component is clickable
   * @returns `boolean`  
   */
  function clickable(): boolean {
    return props.onClick !== undefined;
  }

  return (
    <div
      className={
        styles.card_div + " " + (clickable() ? styles.card_clickable : "")
      }
      onClick={onClick}
    >
      <div className={styles.card_nickname}>{user.nickname}</div>
    </div>
  );
}

export default UserCard;
