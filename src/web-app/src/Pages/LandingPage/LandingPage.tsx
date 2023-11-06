import React, { useEffect, useState } from 'react';
import { getLoggedinUser } from "../../Services/FirebaseFunctions/auth";
import { Link } from 'react-router-dom';

import styles from './LandingPage.module.css';

/**
 * @author seansnellinx
 * Page which the user lands on initially
 */
function LandingPage(props: Object) {
	const [ notLoggedIn, setNotLoggedIn ] = useState<null | boolean>(null);

	// On mounting
	useEffect(() => {
		getLoggedUser();
	}, []);

	/**
	 * @see getLoggedinUser
	 */
	async function getLoggedUser() {
		let responseObject = await getLoggedinUser();
		console.log(responseObject);
		if (responseObject.status === 200) {
			setNotLoggedIn(false);
		} else {
			setNotLoggedIn(true);
		}
	}
	return (
		<div className={styles.landingpage_background}>
			<div className={styles.box}>
				<div className={styles.text_box}>
					<h2 className={styles.text_title}>Welcome to PlayConnect!</h2>
					<p className={styles.text_content}>
					PlayConnect is a website where you can create and find tournaments to enter with your friends 
					or with friends you don't know yet.
					<br/><br/>
					The founding fathers find it important that users can find people to connect with 
					over their passion for games, and their competitive spirit.
					<br/><br/>
					Software Engineering 2020-2021<br/>
					Sean Snellinx, Jente Vandersanden<br/>
					Joep Stevens, Brent Zoomers
					</p>
				</div>
				{notLoggedIn ? (
					<div className={styles.links_box}>
						<Link to="/login" className={styles.login_link}>
							<div className={styles.landingpage_login}>
								<p className={styles.link_text}>Login</p>
							</div>
						</Link>
						<Link to="/register" className={styles.register_link}>
							<div className={styles.landingpage_register}>
								<p className={styles.link_text}>Register</p>
							</div>
						</Link>
					</div>
				) : (
					<div />
				)}
			</div>
		</div>
	);
}

export default LandingPage;
