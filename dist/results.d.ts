import { Component, ParsedComponents, ParsedResult, ParsingReference } from "./index";
import dayjs, { OpUnitType, QUnitType } from "dayjs";
export declare class ReferenceWithTimezone {
    readonly instant: Date;
    readonly timezoneOffset?: number;
    constructor(input?: ParsingReference | Date);
}
export declare class ParsingComponents implements ParsedComponents {
    private knownValues;
    private impliedValues;
    private reference;
    constructor(reference: ReferenceWithTimezone, knownComponents?: {
        [c in Component]?: number;
    });
    get(component: Component): number | null;
    isCertain(component: Component): boolean;
    getCertainComponents(): Array<Component>;
    imply(component: Component, value: number): ParsingComponents;
    assign(component: Component, value: number): ParsingComponents;
    delete(component: Component): void;
    clone(): ParsingComponents;
    isOnlyDate(): boolean;
    isOnlyTime(): boolean;
    isOnlyWeekdayComponent(): boolean;
    isOnlyDayMonthComponent(): boolean;
    isValidDate(): boolean;
    toString(): string;
    dayjs(): dayjs.Dayjs;
    date(): Date;
    private dateWithoutTimezoneAdjustment;
    private getSystemTimezoneAdjustmentMinute;
    static createRelativeFromReference(reference: ReferenceWithTimezone, fragments: {
        [c in OpUnitType | QUnitType]?: number;
    }): ParsingComponents;
}
export declare class ParsingResult implements ParsedResult {
    refDate: Date;
    index: number;
    text: string;
    reference: ReferenceWithTimezone;
    start: ParsingComponents;
    end?: ParsingComponents;
    constructor(reference: ReferenceWithTimezone, index: number, text: string, start?: ParsingComponents, end?: ParsingComponents);
    clone(): ParsingResult;
    date(): Date;
    toString(): string;
}
