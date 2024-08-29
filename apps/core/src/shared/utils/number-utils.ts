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

  const number = Math.random() * (max! - minOrMax) + minOrMax;

  /**
   * Em caso da diferença entre o mínimo e o máximo for maior ou igual a 1, o número será arredondado
   */
  const diff = max! - minOrMax;
  return diff < 1 ? number : Math.floor(number);
}

const numberUtils = {
  random,
};

export default numberUtils;
