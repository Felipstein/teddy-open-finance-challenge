import ID from '@domain/value-objects/id';
import objectUtils from '@shared/utils/object-utils';

export default class Entity<TProps extends Record<string, any>> {
  protected readonly props: TProps;

  constructor(
    readonly id: ID,
    props: TProps,
  ) {
    this.props = objectUtils.cloneDeep(props);
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
