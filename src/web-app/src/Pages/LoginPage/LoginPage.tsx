import { TextField, Button } from '@material-ui/core';
import React, { FormEvent, useState } from 'react';
import { loginUser } from "../../Services/FirebaseFunctions/auth";
import styles from './LoginPage.module.css';
import Cookies from 'js-cookie';
import { isValidEmail, isValidPassword } from '../../Services/formValidation';
import { useHistory } from 'react-router-dom';

/**
 * @author brentzoomers, jentevandersanden
 * Page which serves front-end login functionality.
 */
function LoginPage(props: Object) {
	const [ formFields, setFormFields ] = useState({
		email: '',
		password: '',
		errors: { serverSide: '', email: '', password: '' }
	});
	const history = useHistory();

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
	 * Tries to login the user.
	 * @param event Form event triggering the login
	 */
	async function login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// Try to login user
		let loginResponse = await loginUser(formFields.email, formFields.password);
		if (loginResponse && loginResponse.status === 200) {
			alert('Logged in and authorized!');
			// Set a cookie with the ID of the user that logged in, to be used across the entire platform (expires in 1 day)
			Cookies.set('userId', loginResponse.body.user.id, { expires: 1 });
			history.replace({
				pathname: '/'
			});
			window.location.reload();
		} else if (loginResponse.status === 400) {
			let formFieldsCopy = JSON.parse(JSON.stringify(formFields));
			formFieldsCopy.errors.S = loginResponse.body.message;
			setFormFields(formFieldsCopy);
		} else if (loginResponse.status === 403){
			alert(loginResponse.body.message);
		}else {
			alert('Internal server error: ' + loginResponse.status);
		}
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
			password: ''
		};
		// check if email is valid
		if (!isValidEmail(formFields.email)) {
			isValidForm = false;
			errors.email = 'Invalid email provided!';
		}
		// check is password is valid
		if (!isValidPassword(formFields.password)) {
			isValidForm = false;
			errors.password = 'Invalid password provided!';
		}

		// update formfields
		let formfieldscopy = JSON.parse(JSON.stringify(formFields));
		formfieldscopy.errors = errors;
		setFormFields(formfieldscopy);
		return isValidForm;
	}

	/**
	 * This method handles the sumbit of the login form and logs in on success
	 * @param event The submit event that was triggered
	 * @returns {void} void
	 */
	function handleLogin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		if (handleValidation()) {
			login(event);
		}
	}

	return (
		<div className={styles.wrapper}>
			<form onSubmit={handleLogin} className={styles.login_form_fields} method="post">
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
					name="password"
					id="password"
					type="password"
					placeholder="Password"
					variant="outlined"
					required
					onChange={handleInputChange}
					className={styles.form_field}
				/>
				<span className={styles.error}>
					{formFields.errors.password}
					{formFields.errors.serverSide}
				</span>
				<Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
					Login
				</Button>
			</form>
		</div>
	);
}

export default LoginPage;
