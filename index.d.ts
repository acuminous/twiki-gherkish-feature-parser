export class FeatureParser {
  constructor(options?: FeatureParserOptionsType);
  parse(document: string, metadata?:FeatureParserMetadataType ): any;
}

export type FeatureParserOptionsType = {
  language?: Language;
}

export type FeatureParserMetadataType = {
  source?: {
    uri?: string;
  }
}

export class Language {
  constructor(props: {
    name: string;
    keywords: Map<string, RegExp>;
  });
  name: string;
  translate(keyword: string): RegExp;
}

export const Languages: LanguagesType;

type LanguagesType = {
  Chinese: Language,
  中国人: Language,
  Dutch: Language,
  Nederlands: Language,
  English: Language,
  French: Language,
  Français: Language,
  German: Language,
  Deutsch: Language,
  Norwegian: Language,
  Norsk: Language,
  Pirate: Language,
  Polish: Language,
  Polski: Language,
  Portugeuse: Language,
  Português: Language,
  Russian: Language,
  Русский: Language,
  Spanish: Language,
  Español: Language,
  Ukrainian: Language,
  Yкраїнська: Language,
}

declare class TwikiError extends Error {
  code: string;
}

export namespace Errors {
  export class UnexpectedEventError extends TwikiError {
    static code: string;
  }

  export class MissingEventHandlerBug extends TwikiError {
    static code: string;
  }

  export class UnexpectedNumberOfColumnsError extends TwikiError {
    static code: string;
  }

  export class UnexpectedNumberOfExamplesError extends TwikiError {
    static code: string;
  }

  export class MissingCheckpointBug extends TwikiError {
    static code: string;
  }

  export class MissingHandlerBug extends TwikiError {
    static code: string;
  }

  export class RedundantHandlerBug extends TwikiError {
    static code: string;
  }

  export class MissingStateAliasBug extends TwikiError {
    static code: string;
  }

  export class MissingTranslationPullRequest extends TwikiError {
    static code: string;
  }
}
