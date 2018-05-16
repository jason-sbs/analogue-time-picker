import { AmPm } from './distance';

const _30 = Math.PI / 6;
const _12 = Math.PI / 30;
const _360 = Math.PI * 2;
const _90 = Math.PI / 2;

/** Snap an angle to a given step. E.g. if angle = 22° and step = 10°, round down to 20° */
function snap(angle: number, step: number) {

    var a = angle;
    while (a < 0) a += _360;
    var diff = a % step;

    if (diff <= step / 2) {
        return angle - diff;
    }

    return angle - diff + step;
}

/** Calculate the hour from the hand angle */
function getHours (handAngle: number, amPm: AmPm) {
    handAngle = snap(handAngle, _30);

    var hour = parseInt((((handAngle - _90) % _360) / _30).toFixed());
    if (hour < 0) hour += 12;
    if (hour >= 12) hour -= 12;

    if (!hour) {
        if (amPm === AmPm.am) hour = 12; 
    } else {
        if (amPm !== AmPm.am) hour += 12; 
    }

    return {
        hour,
        handAngle
    }
}

/** Calculate the minute from the hand angle */
function getMinutes (handAngle: number) {
    handAngle = snap(handAngle, _12);

    var minute = parseInt((((handAngle - _90) % _360) / _12).toFixed());
    while (minute < 0) minute += 60;
    while (minute >= 60) minute -= 60;
    
    return {
        minute,
        handAngle
    }
}

function convert24hTo12h(value: number) {

    if (!value) return 12;
    else if (value > 12) return value - 12;
    else return value;
}

function convert12hTo24h(value: number, amPm: AmPm) {

    if (amPm === AmPm.am) return value;
    else if (amPm === AmPm.pm) {
        if (value === 12) return 0;
        return value + 12;
    } else {
        throw new Error(`Expected "am" or "pm": "${amPm}"`);
    }
}

/** The default time format (12h/24h) based on the value of Date.prototype.toLocaleTimeString */
var defaultMode = (function (): 12 | 24 {
    var locale = new Date("January 01, 2000 13:00:00 GMT+00:00").toLocaleTimeString();
    return /(AM)|(PM)/i.test(locale) ? 12 : 24;
} ());

export {
    defaultMode,
    getHours,
    getMinutes,
    convert12hTo24h,
    convert24hTo12h
}