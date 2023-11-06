import { Button, TextField } from "@material-ui/core";
import React, { FormEvent, useEffect, useState } from "react";
import { updateAccount, updatePassword } from "../../Services/FirebaseFunctions/user";
import { getLoggedinUser } from "../../Services/FirebaseFunctions/auth";
import { doPasswordsMatch, isValidBio, isValidEmail, isValidNickname, isValidPassword } from "../../Services/formValidation";
import { User } from "../../typedefs/firebaseTypedefs";
import styles from './ProfileSettingsPage.module.css';

/**
 * @author seansnellinx
 * Page that serves the option to the users to change their profile information.
 */
function ProfileSettingsPage(props: Object) {
    // The currently logged user
    const [user, setUser] = useState({} as User);

    // Data needed for the account settings form
    const [accountInfo, setAccountInfo] = useState({
        email: '',
        nickname: '',
        bio: '',
        allFieldsCorrectFormat: false,
        errors: {
            serverSide: '',
            email: '',
            nickname: '',
            bio: '',
        }
    });

    // Data needed for the password change form
    const [passwordsInfo, setPasswordInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmedPassword: '',
        allFieldsCorrectFormat: false,
        errors: {
            serverSide: '',
            oldPassword: '',
            newPassword: '',
            confirmedPassword: '',
        }
    });

    useEffect(() => {
        getLoggedUser();
    }, []);

    // Gets the logged user
    async function getLoggedUser() {
        let responseObject = await getLoggedinUser();
        if (responseObject.status === 200) {
            setUser(responseObject.body);
        }
    }

    /**
     * This method handles the state updates that need to happen when 
     * an input field in the profile settings form is modified.
     * @param e The onChange event that was triggered
     * @returns {void} void
     */
    function handleProfileInfoChange(e: any) {
        let accountInfoCopy = JSON.parse(JSON.stringify(accountInfo));
        let target = e.target.name;
        accountInfoCopy[target] = e.target.value;
        setAccountInfo(accountInfoCopy);
    }


    /**
     * This method handles the state updates that need to happen when 
     * an input field in the password form is modified.
     * @param e The onChange event that was triggered
     * @returns {void} void
     */
    function handlePasswordInfoChange(e: any) {
        let passwordsInfocopy = JSON.parse(JSON.stringify(passwordsInfo));
        let target = e.target.name;
        passwordsInfocopy[target] = e.target.value;
        setPasswordInfo(passwordsInfocopy);
    }

    /**
     * Validated the account data that the user wants to change
     * @returns {isValidForm} for wether the data he filled was valid.
     */
    function handleAccountValidation() {
        let isValidForm = true;
        let errors = {
            serverSide: '',
            email: '',
            nickname: '',
            bio: '',
        }
        let settingsCopy = JSON.parse(JSON.stringify(accountInfo));

        // check if email is valid
        if (accountInfo.email !== "") {
            if (!isValidEmail(accountInfo.email)) {
                isValidForm = false;
                errors.email = "Invalid email provided!"
            }
        }
        // check if nickname is valid
        if (accountInfo.nickname !== "") {
            if (!isValidNickname(accountInfo.nickname)) {
                isValidForm = false;
                errors.nickname = "Invalid nickname provided!"
            }
        }
        // check if bio is valid
        if (accountInfo.bio.length > 0) {
            if (!isValidBio(accountInfo.bio)) {
                isValidForm = false;
                errors.bio = "Invalid bio provided!"
            }
        }

        // update accountInfo
        settingsCopy.errors = errors;
        setAccountInfo(settingsCopy);
        return isValidForm;
    }

    /**
     * Validated the password change that the user wants to do
     * @returns {isValid} for wether the data he provided was valid.
     */
    function handlePasswordValidation() {
        let isValidForm = true;
        let errors = {
            serverSide: '',
            oldPassword: '',
            newPassword: '',
            confirmedPassword: '',
        }
        // check is old password is valid
        if (passwordsInfo.oldPassword === '') {
            isValidForm = false;
            errors.oldPassword = "Invalid old password provided!"
        }
        // check if password is valid
        if (!isValidPassword(passwordsInfo.newPassword)) {
            isValidForm = false;
            errors.newPassword = "Invalid new password provided!"
        }
        // check is passwords match
        if (!doPasswordsMatch(passwordsInfo.newPassword, passwordsInfo.confirmedPassword)) {
            isValidForm = false;
            errors.confirmedPassword = "Passwords do not match!"
        }

        // update passwordInfo
        let passwordsCopy = JSON.parse(JSON.stringify(passwordsInfo));
        passwordsCopy.errors = errors;
        setPasswordInfo(passwordsCopy);
        return isValidForm;
    }

    /**
     * This function requests the account update after the validation of the form and waits for the response
     * @param event the form event that called this function
     */
    async function changeAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let changeAccountResponse = await updateAccount(accountInfo);
        if (changeAccountResponse && changeAccountResponse.status === 200) {
            
            window.location.reload();
        } else {
            let accountInfoCopy = JSON.parse(JSON.stringify(accountInfo));
            accountInfoCopy.errors.serverSide = changeAccountResponse.body.message;
            setAccountInfo(accountInfoCopy)
        }
    }

    /**
     * This function requests the password update after the validation of the form and waits for the response
     * @param event the form event that called this function
     */
    async function changePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let changePasswordResponse = await updatePassword(passwordsInfo);
        if (changePasswordResponse && changePasswordResponse.status === 200) {
            
        } else {
            let passwordsInfoCopy = JSON.parse(JSON.stringify(passwordsInfo));
            passwordsInfoCopy.errors.serverSide = changePasswordResponse.body.message;
            setAccountInfo(passwordsInfoCopy)
        }
    }

    /**
     * This method handles the sumbit of the account settings form and changes it to the given values on success
     * @param event The submit event that was triggered
     * @returns {void} void
     */
    function handleChangeAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        if (handleAccountValidation()) {
            changeAccount(event);
        }
    }

    /**
     * This method handles the sumbit of the password form and changes the password of the user on success
     * @param event The submit event that was triggered
     * @returns {void} void
     */
    function handleChangePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        if (handlePasswordValidation()) {
            changePassword(event);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.profile_settings_container}>
                <h2>Change your profile:</h2>
                <p>Fill in the things you want to update.</p>
                <form onSubmit={handleChangeAccount} method="post">
                    <div className={styles.form_fields}>
                        <span className={styles.error}>
                            {accountInfo.errors.serverSide}
                        </span>
                        <TextField
                            name="email"
                            id="email"
                            placeholder={user.email}
                            variant="outlined"
                            type="email"
                            onChange={handleProfileInfoChange}
                            className={styles.form_field}
                        />
                        <span className={styles.error}>
                            {accountInfo.errors.email}
                        </span>
                        <TextField
                            name="nickname"
                            id="nickname"
                            placeholder={user.nickname}
                            variant="outlined"
                            onChange={handleProfileInfoChange}
                            className={styles.form_field}
                        />
                        <span className={styles.error}>
                            {accountInfo.errors.nickname}
                        </span>
                        <TextField
                            name="bio"
                            multiline
                            rowsMax={8}
                            id="bio"
                            placeholder={user.bio}
                            variant="outlined"
                            onChange={handleProfileInfoChange}
                            className={styles.form_field}
                        />
                        <span className={styles.error}>
                            {accountInfo.errors.bio}
                        </span>
                    </div>
                    <Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
                        Update Profile Info
				</Button>
                </form>
            </div>
            <div className={styles.password_container}>
                <h2>Change your password:</h2>
                <p>Choose a new password.</p>
                <form onSubmit={handleChangePassword} className={styles.password_form} method="post">
                    <div className={styles.form_fields}>
                        <span className={styles.error}>
                            {passwordsInfo.errors.serverSide}
                        </span>
                        <TextField
                            name="oldPassword"
                            id="oldPassword"
                            type="password"
                            placeholder="Old Password"
                            variant="outlined"
                            autoComplete="off"
                            required
                            onChange={handlePasswordInfoChange}
                            className={styles.form_field}
                        />
                        <span className={styles.error}>
                            {passwordsInfo.errors.oldPassword}
                        </span>
                        <TextField
                            name="newPassword"
                            id="newPassword"
                            type="password"
                            placeholder="New Password"
                            variant="outlined"
                            autoComplete="off"
                            required
                            onChange={handlePasswordInfoChange}
                            className={styles.form_field}
                        />
                        <span className={styles.error}>
                            {passwordsInfo.errors.newPassword}
                        </span>
                        <TextField
                            name="confirmedPassword"
                            id="confirmedPassword"
                            type="password"
                            placeholder="Confirm New Password"
                            variant="outlined"
                            autoComplete="off"
                            required
                            onChange={handlePasswordInfoChange}
                            className={styles.form_field}
                        />
                    </div>
                    <Button variant="contained" type="submit" color="secondary" className={styles.button_style}>
                        Update Password
				    </Button>
                </form>
            </div>
        </div>
    );
}

export default ProfileSettingsPage;