// mathScore returns an int range: [0,100]
export const calculateMatchScore = (user1, user2) => {
    try {
        let matchScore = 0;
        if (user1.preferences.main && user2.preferences.main) {
            const { age: age1, yearOfStudy: year1 } = user1.preferences.main;
            const { age: age2, yearOfStudy: year2 } = user2.preferences.main;

            if (age1 && age2) {
                const ageInt1 = parseInt(age1, 10);
                const ageInt2 = parseInt(age2, 10);
                if (!isNaN(ageInt1) && !isNaN(ageInt2)) {
                    const ageDifference = Math.abs(ageInt1 - ageInt2);
                    if (ageDifference <= 5) {
                        matchScore += 0.2 * (5 - ageDifference) / 5;
                    } // else give zero mark
                }
            }

            if (year1 && year2) {
                const yearInt1 = parseInt(year1, 10);
                const yearInt2 = parseInt(year2, 10);
                if (!isNaN(yearInt1) && !isNaN(yearInt2)) {
                    const yearDifference = Math.abs(yearInt1 - yearInt2);
                    matchScore += 0.2 * (3 - yearDifference) / 3;
                }
            }
        }

        matchScore += 0.6 * sleepScore(user1, user2);
        console.log("matchScore :" + matchScore);
        return Math.round(matchScore * 100);
    } catch (error) {
        console.error('Error calculating match score:', error);
        console.log('Current user:', currentUser);
        console.log('Other user:', otherUser);
        return 0; // Return a default score if calculation fails
    }
};

const sleepScore = (user1, user2) => { // range: [0,1]

    const timeToMinutes = (time) => {
        if (!time || typeof time !== 'string' || time === "") return 0; //return 0 for invalid times
        const [hours, minutes] = time.split(":").map(Number);
        return isNaN(hours) || isNaN(minutes) ? 0 : hours * 60 + minutes;
    };

    const calculateOverlap = (start1, end1, start2, end2) => {
        const start1Minutes = timeToMinutes(start1);
        const tempEnd1Minutes = end1 === "00:00" ?
            24 * 60 : timeToMinutes(end1);
        const end1Minutes = tempEnd1Minutes < start1Minutes ?
            (24 * 60) + tempEnd1Minutes : tempEnd1Minutes;
        const start2Minutes = timeToMinutes(start2);
        const tempEnd2Minutes = end2 === "00:00" ?
            24 * 60 : timeToMinutes(end2);
        const end2Minutes = tempEnd2Minutes < start2Minutes ?
            (24 * 60) + tempEnd2Minutes : tempEnd2Minutes;

        const maxStart = Math.max(start1Minutes, start2Minutes);
        const minEnd = Math.min(end1Minutes, end2Minutes);

        return maxStart < minEnd ? minEnd - maxStart : 0;
    };

    const calculateTotalSleepTime = (start, end) => {
        const startMinutes = timeToMinutes(start);
        const endMinutes = end === "00:00" ? 24 * 60 : timeToMinutes(end);

        return startMinutes <= endMinutes ?
            endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;
    };

    // flexScore returns a decimal value (< 1)
    const flexScore = (flex1, flex2) => {
        const max = 4;
        const score = flex1 + flex2;
        const result = score / max;
        console.log("flexScore :" + result);
        return result;
    };

    // lightScore returns a decimal value ( < 1 )
    const lightScore = (light1, light2) => {
        const max = 2;
        let score = 0;
        if (light1 === light2) {
            score += 2;
        } else if (light1 === "No preference" || light2 === "No preference") {
            score += 1;
        }
        const result = score / max;
        console.log("sleepScore :" + result);
        return result;
    };

    let sleepScore = 0; // range : [0,1]
    // start calculating total sleep score
    if (user1.preferences.sleep && user2.preferences.sleep) {
        const {
            sleepTimeStart: sleepStart1,
            sleepTimeEnd: sleepEnd1,
            sleepScheduleFlexiblity: flexibility1,
            sleepLightsOnOff: lights1,
        } = user1.preferences.sleep;
        const {
            sleepTimeStart: sleepStart2,
            sleepTimeEnd: sleepEnd2,
            sleepScheduleFlexiblity: flexibility2,
            sleepLightsOnOff: lights2,
        } = user2.preferences.sleep;

        // check flexiblity and lights preferences
        if (flexibility1 && flexibility2) {
            sleepScore += 0.2 * flexScore(flexibility1, flexibility2);
        }

        if (lights1 && lights2) {
            sleepScore += 0.2 * lightScore(lights1, lights2);
        }

        // calculate sleep schedule overlap
        if (sleepStart1 && sleepEnd1 && sleepStart2 && sleepEnd2) {
            const sleepOverlap = calculateOverlap(sleepStart1, sleepEnd1,
                sleepStart2, sleepEnd2);

            const totalSleepTime1 = calculateTotalSleepTime(sleepStart1, sleepEnd1);
            const totalSleepTime2 = calculateTotalSleepTime(sleepStart2, sleepEnd2);

            const sleepMatchPercentage1 = (sleepOverlap / totalSleepTime1);
            const sleepMatchPercentage2 = (sleepOverlap / totalSleepTime2);
            // calculate the average
            const sleepMatchPercentage =
                (sleepMatchPercentage1 + sleepMatchPercentage2) / 2;
            sleepScore += 0.6 * sleepMatchPercentage;
        }

        console.log("sleepScore: " + sleepScore);
        return sleepScore;
    }
};
