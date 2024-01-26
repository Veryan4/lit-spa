import { ReactiveControllerHost, noChange } from "lit";
import {
  Directive,
  ChildPart,
  DirectiveParameters,
  directive,
  DirectiveResult,
} from "lit/directive.js";
import { translateService } from "../services";

export class TranslationController {
  private host: ReactiveControllerHost;
  language = translateService.initLanguage();
  scope?: string;
  translations = new Map<string, string>();
  translationCacheKey: string;

  loadTranslations: (language:string, scope?: string) => any = translateService.loadTranslations;
  hasLoadedTranslations = false;

  t(
    translationKey: string,
    properties?: Record<string, string | number>
  ): DirectiveResult<typeof TranslationDirective> {
    return translationDirective(
      translationKey,
      this.language,
      this.translations,
      properties
    );
  }

  n(
    number: number,
    options?: Intl.NumberFormatOptions
  ): DirectiveResult<typeof TranslationDirective> {
    return numberDirective(
      number,
      this.language,
      options
    );
  }

  d(
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ): DirectiveResult<typeof TranslationDirective> {
    return dateDirective(
      date,
      this.language,
      options
    );
  }

  _changeLanguage = (e: CustomEvent) => {
    if (this.language !== e.detail.lang) {
      this.language = e.detail.lang;
      this.loadTranslations(this.language, this.scope);
    }
  };

  _translationLoaded = (e: CustomEvent) => {
    if (
      this.language === e.detail.lang &&
      this.scope === e.detail.scope &&
      this.translationCacheKey !== e.detail.translationCacheKey
    ) {
      this.translationCacheKey = e.detail.translationCacheKey;
      this.translations = e.detail.translations;
      this.hasLoadedTranslations = true;
      this.host.requestUpdate();
    }
  };

  constructor(host: ReactiveControllerHost, scope?: string) {
    this.host = host;
    this.scope = scope;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener(
      translateService.LANGUAGE_CHANGE_EVENT,
      this._changeLanguage as EventListener
    );
    window.addEventListener(
      translateService.TRANSLATION_LOADED_EVENT,
      this._translationLoaded as EventListener
    );
    this.loadTranslations(this.language, this.scope);
  }

  hostDisconnected() {
    window.removeEventListener(
      translateService.LANGUAGE_CHANGE_EVENT,
      this._changeLanguage as EventListener
    );
    window.removeEventListener(
      translateService.TRANSLATION_LOADED_EVENT,
      this._translationLoaded as EventListener
    );
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
    ]: DirectiveParameters<this>
  ) {
    return this.render(translationKey, language, translations, properties);
  }

  render(
    translationKey: string,
    language: string,
    translations: Map<string, string>,
    properties?: Record<string, string | number>
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
  private currentLanguage: string;
  private  options: Intl.NumberFormatOptions;

  update(
    _part: ChildPart,
    [
      number,
      language,
      options,
    ]: DirectiveParameters<this>
  ) {
    return this.render(number, language, options);
  }

  render(
    number: number,
    language: string,
    options?: Intl.NumberFormatOptions
  ) {
    if (
      this.currentLanguage === language &&
      this.options === options
    ) {
      return noChange;
    }
    this.currentLanguage = language;
    if (options) {
      this.options = options;
    }
    return translateService.formatNumber(number, language, options);
  }
}
const numberDirective = directive(NumberDirective);

class DateDirective extends Directive {
  private currentLanguage: string;
  private options: Intl.DateTimeFormatOptions;

  update(
    _part: ChildPart,
    [
      date,
      language,
      options,
    ]: DirectiveParameters<this>
  ) {
    return this.render(date, language, options);
  }

  render(
    date: Date,
    language: string,
    options?: Intl.DateTimeFormatOptions
  ) {
    if (
      this.currentLanguage === language &&
      this.options === options
    ) {
      return noChange;
    }
    this.currentLanguage = language;
    if (options) {
      this.options = options;
    }
    return translateService.formatDate(date, language, options);
  }
}
const dateDirective = directive(DateDirective);
