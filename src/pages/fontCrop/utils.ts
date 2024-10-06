import _ from 'lodash';
import codePoints from 'code-points';

/**
 * getPureText
 *
 * @see https://msdn.microsoft.com/zh-cn/library/ie/2yfce773
 * @see http://www.unicode.org/charts/
 *
 * @param  {string} str target text
 * @return {string}     pure text
 */
function getPureText(str: string) {

    // fix space
    var emptyTextMap: Record<string, number> = {};

    function replaceEmpty (word: string) {
        emptyTextMap[word] = 1;
        return '';
    }

    var pureText = String(str)
        .replace(/[\s]/g, replaceEmpty)
        .trim()
        // .replace(/[\f]/g, '')
        // .replace(/[\b]/g, '')
        // .replace(/[\n]/g, '')
        // .replace(/[\t]/g, '')
        // .replace(/[\r]/g, '')
        .replace(/[\u2028]/g, '')
        .replace(/[\u2029]/g, '');

    var emptyText = Object.keys(emptyTextMap).join('');

    return pureText + emptyText;

}

/**
 * getUniqText
 *
 * @deprecated since version 0.9.9
 *
 * @param  {string} str target text
 * @return {string}     uniq text
 */
function getUniqText(str: string) {
    return _.uniq(
        str.split('')
    ).join('');
}


/**
 * basic chars
 *
 * "!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}"
 *
 * @type {string}
 */
var basicText = String.fromCharCode.apply(this, _.range(33, 126));

/**
 * get subset text
 *
 * @param  {Object} opts opts
 * @return {string}      subset text
 */
export function getSubsetText(opts: any) {

    var text = opts.text || '';

    // trim
    text && opts.trim && (text = getPureText(text));

    // basicText
    opts.basicText && (text += basicText);

    return text;
}

/**
 * string to unicodes
 *
 * @param  {string} str string
 * @return {Array}      unicodes
 */
export function string2unicodes(str: string) {
    return _.uniq<number>(codePoints(str));
}