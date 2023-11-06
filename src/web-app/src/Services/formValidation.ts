/**
 * TODO Give some fields a stricter validation like badwordcheck, symbols, ...
 */

/***********************
 *   LOGIN + REGISTER
 ***********************/
/**
 * Validates whether the provided email is a valid email
 * @param {string} email - The provided email that needs to be checked
 * @returns {boolean} - True: if the email is valid, false: if the email is invalid
 */
export function isValidEmail(email: string): boolean {
	let re = /\S+@\S+\.\S+/;
	if (!email) {
		return false;
	}
	if (!re.test(email)) {
		return false;
	}
	if (email.length > 256) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided nickname is a valid nickname
 * @param {string} nickname - The provided nickname that needs to be checked
 * @returns {boolean} - True: if the nickname is valid, false: if the nickname is invalid
 */
export function isValidNickname(nickname: string): boolean {
	if (!nickname) {
		return false;
	}
	if (!nickname.match(/^[0-9a-zA-Z]+$/)) {
		return false;
	}
	if (nickname.length > 30) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided password is a valid password
 * @param {string} password - The provided password that needs to be checked
 * @returns {boolean} - True: if the password is valid, false: if the password is invalid
 */
export function isValidPassword(password: string): boolean {
	if (!password) {
		return false;
	}
	if (password.length < 4) {
		return false;
	}
	if (password.length > 50) {
		return false;
	}
	return true;
}

/**
 * Validates whether 2 given passwords match
 * @param {string} password1 - The first password provided
 * @param {string} password2 - The second password provided
 * @returns {boolean} - True: if the passwords match, False: if they don't match
 */
export function doPasswordsMatch(password1: string, password2: string): boolean {
	if (password1 !== password2) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided bio is a valid bio
 * @param {string} bio - The provided bio that needs to be checked
 * @returns {boolean} - True: if the bio is valid, false: if the bio is invalid
 */
export function isValidBio(bio: string): boolean {
	if (!bio) {
		return false;
	}
	if (bio.length > 256) {
		return false;
	}
	return true;
}

/***********************
 *   TOURNAMENT & LOBBY
 ***********************/

/**
 * Validates whether the provided name is a valid name
 * @param {string} name - The provided name that needs to be checked
 * @returns {boolean} - True: if the name is valid, false: if the name is invalid
 */
export function isValidName(name: string) {
	if (!name || !name.trim()) {
		return false;
	}
	if (!name.match(/^[0-9a-zA-Z_ ]+$/)) {
		return false;
	}
	if (name.length > 40) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided game is a valid game
 * @param {string} game - The provided game that needs to be checked
 * @returns {boolean} - True: if the game is valid, false: if the game is invalid
 */
export function isValidGame(game: string) {
	if (!game) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided description is a valid description
 * @param {string} description - The provided description that needs to be checked
 * @returns {boolean} - True: if the description is valid, false: if the description is invalid
 */
export function isValidDescription(description: string) {
	if (!description) {
		return false;
	}
	if (!description.match(/^[0-9a-zA-Z ]+$/)) {
		return false;
	}
	if (description.length > 150) {
		return false;
	}
	return true;
}

/**
 * Gets the current date
 * @returns {currentdate} in format YYYY-MM-DD
 */
function currentDate() {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [ year, month, day ].join('-');
}

/**
 * Checks the validaty of the format of the date
 * @param date wich represents the date in YYYY-MM-DD
 * @returns {boolean} : true, if the date was a correct format of yyyy-mm-dd, false if not
 */
function validDate(date: string) {
	let parts = date.split('-');
	let year = parseInt(parts[0], 10);
	let month = parseInt(parts[1], 10);
	let day = parseInt(parts[2], 10);

	if (year < 1000 || year > 3000 || month <= 0 || month > 12) {
		return false;
	}

	const monthsLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	// Leap year adjust
	if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
		monthsLength[1] = 29;
	}
	if (day <= 0 || day > monthsLength[month - 1]) {
		return false;
	}
	return true;
}
/**
 * Validates whether the provided startdate is a valid startdate
 * @param {string} startdate - The provided startdate that needs to be checked
 * @returns {boolean} - True: if the startdate is valid, false: if the startdate is invalid
 */
export function isValidStartDate(startdate: string) {
	if (!startdate) {
		return false;
	}
	if (currentDate() > startdate) {
		return false;
	} else {
		return validDate(startdate);
	}
}

/**
 * Validates whether the provided enddate is a valid enddate
 * @param {string} enddate - The provided enddate that needs to be checked
 * @returns {boolean} - True: if the enddate is valid, false: if the enddate is invalid
 */
export function isValidEndDate(startDate: string, endDate: string) {
	if (!endDate) {
		return true;
	}
	if (startDate > endDate) {
		return false;
	} else {
		return validDate(endDate);
	}
}

/**
 * Validates whether the provided banner is a valid banner
 * @param {string} banner - The provided banner that needs to be checked
 * @returns {boolean} - True: if the banner is valid, false: if the banner is invalid
 */
export function isValidBanner(banner: string) {
	return true;
}

/**
 * Validates whether the provided teamsize is a valid teamsize
 * @param {string} teamSize - The provided teamsize that needs to be checked
 * @returns {boolean} - True: if the teamsize is valid, false: if the teamsize is invalid
 */
export function isValidTeamSize(teamSize: number) {
	if (teamSize <= 0 || 20 <= teamSize) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided team amount is a valid team amount (power of 2)
 * @param {string} teamamount - The provided team amount that needs to be checked
 * @returns {boolean} - True: if the team amount is valid, false: if the team amount is invalid
 */
export function isValidTeamAmount(teamAmount: number) {
	if (teamAmount <= 512)
		return teamAmount && (teamAmount & (teamAmount - 1)) === 0;
}
/**
 * Validates whether the provided skilltier is a valid skilltier
 * @param {string} skilltier - The provided skilltier that needs to be checked
 * @returns {boolean} - True: if the skilltier is valid, false: if the skilltier is invalid
 */
export function isValidSkillTier(skillTier: string) {
	if (!skillTier) {
		return false;
	}
	if (
		skillTier !== 'Turbostuck' &&
		skillTier !== 'Hardstuck' &&
		skillTier !== 'Gold' &&
		skillTier !== 'Platinum' &&
		skillTier !== 'Diamond' &&
		skillTier !== 'Quantumsmurf'
	) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided prize is a valid prize
 * @param {string} prize - The provided prize that needs to be checked
 * @returns {boolean} - True: if the prize is valid, false: if the prize is invalid
 */
export function isValidPrize(prize: string) {
	if (!prize || !prize.trim()) {
		return false;
	}
	if (!prize.match(/^[0-9a-zA-Z ]+$/)) {
		return false;
	}
	if (prize.length > 150) {
		return false;
	}
	return true;
}

/**
 * Validates whether the provided tournamentformat is a valid tournamentformat
 * @param {string} tournamentFormat - The provided tournamentformat that needs to be checked
 * @returns {boolean} - True: if the tournamentformat is valid, false: if the tournamentformat is invalid
 */
export function isValidTournamentFormat(tournamentFormat: string) {
	if (tournamentFormat !== 'roundrobin' && tournamentFormat !== 'singleelim' && tournamentFormat !== 'doubleelim') {
		return false;
	}
	return true;
}
