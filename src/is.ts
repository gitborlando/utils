export class Is {
  static number(value: any): value is number {
    return typeof value === 'number'
  }
  static string(value: any): value is string {
    return typeof value === 'string'
  }
  static boolean(value: any): value is boolean {
    return typeof value === 'boolean'
  }
  static array<T>(value: any): value is T[] {
    return Array.isArray(value)
  }
  static object(value: any): value is object {
    return typeof value === 'object' && value !== null && !Is.array(value)
  }
  static function(value: any): value is Function {
    return typeof value === 'function'
  }
  static null(value: any): value is null {
    return value === null
  }
  static undefined(value: any): value is undefined {
    return value === undefined
  }
  static symbol(value: any): value is symbol {
    return typeof value === 'symbol'
  }
  static nullable(value: any): value is null | undefined {
    return value === null || value === undefined
  }
  static notNullable<T>(value: any): value is T {
    return value !== null && value !== undefined
  }
  static falsy(value: any) {
    return (
      Is.nullable(value) ||
      value === '' ||
      value === false ||
      value === 'false' ||
      value === 0
    )
  }
  static notFalsy(value: any) {
    return !Is.falsy(value)
  }
  static empty(value: any) {
    if (Is.array(value)) return value.length === 0
    if (Is.object(value)) return Object.keys(value).length === 0
    return Is.falsy(value)
  }
  static notEmpty(value: any) {
    return !Is.empty(value)
  }
}
