"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingResult = exports.ParsingComponents = exports.ReferenceWithTimezone = void 0;
const quarterOfYear_1 = __importDefault(require("dayjs/plugin/quarterOfYear"));
const dayjs_1 = __importDefault(require("dayjs"));
const dayjs_2 = require("./utils/dayjs");
const timezone_1 = require("./timezone");
dayjs_1.default.extend(quarterOfYear_1.default);
class ReferenceWithTimezone {
    constructor(input) {
        var _a;
        input = input !== null && input !== void 0 ? input : new Date();
        if (input instanceof Date) {
            this.instant = input;
            this.timezoneOffset = -input.getTimezoneOffset();
        }
        else {
            this.instant = (_a = input.instant) !== null && _a !== void 0 ? _a : new Date();
            this.timezoneOffset = timezone_1.toTimezoneOffset(input.timezone);
        }
    }
}
exports.ReferenceWithTimezone = ReferenceWithTimezone;
class ParsingComponents {
    constructor(reference, knownComponents) {
        this.reference = reference;
        this.knownValues = {};
        this.impliedValues = {};
        if (knownComponents) {
            for (const key in knownComponents) {
                this.knownValues[key] = knownComponents[key];
            }
        }
        const refDayJs = dayjs_1.default(reference.instant);
        this.imply("day", refDayJs.date());
        this.imply("month", refDayJs.month() + 1);
        this.imply("year", refDayJs.year());
        this.imply("hour", 12);
        this.imply("minute", 0);
        this.imply("second", 0);
        this.imply("millisecond", 0);
    }
    get(component) {
        if (component in this.knownValues) {
            return this.knownValues[component];
        }
        if (component in this.impliedValues) {
            return this.impliedValues[component];
        }
        return null;
    }
    isCertain(component) {
        return component in this.knownValues;
    }
    getCertainComponents() {
        return Object.keys(this.knownValues);
    }
    imply(component, value) {
        if (component in this.knownValues) {
            return this;
        }
        this.impliedValues[component] = value;
        return this;
    }
    assign(component, value) {
        this.knownValues[component] = value;
        delete this.impliedValues[component];
        return this;
    }
    delete(component) {
        delete this.knownValues[component];
        delete this.impliedValues[component];
    }
    clone() {
        const component = new ParsingComponents(this.reference);
        component.knownValues = {};
        component.impliedValues = {};
        for (const key in this.knownValues) {
            component.knownValues[key] = this.knownValues[key];
        }
        for (const key in this.impliedValues) {
            component.impliedValues[key] = this.impliedValues[key];
        }
        return component;
    }
    isOnlyDate() {
        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
    }
    isOnlyTime() {
        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyWeekdayComponent() {
        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyDayMonthComponent() {
        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
    }
    isValidDate() {
        const date = this.dateWithoutTimezoneAdjustment();
        if (date.getFullYear() !== this.get("year"))
            return false;
        if (date.getMonth() !== this.get("month") - 1)
            return false;
        if (date.getDate() !== this.get("day"))
            return false;
        if (this.get("hour") != null && date.getHours() != this.get("hour"))
            return false;
        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
            return false;
        return true;
    }
    toString() {
        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}]`;
    }
    dayjs() {
        return dayjs_1.default(this.date());
    }
    date() {
        const date = this.dateWithoutTimezoneAdjustment();
        return new Date(date.getTime() + this.getSystemTimezoneAdjustmentMinute(date) * 60000);
    }
    dateWithoutTimezoneAdjustment() {
        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
        date.setFullYear(this.get("year"));
        return date;
    }
    getSystemTimezoneAdjustmentMinute(date) {
        var _a, _b;
        if (!date || date.getTime() < 0) {
            date = new Date();
        }
        const currentTimezoneOffset = -date.getTimezoneOffset();
        const targetTimezoneOffset = (_b = (_a = this.get("timezoneOffset")) !== null && _a !== void 0 ? _a : this.reference.timezoneOffset) !== null && _b !== void 0 ? _b : currentTimezoneOffset;
        return currentTimezoneOffset - targetTimezoneOffset;
    }
    static createRelativeFromReference(reference, fragments) {
        let date = dayjs_1.default(reference.instant);
        for (const key in fragments) {
            date = date.add(fragments[key], key);
        }
        const components = new ParsingComponents(reference);
        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
            dayjs_2.assignSimilarTime(components, date);
            dayjs_2.assignSimilarDate(components, date);
            if (reference.timezoneOffset !== null) {
                components.assign("timezoneOffset", -reference.instant.getTimezoneOffset());
            }
        }
        else {
            dayjs_2.implySimilarTime(components, date);
            if (reference.timezoneOffset !== null) {
                components.imply("timezoneOffset", -reference.instant.getTimezoneOffset());
            }
            if (fragments["d"]) {
                components.assign("day", date.date());
                components.assign("month", date.month() + 1);
                components.assign("year", date.year());
            }
            else {
                if (fragments["week"]) {
                    components.imply("weekday", date.day());
                }
                components.imply("day", date.date());
                if (fragments["month"]) {
                    components.assign("month", date.month() + 1);
                    components.assign("year", date.year());
                }
                else {
                    components.imply("month", date.month() + 1);
                    if (fragments["year"]) {
                        components.assign("year", date.year());
                    }
                    else {
                        components.imply("year", date.year());
                    }
                }
            }
        }
        return components;
    }
}
exports.ParsingComponents = ParsingComponents;
class ParsingResult {
    constructor(reference, index, text, start, end) {
        this.reference = reference;
        this.refDate = reference.instant;
        this.index = index;
        this.text = text;
        this.start = start || new ParsingComponents(reference);
        this.end = end;
    }
    clone() {
        const result = new ParsingResult(this.reference, this.index, this.text);
        result.start = this.start ? this.start.clone() : null;
        result.end = this.end ? this.end.clone() : null;
        return result;
    }
    date() {
        return this.start.date();
    }
    toString() {
        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
    }
}
exports.ParsingResult = ParsingResult;
