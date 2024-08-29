import DomainError from '@domain/errors/domain-error';
import generateRandomCode from '@domain/services/generate-random-code';
import generateRandomID from '@domain/services/generate-random-id';
import Code from '@domain/value-objects/code';
import ErrorCode from '@shared/error-codes';

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

  set code(newCustomCode: string) {
    this.props.code = new Code(newCustomCode);
    this.props.updatedAt = new Date();
  }

  get link() {
    return this.props.link;
  }

  set link(link: string) {
    this.props.link = link;
    this.props.updatedAt = new Date();
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

  isExpired() {
    return this.props.expiresIn && this.props.expiresIn <= new Date();
  }

  incrementUsageCount() {
    if (this.isExpired()) {
      throw new DomainError(ErrorCode.EXPIRED_SHORTENED_LINK, 'Link expired');
    }

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
