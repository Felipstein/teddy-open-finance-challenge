import generateRandomCode from '@domain/services/generate-random-code';
import generateRandomID from '@domain/services/generate-random-id';
import Code from '@domain/value-objects/code';

import Entity from './core/entity';

type ShortenedLinkProps = {
  code: Code;
  link: string;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresIn: Date | null;
  usageCount: number;
};

type Builder = {
  link: string;
  customCode?: string;
  createdByUserId?: string | null;
  expiresIn?: Date | null;
};

export default class ShortenedLink extends Entity<ShortenedLinkProps> {
  get code() {
    return this.props.code.value;
  }

  get link() {
    return this.props.link;
  }

  get createdByUserId() {
    return this.props.createdByUserId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get expiresIn() {
    return this.props.expiresIn;
  }

  set expiresIn(expiresIn: Date | null) {
    this.props.expiresIn = expiresIn;
    this.props.updatedAt = new Date();
  }

  get usageCount() {
    return this.props.usageCount;
  }

  incrementUsageCount() {
    ++this.props.usageCount;
  }

  static create(props: Builder) {
    const id = generateRandomID();
    const code = props.customCode ? new Code(props.customCode) : generateRandomCode();

    return new ShortenedLink(id, {
      code,
      link: props.link,
      createdByUserId: props.createdByUserId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresIn: props.expiresIn || null,
      usageCount: 0,
    });
  }
}
