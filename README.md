![lit-spa logo](https://github.com/Veryan4/lit-spa/blob/master/lit-spa.png?raw=true)

A library for creating Single Page Applications based on [lit.dev](https://lit.dev) WebComponents.

It provides Controllers, Services, and Components for a plug and play control of following features:


- Routing
- i18n internalization
- Themes
- Http Service


## Routing

Provides the ability to lazy-load components, along with other typical routing features, such as guards, default routes, and collecting path parameters.

```typescript
import { LitElement, html } from "lit";
import { RouteController, Route } from "@veryan/lit-spa";

const routes: Route[] = [
  {
    name: "home",
    pattern: "",
    component: () =>
      import("./pages/my-app/my-app.component").then(
        () => html`<my-app></my-app>`
      ),
  },
  {
    name: "private",
    pattern: "hidden",
    component: () =>
      import("./pages/private/private.component").then(
        () => html`<app-private></app-private>`
      ),
    guard: () => Promise(()=> "") // redirects to home route, since it's not resolving as true
  },
  {
    name: "foobar",
    pattern: "foobar/:foobarId",
    component: () =>
      import("./pages/foobar/foobar.component").then(
        () => html`<foo-bar></foo-bar>`
      ),
  },
  {
    name: "default",
    pattern: "*",
    component: () =>
      import("./pages/my-app/my-app.component").then(
        () => html`<my-app></my-app>`
      ),
  }
]

@customElement("my-app")
class SinglePageApp extends LitElement {

  private router = new RouteController(this, routes);

   render() {
    return html`
        <div class="body">
            ${this.router.navigation()}
        </div>
    `;
  }
}
```

## i18n internalization

Accessing scoped translation files to render a string in different languages. 
By default the translation service will look for a /i18n/en.json at the root of your application.
The TranslationController's loader can be overwritten so change this behavior.

The following example is considering there are the follow translation files at the root of the application.
/i18n/home/en.json
/i18n/home/fr.json

```typescript
import { LitElement, html } from "lit";
import { TranslationController } from "@veryan/lit-spa";

@customElement("my-app")
class SinglePageApp extends LitElement {

   private i18n = new TranslationController(this, "home"); 

   render() {
    return html`
      <div class="body" @click=${this.changeLanguage}>
        ${this.i18.t('hello.helloWorld')}
      </div>
    `;
  }

  changeLanguage() {
    if (this.i18.currentLanguage == 'en') {
      translateService.useLanguage('fr');
    } else {
      translateService.useLanguage('en');
    }
  }
}
```

## Themes

Leveraging css variables in order to have a theme remain consistent across isolated components.

```typescript
import { LitElement, html } from "lit";
import { ThemeController, themeService } from "@veryan/lit-spa";

@customElement("my-app")
class SinglePageApp extends LitElement {

  styles = [`
    .body{
      color: var(--color);
      background-color: var(--background-color);
    }
  `];

  private theme = new ThemeController(this);

  constructor() {
    super();

    this.registerThemes();
  }

   render() {
    return html`
      <div class="body" @click=${this.changeTheme}>
        Current theme : ${this.theme.value}
      </div>
    `;
  }

  registerThemes() {
    const root = document.querySelector(":root") as HTMLElement;
    themeService.registerThemes(root, {
      'light': {
        '--color': '#2c2c2c',
        '--background-color': '#fafafa',
      },
      'dark': {
        '--color': '#fafafa',
        '--background-color': '#2c2c2c',
      }
    });
  }

  changeTheme() {
    if (this.theme.value == "light") {
      themeService.changeTheme("dark");
    } else {
      themeService.changeTheme("light")
    }
  }
}
```

## Http Service

A group of functions that simplify the web browsers' fetch api, in order to simply handle json.

```typescript
import { httpService } from "@veryan/lit-spa";

class Foobar {
  id: string;
  name: string;
}

function getFoobarsByName(name: string): Promise<Foobar[]> {
  return httpService.get<Foobar[]>(`http://localhost:8080/${name}`);
}
```


## Example Applications

- Website: https://truba.news
  
  Repo: https://github.com/Veryan4/truba

- Website: https://d-rummy.com
  
  Repo: https://github.com/Veryan4/d-rummy

- Website: https://veryan.ca
  
  Repo: https://github.com/Veryan4/portfolio

