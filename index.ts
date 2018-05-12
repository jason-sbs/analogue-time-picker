import { Clock, TimeInput } from "./src/clock";
import { create, append, remove } from "./src/template";
import { buildElements } from "./src/componentElements";
import { publicClock } from "./src/publicClock";

// requiring will auto inject via webpack style-loader
declare var require: any
const css = require('./src/clock.css');

enum ElementMode {
    Created = 1,
    Appended = 2
}

type Input =
    {
        element?: object, 
        time?: {hour: object | null, minute: object | null} | Date,
        closeOnSelect?: boolean
    }

function simpleMaterialTime(input?: Input) {

    if (!input) input = {};

    var element: HTMLElement;
    var time: TimeInput = {hour: null, minute: null};

    var mode: ElementMode
    if (input.element == null) {
        mode = ElementMode.Created;
        element = create();
    } else if (!(input.element instanceof HTMLElement)) {
        throw new Error("The input argument must be a html element.");
    } else {
        mode = ElementMode.Appended;
        element = append(input.element);
    }

    if (input.time != null) {
        if (input.time instanceof Date) {
            time.hour = input.time.getHours();
            time.minute = input.time.getMinutes();
        } else {
            if (input.time.hour != null) {
                if (typeof input.time.hour === "number") {
                    if (input.time.hour < 0 || input.time.hour > 23) throw new Error("The time.hour argument must be between 1 and 24.");
                    time.hour = input.time.hour;
                } else {
                    throw new Error("The time.hour argument must be a number.");
                }
            }
            
            if (input.time.minute != null) {
                if (typeof input.time.minute === "number") {
                    if (input.time.minute < 0 || input.time.minute > 59) throw new Error("The time.minute argument must be between 0 and 59.");
                    time.minute = input.time.minute;
                } else {
                    throw new Error("The time.minute argument must be a number.");
                }
            }
        }
    }

    var clock = new Clock(buildElements(element), !!input.closeOnSelect, time);
    clock.onDispose(() => mode === ElementMode.Created ?
        element.parentElement ?
            element.parentElement.removeChild(element) :
            null :
        remove(element));

    return publicClock(clock, element);
}

export {
    simpleMaterialTime
}