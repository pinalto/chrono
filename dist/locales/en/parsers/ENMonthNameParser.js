"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const years_1 = require("../../../calculation/years");
const pattern_1 = require("../../../utils/pattern");
const constants_2 = require("../constants");
const AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
const PATTERN = new RegExp(`((?:in)\\s*)?` +
    `(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const PREFIX_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const YEAR_GROUP = 3;
class ENMonthNameParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants_1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
            return null;
        }
        const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants_1.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            const year = years_1.findYearClosestToRef(context.refDate, 1, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = ENMonthNameParser;
