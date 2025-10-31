import { useState, useEffect } from 'react';

/**
 * Compares if two objects have the same properties and values.
 * @param obj1 First object to compare.
 * @param obj2 Second object to compare.
 * @returns true if the objects are equal, false otherwise.
 */
function areObjectsEqual<T>(
  obj1: T,
  obj2: T,
  visited = new WeakSet(),
  depth = 0
): boolean {
  if (depth > 10) return false;
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  if (visited.has(obj1 as object) || visited.has(obj2 as object)) {
    return obj1 === obj2;
  }

  visited.add(obj1 as object);
  visited.add(obj2 as object);

  const keys1 = Object.keys(obj1 as object) as (keyof T)[];
  const keys2 = Object.keys(obj2 as object) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (
      !keys2.includes(key) ||
      !areObjectsEqual(obj1[key], obj2[key], visited, depth + 1)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Hook to determine if an object has changed compared to an initial reference.
 * @param currentObj The current object.
 * @param initialObj The initial reference object.
 * @returns true if the current object has changed, false if it is equal to the initial one.
 */
export function useHasChanged<T extends object | null>(
  currentObj: T,
  initialObj: T
): boolean {
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    // If both are null, there are no changes.
    if (currentObj === null && initialObj === null) {
      setHasChanged(false);
      return;
    }

    // If one is null and the other is not, there are changes.
    if (currentObj === null || initialObj === null) {
      setHasChanged(true);
      return;
    }

    const changed = !areObjectsEqual(currentObj, initialObj);
    setHasChanged(changed);
  }, [currentObj, initialObj]); // The effect runs when the objects change.

  return hasChanged;
}

/**
 * Removes null or undefined values from an object (recursively for nested objects).
 * @param obj The object to clean.
 * @returns A new object without null or undefined properties.
 */
export function cleanObjectRemoveNulls<T extends object>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        // Assume the value is an object and clean it recursively.
        const cleanedNestedObj = cleanObjectRemoveNulls(value);

        // If the nested object has properties, add it.
        if (Object.keys(cleanedNestedObj).length > 0) {
          // Assign the cleaned object to the new property.
          newObj[key] = cleanedNestedObj as T[Extract<keyof T, string>];
        }
      } else if (value !== null && value !== undefined) {
        // If the value is not an object and not null or undefined, add it.
        newObj[key] = value as T[Extract<keyof T, string>];
      }
    }
  }
  return newObj;
}
