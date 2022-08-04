import * as Contacts from 'expo-contacts';
import { getAllUsers } from './User';

const getContactslist = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName],
        });

        if (data.length > 0) {
            const contact = data[0];
            console.log(data.length);
            // console.log("Contacts:",contact);
        }
        checkWithFirebaseUsers(data);
    }
}

const checkWithFirebaseUsers = async (data) => {
    let allUsers = await getAllUsers();
    let commonUserList = []

    console.log(typeof (data[0].phoneNumbers[0].number))
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < allUsers.length; j++) {
            if (data[i].phoneNumbers[0].number === allUsers[j].conatactNumber) {
                commonUserList.push(allUsers[j]);
            }
        }
    }

    console.log("Common User List: ", commonUserList.length);
}

export { getContactslist };