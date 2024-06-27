//import {luxz_validate_graduate, luxzIDEvent } from 'src/config'
const luxz_validate_graduate ='https://chatbot.luxze.mx/validate-graduate'
const luxzIDEvent ='https://chatbot.luxze.mx/validate-event'
/**
 * get calendar
 * @returns 
 */
const getCurrentCalendar = async (): Promise<string[]> => {
    const dataCalendarApi = await fetch(luxzIDEvent)
    const json: { date: string, name: string }[] = await dataCalendarApi.json()
    console.log({ json })
    const list = json.filter(({date, name}) => !!date && !!name).reduce((prev, current) => {
        prev.push(current.date)
        return prev
    }, [])
    return list
}

/**
 * add to calendar
 * @param body 
 * @returns 
 */
const ExistsEvent = async (key:string) => {
    try {
        const payload = {
            event_key: key
        };

        const response = await fetch(luxzIDEvent, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return { success: data.success === true, title: data.title};
    } catch (err) {
        console.error('Error:', err);
        return { success: false };
    }
};
/**
 * add to calendar
 * @param body 
 * @returns 
 */
const validateGraduate = async (email_or_name: string) => {
    try {
        const payload = {
            email_or_name: email_or_name
        };

        const response = await fetch(luxz_validate_graduate, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: data.success === true,
            graduate: data.graduate,
            amount: data.amount
        };
    } catch (err) {
        console.error('Error:', err);
        return { 
            success: false,
            graduate: null,
            amount: 0 
        };
    }
};








export { validateGraduate, ExistsEvent}