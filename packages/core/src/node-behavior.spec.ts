import { Node } from './node.js';
import { NodeBehavior } from './node-behavior.js';

describe('NodeBehavior', () => {
  function createNode(id: string): Node {
    return {
      identity: jest.fn(() => id),
      attach: jest.fn(),
      detach: jest.fn(),
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      parent: jest.fn(() => null),
      children: jest.fn(() => new Set()),
      dispose: jest.fn(),
      traverse: jest.fn(),
      track: jest.fn(),
    };
  }

  const createBehavior = jest.fn(
    (kernel: Node): NodeBehavior =>
      new (class extends NodeBehavior {
        constructor() {
          super(kernel);
        }
        protected override decorate(target: Node): this {
          return createBehavior(target) as this;
        }
      })(),
  );

  describe('identity', () => {
    it('should work', () => {
      const kernel = createNode('kernel');
      const behavior = createBehavior(kernel);
      expect(behavior.identity()).toBe('kernel');
    });
  });

  describe('attach', () => {
    it('should invoke kernel', () => {
      const root = createNode('root');
      const child = createNode('child');
      const childBehavior = createBehavior(child);
      childBehavior.attach(root);
      expect(child.attach).toHaveBeenCalledWith(root);
    });
  });

  describe('parent', () => {
    it('should decorate parent', () => {
      const root = createNode('root');
      const child = createNode('child');
      child.parent = jest.fn(() => root);
      const childBehavior = createBehavior(child);
      const calls = createBehavior.mock.calls.length;
      const result = childBehavior.parent();
      expect(result).toBeInstanceOf(NodeBehavior);
      expect(createBehavior).toHaveBeenCalledTimes(calls + 1);
    });
  });

  describe('children', () => {
    it('should lazily decorate children', () => {
      const root = createNode('root');
      const child1 = createNode('child1');
      const child2 = createNode('child2');
      root.children = jest.fn(() => new Set([child1, child2]));
      const rootBehavior = createBehavior(root);
      const calls = createBehavior.mock.calls.length;
      const result = rootBehavior.children();
      expect(createBehavior).toHaveBeenCalledTimes(calls);
      const values = result.values();
      expect(values.next().value).toBeInstanceOf(NodeBehavior);
      expect(createBehavior).toHaveBeenCalledTimes(calls + 1);
      expect(values.next().value).toBeInstanceOf(NodeBehavior);
      expect(createBehavior).toHaveBeenCalledTimes(calls + 2);
      expect(values.next().done).toBe(true);
    });
  });
});
