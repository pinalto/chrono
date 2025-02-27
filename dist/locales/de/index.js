"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const configurations_1 = require("../../configurations");
const chrono_1 = require("../../chrono");
const SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
const ISOFormatParser_1 = __importDefault(require("../../common/parsers/ISOFormatParser"));
const DETimeExpressionParser_1 = __importDefault(require("./parsers/DETimeExpressionParser"));
const DEWeekdayParser_1 = __importDefault(require("./parsers/DEWeekdayParser"));
const DEMergeDateRangeRefiner_1 = __importDefault(require("./refiners/DEMergeDateRangeRefiner"));
const DEMergeDateTimeRefiner_1 = __importDefault(require("./refiners/DEMergeDateTimeRefiner"));
const DECasualDateParser_1 = __importDefault(require("./parsers/DECasualDateParser"));
const DECasualTimeParser_1 = __importDefault(require("./parsers/DECasualTimeParser"));
const DEMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/DEMonthNameLittleEndianParser"));
exports.casual = new chrono_1.Chrono(createCasualConfiguration());
exports.strict = new chrono_1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new DECasualTimeParser_1.default());
    option.parsers.unshift(new DECasualDateParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations_1.includeCommonConfiguration({
        parsers: [
            new ISOFormatParser_1.default(),
            new SlashDateFormatParser_1.default(littleEndian),
            new DETimeExpressionParser_1.default(),
            new DEMonthNameLittleEndianParser_1.default(),
            new DEWeekdayParser_1.default(),
        ],
        refiners: [new DEMergeDateRangeRefiner_1.default(), new DEMergeDateTimeRefiner_1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
