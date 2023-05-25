import { CssBorderRadiusParser } from './border-radius.js';

describe('CssBorderRadiusParser', () => {
  let parser: CssBorderRadiusParser;

  beforeEach(() => {
    parser = new CssBorderRadiusParser();
  });

  describe('parse', () => {
    test('?px ?px', () => {
      expect(parser.parse('10px 20px', 100, 100)).toEqual({ x: 10, y: 20 });
    });
    test('?px', () => {
      expect(parser.parse('10px', 100, 100)).toEqual({ x: 10, y: 10 });
    });
    test('?%', () => {
      expect(parser.parse('10%', 100, 100)).toEqual({ x: 10, y: 10 });
    });
    test('unsupported', () => {
      const fn = () => parser.parse('10px / 10px', 100, 100);
      expect(fn).toThrow('Unsupported');
    });
  });
});
