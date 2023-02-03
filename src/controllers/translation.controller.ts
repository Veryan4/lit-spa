import { ReactiveControllerHost, noChange } from "lit";
import {
  Directive,
  ChildPart,
  DirectiveParameters,
  directive,
  DirectiveResult,
} from "lit/directive.js";
import { translateService } from "../services";

class TranslationDirective extends Directive {
  private currentLanguage: string;
  private translations: Record<string, any>;
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
    translations: Record<string, any>,
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
    return translateService.t(translationKey, translations, properties);
  }
}
const translationDirective = directive(TranslationDirective);

export class TranslationController {
  private host: ReactiveControllerHost;
  language = translateService.initLanguage();
  scope?: string;
  translations = {};
  translationCacheKey: string;

  loadTranslations: (...args: any) => any = translateService.loadTranslations;
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
    this.loadTranslations(this.language, scope);
  }

  hostConnected() {
    window.addEventListener(
      translateService.LANGUAGE_CHANGE_EVENT,
      this._changeLanguage as EventListener
    );
    window.addEventListener(
      translateService.TRANSLATION_LOADED_EVENT,
      this._changeLanguage as EventListener
    );
  }

  hostDisconnected() {
    window.removeEventListener(
      translateService.LANGUAGE_CHANGE_EVENT,
      this._translationLoaded as EventListener
    );
    window.addEventListener(
      translateService.TRANSLATION_LOADED_EVENT,
      this._translationLoaded as EventListener
    );
  }
}
