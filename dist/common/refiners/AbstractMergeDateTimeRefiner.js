"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRefiners_1 = require("../abstractRefiners");
const mergingCalculation_1 = require("../../calculation/mergingCalculation");
class ENMergeDateTimeRefiner extends abstractRefiners_1.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
            textBetween.match(this.patternBetween()) != null);
    }
    mergeResults(textBetween, currentResult, nextResult) {
        const result = currentResult.start.isOnlyDate()
            ? mergingCalculation_1.mergeDateTimeResult(currentResult, nextResult)
            : mergingCalculation_1.mergeDateTimeResult(nextResult, currentResult);
        result.index = currentResult.index;
        result.text = currentResult.text + textBetween + nextResult.text;
        return result;
    }
}
exports.default = ENMergeDateTimeRefiner;
