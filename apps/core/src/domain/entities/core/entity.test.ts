import generateRandomID from '@domain/services/generate-random-id';

import Entity from './entity';

type Props = {
  name: string;
  email: string;
  social: {
    twitter?: string;
    facebook?: string;
  };
};

class TestEntity extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  get social() {
    return this.props.social;
  }
}

describe('Entity', () => {
  it('deve comparar pelos campos ambas as entidades com mesma identificação porém com mutação e retornar false', () => {
    const id = generateRandomID();
    const props: Props = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      social: {
        twitter: '@johndoe',
        facebook: 'johndoe',
      },
    };

    const entity1 = new TestEntity(id, props);
    const entity2 = new TestEntity(id, props);

    entity2.name = 'Felipe';

    expect(entity1.equals(entity2)).toBe(false);
  });

  it('deve comparar pela identidade ambas as entidades com mesma identificação porém com mutação e retornar true', () => {
    const id = generateRandomID();
    const props: Props = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      social: {
        twitter: '@johndoe',
        facebook: 'johndoe',
      },
    };

    const entity1 = new TestEntity(id, props);
    const entity2 = new TestEntity(id, props);

    entity2.name = 'Felipe';

    expect(entity1.same(entity2)).toBe(true);
  });
});
