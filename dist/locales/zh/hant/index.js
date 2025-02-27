"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hant = void 0;
const chrono_1 = require("../../../chrono");
const ExtractTimezoneOffsetRefiner_1 = __importDefault(require("../../../common/refiners/ExtractTimezoneOffsetRefiner"));
const configurations_1 = require("../../../configurations");
const ZHHantCasualDateParser_1 = __importDefault(require("./parsers/ZHHantCasualDateParser"));
const ZHHantDateParser_1 = __importDefault(require("./parsers/ZHHantDateParser"));
const ZHHantDeadlineFormatParser_1 = __importDefault(require("./parsers/ZHHantDeadlineFormatParser"));
const ZHHantRelationWeekdayParser_1 = __importDefault(require("./parsers/ZHHantRelationWeekdayParser"));
const ZHHantTimeExpressionParser_1 = __importDefault(require("./parsers/ZHHantTimeExpressionParser"));
const ZHHantWeekdayParser_1 = __importDefault(require("./parsers/ZHHantWeekdayParser"));
const ZHHantMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ZHHantMergeDateRangeRefiner"));
const ZHHantMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ZHHantMergeDateTimeRefiner"));
exports.hant = new chrono_1.Chrono(createCasualConfiguration());
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
    option.parsers.unshift(new ZHHantCasualDateParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    const configuration = configurations_1.includeCommonConfiguration({
        parsers: [
            new ZHHantDateParser_1.default(),
            new ZHHantRelationWeekdayParser_1.default(),
            new ZHHantWeekdayParser_1.default(),
            new ZHHantTimeExpressionParser_1.default(),
            new ZHHantDeadlineFormatParser_1.default(),
        ],
        refiners: [new ZHHantMergeDateRangeRefiner_1.default(), new ZHHantMergeDateTimeRefiner_1.default()],
    });
    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default));
    return configuration;
}
exports.createConfiguration = createConfiguration;
