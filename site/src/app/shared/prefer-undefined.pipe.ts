import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preferUndefined',
  standalone: true,
  pure: true,
})
export class PreferUndefinedPipe implements PipeTransform {
  transform<Value>(
    value: Value,
    ...args: unknown[]
  ): Exclude<Value, null> extends never ? undefined : Exclude<Value, null> {
    const result = value === null ? undefined : value;
    return result as any;
  }
}
