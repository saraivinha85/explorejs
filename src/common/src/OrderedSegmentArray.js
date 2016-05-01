var bs = require('binarysearch');
var _ = require('underscore');
var options = {
    leftBoundKey: 'left',
    rightBoundKey: 'right',
    leftBoundClosed: true,
    rightBoundClosed: false
};
/**
 * Implementation of segment array where each segment doesn't overlap each other.
 * All segments all disjoint or touch others
 */
class OrderedSegmentArray {

    /**
     * @param [options.leftBoundKey]
     * @param [options.rightBoundKey]
     * @param [options.leftBoundClosed]
     * @param [options.rightBoundClosed]
     */
    constructor(options) {
        this.options = _.defaults(options, OrderedSegmentArray);
        this._leftBoundComparator = new Function('e', 'find',
            `return e['${this.options.leftBoundKey}'] - find;`
        );
        this._rightBoundComparator = new Function('e', 'find',
            `return e['${this.options.rightBoundKey}'] - find;`
        );
        this._data = [];
    }

    /**
     * Inserts range of segments into array assuming the there are no existing ranges between first and last range
     * @param range must be ordered and not overlap with existing segment
     */
    insertRange(range) {
        var leftBoundKey = this.options.leftBoundKey;
        var rightBoundKey = this.options.rightBoundKey;
        var rangeLeft = range[0][leftBoundKey];
        var rangeRight = range[range.length - 1][rightBoundKey];
        var leftNeighborIndex = this._findBoundNotAfter(rangeLeft, this._rightBoundComparator);
        var rightNeighborIndex = this._findBoundNotBefore(rangeRight, this._leftBoundComparator);

        if (rightNeighborIndex - leftNeighborIndex == 1) {
            //segments are not touching
            this._data.splice(leftNeighborIndex + 1, 0, ...range);
        } else {
            throw new Error("You can insert only into a gap. There are items in your range, so you should use mergeRange method");
        }


    }

    /**
     * Merges range of segments into array with preserving order of overlapped segments in array
     * @param range array of segments, can overlap existing segments
     */
    mergeRange(range) {
        // TODO: perform the array merge of range and overlapped segments
    }

    /**
     * @param openKey first segment open key
     * @param closeKey last segment close key
     */
    removeRange(openKey, closeKey) {

    }

    /**
     *
     * @param openIndex first segment index
     * @param closeIndex last segment index
     */
    removeRangeByIndex(openIndex, closeIndex) {

    }

    /**
     * Returns range of segments which contains specified range
     * @param rangeLeftBound left bound to find first segment
     * @param rangeRightBound right bound to find last segment
     * @returns {Array}
     */
    getRange(rangeLeftBound, rangeRightBound) {
        if (arguments.length == 0) {
            return this._data;
        }
        var indexes = this.findRangeIndexes(rangeLeftBound, rangeRightBound);
        return this._data.slice(indexes.left, indexes.right + 1);

    }

    findRangeIndexes(rangeLeftBound, rangeRightBound) {
        var firstSegmentIndex = this._findBoundNotBefore(rangeLeftBound, this._rightBoundComparator);
        var lastSegmentIndex = this._findBoundNotAfter(rangeRightBound, this._leftBoundComparator);
        var data = this._data;

        var firstSegmentRight_vs_rangeLeft = this._rightBoundComparator(data[firstSegmentIndex], rangeLeftBound);
        var lastSegmentLeft_vs_rangeRight = this._leftBoundComparator(data[lastSegmentIndex], rangeRightBound);

        // exclude touching segments for open bounds

        if (firstSegmentRight_vs_rangeLeft == 0 && this.options.leftBoundClosed == false) {
            firstSegmentIndex++;
        }
        if (lastSegmentLeft_vs_rangeRight == 0 && this.options.rightBoundClosed == false) {
            lastSegmentIndex--;
        }

        return {left: firstSegmentIndex, right: lastSegmentIndex};
    }

    _findBoundNotAfter(boundValue, boundComparator) {
        var index = bs.closest(this._data, boundValue, boundComparator);
        if (boundComparator(this._data[index], boundValue) > 0) {
            // found bound is greater
            return index - 1;
        }
        return index;
    }

    _findBoundNotBefore(boundValue, boundComparator) {
        var index = bs.closest(this._data, boundValue, boundComparator);
        if (boundComparator(this._data[index], boundValue) < 0) {
            // found bound is lower
            return index + 1;
        }
        return index;
    }

}
module.exports = OrderedSegmentArray;