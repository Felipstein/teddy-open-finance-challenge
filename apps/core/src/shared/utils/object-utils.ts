import _ from 'lodash';

function equals(obj1: any, obj2: any) {
  return _.isEqual(obj1, obj2);
}

function cloneDeep<T>(obj: T): T {
  return _.cloneDeep(obj);
}

/**
 * Seta strings vazias para null ou undefined
 */
function mapEmptyStrings(obj: object, setTo: 'null' | 'undefined' = 'null') {
  const newObj = cloneDeep(obj);

  for (const key in newObj) {
    const value = newObj[key as keyof typeof newObj];

    if (typeof value === 'string' && value === '') {
      // @ts-expect-error
      newObj[key] = setTo === 'null' ? null : undefined;
      continue;
    }

    if (typeof value === 'object' && !!value) {
      // @ts-expect-error
      newObj[key] = mapEmptyStrings(value, setTo);
      continue;
    }

    newObj[key as keyof typeof newObj] = value;
  }

  return newObj;
}

/**
 * Remove as propriedades que estão undefined
 */
function deleteUndefined<T extends object>(obj: T) {
  const newObj = {} as T;

  for (const key in obj) {
    const value = obj[key];

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !_.isEmpty(value) &&
      !(value instanceof Promise)
    ) {
      newObj[key] = deleteUndefined(value);
      continue;
    }

    if (value === undefined) {
      continue;
    }

    newObj[key] = value;
  }

  return newObj;
}

const objectUtils = {
  equals,
  cloneDeep,
  mapEmptyStrings,
  deleteUndefined,
};

export default objectUtils;
