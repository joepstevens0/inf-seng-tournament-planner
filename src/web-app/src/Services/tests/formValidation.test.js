import {
  isValidEmail,
  isValidNickname,
  isValidpassword,
  doPasswordsMatch,
  isValidBio,
  isValidName,
  isValidGame,
  isValidDescription,
  isValidStartDate,
  isValidEndDate,
  isValidTeamSize,
  isValidTeamAmount,
  isValidSkillTier,
  isValidPrize,
  isValidTournamentFormat,
} from "../formValidation";

/**
 * @author jentevandersanden
 * Jest test file for formValidation.ts
 */

// Test isValidEmail
test("Checks whether an email is valid", () => {
  let result1 = true;
  let result2 = false;
  let result3 = true;
  let result4 = false;

  expect(isValidEmail("test@hotmail.com")).toEqual(result1);
  expect(isValidEmail("test")).toEqual(result2);
  expect(isValidEmail("jente.vandersanden@student.uhasselt.be")).toEqual(
    result3
  );
  expect(isValidEmail("")).toEqual(result4);
});

// Test isValidNickname
test("Checks whether a nickname is valid", () => {
  let result1 = true;
  let result2 = false;
  let result3 = true;
  let result4 = false;
  let result5 = false;

  expect(isValidNickname("test123")).toEqual(result1);
  expect(isValidNickname("")).toEqual(result2);
  expect(isValidNickname("teapot")).toEqual(result3);
  expect(isValidNickname("___xd____!.;:")).toEqual(result4);
  expect(
    isValidNickname(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccc123213213123123"
    )
  ).toEqual(result5);
});

// Test isValidPassword
test("Checks whether a password is valid", () => {
  let result1 = true;
  let result2 = false;
  let result3 = true;
  let result4 = false;
  let result5 = false;

  expect(isValidpassword("test123")).toEqual(result1);
  expect(isValidpassword("tes")).toEqual(result2);
  expect(isValidpassword("test_1w2mfakl.,x;:")).toEqual(result3);
  expect(isValidpassword("")).toEqual(result4);
  expect(
    isValidpassword(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccc123213213123123"
    )
  ).toEqual(result5);
});

// Test doPasswordsMatch
test("Checks whether passwords match", () => {
  let result1 = true;
  let result2 = false;
  let result3 = true;

  expect(doPasswordsMatch("test123", "test123")).toEqual(result1);
  expect(doPasswordsMatch("test123", "test124")).toEqual(result2);
  expect(doPasswordsMatch("", "")).toEqual(result3);
});

// Test isValidBio
test("Checks whether a bio is valid", () => {
  let result1 = true;
  let result2 = true;
  let result3 = true;
  let result4 = false;
  let result5 = false;

  expect(isValidBio(";_____;")).toEqual(result1);
  expect(isValidBio("><:?.,124982957`~§±")).toEqual(result2);
  expect(isValidBio("This is a test Biography.")).toEqual(result3);
  expect(isValidBio("")).toEqual(result4);
  expect(
    isValidBio(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccc123213213123123"
    )
  ).toEqual(result5);
});

// Test isValidName
test("Checks whether a tournament/lobby name is valid", () => {
  let result1 = true;
  let result2 = true;
  let result3 = false;
  let result4 = false;
  let result5 = false;

  expect(isValidName("      testname")).toEqual(result1);
  expect(isValidName("testname123")).toEqual(result2);
  expect(
    isValidName(
      "testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123testname123"
    )
  ).toEqual(result3);
  expect(isValidName("_x';./")).toEqual(result4);
  expect(isValidName("")).toEqual(result5);
});

// Test isValidGame
test("Checks whether a game name is valid", () => {
  let result1 = true;
  let result2 = true;
  let result3 = false;

  expect(isValidGame("testGame")).toEqual(result1);
  expect(isValidGame("___")).toEqual(result2);
  expect(isValidGame("")).toEqual(result3);
});

// Test isValidDescription
test("Checks whether a description is valid", () => {
  let result1 = true;
  let result2 = true;
  let result3 = true;
  let result4 = false;
  let result5 = false;

  expect(isValidDescription("testDescription")).toEqual(result1);
  expect(isValidDescription("123  this is my description  123")).toEqual(
    result2
  );
  expect(isValidDescription("This is a test description")).toEqual(result3);
  expect(isValidDescription("")).toEqual(result4);
  expect(
    isValidDescription(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccc123213213123123"
    )
  ).toEqual(result5);
});

// Test isValidStartDate
test("Checks whether a certain start date is valid.", () => {
  expect(isValidStartDate("2022-12-28")).toEqual(true);
  expect(isValidStartDate("2020-12-18")).toEqual(false);
});

// Test isValidEndDate
test("Checks whether a certain end date is valid.", () => {
  expect(isValidEndDate("2022-12-28", "2022-12-30")).toEqual(true);
  expect(isValidEndDate("2022-12-28", "")).toEqual(true);
  expect(isValidEndDate("2022-12-30", "2022-12-28")).toEqual(false);
});

// Test isValidBanner
test("Checks whether a banner is valid.", () => {
  // TODO
});

// Test isValidTeamSize
test("Checks whether a certain team size is valid.", () => {
  expect(isValidTeamSize(0)).toEqual(false);
  expect(isValidTeamSize(-3)).toEqual(false);
  expect(isValidTeamSize(30)).toEqual(false);
  expect(isValidTeamSize(10)).toEqual(true);
});

// Test isValidTeamAmount
test("Checks whether a certain team amount is valid.", () => {
  expect(isValidTeamAmount(0)).toEqual(0);
  expect(isValidTeamAmount(2)).toEqual(true);
  expect(isValidTeamAmount(8)).toEqual(true);
  expect(isValidTeamAmount(9)).toEqual(false);
});

// Test isValidSkillTier
test("Checks whether a certain skill tier is valid.", () => {
  expect(isValidSkillTier("Turbostuck")).toEqual(true);
  expect(isValidSkillTier("Quantumsmurf")).toEqual(true);
  expect(isValidSkillTier("random")).toEqual(false);
  expect(isValidSkillTier("Diamond")).toEqual(true);
});

// Test isValidPrize
test("Checks whether a certain prize is valid.", () => {
  expect(isValidPrize("")).toEqual(false);
  expect(isValidPrize("     ")).toEqual(false);
  expect(isValidPrize("test prize")).toEqual(true);
  expect(isValidPrize(">LLW?;''§`~")).toEqual(false);
  expect(
    isValidPrize(
      "aaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbcccccccccccaaaaaaaaaabbbbbbccccccccccc"
    )
  ).toEqual(false);
});

// Test isValidTournamentFormat
test("Checks whether a certain tournament format is valid.", () => {
  expect(isValidTournamentFormat("roundrobin")).toEqual(true);
  expect(isValidTournamentFormat("singleelim")).toEqual(true);
  expect(isValidTournamentFormat("doubleelim")).toEqual(true);
  expect(isValidTournamentFormat("random")).toEqual(false);
});
