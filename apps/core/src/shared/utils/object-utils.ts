import _ from 'lodash';

function equals(obj1: any, obj2: any) {
  return _.isEqual(obj1, obj2);
}

const objectUtils = {
  equals,
};

export default objectUtils;
