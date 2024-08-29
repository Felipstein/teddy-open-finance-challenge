/**
 * ValueObject (VO) são conceitos encontrados dentro do conjunto de princípios
 * para design de softwares DDD (Domain-Driven Design).
 *
 * Diferente das Entidades, ValueObjects não possuem identidade e são imutáveis. São usados
 * geralmente para compor as entidades, concentrando regras do domínio da aplicação.
 */
export default abstract class ValueObject<TPrimitive> {
  protected readonly _rawValue: TPrimitive;

  constructor(value: TPrimitive) {
    const transformedValue = this.validate(value);

    this._rawValue = typeof transformedValue === 'undefined' ? value : transformedValue;
  }

  /**
   * Realiza uma validação no valor primitivo providenciado pelo construtor
   * para garantir que o VO seja válido.
   *
   * @returns Caso não seja retornado nenhum valor, o valor providenciado pelo
   * construtor é quem persistirá, mas caso seja retornado um valor da função,
   * o valor retornado será o que persistirá no VO.
   */
  protected abstract validate(value: TPrimitive): void | TPrimitive | never;

  equals(value: TPrimitive | ValueObject<TPrimitive>) {
    if (!value) return false;

    if (value === this) return true;

    return value instanceof ValueObject
      ? this._rawValue === value._rawValue
      : this._rawValue === new (this.constructor as any)(value)._rawValue;
  }
}

export type ValueObjectPrimitive<T> = T extends ValueObject<infer TPrimitive> ? TPrimitive : never;
