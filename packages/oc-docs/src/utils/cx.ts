// classnames/clsx-style composer: strings, numbers, arrays, { class: cond } objects; falsy skipped.
export type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassValue[];

export interface ClassDictionary {
  [className: string]: boolean | null | undefined;
}

export const cx = (...inputs: ClassValue[]): string => {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cx(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const key of Object.keys(input)) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(' ');
};

export default cx;
