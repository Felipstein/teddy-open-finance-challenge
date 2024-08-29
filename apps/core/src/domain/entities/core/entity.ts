import ID from '@domain/value-objects/id';
import objectUtils from '@shared/utils/object-utils';

/**
 * Entidades são modelo de domínios (e também chamado aggregates) dentro do conceito de design
 * de arquiteturas DDD (Domain-Driven Design). Diferente dos Value Objects, as entidades possuem
 * uma identificação única, são mutáveis e persistentes na aplicação.
 */
export default class Entity<TProps extends Record<string, any>> {
  private readonly _id: ID;
  protected readonly props: TProps;

  constructor(id: ID, props: TProps) {
    this._id = id;
    this.props = objectUtils.cloneDeep(props);
  }

  get id() {
    return this._id.value;
  }

  /**
   * Verifica se ambas as entidades possuem ainda os mesmos valores, não havendo nenhuma
   * mutação.
   */
  equals(value: unknown) {
    if (!value) return false;

    if (value === this) return true;

    if (value instanceof Entity) {
      return this.id === value.id && objectUtils.equals(this.props, value.props);
    }

    return false;
  }

  /**
   * Verifica se ambas as entidades são as mesmas, comparando-as pela identificação (ID).
   */
  same(entity: Entity<any>) {
    return this.id === entity.id;
  }
}
