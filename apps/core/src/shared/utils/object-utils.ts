import _ from 'lodash';

function equals(obj1: any, obj2: any) {
  return _.isEqual(obj1, obj2);
}

function cloneDeep<T>(obj: T): T {
  return _.cloneDeep(obj);
}

const objectUtils = {
  equals,
  cloneDeep,
};

export default objectUtils;
