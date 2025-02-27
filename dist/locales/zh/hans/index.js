"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hans = void 0;
const chrono_1 = require("../../../chrono");
const ExtractTimezoneOffsetRefiner_1 = __importDefault(require("../../../common/refiners/ExtractTimezoneOffsetRefiner"));
const configurations_1 = require("../../../configurations");
const ZHHansCasualDateParser_1 = __importDefault(require("./parsers/ZHHansCasualDateParser"));
const ZHHansDateParser_1 = __importDefault(require("./parsers/ZHHansDateParser"));
const ZHHansDeadlineFormatParser_1 = __importDefault(require("./parsers/ZHHansDeadlineFormatParser"));
const ZHHansRelationWeekdayParser_1 = __importDefault(require("./parsers/ZHHansRelationWeekdayParser"));
const ZHHansTimeExpressionParser_1 = __importDefault(require("./parsers/ZHHansTimeExpressionParser"));
const ZHHansWeekdayParser_1 = __importDefault(require("./parsers/ZHHansWeekdayParser"));
const ZHHansMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ZHHansMergeDateRangeRefiner"));
const ZHHansMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ZHHansMergeDateTimeRefiner"));
exports.hans = new chrono_1.Chrono(createCasualConfiguration());
exports.casual = new chrono_1.Chrono(createCasualConfiguration());
exports.strict = new chrono_1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new ZHHansCasualDateParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    const configuration = configurations_1.includeCommonConfiguration({
        parsers: [
            new ZHHansDateParser_1.default(),
            new ZHHansRelationWeekdayParser_1.default(),
            new ZHHansWeekdayParser_1.default(),
            new ZHHansTimeExpressionParser_1.default(),
            new ZHHansDeadlineFormatParser_1.default(),
        ],
        refiners: [new ZHHansMergeDateRangeRefiner_1.default(), new ZHHansMergeDateTimeRefiner_1.default()],
    });
    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default));
    return configuration;
}
exports.createConfiguration = createConfiguration;
