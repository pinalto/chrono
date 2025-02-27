import { ParsingContext } from "../../../../chrono";
import { AbstractParserWithWordBoundaryChecking } from "../../../../common/parsers/AbstractParserWithWordBoundary";
import { ParsingResult } from "../../../../results";
export default class ZHHantWeekdayParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp;
    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingResult;
}
