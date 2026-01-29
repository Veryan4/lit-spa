import { ReactiveControllerHost, noChange } from "lit";
import {
  Directive,
  ChildPart,
  DirectiveParameters,
  directive,
  DirectiveResult,
} from "lit/directive.js";
import { translateService } from "../services";

export class TranslationControllerOptions {
  scope?: string;
  supportedLanguages?: string[];
}

export class TranslationController {
  private host: ReactiveControllerHost;
  private unsubscribe?: () => boolean;
  language: string;
  scope?: string;
  translations = new Map<string, string>();
  loadTranslations: (language: string, scope?: string) => any =
    translateService.loadTranslations;
  hasLoadedTranslations = false;

  t(
    translationKey: string,
    properties?: Record<string, string | number>,
  ): DirectiveResult<typeof TranslationDirective> {
    return translationDirective(
      translationKey,
      this.language,
      this.translations,
      properties,
    );
  }

  n(
    number: number,
    options?: Intl.NumberFormatOptions,
  ): DirectiveResult<typeof TranslationDirective> {
    return numberDirective(number, this.language, options);
  }

  d(
    date: Date,
    options?: Intl.DateTimeFormatOptions,
  ): DirectiveResult<typeof TranslationDirective> {
    return dateDirective(date, this.language, options);
  }

  constructor(
    host: ReactiveControllerHost,
    options?: TranslationControllerOptions,
  ) {
    this.host = host;
    this.scope = options?.scope;
    this.language = translateService.initLanguage(options?.supportedLanguages);
    host.addController(this);
    this.processLoad();
  }

  hostConnected() {
    this.unsubscribe = translateService.state.subscribe(this._changeLanguage);
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }

  private loadGeneration = 0;

  _changeLanguage = (lang: string) => {
    this.language = lang;
    void this.processLoad();
  };

  async processLoad() {
    const generation = ++this.loadGeneration;
    const translations = await this.loadTranslations(this.language, this.scope);
    if (generation !== this.loadGeneration) return;
    this.translations = translations;
    this.hasLoadedTranslations = true;
    this.host.requestUpdate();
  }
}

class TranslationDirective extends Directive {
  private currentLanguage: string;
  private translations: Map<string, string>;
  private properties: Record<string, string | number>;

  update(
    _part: ChildPart,
    [
      translationKey,
      language,
      translations,
      properties,
    ]: DirectiveParameters<this>,
  ) {
    return this.render(translationKey, language, translations, properties);
  }

  render(
    translationKey: string,
    language: string,
    translations: Map<string, string>,
    properties?: Record<string, string | number>,
  ) {
    if (
      this.currentLanguage === language &&
      this.properties === properties &&
      this.translations === translations
    ) {
      return noChange;
    }
    this.currentLanguage = language;
    this.translations = translations;
    if (properties) {
      this.properties = properties;
    }
    return translateService.translate(translationKey, translations, properties);
  }
}
const translationDirective = directive(TranslationDirective);

class NumberDirective extends Directive {
  private currentLanguage?: string;
  private options?: Intl.NumberFormatOptions;
  private value?: number;

  update(
    _part: ChildPart,
    [number, language, options]: DirectiveParameters<this>,
  ) {
    return this.render(number, language, options);
  }

  render(number: number, language: string, options?: Intl.NumberFormatOptions) {
    if (
      this.currentLanguage === language &&
      this.options === options &&
      this.value === number
    ) {
      return noChange;
    }
    this.currentLanguage = language;
    this.value = number;
    this.options = options;
    return translateService.formatNumber(number, language, options);
  }
}
const numberDirective = directive(NumberDirective);

class DateDirective extends Directive {
  private currentLanguage?: string;
  private options?: Intl.DateTimeFormatOptions;
  private time?: number;

  update(
    _part: ChildPart,
    [date, language, options]: DirectiveParameters<this>,
  ) {
    return this.render(date, language, options);
  }

  render(date: Date, language: string, options?: Intl.DateTimeFormatOptions) {
    const time = date?.getTime();
    if (
      this.currentLanguage === language &&
      this.options === options &&
      this.time === time
    ) {
      return noChange;
    }
    this.currentLanguage = language;
    this.time = time;
    this.options = options;
    return translateService.formatDate(date, language, options);
  }
}
const dateDirective = directive(DateDirective);
