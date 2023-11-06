import { Button, TextField } from '@material-ui/core';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createNewUser } from '../../Services/FirebaseFunctions/user';
import { User } from '../../typedefs/firebaseTypedefs';
import styles from './RegisterPage.module.css';
import {
	isValidEmail,
	isValidNickname,
	isValidPassword,
	doPasswordsMatch,
	isValidBio
} from '../../Services/formValidation';
/**
 * @author brentzoomers, jentevandersanden
 * Page which serves the front-end register functionality of the platform.
 */

function RegisterPage(props: Object) {
	// Input field state
	const [ formFields, setFormFields ] = useState({
		email: '',
		nickname: '',
		password: '',
		confirmedPassword: '',
		bio: '',
		allFieldsCorrectFormat: false,
		errors: {
			serverSide: '',
			email: '',
			nickname: '',
			password: '',
			confirmedPassword: '',
			bio: ''
		}
	});

	const history = useHistory();
	/**
   * This method creates a new User object and
   * inserts it into the Google Firestore Database, making use of the
   * set up back-end API endpoints.
   * @pre : userObject is complete, the form is checked and validated for possible malicious values.
   * @post : A new User object was made and inserted into the database.
   * @returns {void} void
   */
	async function insertNewUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// The new user object
		let newUser: User = {
			id: '',
			achievements: [],
			bio: formFields.bio,
			email: formFields.email,
			joinDate: '',
			followers: [],
			following: [],
			nickname: formFields.nickname,
			password: formFields.password,
			isAdmin: false,
			isBanned: false,
			isVerified: false,
			skillLevels: []
		};
		// Communicate with the back-end API endpoint to make the insertion
		event.preventDefault();
		let registerResponse = await createNewUser(newUser);
		if (registerResponse && registerResponse.status === 200) {
			alert(registerResponse.body.message);
			// Refresh page
			history.replace({
				pathname: '/'
			});
		} else {
			// alert('Something went wrong during your register process. ' + registerResponse.body.message + ' Please try again!');
			let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
			formFieldsCopy.errors.serverSide = registerResponse.body.message;
			setFormFields(formFieldsCopy);
			// formFields.errors.serverside = registerResponse.body.message;
		}
	}

	/**
   * This method handles the state updates that need to happen when
   * an input field in the register form is modified.
   * @param e The onChange event that was triggered
   * @returns {void} void
   */
	function handleInputChange(e: any) {
		let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
		let target = e.target.name;
		formFieldsCopy[target] = e.target.value;
		setFormFields(formFieldsCopy);
	}

	/**
   * Validated the form data
   * @returns {void} void
   */
	function handleValidation() {
		let isValidForm = true;
		let errors = {
			serverSide: '',
			email: '',
			nickname: '',
			password: '',
			confirmedPassword: '',
			bio: ''
		};
		// check is email is valid
		if (!isValidEmail(formFields.email)) {
			isValidForm = false;
			errors.email = 'Invalid email provided!';
		}
		// check is nickname is valid
		if (!isValidNickname(formFields.nickname)) {
			isValidForm = false;
			errors.nickname = 'Invalid nickname provided!';
		}
		// check is password is valid
		if (!isValidPassword(formFields.password)) {
			isValidForm = false;
			errors.password = 'Invalid password provided!';
		}
		// check if passwords match
		if (!doPasswordsMatch(formFields.password, formFields.confirmedPassword)) {
			isValidForm = false;
			errors.confirmedPassword = 'Passwords do not match!';
		}
		// check if bio is valid
		if (!isValidBio(formFields.bio)) {
			isValidForm = false;
			errors.bio = 'Invalid bio provided!';
		}

		// update formfields
		let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
		formFieldsCopy.errors = errors;
		setFormFields(formFieldsCopy);
		return isValidForm;
	}

	/**
   * This method handles the sumbit of the register form and creates the new user on success
   * @param event The submit event that was triggered
   * @returns {void} void
   */
	function handleRegister(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		// insert new user if forms where valid
		if (handleValidation()) {
			insertNewUser(event);
		}
	}

	return (
		<div className={styles.wrapper}>
			<form onSubmit={handleRegister} className={styles.wrapper} method="post">
				<div className={styles.register_form_fields}>
					<span className={styles.error}>{formFields.errors.serverSide}</span>
					<TextField
						name="email"
						id="email"
						placeholder="E-mail Address"
						variant="outlined"
						type="email"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.email}</span>
					<TextField
						name="nickname"
						id="nickname"
						placeholder="Nickname"
						variant="outlined"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.nickname}</span>
					<TextField
						name="password"
						id="password"
						type="password"
						placeholder="Password"
						variant="outlined"
						autoComplete="off"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.password}</span>
					<TextField
						name="confirmedPassword"
						id="confirmedPassword"
						type="password"
						placeholder="Confirm Password"
						variant="outlined"
						autoComplete="off"
						required
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.confirmedPassword}</span>
					<TextField
						name="bio"
						multiline
						rowsMax={8}
						id="bio"
						placeholder="Biography"
						variant="outlined"
						onChange={handleInputChange}
						className={styles.form_field}
					/>
					<span className={styles.error}>{formFields.errors.bio}</span>
				</div>
				<Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
					Register now
				</Button>
			</form>
		</div>
	);
}

export default RegisterPage;
