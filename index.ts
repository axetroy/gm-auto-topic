import http from 'gm-http';

class Topic {
  constructor() {

  }
  init(){
    this.makeSureFetchButton();
    this.onStateChange(() => {
      const timer = setInterval(() => {
        clearInterval(timer);
        this.makeSureFetchButton();
      }, 500);
    });
  }
  makeSureFetchButton() {
    const $topicsContainer = document.getElementById('topics-list-container');
    const $manageTopics = document.querySelector('.js-repo-topics-form-toggle');
    if (!$topicsContainer || !$manageTopics) return;
    $topicsContainer.appendChild(this.createButton());
  }
  createButton() {
    const $button: HTMLButtonElement = document.createElement('button');
    $button.className = 'btn-link';
    $button.type = 'button';
    $button.id = 'fetch-from-package';
    $button.style.color = '#4CAF50';
    $button.innerHTML = 'Fetch from package.json';
    $button.onclick = this.onclickHandler.bind(this);
    return $button;
  }

  private onStateChange(func) {
    addEventListener(
      'click',
      event => {
        const $done = document.querySelector('button.js-repo-topics-form-done');
        if (event.target !== $done) return;
        func(event);
      },
      false
    );
  }

  async onclickHandler(event) {
    event.preventDefault();
    const $button = <HTMLButtonElement>document.querySelector(
      '.btn-link.js-repo-topics-form-toggle.js-details-target'
    );

    if (!$button)
      return console.warn(`Can't found the button to show topic...`);

    $button.click();

    let packageJson: Object = {};

    try {
      packageJson = await this.fetchPackage();
    } catch (err) {
      console.error(err);
    }

    function check() {
      const $formUl = <HTMLUListElement>document.querySelector(
        '.js-tag-input-selected-tags'
      );
      if (!$formUl) return;
      clearInterval(timer);

      const formValues: string[] = Array.from(
        $formUl.querySelectorAll('input')
      ).map($input => $input.value);

      const keywords = packageJson['keywords'] || [];

      const $input = <HTMLInputElement>document.querySelector('#repo_topics');

      keywords
        .filter(kw => kw)
        .filter(kw => formValues.findIndex(v => v === kw) < 0)
        .forEach(keyword => {
          $input.value = keyword.replace(/\./g, '-');
          $input.click();
          $input.blur();
        });
      $input.focus();
    }

    const timer = setInterval(check, 500);
  }

  async fetchPackage(): Promise<any> {
    const $package = <HTMLAnchorElement>document.querySelector(
      'tr.js-navigation-item td.content a[title="package.json"]'
    );
    let packageUrl = $package.href;
    packageUrl =
      packageUrl
        .replace('/blob/', '/')
        .replace('github', 'raw.githubusercontent') + `?v=${Math.random()}`;
    let res: any = {};
    try {
      res = await http.get(packageUrl);
      res = JSON.parse(res.response);
    } catch (err) {
      console.error(err);
    }
    return res;
  }
}

new Topic();
