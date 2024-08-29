function random(): number;
function random(max: number): number;
function random(min: number, max: number): number;

function random(minOrMax?: number, max?: number) {
  if (minOrMax === undefined && max === undefined) {
    return Math.random();
  }

  if (max === undefined) {
    max = minOrMax;
    minOrMax = 0;
  } else if (minOrMax === undefined) {
    minOrMax = 0;
  }

  return Math.random() * (max! - minOrMax) + minOrMax;
}

const numberUtils = {
  random,
};

export default numberUtils;
