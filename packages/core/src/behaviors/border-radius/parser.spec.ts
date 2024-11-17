import { ComputedStylesBorderRadiusParser } from './parser.js';

describe('ComputedStylesBorderRadiusParser', () => {
  let parser: ComputedStylesBorderRadiusParser;

  beforeEach(() => {
    parser = new ComputedStylesBorderRadiusParser();
  });

  describe('parse', () => {
    test('?px ?px', () => {
      expect(parser.parseCorner('10px 20px', 100, 100)).toEqual({
        x: 10,
        y: 20,
      });
    });
    test('?px', () => {
      expect(parser.parseCorner('10px', 100, 100)).toEqual({ x: 10, y: 10 });
    });
    test('?%', () => {
      expect(parser.parseCorner('10%', 100, 100)).toEqual({ x: 10, y: 10 });
    });
    test('unsupported', () => {
      const fn = () => parser.parseCorner('10px / 10px', 100, 100);
      expect(fn).toThrow('Unsupported');
    });
  });
});
