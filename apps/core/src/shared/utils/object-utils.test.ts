import objectUtils from './object-utils';

describe('objectUtils', () => {
  describe('equals', () => {
    it('deve comparar ambos objetos idênticos sob referências diferentes e retornar como true', () => {
      const obj1 = {
        name: 'John',
        socials: {
          twitter: '@johndoe',
          facebook: 'johndoe',
        },
      };

      const obj2 = {
        name: 'John',
        socials: {
          twitter: '@johndoe',
          facebook: 'johndoe',
        },
      };

      expect(objectUtils.equals(obj1, obj2)).toBe(true);
    });

    it('deve comparar ambos objetos diferentes sob referências diferentes e retornar como false', () => {
      const obj1 = {
        name: 'John',
        socials: {
          twitter: '@johndoe',
          facebook: 'johndoe',
        },
      };

      const obj2 = {
        name: 'Felipe',
        socials: {
          twitter: '@johndoe',
          facebook: 'johndoe',
          instagram: '@johndoe',
        },
      };

      expect(objectUtils.equals(obj1, obj2)).toBe(false);
    });
  });

  it('cloneDeep', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
      d: [
        'abc',
        {
          e: 3,
        },
      ],
    };

    const newObj = objectUtils.cloneDeep(obj);

    expect(newObj).toEqual(obj);
    expect(newObj).not.toBe(obj);
  });

  it('mapEmptyStrings', () => {
    const obj = {
      firstName: 'John',
      lastName: '',
      email: 'johndoe@example.com',
      phone: '',
      social: {
        twitter: '',
        facebook: 'face',
      },
    };

    expect(objectUtils.mapEmptyStrings(obj)).toEqual({
      firstName: 'John',
      lastName: null,
      email: 'johndoe@example.com',
      phone: null,
      social: {
        twitter: null,
        facebook: 'face',
      },
    });
    expect(objectUtils.mapEmptyStrings(obj, 'undefined')).toEqual({
      firstName: 'John',
      email: 'johndoe@example.com',
      social: {
        facebook: 'face',
      },
    });
  });
});
