import React, { useEffect, useState } from 'react';
import styles from './AchievementCreator.module.css';
import { Achievement } from '../../typedefs/firebaseTypedefs';
import { Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Popup from '../Popup/Popup';
import AchievementCard from '../AchievementCard/AchievementCard';
import { Props } from './Props';

function AchievementCreator(props: Props) {
    const emptyAchievement = {
        description: "",
        name: "",
        id: "",
        type: "participant"
    } as Achievement;
    const [createdAchievements, setCreatedAchievements] = useState([] as Achievement[]); 
    const [formFields, setFormFields] = useState(emptyAchievement);
    const [creating, setCreating] = useState(false);
    const [nextId, setNextId] = useState(0);


    useEffect(()=>{
        props.onChange(createdAchievements);
    }, [createdAchievements, props]);

    /**
	 * This method handles the state updates that need to happen when 
	 * an input field in the achievement form is modified.
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
     * Close the popup
     * @post popup is closed
     * @post form values are reset to default values
     */
    function popupClose(){
        setFormFields(emptyAchievement);
        setCreating(false);
    }

    /**
     * Form validation
     * @returns true if form valid
     */
    function handleValidation(): boolean{
        // TODO
        return true;
    }

    /**
     * Add the new achievement
     * @post achievement is added to the list
     * @post popup is closed and form value are reset to default values
     */
    function insertNewAchievement(){
        const achievement = formFields;
        console.debug("New achievement: ", achievement);
        achievement.id = nextId.toString();
        setNextId(nextId + 1);


        const achievementList = createdAchievements;
        achievementList.push(achievement);
        setCreatedAchievements(achievementList);

        popupClose();
    }

    /**
     * Called on pressing create achievement button
     * @post achievement is created is forms where valid
     * @post popup closed if forms where valid
     */
    function handleNewAchievement(){
		if (handleValidation()) {
			insertNewAchievement();
		}
    }

    /**
     * Delete an achievement from the list
     * @param id of the achievement deleting
     * @post achievement with id <id> is deleted from the list
     */
    function deleteAchievement(id: string){
        // filter the achievement with the given id out
        const achievements = createdAchievements.filter((value: Achievement)=>{
            if (value.id !== id)
                return value;
            return null;
        });
        
        setCreatedAchievements(achievements);
    }

    /**
     * @returns Content of the creation popup form
     */
    function popUpElement(): JSX.Element{
        return (
        <div  className={styles.achievementcreator_form}>
            <InputLabel htmlFor="name">Achievement name</InputLabel>
            <TextField
                name="name"
                id="name"
                placeholder="Achievement name"
                variant="outlined"
                onChange={handleInputChange}
                className={styles.form_field}
                value={formFields.name}
                fullWidth={true}
            />
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextField
                name="description"
                id="description"
                placeholder="Description"
                variant="outlined"
                onChange={handleInputChange}
                className={styles.form_field}
                value={formFields.description}
                fullWidth={true}
            />
            <InputLabel htmlFor="type">Received by</InputLabel>
            <Select name="type" id="type" onChange={handleInputChange} defaultValue={"participants"}>
                <MenuItem value={'participant'}>All participants</MenuItem>
                <MenuItem value={'winner'}>Only winners</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleNewAchievement} color="secondary" className={styles.button_style} >
                Create Achievement
            </Button>
        </div>);
    }

    const achievementElements = createdAchievements.map(
        (achievement: Achievement) => 
        <div key={achievement.id}>
            <AchievementCard achievementData={achievement}></AchievementCard>
            <Button onClick={()=>{deleteAchievement(achievement.id)}} className={styles.button_style}>delete</Button>
        </div>
    );
    return (
        <div className={styles.achievementcreator}>
            <Popup title={"Create an achievement"} onClose={popupClose} hidden={!creating}>{popUpElement()}</Popup>
            <Button className={styles.achievementcreator_createbutton} onClick={()=>{setCreating(true);}}>Create achievement</Button>
            <div className={styles.achievementcreator_list}>
                {achievementElements}
            </div>
        </div>
    )

}

export default AchievementCreator