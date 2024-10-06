import FontCore, { TTF } from 'fonteditor-core';
import * as util from './utils';

type OptsType = {
  hinting?: boolean;
  trim?: boolean;
  subset?: number[];
  text?: string;
  basicText?: boolean;
}

export const minifyFontObject = (fontObject: TTF.TTFObject, subset?: number[]) => {
  const ttf = new FontCore.TTF(fontObject);

  let glyphs = [];
  const indexList = ttf.findGlyf({
    unicode: subset || [],
  });

  if(indexList.length) {
    glyphs = ttf.getGlyf(indexList);
  }
  glyphs.unshift(ttf.get().glyf[0]);
  ttf.setGlyf(glyphs);

  return ttf;
}

export const minify = (ttfObject: TTF.TTFObject, opts: OptsType = {}) => {
  const _opts: OptsType = {
    hinting: true,
    trim: true,
    ...opts,
  }
  const subsetText = util.getSubsetText(_opts);
  _opts.subset = util.string2unicodes(subsetText);

  const miniTTF = minifyFontObject(ttfObject, _opts.subset);

  const buffer = new FontCore.TTFWriter(
    { writeZeroContoursGlyfData: true },
    _opts,
  ).write(miniTTF.get());

  return buffer;
}