This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.github/
  workflows/
    npm-publishing.yml
  CONTRIBUTING.md
  ISSUE_TEMPLATE.md
  PULL_REQUEST_TEMPLATE.md
src/
  components/
    button/
      stellar-wallets-button.ts
      styles.ts
    modal/
      stellar-wallets-modal.ts
      styles.ts
    selector-modal/
      stellar-selector-modal.ts
      styles.ts
    index.ts
  modules/
    albedo.module.ts
    freighter.module.ts
    hana.module.ts
    hotwallet.module.ts
    ledger.module.ts
    lobstr.module.ts
    rabet.module.ts
    trezor.module.ts
    walletconnect.module.ts
    xbull.module.ts
  services/
    account.service.ts
    clipboard.service.ts
  state/
    reactive-state.ts
    store.ts
  index.ts
  stellar-wallets-kit.ts
  types.ts
  utils.ts
.cspell.json
.editorconfig
.eslintignore
.eslintrc.json
.gitignore
.nvmrc
.prettierignore
.prettierrc.json
CHANGELOG.md
index.html
LICENSE
package.json
README.md
rollup.config.js
tsconfig.json
```

# Files

## File: .github/workflows/npm-publishing.yml
````yaml
name: Publish Package to npm
on:
  release:
    types:
      - published

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v3
        with:
          node-version: '20.11.0'
          registry-url: 'https://registry.npmjs.org'

      - run: npm -g i pnpm && pnpm i

      - run: pnpm run all

      - run: cd build && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## File: .github/CONTRIBUTING.md
````markdown
# Example Contributing Guidelines

This is an example of GitHub's contributing guidelines file. Check out GitHub's [CONTRIBUTING.md help center article](https://help.github.com/articles/setting-guidelines-for-repository-contributors/) for more information.
````

## File: .github/ISSUE_TEMPLATE.md
````markdown
- **I'm submitting a ...**
  [ ] bug report
  [ ] feature request
  [ ] question about the decisions made in the repository
  [ ] question about how to use this project

- **Summary**

- **Other information** (e.g. detailed explanation, stack traces, related issues, suggestions how to fix, links for us to have context, eg. StackOverflow, personal fork, etc.)
````

## File: .github/PULL_REQUEST_TEMPLATE.md
````markdown
- **What kind of change does this PR introduce?** (Bug fix, feature, docs update, ...)

- **What is the current behavior?** (You can also link to an open issue here)

- **What is the new behavior (if this is a feature change)?**

- **Other information**:
````

## File: src/components/button/stellar-wallets-button.ts
````typescript
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { firstValueFrom, Subscription, switchMap } from 'rxjs';
import { fetchAccountBalance } from '../../services/account.service';
import { copyToClipboard } from '../../services/clipboard.service';
import { ReactiveState } from '../../state/reactive-state';
import { activeAddress$, buttonTheme$, horizonUrl$, removeAddress } from '../../state/store';
import { IButtonTheme } from '../../types';
import { dropdownWrapper, buttonContainer, buttonStyles } from './styles';

export enum ButtonThemeType {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export const ButtonThemes: { [key in ButtonThemeType]: IButtonTheme } = {
  DARK: {
    bgColor: '#161616',
    textColor: '#a0a0a0',
    solidTextColor: '#ededed',
    dividerColor: 'rgba(255, 255, 255, 0.15)',
    buttonPadding: '0.5rem 1.25rem',
    buttonBorderRadius: '0.5rem',
  },
  LIGHT: {
    bgColor: '#fcfcfc',
    textColor: '#181818',
    solidTextColor: '#000000',
    dividerColor: 'rgba(0, 0, 0, 0.15)',
    buttonPadding: '0.5rem 1.25rem',
    buttonBorderRadius: '0.5rem',
  },
};

@customElement('stellar-wallets-button')
export class StellarWalletsButton extends LitElement {
  static override styles = [
    css`
      :host * {
        box-sizing: border-box;
      }
    `,
    buttonStyles,
    buttonContainer,
    dropdownWrapper,
  ];

  @property({ type: String, reflect: true })
  buttonText: string = 'Connect';

  @state()
  showDropdown: boolean = false;

  @state()
  accountBalance?: string;

  @state()
  showCopiedMessage: boolean = false;

  activeAddress: ReactiveState<string | undefined> = new ReactiveState(this, activeAddress$);
  theme: ReactiveState<IButtonTheme | undefined> = new ReactiveState(this, buttonTheme$);
  fetchAddressSubscription: Subscription | undefined;

  private get getThemeStyles() {
    if (!this.theme.value) return {};

    return {
      '--button-bg-color': this.theme.value.bgColor,
      '--button-text-color': this.theme.value.textColor,
      '--button-solid-text-color': this.theme.value.solidTextColor,
      '--button-divider-color': this.theme.value.dividerColor,
      '--button-padding': this.theme.value.buttonPadding,
      '--button-border-radius': this.theme.value.buttonBorderRadius,
    };
  }

  onButtonClicked() {
    if (this.activeAddress.value) {
      this.showDropdown = !this.showDropdown;
    } else {
      this.dispatchEvent(
        new CustomEvent('button-clicked', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  disconnect(): void {
    removeAddress();
    this.closeDropdown();

    this.dispatchEvent(
      new CustomEvent('disconnect-wallet', {
        bubbles: true,
        composed: true,
      })
    );
  }

  async copyPublicKey(): Promise<void> {
    await copyToClipboard(this.activeAddress.value!);
    this.showCopiedMessage = true;
    await new Promise(r => setTimeout(r, 3000));
    this.showCopiedMessage = false;
  }

  async startBalanceFetcher(): Promise<void> {
    const horizonUrl: string | undefined = await firstValueFrom(horizonUrl$);

    if (horizonUrl) {
      this.fetchAddressSubscription = this.activeAddress.value$
        .pipe(
          switchMap(async (value: string | undefined): Promise<string> => {
            return value ? fetchAccountBalance(value).catch((): string => '0') : '0';
          })
        )
        .subscribe((balance: string): void => {
          this.accountBalance = balance;
        });
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.startBalanceFetcher().then();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.fetchAddressSubscription?.unsubscribe();
  }

  override render() {
    const button = html`
      <button @click=${this.onButtonClicked} class="btn">
        ${this.activeAddress.value
          ? this.activeAddress.value.slice(0, 4) + '....' + this.activeAddress.value.slice(-6)
          : this.buttonText}

        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8H10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M20.8333 9H18.2308C16.4465 9 15 10.3431 15 12C15 13.6569 16.4465 15 18.2308 15H20.8333C20.9167 15 20.9583 15 20.9935 14.9979C21.5328 14.965 21.9623 14.5662 21.9977 14.0654C22 14.0327 22 13.994 22 13.9167V10.0833C22 10.006 22 9.96726 21.9977 9.9346C21.9623 9.43384 21.5328 9.03496 20.9935 9.00214C20.9583 9 20.9167 9 20.8333 9Z"
            stroke-width="1.5" />
          <path
            d="M20.965 9C20.8873 7.1277 20.6366 5.97975 19.8284 5.17157C18.6569 4 16.7712 4 13 4L10 4C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H13C16.7712 20 18.6569 20 19.8284 18.8284C20.6366 18.0203 20.8873 16.8723 20.965 15"
            stroke-width="1.5" />
          <path d="M17.9912 12H18.0002" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    `;

    const dropdown = this.showDropdown
      ? html`
          <section class="dropdown-wrapper">
            <button @click=${this.closeDropdown} class="dropdown-close">x</button>

            <div class="dropdown-profile">
              <svg
                style="margin-bottom: 1rem"
                width="36px"
                height="36px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5" />
                <path
                  d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round" />
              </svg>

              <h2 style="margin: 0 0 0.25rem" class="dropdown-text-solid">
                ${this.activeAddress.value?.slice(0, 4)}....${this.activeAddress.value?.slice(-6)}
              </h2>

              ${this.accountBalance
                ? html`<h3 style="margin: 0" class="dropdown-text">${this.accountBalance} XLM</h3>`
                : ''}
            </div>

            <div class="dropdown-action-wrapper">
              <button @click=${this.copyPublicKey} class="dropdown-action-button">
                ${!this.showCopiedMessage
                  ? html`Copy address

                      <svg
                        width="0.75rem"
                        height="0.75rem"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15 1.25H10.9436C9.10583 1.24998 7.65019 1.24997 6.51098 1.40314C5.33856 1.56076 4.38961 1.89288 3.64124 2.64124C2.89288 3.38961 2.56076 4.33856 2.40314 5.51098C2.24997 6.65019 2.24998 8.10582 2.25 9.94357V16C2.25 17.8722 3.62205 19.424 5.41551 19.7047C5.55348 20.4687 5.81753 21.1208 6.34835 21.6517C6.95027 22.2536 7.70814 22.5125 8.60825 22.6335C9.47522 22.75 10.5775 22.75 11.9451 22.75H15.0549C16.4225 22.75 17.5248 22.75 18.3918 22.6335C19.2919 22.5125 20.0497 22.2536 20.6517 21.6517C21.2536 21.0497 21.5125 20.2919 21.6335 19.3918C21.75 18.5248 21.75 17.4225 21.75 16.0549V10.9451C21.75 9.57754 21.75 8.47522 21.6335 7.60825C21.5125 6.70814 21.2536 5.95027 20.6517 5.34835C20.1208 4.81753 19.4687 4.55348 18.7047 4.41551C18.424 2.62205 16.8722 1.25 15 1.25ZM17.1293 4.27117C16.8265 3.38623 15.9876 2.75 15 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V16C3.75 16.9876 4.38624 17.8265 5.27117 18.1293C5.24998 17.5194 5.24999 16.8297 5.25 16.0549V10.9451C5.24998 9.57754 5.24996 8.47522 5.36652 7.60825C5.48754 6.70814 5.74643 5.95027 6.34835 5.34835C6.95027 4.74643 7.70814 4.48754 8.60825 4.36652C9.47522 4.24996 10.5775 4.24998 11.9451 4.25H15.0549C15.8297 4.24999 16.5194 4.24998 17.1293 4.27117ZM7.40901 6.40901C7.68577 6.13225 8.07435 5.9518 8.80812 5.85315C9.56347 5.75159 10.5646 5.75 12 5.75H15C16.4354 5.75 17.4365 5.75159 18.1919 5.85315C18.9257 5.9518 19.3142 6.13225 19.591 6.40901C19.8678 6.68577 20.0482 7.07435 20.1469 7.80812C20.2484 8.56347 20.25 9.56458 20.25 11V16C20.25 17.4354 20.2484 18.4365 20.1469 19.1919C20.0482 19.9257 19.8678 20.3142 19.591 20.591C19.3142 20.8678 18.9257 21.0482 18.1919 21.1469C17.4365 21.2484 16.4354 21.25 15 21.25H12C10.5646 21.25 9.56347 21.2484 8.80812 21.1469C8.07435 21.0482 7.68577 20.8678 7.40901 20.591C7.13225 20.3142 6.9518 19.9257 6.85315 19.1919C6.75159 18.4365 6.75 17.4354 6.75 16V11C6.75 9.56458 6.75159 8.56347 6.85315 7.80812C6.9518 7.07435 7.13225 6.68577 7.40901 6.40901Z" />
                      </svg>`
                  : 'Copied!!'}
              </button>

              <button @click=${this.disconnect} class="dropdown-action-button">
                Disconnect

                <svg
                  width="0.75rem"
                  height="0.75rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </section>
        `
      : '';

    return html`
      <section style=${styleMap(this.getThemeStyles)} class="btn-container">${button} ${dropdown}</section>
    `;
  }
}
````

## File: src/components/button/styles.ts
````typescript
import { css } from 'lit';

export const buttonContainer = css`
  .btn-container {
    position: relative;
  }
`;

export const buttonStyles = css`
  .btn {
    background: none;
    border: none;
    border-radius: var(--button-border-radius, 0.5rem);
    cursor: pointer;
    padding: var(--button-padding, 0.5rem 1.25rem);
    display: flex;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    line-height: 100%;
    margin: 0;
    font-family: 'Open Sans', arial, sans-serif;
  }

  .btn svg {
    width: 1rem;
    height: auto;
    margin-left: 0.5rem;
  }

  @media (prefers-color-scheme: light) {
    .btn {
      background-color: var(--button-bg-color, #fcfcfc);
      color: var(--button-text-color, #181818);
      border: solid var(--button-text-color, #181818) 1px;
    }

    .btn svg circle,
    .btn svg path {
      stroke: var(--button-text-color, #181818);
    }
  }

  @media (prefers-color-scheme: dark) {
    .btn {
      background-color: var(--button-bg-color, #161616);
      color: var(--button-text-color, #fcfcfc);
      border: solid var(--button-text-color, #fcfcfc) 1px;
    }

    .btn svg circle,
    .btn svg path {
      stroke: var(--button-text-color, #fcfcfc);
    }
  }
`;

export const dropdownWrapper = css`
  .dropdown-wrapper {
    position: absolute;
    top: 110%;
    right: 0;
    box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.25);
    z-index: 900;
    border-radius: 0.75rem;
    padding: 2rem;
    width: 18rem;
    display: flex;
    flex-direction: column;
    font-family: 'Open Sans', arial, sans-serif;
  }

  .dropdown-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }

  .dropdown-text-solid {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .dropdown-text {
    font-size: 0.875rem;
    line-height: 1.125rem;
  }

  .dropdown-action-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .dropdown-action-button {
    padding: 0.4rem;
    border-radius: 0.25rem;
    border: none;
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .dropdown-close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }

  @media (prefers-color-scheme: light) {
    .dropdown-wrapper {
      background-color: var(--button-bg-color, #fcfcfc);
      border: solid 1px var(--button-solid-text-color, #000000);
    }

    .dropdown-text-solid,
    .dropdown-action-button,
    .dropdown-close {
      color: var(--button-solid-text-color, #000000);
    }

    .dropdown-text {
      color: var(--button-text-color, #181818);
    }

    svg circle,
    svg path {
      stroke: var(--button-text-color, #181818);
    }

    .dropdown-action-button {
      border: 1px solid var(--button-text-color, #181818);
    }
  }

  @media (prefers-color-scheme: dark) {
    .dropdown-wrapper {
      background-color: var(--button-bg-color, #161616);
      border: solid 1px var(--button-solid-text-color, #ededed);
    }

    .dropdown-text-solid,
    .dropdown-action-button,
    .dropdown-close {
      color: var(--button-solid-text-color, #ededed);
    }

    .dropdown-text {
      color: var(--button-text-color, #a0a0a0);
    }

    svg circle,
    svg path {
      stroke: var(--button-text-color, #fcfcfc);
    }

    .dropdown-action-button {
      border: 1px solid var(--button-text-color, #a0a0a0);
    }
  }
`;
````

## File: src/components/modal/stellar-wallets-modal.ts
````typescript
import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { ReactiveState } from '../../state/reactive-state';
import { allowedWallets$, modalTheme$ } from '../../state/store';

import { ISupportedWallet, IModalTheme } from '../../types';
import {
  backdropStyles,
  modalWalletsSection,
  modalDialogBodyStyles,
  modalDialogStyles,
  modalHelpSection,
  modalAnimations,
} from './styles';

export enum ModalThemeType {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export const ModalThemes: { [key in ModalThemeType]: IModalTheme } = {
  DARK: {
    bgColor: '#161616',
    textColor: '#a0a0a0',
    solidTextColor: '#ededed',
    headerButtonColor: '#707070',
    dividerColor: 'rgba(255, 255, 255, 0.15)',
    helpBgColor: '#1c1c1c',
    notAvailableTextColor: '#a0a0a0',
    notAvailableBgColor: '#232323',
    notAvailableBorderColor: '#343434',
  },
  LIGHT: {
    bgColor: '#fcfcfc',
    textColor: '#181818',
    solidTextColor: '#000000',
    headerButtonColor: '#8f8f8f',
    dividerColor: 'rgba(0, 0, 0, 0.15)',
    helpBgColor: '#f8f8f8',
    notAvailableTextColor: '#6f6f6f',
    notAvailableBgColor: '#f3f3f3',
    notAvailableBorderColor: '#e2e2e2',
  },
};

@customElement('stellar-wallets-modal')
export class StellarWalletsModal extends LitElement {
  static override styles = [
    css`
      :host * {
        box-sizing: border-box;
      }

      .mb-0 {
        margin-bottom: 0 !important;
      }
    `,
    modalDialogStyles,
    modalDialogBodyStyles,
    modalHelpSection,
    backdropStyles,
    modalAnimations,
    modalWalletsSection,
  ];

  /**
   * This value is used to tell the modal that it should not update the value
   * `showModal` at any moment, this comes handy when the state wants to be handled by another source
   */
  @property({ type: Boolean, reflect: true })
  ignoreShowStatus: boolean = false;

  @property({ type: Boolean, reflect: true })
  showModal: boolean = false;

  @state()
  closingModal: boolean = false;

  @property({ type: String, reflect: true })
  modalTitle: string = 'Connect a Wallet';

  @property({ type: String, reflect: true })
  notAvailableText: string = 'Not available';

  allowedWallets: ReactiveState<ISupportedWallet[]> = new ReactiveState(this, allowedWallets$);

  theme: ReactiveState<IModalTheme | undefined> = new ReactiveState(this, modalTheme$);

  override connectedCallback() {
    super.connectedCallback();
  }

  async closeModal(): Promise<void> {
    this.closingModal = true;

    await new Promise(r => setTimeout(r, 280));

    if (!this.ignoreShowStatus) {
      this.showModal = false;
    }

    this.dispatchEvent(
      new CustomEvent('modal-closed', {
        detail: new Error('Modal closed'),
        bubbles: true,
        composed: true,
      })
    );

    this.closingModal = false;
  }

  async pickWalletOption(option: ISupportedWallet): Promise<void> {
    if (!option.isAvailable) {
      window.open(option.url, '_blank');
      return;
    }

    this.closingModal = true;

    await new Promise(r => setTimeout(r, 280));

    try {
      const record: string | null = window.localStorage.getItem('@StellarWalletsKit/usedWalletsIds');
      let usedWalletsIds: Array<ISupportedWallet['id']> = record ? JSON.parse(record) : [];
      usedWalletsIds = [option.id, ...usedWalletsIds.filter((id: string): boolean => id !== option.id)];
      window.localStorage.setItem('@StellarWalletsKit/usedWalletsIds', JSON.stringify(usedWalletsIds));
    } catch (e) {
      console.error(e);
    }

    this.dispatchEvent(
      new CustomEvent('wallet-selected', {
        detail: option,
        bubbles: true,
        composed: true,
      })
    );

    this.closingModal = false;
  }

  /**
   * This function gets the list of the wallets following the logic from this task https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/28
   * It follows this order:
   * 1- Wallet last used by wallet selector
   * 2- If not wallet last use, wallets detected in the browser
   * 3- Wallet ordering as defined by the developer
   *
   */
  private getSortedList(): ISupportedWallet[] {
    const sortedWallets: { available: ISupportedWallet[]; unavailable: ISupportedWallet[] } =
      this.allowedWallets.value!.reduce(
        (all: { available: ISupportedWallet[]; unavailable: ISupportedWallet[] }, current: ISupportedWallet) => {
          return {
            available: current.isAvailable ? [...all.available, current] : all.available,
            unavailable: !current.isAvailable ? [...all.unavailable, current] : all.unavailable,
          };
        },
        { available: [], unavailable: [] }
      );

    let usedWalletsIds: Array<ISupportedWallet['id']>;
    try {
      const record: string | null = window.localStorage.getItem('@StellarWalletsKit/usedWalletsIds');
      usedWalletsIds = record ? JSON.parse(record) : [];
    } catch (e) {
      console.error(e);
      usedWalletsIds = [];
    }

    if (usedWalletsIds.length === 0) {
      return [...sortedWallets.available, ...sortedWallets.unavailable];
    }

    const usedWallets: ISupportedWallet[] = [];
    const nonUsedWallets: ISupportedWallet[] = [];
    for (const availableWallet of sortedWallets.available) {
      if (usedWalletsIds.find((id: string): boolean => id === availableWallet.id)) {
        usedWallets.push(availableWallet);
      } else {
        nonUsedWallets.push(availableWallet);
      }
    }

    return [
      ...usedWallets.sort((a: ISupportedWallet, b: ISupportedWallet) => {
        return usedWalletsIds.indexOf(a.id) - usedWalletsIds.indexOf(b.id);
      }),
      ...nonUsedWallets,
      ...sortedWallets.unavailable,
    ];
  }

  private getThemeStyles() {
    if (!this.theme.value) return {};

    return {
      '--modal-bg-color': this.theme.value.bgColor,
      '--modal-text-color': this.theme.value.textColor,
      '--modal-solid-text-color': this.theme.value.solidTextColor,
      '--modal-header-button-color': this.theme.value.headerButtonColor,
      '--modal-divider-color': this.theme.value.dividerColor,
      '--modal-help-bg-color': this.theme.value.helpBgColor,
      '--modal-not-available-text-color': this.theme.value.notAvailableTextColor,
      '--modal-not-available-bg-color': this.theme.value.notAvailableBgColor,
      '--modal-not-available-border-color': this.theme.value.notAvailableBorderColor,
    };
  }

  override render() {
    const helpSection = html`
      <section class="help-container">
        <header class="help-header">
          <h2 class="help-header__modal-title dialog-text-solid">Learn more</h2>
        </header>

        <div class="help__whats_a_wallet">
          <h2 class="dialog-text-solid help__title">What is a wallet?</h2>
          <p class="dialog-text help__text">
            Wallets are used to send, receive, and store the keys you use to sign blockchain transactions.
          </p>
        </div>

        <div class="help__whats_stellar">
          <h2 class="dialog-text-solid help__title">What is Stellar?</h2>
          <p class="dialog-text help__text">
            Stellar is a decentralized, public blockchain that gives developers the tools to create experiences that are
            more like cash than crypto
          </p>
        </div>
      </section>
    `;

    const walletsSection = html`
      <section class="wallets-container">
        <header class="wallets-header">
          <h2 class="wallets-header__modal-title dialog-text-solid">${this.modalTitle}</h2>

          <button @click=${() => this.closeModal()} class="wallets-header__button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="20px" width="20px" viewBox="0 0 490 490">
              <polygon
                points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " />
            </svg>
          </button>
        </header>

        <ul class="wallets-body">
          ${this.getSortedList().map(
            (item: ISupportedWallet, i: number) =>
              html`
                <li
                  @click=${() => this.pickWalletOption(item)}
                  class=" wallets-body__item ${!item.isAvailable ? 'not-available' : ''} ${i ===
                  this.allowedWallets.value!.length - 1
                    ? 'mb-0'
                    : ''}">
                  <img src=${item.icon} alt=${item.name} />
                  <span class="dialog-text-solid">${item.name}</span>
                  ${!item.isAvailable ? html`<small class="not-available">${this.notAvailableText}</small>` : ''}
                </li>
              `
          )}
        </ul>
      </section>
    `;

    return html`
      <dialog
        style=${styleMap(this.getThemeStyles())}
        class="dialog-modal ${this.closingModal ? 'closing' : ''}"
        .open=${this.showModal}>
        <section class="dialog-modal-body">
          <div class="dialog-modal-body__help">${helpSection}</div>
          <div class="dialog-modal-body__wallets">${walletsSection}</div>
        </section>
      </dialog>

      <div
        style="position: fixed; z-index: 950"
        class="backdrop ${this.closingModal ? 'closing' : ''}"
        @click=${() => this.closeModal()}></div>
    `;
  }
}
````

## File: src/components/modal/styles.ts
````typescript
import { css } from 'lit';

export const modalDialogStyles = css`
  .dialog-modal {
    position: fixed;
    z-index: 990;
    font-family: 'Open Sans', arial, sans-serif;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    border-width: 0;
    box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.25);
    bottom: 0;
    overflow: hidden;
  }

  @media screen and (min-width: 768px) {
    .dialog-modal {
      z-index: 990;
      bottom: auto;
      top: 5rem;
      max-width: 45rem;
      border-radius: 1rem;
    }
  }
`;

export const modalDialogBodyStyles = css`
  .dialog-modal-body {
    display: flex;
    flex-direction: column-reverse;
  }

  .dialog-modal-body__help,
  .dialog-modal-body__wallets {
    width: 100%;
    flex-basis: 100%;
  }

  .dialog-modal-body__help {
    padding: 1.5rem;
  }

  .dialog-modal-body__wallets {
    padding: 1.5rem;
  }

  .dialog-text-solid {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .dialog-text {
    font-size: 0.875rem;
    line-height: 1.125rem;
  }

  @media (prefers-color-scheme: light) {
    .dialog-modal-body__help {
      background-color: var(--modal-help-bg-color, #f8f8f8);
      border-top: 1px solid var(--modal-divider-color, rgba(0, 0, 0, 0.15));
    }

    @media screen and (min-width: 768px) {
      .dialog-modal-body__help {
        border-top: none;
        border-right: 1px solid var(--modal-divider-color, rgba(0, 0, 0, 0.15));
      }
    }

    .dialog-modal-body__wallets,
    .dialog-modal-body {
      background-color: var(--modal-bg-color, #fcfcfc);
    }

    .dialog-text-solid {
      color: var(--modal-solid-text-color, #000000);
    }

    .dialog-text {
      color: var(--modal-text-color, #181818);
    }
  }

  @media (prefers-color-scheme: dark) {
    .dialog-modal-body__help {
      background-color: var(--modal-help-bg-color, #1c1c1c);
      border-top: 1px solid var(--modal-divider-color, rgba(255, 255, 255, 0.15));
    }

    @media screen and (min-width: 768px) {
      .dialog-modal-body__help {
        border-top: none;
        border-right: 1px solid var(--modal-divider-color, rgba(255, 255, 255, 0.15));
      }
    }

    .dialog-modal-body__wallets,
    .dialog-modal-body {
      background-color: var(--modal-bg-color, #161616);
    }

    .dialog-text-solid {
      color: var(--modal-solid-text-color, #ededed);
    }

    .dialog-text {
      color: var(--modal-text-color, #a0a0a0);
    }
  }

  @media screen and (min-width: 768px) {
    .dialog-modal-body {
      flex-direction: row;
    }

    .dialog-modal-body__help,
    .dialog-modal-body__wallets {
      padding: 2rem;
    }
  }
`;

export const modalHelpSection = css`
  .help-container {
    width: 100%;
  }

  .help-header {
    display: none;
    margin: 0 0 2rem 0;
  }

  .help-header__modal-title {
    font-size: 1.25rem;
    padding: 0;
    margin: 0;
  }

  .help__title,
  .help__text {
    text-align: center;
  }

  .help__title {
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .help__text {
    max-width: 21rem;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
    margin-top: 0;
  }

  .help__whats_stellar {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .help-header {
      display: block;
    }

    .help__title,
    .help__text {
      text-align: left;
      margin-left: 0;
    }

    .help__whats_a_wallet {
      margin-bottom: 2rem;
    }

    .help__whats_stellar {
      display: block;
    }
  }
`;

export const modalWalletsSection = css`
  .wallets-container {
    width: 100%;
    height: 100%;
    min-height: fit-content;
    display: flex;
    flex-direction: column;
  }

  .wallets-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .wallets-header__modal-title {
    font-size: 1.25rem;
    padding: 0;
    margin: 0;
  }

  .wallets-header__button {
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (prefers-color-scheme: light) {
    .wallets-header__button svg {
      fill: var(--modal-header-button-color, #8f8f8f);
    }
  }

  @media (prefers-color-scheme: dark) {
    .wallets-header__button svg {
      fill: var(--modal-header-button-color, #707070);
    }
  }

  .wallets-body {
    margin: 0;
    width: 100%;
    list-style: none;
    padding: 0 !important;
  }

  .wallets-body__item {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-bottom: 2rem;
    cursor: pointer;
  }

  .wallets-body__item img {
    margin-right: 1rem;
    width: 2rem;
    border-radius: 100%;
    overflow: hidden;
  }

  .wallets-body__item.not-available {
    cursor: alias;
  }

  .wallets-body__item .not-available {
    margin-left: auto;
    font-size: 10px;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
  }

  @media (prefers-color-scheme: light) {
    .wallets-body__item .not-available {
      border: solid var(--modal-not-available-border-color, #e2e2e2) 1px;
      background-color: var(--modal-not-available-bg-color, #f3f3f3);
      color: var(--modal-not-available-text-color, #6f6f6f);
    }
  }

  @media (prefers-color-scheme: dark) {
    .wallets-body__item .not-available {
      border: solid var(--modal-not-available-border-color, #343434) 1px;
      background-color: var(--modal-not-available-bg-color, #232323);
      color: var(--modal-not-available-text-color, #a0a0a0);
    }
  }

  @media screen and (min-width: 768px) {
  }
`;

export const backdropStyles = css`
  .dialog-modal[open] + .backdrop {
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const modalAnimations = css`
  .dialog-modal[open] {
    -webkit-animation: showModal 0.3s ease normal;
  }
  @-webkit-keyframes showModal {
    from {
      transform: translateY(25%);
      opacity: 0;
    }
    to {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .dialog-modal.closing {
    -webkit-animation: hideModal 0.3s ease normal !important;
  }
  @-webkit-keyframes hideModal {
    from {
      transform: translateY(0%);
      opacity: 1;
    }
    to {
      transform: translateY(25%);
      opacity: 0;
    }
  }

  .backdrop.closing {
    -webkit-animation: hideBackdrop 0.3s ease normal !important;
  }
  @-webkit-keyframes hideBackdrop {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
````

## File: src/components/selector-modal/stellar-selector-modal.ts
````typescript
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IModalTheme } from '../../types';
import {
  backdropStyles,
  modalAnimations,
  modalDialogBodyStyles,
  modalHelpSection,
  modalWalletsSection,
  modalDialogStyles,
} from './styles';

export enum ModalThemeType {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export const ModalThemes: { [key in ModalThemeType]: IModalTheme } = {
  DARK: {
    bgColor: '#161616',
    textColor: '#a0a0a0',
    solidTextColor: '#ededed',
    headerButtonColor: '#707070',
    dividerColor: 'rgba(255, 255, 255, 0.15)',
    helpBgColor: '#1c1c1c',
    notAvailableTextColor: '#a0a0a0',
    notAvailableBgColor: '#232323',
    notAvailableBorderColor: '#343434',
  },
  LIGHT: {
    bgColor: '#fcfcfc',
    textColor: '#181818',
    solidTextColor: '#000000',
    headerButtonColor: '#8f8f8f',
    dividerColor: 'rgba(0, 0, 0, 0.15)',
    helpBgColor: '#f8f8f8',
    notAvailableTextColor: '#6f6f6f',
    notAvailableBgColor: '#f3f3f3',
    notAvailableBorderColor: '#e2e2e2',
  },
};

@customElement('stellar-accounts-selector')
export class StellarSelectorModal extends LitElement {
  static override styles = [
    css`
      :host * {
        box-sizing: border-box;
      }

      .mb-0 {
        margin-bottom: 0 !important;
      }
    `,
    modalDialogStyles,
    modalDialogBodyStyles,
    modalHelpSection,
    backdropStyles,
    modalAnimations,
    modalWalletsSection,
  ];

  @property({ type: Boolean, reflect: true })
  showModal: boolean = false;

  @property({ type: Boolean, reflect: true })
  loadingAccounts: boolean = false;

  @state()
  closingModal: boolean = false;

  @property({ type: String, reflect: true })
  modalTitle: string = 'Pick your account';

  @property({ type: String, reflect: true, converter: value => (value ? JSON.parse(value) : []) })
  accounts: { index: number; publicKey: string }[] = [];

  override connectedCallback() {
    super.connectedCallback();
  }

  async pickAccount(option: { publicKey: string; index: number }): Promise<void> {
    this.closingModal = true;

    await new Promise(r => setTimeout(r, 280));

    this.dispatchEvent(
      new CustomEvent('account-selected', {
        detail: option,
        bubbles: true,
        composed: true,
      })
    );

    this.closingModal = false;
  }

  async closeModal(): Promise<void> {
    this.closingModal = true;

    await new Promise(r => setTimeout(r, 280));

    this.showModal = false;

    this.dispatchEvent(
      new CustomEvent('account-selector-closed', {
        detail: new Error('Account selector closed'),
        bubbles: true,
        composed: true,
      })
    );

    this.closingModal = false;
  }

  override render() {
    const loadingIcon = html`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <style>
          .spinner_qM83 {
            animation: spinner_8HQG 1.05s infinite;
            fill: white;
          }
          .spinner_oXPr {
            animation-delay: 0.1s;
          }
          .spinner_ZTLf {
            animation-delay: 0.2s;
          }
          @keyframes spinner_8HQG {
            0%,
            57.14% {
              animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
              transform: translate(0);
            }
            28.57% {
              animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
              transform: translateY(-6px);
            }
            100% {
              transform: translate(0);
            }
          }
        </style>
        <circle class="spinner_qM83" cx="4" cy="12" r="3" />
        <circle class="spinner_qM83 spinner_oXPr" cx="12" cy="12" r="3" />
        <circle class="spinner_qM83 spinner_ZTLf" cx="20" cy="12" r="3" />
      </svg>
    `;

    const accountsList = html`
      <ul class="wallets-body">
        ${this.accounts.map(
          ({ publicKey, index }) => html`
            <li @click="${() => this.pickAccount({ publicKey, index })}" class="wallets-body__item">
              <span style="margin-right: 1rem;" class="dialog-text-solid">
                ${publicKey.slice(0, 4)}....${publicKey.slice(-6)}
              </span>
              <span class="dialog-text">(44'/148'/${index}')</span>
            </li>
          `
        )}
      </ul>
    `;

    return html`
      <dialog style="" class="dialog-modal ${this.closingModal ? 'closing' : ''}" .open=${this.showModal}>
        <section class="dialog-modal-body">
          <div class="dialog-modal-body__wallets">
            <section class="wallets-container">
              <header class="wallets-header">
                <h2 class="wallets-header__modal-title dialog-text-solid">${this.modalTitle}</h2>

                <button @click=${() => this.closeModal()} class="wallets-header__button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    height="20px"
                    width="20px"
                    viewBox="0 0 490 490">
                    <polygon
                      points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " />
                  </svg>
                </button>
              </header>

              ${this.loadingAccounts ? loadingIcon : accountsList}
            </section>
          </div>
        </section>
      </dialog>

      <div
        style="position: fixed; z-index: 950"
        class="backdrop ${this.closingModal ? 'closing' : ''}"
        @click=${() => this.closeModal()}></div>
    `;
  }
}
````

## File: src/components/selector-modal/styles.ts
````typescript
import { css } from 'lit';

export const modalDialogStyles = css`
  .dialog-modal {
    max-height: 100vh;
    position: fixed;
    z-index: 990;
    font-family: 'Open Sans', arial, sans-serif;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    border-width: 0;
    box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.25);
    bottom: 0;
    overflow: hidden;
  }

  @media screen and (min-width: 768px) {
    .dialog-modal {
      z-index: 990;
      bottom: auto;
      top: 5rem;
      max-width: 25rem;
      border-radius: 1rem;
    }
  }
`;

export const modalDialogBodyStyles = css`
  .dialog-modal-body {
    display: flex;
    flex-direction: column-reverse;
  }

  .dialog-modal-body__help,
  .dialog-modal-body__wallets {
    width: 100%;
    flex-basis: 100%;
  }

  .dialog-modal-body__help {
    padding: 1.5rem;
  }

  .dialog-modal-body__wallets {
    padding: 1.5rem;
  }

  .dialog-text-solid {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .dialog-text {
    font-size: 0.875rem;
    line-height: 1.125rem;
  }

  @media (prefers-color-scheme: light) {
    .dialog-modal-body__help {
      background-color: var(--modal-help-bg-color, #f8f8f8);
      border-top: 1px solid var(--modal-divider-color, rgba(0, 0, 0, 0.15));
    }

    @media screen and (min-width: 768px) {
      .dialog-modal-body__help {
        border-top: none;
        border-right: 1px solid var(--modal-divider-color, rgba(0, 0, 0, 0.15));
      }
    }

    .dialog-modal-body__wallets,
    .dialog-modal-body {
      background-color: var(--modal-bg-color, #fcfcfc);
    }

    .dialog-text-solid {
      color: var(--modal-solid-text-color, #000000);
    }

    .dialog-text {
      color: var(--modal-text-color, #181818);
    }
  }

  @media (prefers-color-scheme: dark) {
    .dialog-modal-body__help {
      background-color: var(--modal-help-bg-color, #1c1c1c);
      border-top: 1px solid var(--modal-divider-color, rgba(255, 255, 255, 0.15));
    }

    @media screen and (min-width: 768px) {
      .dialog-modal-body__help {
        border-top: none;
        border-right: 1px solid var(--modal-divider-color, rgba(255, 255, 255, 0.15));
      }
    }

    .dialog-modal-body__wallets,
    .dialog-modal-body {
      background-color: var(--modal-bg-color, #161616);
    }

    .dialog-text-solid {
      color: var(--modal-solid-text-color, #ededed);
    }

    .dialog-text {
      color: var(--modal-text-color, #a0a0a0);
    }
  }

  @media screen and (min-width: 768px) {
    .dialog-modal-body {
      flex-direction: row;
    }

    .dialog-modal-body__help,
    .dialog-modal-body__wallets {
      padding: 2rem;
    }
  }
`;

export const modalHelpSection = css`
  .help-container {
    width: 100%;
  }

  .help-header {
    display: none;
    margin: 0 0 2rem 0;
  }

  .help-header__modal-title {
    font-size: 1.25rem;
    padding: 0;
    margin: 0;
  }

  .help__title,
  .help__text {
    text-align: center;
  }

  .help__title {
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .help__text {
    max-width: 21rem;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
    margin-top: 0;
  }

  .help__whats_stellar {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .help-header {
      display: block;
    }

    .help__title,
    .help__text {
      text-align: left;
      margin-left: 0;
    }

    .help__whats_a_wallet {
      margin-bottom: 2rem;
    }

    .help__whats_stellar {
      display: block;
    }
  }
`;

export const modalWalletsSection = css`
  .wallets-container {
    width: 100%;
    height: 100%;
    min-height: fit-content;
    display: flex;
    flex-direction: column;
  }

  .wallets-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .wallets-header__modal-title {
    font-size: 1.25rem;
    padding: 0;
    margin: 0;
  }

  .wallets-header__button {
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (prefers-color-scheme: light) {
    .wallets-header__button svg {
      fill: var(--modal-header-button-color, #8f8f8f);
    }
  }

  @media (prefers-color-scheme: dark) {
    .wallets-header__button svg {
      fill: var(--modal-header-button-color, #707070);
    }
  }

  .wallets-body {
    margin: 0;
    width: 100%;
    list-style: none;
    padding: 1rem 0 0 !important;
  }

  .wallets-body__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 2rem;
    cursor: pointer;
    padding: 0 0 1rem 0;
  }

  .wallets-body__item:last-child {
    margin-bottom: 0;
  }

  @media (prefers-color-scheme: light) {
    .wallets-body__item {
      border-bottom: 1px var(--modal-divider-color, rgba(0, 0, 0, 0.15)) solid;
    }
  }

  @media (prefers-color-scheme: dark) {
    .wallets-body__item {
      border-bottom: 1px var(--modal-divider-color, rgba(255, 255, 255, 0.15)) solid;
    }
  }

  .wallets-body__item img {
    margin-right: 1rem;
    width: 2rem;
    border-radius: 100%;
    overflow: hidden;
  }

  .wallets-body__item.not-available {
    cursor: alias;
  }

  .wallets-body__item .not-available {
    margin-left: auto;
    font-size: 10px;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
  }

  @media (prefers-color-scheme: light) {
    .wallets-body__item .not-available {
      border: solid var(--modal-not-available-border-color, #e2e2e2) 1px;
      background-color: var(--modal-not-available-bg-color, #f3f3f3);
      color: var(--modal-not-available-text-color, #6f6f6f);
    }
  }

  @media (prefers-color-scheme: dark) {
    .wallets-body__item .not-available {
      border: solid var(--modal-not-available-border-color, #343434) 1px;
      background-color: var(--modal-not-available-bg-color, #232323);
      color: var(--modal-not-available-text-color, #a0a0a0);
    }
  }

  @media screen and (min-width: 768px) {
  }
`;

export const backdropStyles = css`
  .dialog-modal[open] + .backdrop {
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const modalAnimations = css`
  .dialog-modal[open] {
    -webkit-animation: showModal 0.3s ease normal;
  }
  @-webkit-keyframes showModal {
    from {
      transform: translateY(25%);
      opacity: 0;
    }
    to {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .dialog-modal.closing {
    -webkit-animation: hideModal 0.3s ease normal !important;
  }
  @-webkit-keyframes hideModal {
    from {
      transform: translateY(0%);
      opacity: 1;
    }
    to {
      transform: translateY(25%);
      opacity: 0;
    }
  }

  .backdrop.closing {
    -webkit-animation: hideBackdrop 0.3s ease normal !important;
  }
  @-webkit-keyframes hideBackdrop {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
````

## File: src/components/index.ts
````typescript
import { StellarWalletsButton } from './button/stellar-wallets-button';
import { StellarWalletsModal } from './modal/stellar-wallets-modal';
import { StellarSelectorModal } from './selector-modal/stellar-selector-modal';

declare global {
  interface HTMLElementTagNameMap {
    'stellar-wallets-modal': StellarWalletsModal;
    'stellar-wallets-button': StellarWalletsButton;
    'stellar-selector-modal': StellarSelectorModal;
  }
}
````

## File: src/modules/albedo.module.ts
````typescript
import albedo from '@albedo-link/intent';

import { ModuleInterface, ModuleType, WalletNetwork } from '../types';
import { parseError } from '../utils';

export const ALBEDO_ID = 'albedo';

export class AlbedoModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = ALBEDO_ID;
  productName: string = 'Albedo';
  productUrl: string = 'https://albedo.link/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/albedo.png';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getAddress(): Promise<{ address: string }> {
    return albedo
      .publicKey({})
      .then(result => ({ address: result.pubkey }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    return albedo
      .tx({
        xdr,
        pubkey: opts?.address,
        network: opts?.networkPassphrase
          ? opts.networkPassphrase === WalletNetwork.PUBLIC
            ? AlbedoNetwork.PUBLIC
            : AlbedoNetwork.TESTNET
          : undefined,
      })
      .then(({ signed_envelope_xdr }) => ({
        signedTxXdr: signed_envelope_xdr,
        signerAddress: opts?.address,
      }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Albedo does not support the "signAuthEntry" function',
    };
  }

  /**
   * We understand that Albedo has a method to sign a message, but that method is not compatible with SEP-0043
   */
  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Albedo does not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Albedo does not support the "getNetwork" function',
    };
  }
}

export enum AlbedoNetwork {
  PUBLIC = 'public',
  TESTNET = 'testnet',
}
````

## File: src/modules/freighter.module.ts
````typescript
import {
  isConnected,
  signTransaction,
  signAuthEntry,
  requestAccess,
  signMessage,
  getNetwork,
  getAddress,
} from '@stellar/freighter-api';
import { ModuleInterface, ModuleType } from '../types';
import { parseError } from '../utils';
import { Buffer } from 'buffer';

export const FREIGHTER_ID = 'freighter';

export class FreighterModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = FREIGHTER_ID;
  productName: string = 'Freighter';
  productUrl: string = 'https://freighter.app';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/freighter.png';

  async runChecks(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error('Freighter is not connected');
    }
  }

  async isAvailable(): Promise<boolean> {
    return isConnected()
      .then(({ isConnected, error }) => !error && isConnected)
      .catch((): boolean => false);
  }

  async getAddress(): Promise<{ address: string }> {
    return this.runChecks()
      .then(() => requestAccess())
      .then(() => getAddress())
      .then(({ address, error }) => {
        if (error) throw error;

        return { address };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    return this.runChecks()
      .then(async () => {
        const { signedTxXdr, signerAddress, error } = await signTransaction(xdr, {
          address: opts?.address,
          networkPassphrase: opts?.networkPassphrase,
        });

        if (error) throw error;

        return { signedTxXdr, signerAddress: signerAddress };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(
    authEntry: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    return this.runChecks()
      .then(async () => {
        const { signedAuthEntry, signerAddress, error } = await signAuthEntry(authEntry, {
          address: opts?.address,
          networkPassphrase: opts?.networkPassphrase,
        });

        if (error || !signedAuthEntry) throw error;

        return { signedAuthEntry: Buffer.from(signedAuthEntry).toString('base64'), signerAddress: signerAddress };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async signMessage(
    message: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedMessage: string; signerAddress?: string }> {
    return this.runChecks()
      .then(async () => {
        const { signedMessage, signerAddress, error } = await signMessage(message, {
          address: opts?.address,
          networkPassphrase: opts?.networkPassphrase,
        });

        if (error || !signedMessage) throw error;

        return { signedMessage: Buffer.from(signedMessage).toString('base64'), signerAddress: signerAddress };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    return this.runChecks()
      .then(async () => {
        const { network, networkPassphrase, error } = await getNetwork();

        if (error) throw error;

        return { network, networkPassphrase };
      })
      .catch(e => {
        throw parseError(e);
      });
  }
}
````

## File: src/modules/hana.module.ts
````typescript
import { ModuleInterface, ModuleType } from '../types';
import { parseError } from '../utils';

interface SignTransactionProps {
  xdr: string;
  accountToSign?: string;
  networkPassphrase?: string;
}

interface SignBlobProps {
  blob: string;
  accountToSign: string;
}

interface SignAuthEntryProps {
  xdr: string;
  accountToSign?: string;
}

interface SignMessageProps {
  message: string;
  accountToSign?: string;
}

declare const window: Window & {
  hanaWallet?: {
    stellar?: {
      getPublicKey(): Promise<string>;
      signTransaction({ xdr, accountToSign, networkPassphrase }: SignTransactionProps): Promise<string>;
      signBlob({ blob, accountToSign }: SignBlobProps): Promise<string>;
      signAuthEntry({ xdr, accountToSign }: SignAuthEntryProps): Promise<string>;
      signMessage({ message, accountToSign }: SignMessageProps): Promise<string>;
    };
  };
};

export const HANA_ID = 'hana';

export class HanaModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = HANA_ID;
  productName: string = 'Hana Wallet';
  productUrl: string = 'https://hanawallet.io/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/hana.png';

  async runChecks(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error('Hana Wallet is not installed');
    }
  }

  isAvailable(): Promise<boolean> {
    return new Promise(resolve => resolve(typeof window !== "undefined" && !!window.hanaWallet?.stellar));
  }

  async getAddress(): Promise<{ address: string }> {
    return this.runChecks()
      .then(() => window.hanaWallet!.stellar!.getPublicKey())
      .then(address => ({ address }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    return this.runChecks()
      .then(() =>
        window.hanaWallet!.stellar!.signTransaction({
          xdr,
          accountToSign: opts?.address,
          networkPassphrase: opts?.networkPassphrase,
        })
      )
      .then(signedTxXdr => ({ signedTxXdr, signerAddress: opts?.address }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(
    authEntry: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    return this.runChecks()
      .then(() =>
        window.hanaWallet!.stellar!.signAuthEntry({
          xdr: authEntry,
          accountToSign: opts?.address,
        })
      )
      .then(signedAuthEntry => ({ signedAuthEntry, signerAddress: opts?.address }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signMessage(
    message: string,
    opts?: {
      address?: string;
    }
  ): Promise<{ signedMessage: string; signerAddress?: string }> {
    return this.runChecks()
      .then(() =>
        window.hanaWallet!.stellar!.signMessage({
          message,
          accountToSign: opts?.address,
        })
      )
      .then(signedMessage => ({ signedMessage, signerAddress: opts?.address }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Hana does not support the "getNetwork" function',
    };
  }
}
````

## File: src/modules/hotwallet.module.ts
````typescript
import { HOT } from '@hot-wallet/sdk';
import { ModuleInterface, ModuleType, WalletNetwork } from '../types';

export const HOTWALLET_ID = 'hot-wallet';

export class HotWalletModule implements ModuleInterface {
  moduleType: ModuleType;
  productId: string;
  productName: string;
  productUrl: string;
  productIcon: string;

  constructor() {
    this.moduleType = ModuleType.HOT_WALLET;
    this.productId = HOTWALLET_ID;
    this.productName = 'HOT Wallet';
    this.productUrl = 'https://hot-labs.org/wallet';
    this.productIcon = 'https://storage.herewallet.app/logo.png';
  }

  async isAvailable() {
    return true;
  }

  async getAddress() {
    return await HOT.request('stellar:getAddress', {});
  }

  async signTransaction(xdr: string, opts?: { address?: string }) {
    return await HOT.request('stellar:signTransaction', { xdr, accountToSign: opts?.address });
  }

  async signAuthEntry(authEntry: string, opts?: { address?: string }) {
    return await HOT.request('stellar:signAuthEntry', { authEntry, accountToSign: opts?.address });
  }

  async signMessage(message: string, opts?: { address?: string }) {
    return await HOT.request('stellar:signMessage', { message, accountToSign: opts?.address });
  }

  async getNetwork() {
    return { network: 'mainnet', networkPassphrase: WalletNetwork.PUBLIC };
  }
}
````

## File: src/modules/ledger.module.ts
````typescript
import Str from '@ledgerhq/hw-app-str';
import Transport from '@ledgerhq/hw-transport';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Buffer } from 'buffer';
import { firstValueFrom } from 'rxjs';
import { StellarSelectorModal } from '../components/selector-modal/stellar-selector-modal';
import {
  hardwareWalletPaths$,
  mnemonicPath$,
  removeHardwareWalletPaths,
  removeMnemonicPath,
  selectedNetwork$,
  setHardwareWalletPaths,
  setMnemonicPath,
} from '../state/store';
import { ModuleInterface, ModuleType } from '../types';
import { StrKey } from '@stellar/stellar-base';
import { parseError } from '../utils';
import { Transaction } from '@stellar/stellar-base';

export const LEDGER_ID = 'LEDGER';

export class LedgerModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HW_WALLET;

  productId: string = LEDGER_ID;
  productName: string = 'Ledger';
  productUrl: string = 'https://www.ledger.com/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/ledger.png';

  private _transport?: Transport;
  async transport() {
    if (!(await TransportWebUSB.isSupported())) throw new Error('Ledger can not be used with this device.');

    if (!this._transport) {
      this._transport = await TransportWebUSB.create();
    }

    return this._transport;
  }

  async disconnect(): Promise<void> {
    removeMnemonicPath();
    removeHardwareWalletPaths();
    this._transport?.close();
    this._transport = undefined;
  }

  /**
   * This always return true because in theory ledgers aren't supposed
   * to be connected at all time
   */
  async isAvailable(): Promise<boolean> {
    return TransportWebUSB.isSupported();
  }

  async runChecks(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error('Ledger wallets can not be used');
    }
  }

  async getAddress(opts?: { path?: string }): Promise<{ address: string }> {
    await this.runChecks();

    try {
      const finalTransport: Transport = await this.transport();
      const str = new Str(finalTransport);

      let mnemonicPath: string | undefined = opts?.path || (await firstValueFrom(mnemonicPath$));

      if (!mnemonicPath) {
        await this.openAccountSelector();
        mnemonicPath = await firstValueFrom(mnemonicPath$);
      }

      const result: { rawPublicKey: Buffer } = await str.getPublicKey(mnemonicPath!);
      return { address: StrKey.encodeEd25519PublicKey(result.rawPublicKey) };
    } catch (e) {
      throw parseError(e);
    }
  }

  /**
   * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
   * @param page - {Number}
   */
  async getAddresses(page: number = 0): Promise<{ publicKey: string; index: number }[]> {
    const finalTransport: Transport = await this.transport();
    const str = new Str(finalTransport);
    const startIndex: number = page * 10;
    const results: { publicKey: string; index: number }[] = [];

    for (let i = 0; i < 10; i++) {
      const result: { rawPublicKey: Buffer } = await str.getPublicKey(`44'/148'/${i + startIndex}'`);
      results.push({
        publicKey: StrKey.encodeEd25519PublicKey(result.rawPublicKey),
        index: i + startIndex,
      });
    }

    setHardwareWalletPaths(results);

    return results;
  }

  /**
   * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
   */
  async openAccountSelector(): Promise<{ publicKey: string; index: number }> {
    return new Promise((resolve, reject) => {
      const el = document.createElement('stellar-accounts-selector') as StellarSelectorModal;
      el.setAttribute('showModal', '');
      el.setAttribute('loadingAccounts', '');
      document.body.appendChild(el);

      this.getAddresses()
        .then(addressesData => {
          el.setAttribute('accounts', JSON.stringify(addressesData));
          el.removeAttribute('loadingAccounts');
        })
        .catch(err => {
          el.remove();
          reject(err);
        });

      const listener = (event: CustomEvent) => {
        const { publicKey, index } = event.detail as { publicKey: string; index: number };
        setMnemonicPath(`44'/148'/${index}'`);
        resolve({ publicKey, index });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selected', listener, false);
        document.body.removeChild(el);
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      el.addEventListener('account-selected', listener, false);

      const errorListener = (event: CustomEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selected', listener, false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selector-closed', errorListener, false);
        document.body.removeChild(el);
        reject(event.detail);
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      el.addEventListener('account-selector-closed', errorListener, false);
    });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      nonBlindTx?: boolean;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    await this.runChecks();
    const finalTransport: Transport = await this.transport();
    const str = new Str(finalTransport);

    let mnemonicPath: string | undefined;
    let account: string;
    if (opts?.path) {
      mnemonicPath = opts.path;
      const result: { rawPublicKey: Buffer } = await str.getPublicKey(mnemonicPath);
      account = StrKey.encodeEd25519PublicKey(result.rawPublicKey);
    } else if (opts?.address) {
      const paths = await firstValueFrom(hardwareWalletPaths$);
      const target = paths.find(p => p.publicKey === opts.address);
      if (!target) throw new Error('This address has not been loaded from this ledger');
      mnemonicPath = `44'/148'/${target.index}'`;
      account = target.publicKey;
    } else {
      mnemonicPath = await firstValueFrom(mnemonicPath$);
      if (!mnemonicPath) throw new Error('There is no path available, please call the `getAddress` method first.');
      const result: { rawPublicKey: Buffer } = await str.getPublicKey(mnemonicPath);
      account = StrKey.encodeEd25519PublicKey(result.rawPublicKey);
    }

    const network: string | undefined = opts?.networkPassphrase || (await firstValueFrom(selectedNetwork$));
    if (!network) throw new Error('You need to provide or set a network passphrase');

    const tx: Transaction = new Transaction(xdr, network);

    const result: { signature: Buffer } = opts?.nonBlindTx
      ? await str.signTransaction(mnemonicPath, tx.signatureBase())
      : await str.signHash(mnemonicPath, tx.hash());

    tx.addSignature(account, result.signature.toString('base64'));

    return {
      signedTxXdr: tx.toXDR(),
      signerAddress: account,
    };
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Ledger Wallets do not support the "signAuthEntry" function',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Ledger Wallets do not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Ledger Wallets do not support the "getNetwork" function',
    };
  }
}
````

## File: src/modules/lobstr.module.ts
````typescript
import { isConnected, getPublicKey, signTransaction } from '@lobstrco/signer-extension-api';
import { ModuleInterface, ModuleType } from '../types';
import { parseError } from '../utils';

export const LOBSTR_ID = 'lobstr';

export class LobstrModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = LOBSTR_ID;
  productName: string = 'LOBSTR';
  productUrl: string = 'https://lobstr.co';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/lobstr.png';

  async isAvailable(): Promise<boolean> {
    return isConnected();
  }

  async getAddress(): Promise<{ address: string }> {
    const runChecks = async () => {
      if (!(await isConnected())) {
        throw new Error(`Lobstr is not connected`);
      }
    };

    return runChecks()
      .then(() => getPublicKey())
      .then(address => ({ address }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    const runChecks = async () => {
      if (!(await isConnected())) {
        throw new Error(`Lobstr is not connected`);
      }

      if (opts?.address) {
        console.warn(`Lobstr doesn't allow specifying what public key should sign the transaction, we skip the value`);
      }

      if (opts?.networkPassphrase) {
        console.warn(`Lobstr doesn't allow specifying the network that should be used, we skip the value`);
      }
    };

    return runChecks()
      .then(() => signTransaction(xdr))
      .then(signedTxXdr => ({ signedTxXdr }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Lobstr does not support the "signAuthEntry" function',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Lobstr does not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Lobstr does not support the "getNetwork" function',
    };
  }
}
````

## File: src/modules/rabet.module.ts
````typescript
import { ModuleInterface, ModuleType, WalletNetwork } from '../types';
import { parseError } from '../utils';

declare const window: Window &
  typeof globalThis & {
    rabet?: {
      connect: () => Promise<{ publicKey: string }>;
      sign: (xdr: string, network: RabetNetwork) => Promise<{ xdr: string }>;
    };
  };

export const RABET_ID = 'rabet';

export class RabetModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = RABET_ID;
  productName: string = 'Rabet';
  productUrl: string = 'https://rabet.io/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/rabet.png';

  isAvailable(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      // We wait 100ms before answering the call because Rabet is really slow when it comes to create the rabet window object and so this way we make sure is available
      setTimeout(() => {
        resolve(typeof window !== "undefined" && !!window.rabet);
      }, 100);
    });
  }

  async getAddress(): Promise<{ address: string }> {
    const runChecks = async () => {
      if (!(await this.isAvailable())) {
        throw new Error('Rabet is not installed');
      }
    };

    return runChecks()
      .then(() => window.rabet!.connect())
      .then(({ publicKey }) => ({ address: publicKey }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    const runChecks = async () => {
      if (!(await this.isAvailable())) {
        throw new Error('Rabet is not installed');
      }

      if (
        opts?.address &&
        opts.networkPassphrase !== WalletNetwork.PUBLIC &&
        opts.networkPassphrase !== WalletNetwork.TESTNET
      ) {
        throw new Error(`Rabet doesn't support the network: ${opts.networkPassphrase}`);
      }

      if (opts?.address) {
        console.warn(`Rabet doesn't allow specifying the network that should be used, we skip the value`);
      }
    };

    const sign = async () =>
      window.rabet!.sign(
        xdr,
        opts?.networkPassphrase === WalletNetwork.PUBLIC ? RabetNetwork.PUBLIC : RabetNetwork.TESTNET
      );

    return runChecks()
      .then(sign)
      .then(result => ({ signedTxXdr: result?.xdr }))
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Rabet does not support the "signAuthEntry" function',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Rabet does not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Rabet does not support the "getNetwork" function',
    };
  }
}

export enum RabetNetwork {
  PUBLIC = 'mainnet',
  TESTNET = 'testnet',
}
````

## File: src/modules/trezor.module.ts
````typescript
import TrezorConnect from '@trezor/connect-web';
import { transformTransaction } from '@trezor/connect-plugin-stellar';
import { Transaction } from '@stellar/stellar-base';
import { firstValueFrom } from 'rxjs';

import {
  hardwareWalletPaths$,
  mnemonicPath$,
  removeHardwareWalletPaths,
  removeMnemonicPath,
  selectedNetwork$,
  setHardwareWalletPaths,
  setMnemonicPath,
} from '../state/store';
import { ModuleInterface, ModuleType } from '../types';
import { parseError } from '../utils';
import { StellarSelectorModal } from '../components/selector-modal/stellar-selector-modal';

export const TREZOR_ID = 'TREZOR';

export class TrezorModule implements ModuleInterface {
  TrezorConnect: typeof TrezorConnect =
    'default' in TrezorConnect ? (TrezorConnect.default as typeof TrezorConnect) : TrezorConnect;

  private _isAvailable: boolean = false;

  moduleType: ModuleType = ModuleType.HW_WALLET;

  productId: string = TREZOR_ID;
  productName: string = 'Trezor';
  productUrl: string = 'https://www.trezor.com/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/trezor.png';

  constructor(params: ITrezorModuleParams) {
    this.TrezorConnect.init({
      manifest: {
        appUrl: params.appUrl,
        email: params.email,
      },
      // More advanced options
      debug: params.debug || false,
      lazyLoad: params.lazyLoad || false,
      coreMode: params.coreMode || 'auto',
    }).then(() => {
      console.log('Trezor is ready');
      this._isAvailable = true;
    });
  }

  async disconnect(): Promise<void> {
    removeMnemonicPath();
    removeHardwareWalletPaths();
  }

  /**
   * `TrezorConnect` needs to be started before we can use it but because users most likely
   * won't use their devices as soon as the site loads, we return `true` since it should be already started
   * once the user needs to interact with it.
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  async runChecks(): Promise<void> {
    if (!this._isAvailable) {
      throw parseError(new Error('Trezor connection has not been started yet.'));
    }
  }

  async getAddress(opts?: { path?: string }): Promise<{ address: string }> {
    await this.runChecks();

    try {
      const mnemonicPath: string | undefined = opts?.path || (await firstValueFrom(mnemonicPath$));

      if (!mnemonicPath) {
        const result = await this.openAccountSelector();
        return { address: result.publicKey };
      } else {
        const result = await this.TrezorConnect.stellarGetAddress({ path: mnemonicPath, showOnTrezor: false });
        if (!result.success) {
          throw parseError(new Error(result.payload.error));
        }

        return { address: result.payload.address };
      }
    } catch (e) {
      throw parseError(e);
    }
  }

  /**
   * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
   * @param page - {Number}
   */
  async getAddresses(page: number = 0): Promise<{ publicKey: string; index: number }[]> {
    const startIndex: number = page * 10;
    const bundle: { path: string; showOnTrezor: boolean }[] = new Array(10)
      .fill(undefined)
      .map((_, i): { path: string; showOnTrezor: boolean } => ({
        path: `m/44'/148'/${i + startIndex}'`,
        showOnTrezor: false,
      }));

    const result = await this.TrezorConnect.stellarGetAddress({ bundle });
    if (!result.success) {
      throw parseError(new Error(result.payload.error));
    }

    const results = result.payload.map((item, i) => ({
      publicKey: item.address,
      index: i + startIndex,
    }));

    setHardwareWalletPaths(results);

    return results;
  }

  /**
   * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
   */
  async openAccountSelector(): Promise<{ publicKey: string; index: number }> {
    return new Promise((resolve, reject) => {
      const el = document.createElement('stellar-accounts-selector') as StellarSelectorModal;
      el.setAttribute('showModal', '');
      el.setAttribute('loadingAccounts', '');
      document.body.appendChild(el);

      this.getAddresses()
        .then(addressesData => {
          el.setAttribute('accounts', JSON.stringify(addressesData));
          el.removeAttribute('loadingAccounts');
        })
        .catch(err => {
          el.remove();
          reject(err);
        });

      const listener = (event: CustomEvent) => {
        const { publicKey, index } = event.detail as { publicKey: string; index: number };
        setMnemonicPath(`44'/148'/${index}'`);
        resolve({ publicKey, index });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selected', listener, false);
        document.body.removeChild(el);
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      el.addEventListener('account-selected', listener, false);

      const errorListener = (event: CustomEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selected', listener, false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        el.removeEventListener('account-selector-closed', errorListener, false);
        document.body.removeChild(el);
        reject(event.detail);
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      el.addEventListener('account-selector-closed', errorListener, false);
    });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    await this.runChecks();

    let mnemonicPath: string | undefined;
    let account: string;
    if (opts?.path) {
      mnemonicPath = opts.path;
      const result = await this.TrezorConnect.stellarGetAddress({ path: mnemonicPath, showOnTrezor: false });
      if (!result.success) {
        throw new Error(result.payload.error);
      }
      account = result.payload.address;
    } else if (opts?.address) {
      const paths = await firstValueFrom(hardwareWalletPaths$);
      const target = paths.find(p => p.publicKey === opts.address);
      if (!target) throw parseError(new Error('This address has not been loaded from this device'));
      mnemonicPath = `m/44'/148'/${target.index}'`;
      account = target.publicKey;
    } else {
      mnemonicPath = await firstValueFrom(mnemonicPath$);
      if (!mnemonicPath)
        throw parseError(new Error('There is no path available, please call the `getAddress` method first.'));
      const result = await this.TrezorConnect.stellarGetAddress({ path: mnemonicPath, showOnTrezor: false });
      if (!result.success) {
        throw new Error(result.payload.error);
      }
      account = result.payload.address;
    }

    const network: string | undefined = opts?.networkPassphrase || (await firstValueFrom(selectedNetwork$));
    if (!network) throw parseError(new Error('You need to provide or set a network passphrase'));

    const tx: Transaction = new Transaction(xdr, network);
    const parsedTx = transformTransaction(mnemonicPath, tx);
    const result = await this.TrezorConnect.stellarSignTransaction(parsedTx);

    if (!result.success) {
      throw parseError(new Error(result.payload.error));
    }

    tx.addSignature(account, Buffer.from(result.payload.signature, 'hex').toString('base64'));

    return {
      signedTxXdr: tx.toXDR(),
      signerAddress: account,
    };
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Trezor Wallets do not support the "signAuthEntry" method',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'Trezor Wallets do not support the "signMessage" method',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'Trezor Wallets do not support the "getNetwork" method',
    };
  }
}

/**
 * These values are used to start the TrezorConnect library
 */
export interface ITrezorModuleParams {
  appUrl: string;
  email: string;
  debug?: boolean;
  lazyLoad?: boolean;
  coreMode?: 'auto' | 'iframe' | 'popup';
}
````

## File: src/modules/walletconnect.module.ts
````typescript
import { WalletConnectModal } from '@walletconnect/modal';
import { SignClient } from '@walletconnect/sign-client';
import { ISignClient } from '@walletconnect/types/dist/types/sign-client/client';
import { SessionTypes } from '@walletconnect/types/dist/types/sign-client/session';
import { ModuleInterface, ModuleType, WalletNetwork } from '../types';
import { parseError } from '../utils';

const parseWalletConnectSession = (session: SessionTypes.Struct): IParsedWalletConnectSession => {
  const accounts = session.namespaces.stellar.accounts.map((account: string) => ({
    network: account.split(':')[1] as 'pubnet' | 'testnet',
    publicKey: account.split(':')[2],
  }));

  return {
    id: session.topic,
    name: session.peer.metadata.name,
    description: session.peer.metadata.description,
    url: session.peer.metadata.url,
    icons: session.peer.metadata.icons[0],
    accounts,
  };
};

export interface IParsedWalletConnectSession {
  // "id" is the topic, we call it "id" to make it easier for those not familiarized with WalletConnect
  id: string;
  name: string;
  description: string;
  url: string;
  icons: string;
  accounts: Array<{
    network: 'pubnet' | 'testnet';
    publicKey: string;
  }>;
}

export const WALLET_CONNECT_ID = 'wallet_connect';

export class WalletConnectModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.BRIDGE_WALLET;

  productId: string = WALLET_CONNECT_ID;
  productName: string = 'Wallet Connect';
  productUrl: string = 'https://walletconnect.com/';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/walletconnect.png';

  private client?: ISignClient & {
    on: (event: string, cb: (data: { topic: string }) => void) => void;
  };
  private activeSession?: string;
  private qrModal!: WalletConnectModal;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  constructor(public wcParams: IWalletConnectConstructorParams) {
    if (wcParams.sessionId) {
      this.setSession(wcParams.sessionId);
    }

    if (wcParams.client && wcParams.modal) {
      this.client = wcParams.client as any;
      this.qrModal = wcParams.modal;
    } else {
      SignClient.init({
        projectId: wcParams.projectId,
        metadata: {
          name: wcParams.name,
          url: wcParams.url,
          description: wcParams.description,
          icons: wcParams.icons,
        },
      })
        .then(client => {
          console.log('WalletConnect is ready.');
          this.client = client as never;
          this.qrModal = new WalletConnectModal({ projectId: wcParams.projectId });

          if (wcParams.onSessionDeleted) {
            this.onSessionDeleted(wcParams.onSessionDeleted);
          }
        })
        .catch(console.error);
    }
  }

  async getAddress(): Promise<{ address: string }> {
    const runChecks = async () => {
      if (!this.client) {
        throw new Error('WalletConnect is not running yet');
      }
    };

    return runChecks()
      .then(async (): Promise<{ address: string }> => {
        const targetSession: IParsedWalletConnectSession = await this.getTargetSession();
        return { address: targetSession.accounts[0].publicKey };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    const runChecks = async () => {
      if (!this.client) {
        throw new Error('WalletConnect is not running yet');
      }
    };

    return runChecks()
      .then(async () => {
        const targetSession: IParsedWalletConnectSession = await this.getTargetSession({ publicKey: opts?.address });
        const signedTxXdr = await this.client!.request({
          topic: targetSession.id,
          chainId:
            opts?.networkPassphrase === WalletNetwork.PUBLIC
              ? WalletConnectTargetChain.PUBLIC
              : WalletConnectTargetChain.TESTNET,
          request: {
            method: this.wcParams.method,
            params: { xdr },
          },
        }).then((v: any) => v.signedXDR);

        return { signedTxXdr };
      })
      .catch(e => {
        throw parseError(e);
      });
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'WalletConnect does not support the "signAuthEntry" function',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'WalletConnect does not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'WalletConnect does not support the "getNetwork" function',
    };
  }

  /**
   * Allows manually setting the current active session to be used in the kit when doing WalletConnect requests
   *
   * @param sessionId The session ID is a placeholder for the session "topic", term used in WalletConnect
   * */
  public setSession(sessionId: string) {
    this.activeSession = sessionId;
  }

  public onSessionDeleted(cb: (sessionId: string) => void) {
    if (!this.client) {
      throw new Error('WalletConnect is not running yet');
    }

    this.client.on('session_delete', data => {
      cb(data.topic);
    });
  }

  public async connectWalletConnect(): Promise<IParsedWalletConnectSession> {
    if (!this.client) {
      throw new Error('WalletConnect is not running yet');
    }

    try {
      const { uri, approval } = await this.client.connect({
        requiredNamespaces: {
          stellar: {
            methods: [this.wcParams.method],
            chains: [
              this.wcParams.network === WalletNetwork.PUBLIC
                ? WalletConnectTargetChain.PUBLIC
                : WalletConnectTargetChain.TESTNET,
            ],
            events: [],
          },
        },
      });
      const session: IParsedWalletConnectSession = await new Promise<SessionTypes.Struct>((resolve, reject) => {
        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          this.qrModal.openModal({ uri });
        }

        // Await session approval from the wallet.
        approval()
          .then(session => {
            this.qrModal.closeModal();
            resolve(session);
          })
          .catch(error => {
            this.qrModal.closeModal();
            reject(error);
          });
      }).then(parseWalletConnectSession);

      this.setSession(session.id);
      return session;
    } catch (e: unknown) {
      this.qrModal.closeModal();
      console.error(e);
      throw new Error('There was an error when trying to connect');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect is not running yet');
    }

    const sessions: IParsedWalletConnectSession[] = await this.getSessions();
    for (const session of sessions) {
      await this.closeSession(session.id);
    }
  }

  public async closeSession(sessionId: string, reason?: string): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect is not running yet');
    }

    await this.client.disconnect({
      topic: sessionId,
      reason: {
        message: reason || 'Session closed',
        code: -1,
      },
    });
  }

  public async getSessions(): Promise<IParsedWalletConnectSession[]> {
    if (!this.client) {
      throw new Error('WalletConnect is not running yet');
    }

    return this.client.session.values.map(parseWalletConnectSession);
  }

  private async getTargetSession(params?: { publicKey?: string }): Promise<IParsedWalletConnectSession> {
    const activeSessions: IParsedWalletConnectSession[] = await this.getSessions();
    let targetSession: IParsedWalletConnectSession | undefined = activeSessions.find(
      (session: IParsedWalletConnectSession): boolean =>
        session.id === this.activeSession || !!session.accounts.find(a => a.publicKey === params?.publicKey)
    );

    if (!targetSession) {
      targetSession = await this.connectWalletConnect();
    }

    return targetSession;
  }
}

export interface IWalletConnectConstructorParams {
  projectId: string;
  name: string;
  description: string;
  url: string;
  icons: string[];
  method: WalletConnectAllowedMethods;
  network: WalletNetwork;
  sessionId?: string;
  client?: typeof SignClient;
  modal?: WalletConnectModal;
  onSessionDeleted?: (sessionId: string) => void;
}

export enum WalletConnectTargetChain {
  PUBLIC = 'stellar:pubnet',
  TESTNET = 'stellar:testnet',
}

export enum WalletConnectAllowedMethods {
  SIGN = 'stellar_signXDR',
  SIGN_AND_SUBMIT = 'stellar_signAndSubmitXDR',
}
````

## File: src/modules/xbull.module.ts
````typescript
import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';
import { ModuleInterface, ModuleType } from '../types';
import { parseError } from '../utils';

export const XBULL_ID = 'xbull';

export class xBullModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET;

  productId: string = XBULL_ID;
  productName: string = 'xBull';
  productUrl: string = 'https://xbull.app';
  productIcon: string = 'https://stellar.creit.tech/wallet-icons/xbull.png';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getAddress(): Promise<{ address: string }> {
    try {
      const bridge: xBullWalletConnect = new xBullWalletConnect();
      const publicKey: string = await bridge.connect();
      bridge.closeConnections();
      return { address: publicKey };
    } catch (e: any) {
      throw parseError(e);
    }
  }

  async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    try {
      const bridge: xBullWalletConnect = new xBullWalletConnect();

      const signedXdr: string = await bridge.sign({
        xdr,
        publicKey: opts?.address,
        network: opts?.networkPassphrase,
      });

      bridge.closeConnections();
      return { signedTxXdr: signedXdr, signerAddress: opts?.address };
    } catch (e: any) {
      throw parseError(e);
    }
  }

  async signAuthEntry(): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'xBull does not support the "signAuthEntry" function',
    };
  }

  async signMessage(): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw {
      code: -3,
      message: 'xBull does not support the "signMessage" function',
    };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    throw {
      code: -3,
      message: 'xBull does not support the "getNetwork" function',
    };
  }
}
````

## File: src/services/account.service.ts
````typescript
import { firstValueFrom } from 'rxjs';
import { horizonUrl$ } from '../state/store';

export async function fetchAccountBalance(pk: string): Promise<string> {
  const horizonUrl: string | undefined = await firstValueFrom(horizonUrl$);
  if (!horizonUrl) {
    throw new Error('There is no Horizon URL set');
  }
  const url: URL = new URL(horizonUrl);
  url.pathname = `/accounts/${pk}`;
  const response: Response = await fetch(url);
  const data = await response.json();
  const nativeBalance = data.balances.find((b: { asset_type: string }): boolean => b.asset_type === 'native');
  return nativeBalance.balance;
}
````

## File: src/services/clipboard.service.ts
````typescript
export async function copyToClipboard(textToCopy: string): Promise<void> {
  if (!textToCopy) {
    throw new Error(`Text to copy to the clipboard can't be undefined`);
  }

  await navigator.clipboard.writeText(textToCopy);
}
````

## File: src/state/reactive-state.ts
````typescript
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class ReactiveState<T> implements ReactiveController {
  sub: Subscription | null = null;
  value$: BehaviorSubject<T | undefined> = new BehaviorSubject<T | undefined>(undefined);

  constructor(private host: ReactiveControllerHost, private source: Observable<T>, public value?: T) {
    this.host.addController(this);
  }

  hostConnected() {
    this.sub = this.source.subscribe(value => {
      this.value = value;
      this.value$.next(value);
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.sub?.unsubscribe();
  }
}
````

## File: src/state/store.ts
````typescript
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { Observable } from 'rxjs';
import { ISupportedWallet, IModalTheme, WalletNetwork, IButtonTheme } from '../types';

export interface StateProps {
  allowedWallets: ISupportedWallet[];

  horizonUrl?: string;

  selectedNetwork?: WalletNetwork;
  selectedModuleId?: string;

  modalTheme?: IModalTheme;
  buttonTheme?: IButtonTheme;

  activeAddress?: string;
  mnemonicPath?: string;
  hardwareWalletPaths: { publicKey: string; index: number }[];
}

export const store = createStore(
  { name: 'state' },
  withProps<StateProps>({
    allowedWallets: [],
    hardwareWalletPaths: [],
  })
);

export const allowedWallets$: Observable<ISupportedWallet[]> = store.pipe(
  select((state: StateProps) => state.allowedWallets)
);

export const selectedNetwork$: Observable<StateProps['selectedNetwork']> = store.pipe(
  select((state: StateProps) => state.selectedNetwork)
);

export const modalTheme$: Observable<IModalTheme | undefined> = store.pipe(
  select((state: StateProps) => state.modalTheme)
);

export const buttonTheme$: Observable<IButtonTheme | undefined> = store.pipe(
  select((state: StateProps) => state.buttonTheme)
);

export const activeAddress$: Observable<string | undefined> = store.pipe(
  select((state: StateProps) => state.activeAddress)
);

export const horizonUrl$: Observable<string | undefined> = store.pipe(select((state: StateProps) => state.horizonUrl));

export const mnemonicPath$: Observable<string | undefined> = store.pipe(
  select((state: StateProps) => state.mnemonicPath)
);

export const hardwareWalletPaths$: Observable<{ publicKey: string; index: number }[]> = store.pipe(
  select((state: StateProps) => state.hardwareWalletPaths)
);

export function setSelectedModuleId(moduleId: Required<StateProps['selectedModuleId']>): void {
  store.update(setProp('selectedModuleId', moduleId));
}

export function setNetwork(network: WalletNetwork): void {
  if (!Object.values(WalletNetwork).includes(network)) {
    throw new Error(`Wallet network "${network}" is not supported`);
  }

  store.update(setProp('selectedNetwork', network));
}

export function setModalTheme(theme: IModalTheme): void {
  store.update(setProp('modalTheme', theme));
}

export function seButtonTheme(theme: IButtonTheme): void {
  store.update(setProp('buttonTheme', theme));
}

export function setAllowedWallets(data: ISupportedWallet[]) {
  store.update(setProp('allowedWallets', data));
}

export function setAddress(address: string): void {
  store.update(setProp('activeAddress', address));
}

export function removeAddress(): void {
  store.update(setProp('activeAddress', undefined));
}

export function setHorizonUrl(url: string): void {
  store.update(setProp('horizonUrl', url));
}

export function setMnemonicPath(path: string): void {
  store.update(setProp('mnemonicPath', path));
}

export function removeMnemonicPath(): void {
  store.update(setProp('mnemonicPath', undefined));
}

export function setHardwareWalletPaths(accounts: { publicKey: string; index: number }[]): void {
  store.update(setProp('hardwareWalletPaths', accounts));
}

export function removeHardwareWalletPaths(): void {
  store.update(setProp('hardwareWalletPaths', []));
}
````

## File: src/index.ts
````typescript
export * from './stellar-wallets-kit';
export { StellarWalletsModal, ModalThemes } from './components/modal/stellar-wallets-modal';
export { StellarWalletsButton, ButtonThemes } from './components/button/stellar-wallets-button';
export { StellarSelectorModal } from './components/selector-modal/stellar-selector-modal';
export * from './types';
export * from './utils';

export * from './modules/xbull.module';
export * from './modules/freighter.module';
export * from './modules/albedo.module';
export * from './modules/rabet.module';
export * from './modules/lobstr.module';
export * from './modules/hana.module';
export * from './modules/hotwallet.module';
````

## File: src/stellar-wallets-kit.ts
````typescript
import { StellarWalletsButton } from './components/button/stellar-wallets-button';
import { StellarWalletsModal } from './components/modal/stellar-wallets-modal';
import {
  removeAddress,
  seButtonTheme,
  setAddress,
  setAllowedWallets,
  setHorizonUrl,
  setModalTheme,
  setNetwork,
  setSelectedModuleId,
  store,
} from './state/store';
import { IButtonTheme, ISupportedWallet, IModalTheme, KitActions, ModuleInterface, WalletNetwork } from './types';

export interface StellarWalletsKitParams {
  selectedWalletId?: string;
  network: WalletNetwork;
  modules: ModuleInterface[];
  /**
   * @deprecated - This parameter will be removed in a future release, use `modalTheme` instead
   */
  theme?: IModalTheme;
  modalTheme?: IModalTheme;
  buttonTheme?: IButtonTheme;
}

export class StellarWalletsKit implements KitActions {
  private buttonElement?: StellarWalletsButton;
  private modalElement?: StellarWalletsModal;
  private readonly modules: ModuleInterface[];

  private get selectedModule(): ModuleInterface {
    const { selectedModuleId } = store.getValue();

    if (!selectedModuleId) {
      throw { code: -3, message: 'Please set the wallet first' };
    }

    const target: ModuleInterface | undefined = this.modules.find(
      (mod: ModuleInterface): boolean => mod.productId === selectedModuleId
    );

    if (!target) {
      throw { code: -3, message: 'Please set the wallet first' };
    }

    return target;
  }

  constructor(params: StellarWalletsKitParams) {
    this.modules = params.modules;
    if (params.selectedWalletId) this.setWallet(params.selectedWalletId);
    setNetwork(params.network);

    const modalTheme: IModalTheme | undefined = params.theme || params.modalTheme;
    if (modalTheme) {
      setModalTheme(modalTheme);
    }

    if (params.buttonTheme) {
      seButtonTheme(params.buttonTheme);
    }

    this.getSupportedWallets().then((value: ISupportedWallet[]): void => {
      setAllowedWallets(value);
    });
  }

  /**
   * This method will return an array with all wallets supported by this kit but will let you know those the user have already installed/has access to
   * There are wallets that are by default available since they either don't need to be installed or have a fallback
   */
  public async getSupportedWallets(): Promise<ISupportedWallet[]> {
    return Promise.all(
      this.modules.map(async (mod: ModuleInterface): Promise<ISupportedWallet> => {
        const timer: Promise<false> = new Promise(r => setTimeout(() => r(false), 500));
        return {
          id: mod.productId,
          name: mod.productName,
          type: mod.moduleType,
          icon: mod.productIcon,
          isAvailable: await Promise.race([timer, mod.isAvailable()]),
          url: mod.productUrl,
        };
      })
    );
  }

  public setWallet(id: string): void {
    const target: ModuleInterface | undefined = this.modules.find(
      (mod: ModuleInterface): boolean => mod.productId === id
    );

    if (!target) {
      throw new Error(`Wallet id "${id}" is not supported`);
    }

    setSelectedModuleId(target.productId);
  }

  public async getAddress(params?: { path?: string }): Promise<{ address: string }> {
    const { address } = await this.selectedModule.getAddress(params);
    setAddress(address);
    return { address };
  }

  public async signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    return this.selectedModule.signTransaction(xdr, {
      ...opts,
      networkPassphrase: opts?.networkPassphrase || store.getValue().selectedNetwork,
    });
  }

  public async signAuthEntry(
    authEntry: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    return this.selectedModule.signAuthEntry(authEntry, {
      ...opts,
      networkPassphrase: opts?.networkPassphrase || store.getValue().selectedNetwork,
    });
  }

  public async signMessage(
    message: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedMessage: string; signerAddress?: string }> {
    return this.selectedModule.signMessage(message, {
      ...opts,
      networkPassphrase: opts?.networkPassphrase || store.getValue().selectedNetwork,
    });
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    return this.selectedModule.getNetwork();
  }

  async disconnect(): Promise<void> {
    removeAddress();
  }

  // ---- Button methods
  public isButtonCreated(): boolean {
    return !!this.buttonElement;
  }

  /**
   * This method allows developers to set their own buttons (for connection and disconnection) on their website
   * while letting the kit handle the logic behind opening the modal, setting and removing the address from the storage, etc
   */
  public assignButtons(params: {
    connectEl: HTMLElement | string;
    disconnectEl?: HTMLElement | string;
    onConnect: (response: { address: string }) => void;
    onDisconnect: () => void;
  }): void {
    const connectEl: HTMLElement =
      typeof params.connectEl === 'string'
        ? (document.querySelector(params.connectEl) as HTMLElement)
        : params.connectEl;

    if (!connectEl) throw new Error('connectEl is not available');

    connectEl.addEventListener(
      'click',
      () => {
        this.openModal({
          onWalletSelected: option => {
            setSelectedModuleId(option.id);
            this.getAddress().then((r: { address: string }) => params.onConnect(r));
          },
        }).then();
      },
      false
    );

    if (!params.disconnectEl) return;

    const disconnectEl: HTMLElement =
      typeof params.disconnectEl === 'string'
        ? (document.querySelector(params.disconnectEl) as HTMLElement)
        : params.disconnectEl;

    if (!disconnectEl) throw new Error('disconnectEl is not available');

    disconnectEl.addEventListener(
      'click',
      () => {
        params.onDisconnect();
        removeAddress();

        if (this.selectedModule.disconnect) {
          this.selectedModule.disconnect().then();
        }
      },
      false
    );
  }

  /**
   *
   * @param params {Object}
   * @param params.container {HTMLElement} - The container where the button should be rendered.
   * @param params.onConnect {Function} - This callback is called after the user has clicked the button and selected a wallet
   * @param params.onClosed {Function} - This callback is called if the user closes the modal without selecting any wallet.
   * @param params.onError {Function} - This callback is called if there is an error while trying to get the address once the user has selected the wallet from the modal.
   * @param params.onDisconnect {Function} - This callback is called once the user disconnects from the dropdown modal
   * @param params.horizonUrl {String} - If this url is set, the dropdown modal will show the current XLM balance of the address fetched from the wallet
   * @param params.buttonText {String} - A custom text to set inside the button.
   */
  public async createButton(params: {
    container: HTMLElement;
    onConnect: (response: { address: string }) => void;
    onClosed?: (err: Error) => void;
    onError?: (err: Error) => void;
    onDisconnect: () => void;
    horizonUrl?: string;
    buttonText?: string;
  }): Promise<void> {
    if (this.buttonElement) {
      throw new Error(`Stellar Wallets Kit button is already created`);
    }

    this.buttonElement = document.createElement('stellar-wallets-button') as StellarWalletsButton;

    if (params.buttonText) {
      this.buttonElement.setAttribute('buttonText', params.buttonText);
    }

    if (params.horizonUrl) {
      setHorizonUrl(params.horizonUrl);
    }

    params.container.appendChild(this.buttonElement);

    this.buttonElement.addEventListener(
      'button-clicked',
      () => {
        this.openModal({
          onWalletSelected: option => {
            setSelectedModuleId(option.id);
            this.getAddress()
              .then((r: { address: string }) => params.onConnect(r))
              .catch(err => {
                if (params.onError) params.onError(err);
              });
          },
          onClosed: (err: Error): void => {
            if (params.onClosed) params.onClosed(err);
          },
        });
      },
      false
    );

    this.buttonElement.addEventListener(
      'disconnect-wallet',
      () => {
        params.onDisconnect();

        if (this.selectedModule.disconnect) {
          this.selectedModule.disconnect();
        }
      },
      false
    );
  }

  /**
   * Removes the button elements from the HTML and from the kit's instance.
   *
   * @param params.skipDisconnect - Set this to `true` if you want to prevent that we disconnect (for example, disconnecting WalletConnect or removing the address)
   */
  public async removeButton(params?: { skipDisconnect?: boolean }): Promise<void> {
    if (!this.buttonElement) {
      throw new Error(`Stellar Wallets Kit button hasn't been created yet`);
    }

    if (params?.skipDisconnect !== true) {
      this.buttonElement.disconnect();
    }

    this.buttonElement.remove();
    delete this.buttonElement;
  }
  // ---- END Button methods

  // ---- Modal methods
  public async openModal(params: {
    onWalletSelected: (option: ISupportedWallet) => void;
    onClosed?: (err: Error) => void;
    modalTitle?: string;
    notAvailableText?: string;
  }): Promise<void> {
    if (this.modalElement && !this.buttonElement) {
      throw new Error(`Stellar Wallets Kit modal is already open`);
    } else {
      this.modalElement = document.createElement('stellar-wallets-modal') as StellarWalletsModal;
    }

    this.modalElement.setAttribute('showModal', '');

    if (params.modalTitle) {
      this.modalElement.setAttribute('modalTitle', params.modalTitle);
    }

    if (params.notAvailableText) {
      this.modalElement.setAttribute('notAvailableText', params.notAvailableText);
    }

    document.body.appendChild(this.modalElement);

    const listener = (event: CustomEvent) => {
      params.onWalletSelected(event.detail);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.modalElement.removeEventListener('wallet-selected', listener, false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.body.removeChild(this.modalElement);
      this.modalElement = undefined;
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.modalElement.addEventListener('wallet-selected', listener, false);

    const errorListener = (event: CustomEvent) => {
      if (params.onClosed) {
        params.onClosed(event.detail);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.modalElement.removeEventListener('wallet-selected', listener, false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.modalElement.removeEventListener('modal-closed', errorListener, false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.body.removeChild(this.modalElement);
      this.modalElement = undefined;
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.modalElement.addEventListener('modal-closed', errorListener, false);
  }
  // ---- END Modal methods
}
````

## File: src/types.ts
````typescript
export interface IModalTheme {
  bgColor: string;
  textColor: string;
  solidTextColor: string;
  headerButtonColor: string;
  dividerColor: string;
  helpBgColor: string;
  notAvailableTextColor: string;
  notAvailableBgColor: string;
  notAvailableBorderColor: string;
}

/**
 * @deprecated - This type is deprecated, use `IModalTheme` instead
 */
export type ITheme = IModalTheme;

export interface IButtonTheme {
  bgColor: string;
  textColor: string;
  solidTextColor: string;
  dividerColor: string;
  buttonPadding: string;
  buttonBorderRadius: string;
}

export enum WalletNetwork {
  PUBLIC = 'Public Global Stellar Network ; September 2015',
  TESTNET = 'Test SDF Network ; September 2015',
  FUTURENET = 'Test SDF Future Network ; October 2022',
  SANDBOX = 'Local Sandbox Stellar Network ; September 2022',
  STANDALONE = 'Standalone Network ; February 2017',
}

export enum ModuleType {
  HW_WALLET = 'HW_WALLET',
  HOT_WALLET = 'HOT_WALLET',
  BRIDGE_WALLET = 'BRIDGE_WALLET',
  AIR_GAPED_WALLET = 'AIR_GAPED_WALLET',
}

export interface ISupportedWallet {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  icon: string;
  url: string;
}

/**
 * The Kit Actions are the methods the kit use to interact with the Wallet/Service
 */
export interface KitActions {
  /**
   * Function used to request the public key from the active account or
   * specific path on a wallet.
   *
   * @param params
   * @param params.path - The path to tell the wallet which position to ask. This is commonly used in hardware wallets.
   *
   * @return Promise<{ address: string }>
   */
  getAddress(params?: { path?: string }): Promise<{ address: string }>;

  /**
   * A function to request a wallet to sign a built transaction in its XDR mode
   *
   * @param xdr - A Transaction or a FeeBumpTransaction
   * @param opts - Options compatible with https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md#signtransaction
   * @param opts.networkPassphrase - The Stellar network to use when signing
   * @param opts.address - The public key of the account that should be used to sign
   * @param opts.path - This options is added for special cases like Hardware wallets
   *
   * @return Promise<{ signedTxXdr: string; signerAddress: string }>
   */
  signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
  ): Promise<{ signedTxXdr: string; signerAddress?: string }>;

  /**
   * A function to request a wallet to sign an AuthEntry XDR.
   *
   * @param authEntry - An XDR string version of `HashIdPreimageSorobanAuthorization`
   * @param opts - Options compatible with https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md#signauthentry
   * @param opts.networkPassphrase - The Stellar network to use when signing
   * @param opts.address - The public key of the account that should be used to sign
   * @param opts.path - This options is added for special cases like Hardware wallets
   *
   * @return - Promise<{ signedAuthEntry: string; signerAddress: string }>
   */
  signAuthEntry(
    authEntry: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedAuthEntry: string; signerAddress?: string }>;

  /**
   * A function to request a wallet to sign an AuthEntry XDR.
   *
   * @param message - An arbitrary string rather than a transaction or auth entry
   * @param opts - Options compatible with https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md#signmessage
   * @param opts.networkPassphrase - The Stellar network to use when signing
   * @param opts.address - The public key of the account that should be used to sign
   * @param opts.path - This options is added for special cases like Hardware wallets
   *
   * @return - Promise<{ signedMessage: string; signerAddress: string }>
   */
  signMessage(
    message: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    }
  ): Promise<{ signedMessage: string; signerAddress?: string }>;

  /**
   * A function to request the current selected network in the wallet. This comes
   * handy when you are dealing with a wallet that doesn't allow you to specify which network to use (For example Lobstr and Rabet)
   *
   * @return - Promise<{ network: string; networkPassphrase: string }>
   */
  getNetwork(): Promise<{ network: string; networkPassphrase: string }>;

  /**
   * This method should be included if your wallet have some sort of async connection, for example WalletConnect
   * Once this method is called, the module should clear all connections
   */
  disconnect?(): Promise<void>;
}

/**
 * A module is a "plugin" we can use within the kit so is able to handle a
 * specific type of wallet/service. There are some modules that are already
 * in the kit but any wallet developer can create their own plugins
 */
export interface ModuleInterface extends KitActions {
  /**
   * The Module type is used for filtering purposes, define the correct one in
   * your module so we display it accordingly
   */
  moduleType: ModuleType;

  /**
   * This ID of the module, you should expose this ID as a constant variable
   * so developers can use it to show/filter this module if they need to.
   */
  productId: string;

  /**
   * This is the name the kit will show in the builtin Modal.
   */
  productName: string;

  /**
   * This is the URL where users can either download, buy and just know how to
   * get the product.
   */
  productUrl: string;

  /**
   * This icon will be displayed in the builtin Modal along with the product name.
   */
  productIcon: string;

  /**
   * This function should return true is the wallet is installed and/or available.
   * If for example this wallet/service doesn't need to be installed to be used,
   * return `true`.
   *
   * Important:
   * Your wallet/library needs to be able to answer this function in less than 500ms.
   * Otherwise, the kit will show it as unavailable
   *
   */
  isAvailable(): Promise<boolean>;
}
````

## File: src/utils.ts
````typescript
import { AlbedoModule } from './modules/albedo.module';
import { FreighterModule } from './modules/freighter.module';
import { LobstrModule } from './modules/lobstr.module';
import { RabetModule } from './modules/rabet.module';
import { xBullModule } from './modules/xbull.module';
import { HotWalletModule } from './modules/hotwallet.module';
import { HanaModule } from './modules/hana.module';
import { ModuleInterface } from './types';

/**
 * This method returns all modules that don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 */
export function allowAllModules(opts?: { filterBy: (module: ModuleInterface) => boolean }): ModuleInterface[] {
  const modules: ModuleInterface[] = [
    new AlbedoModule(),
    new FreighterModule(),
    new RabetModule(),
    new xBullModule(),
    new LobstrModule(),
    new HanaModule(),
    new HotWalletModule(),
  ];
  return opts?.filterBy ? modules.filter(opts.filterBy) : modules;
}

/**
 * This method only returns those modules from wallet that follow exactly the SEP-43 standard and don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 */
export function sep43Modules(opts?: { filterBy: (module: ModuleInterface) => boolean }): ModuleInterface[] {
  const modules: ModuleInterface[] = [new FreighterModule(), new HotWalletModule()];
  return opts?.filterBy ? modules.filter(opts.filterBy) : modules;
}

export function parseError(e: any) {
  return {
    code: e?.error?.code || e?.code || -1,
    message: e?.error?.message || e?.message || (typeof e === 'string' && e) || 'Unhandled error from the wallet',
    ext: e?.error?.ext || e?.ext,
  };
}
````

## File: .cspell.json
````json
{
  "version": "0.1",
  "$schema": "https://raw.githubusercontent.com/streetsidesoftware/cspell/master/cspell.schema.json",
  "language": "en",
  "words": [
    "pubnet",
    "testnet",
    "lobstr",
    "walletconnect",
    "qrcode",
    "FUTURENET",
    "rabet",
    "xbull",
    "creit",
    "bitjson",
    "bitauth",
    "cimg",
    "circleci",
    "codecov",
    "commitlint",
    "dependabot",
    "editorconfig",
    "esnext",
    "execa",
    "exponentiate",
    "globby",
    "libauth",
    "mkdir",
    "prettierignore",
    "sandboxed",
    "transpiled",
    "typedoc",
    "untracked"
  ],
  "flagWords": [],
  "ignorePaths": [
    "package.json",
    "package-lock.json",
    "yarn.lock",
    "tsconfig.json",
    "node_modules/**"
  ]
}
````

## File: .editorconfig
````
# http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false
````

## File: .eslintignore
````
node_modules/*
docs/*
docs-src/*
rollup-config.js
custom-elements.json
web-dev-server.config.js
````

## File: .eslintrc.json
````json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true
  },
  "rules": {
    "no-prototype-builtins": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ]
  },
  "overrides": [
    {
      "files": ["rollup.config.js", "web-test-runner.config.js"],
      "env": {
        "node": true
      }
    },
    {
      "files": [
        "*_test.ts",
        "**/custom_typings/*.ts",
        "packages/labs/ssr/src/test/integration/tests/**",
        "packages/labs/ssr/src/lib/util/parse5-utils.ts"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
````

## File: .gitignore
````
build

.rollup.cache
tsconfig.tsbuildinfo

.DS_Store
.idea/*
.nyc_output
build/docs
node_modules
demo
src/**.js
coverage
*.log
yarn.lock
bun.lockb

custom-elements.json

# top level source
my-element.js
my-element.js.map
my-element.d.ts
my-element.d.ts.map
# only generated for size check
my-element.bundled.js
````

## File: .nvmrc
````
v18.16.0
````

## File: .prettierignore
````
# package.json is formatted by package managers, so we ignore it here
package.json
````

## File: .prettierrc.json
````json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "es5",
  "bracketSameLine": true,
  "printWidth": 120
}
````

## File: CHANGELOG.md
````markdown
# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.7.6](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.7.5...v1.7.6) (2025-07-10)
### Fix
- Make the `isAvailable` method for Rabet and Hana so it has a small delay to avoid checking before the extensions have placed the window object

### [1.7.5](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.7.3...v1.7.5) (2025-06-03)
### Add
- Include a new `sep43Modules` function that returns a list of only wallets that follow all the SEP-0043 methods
- Add a new `filterBy` parameter for both `allowAllModules` and `sep43Modules`

### Change
- Make optional providing the default module when starting the kit and instead throw an error if someone tries to use one module before it has been selected.

### [1.7.3](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.7.2...v1.7.3) (2025-03-17)
### Change
- Change dist files so we use .mjs instead of .js, that way Next understands it needs to use the ESM version instead of the commonjs version.

### [1.7.2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.7.1...v1.7.2) (2025-03-14)
### Fix
- Do not show the account selector modal if the dev is passing a path for the Ledger module's method `getAddress`

### [1.7.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.7.0...v1.7.1) (2025-03-06)
### add
- Include a new `onError` parameter to the `createButton` method so developers can listen to possible errors when getting the public key from the contract.

### [1.7.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.6.1...v1.7.0) (2025-03-06)
### add
- Include a new `onClosed` parameter to the `createButton` method so developers can listen to the closed event the modal triggers.

### Change
- Upgrade the Trezor library to latest one

### [1.6.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.6.0...v1.6.1) (2025-02-24)
### Add
- Fix the `getAddress` method in the Freighter module, the address was being returned as a blank string. It was reported in this [ticket](https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/57).

### [1.6.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.5.0...v1.6.0) (2025-02-21)
### Add
- Add module for HOT wallet

### [1.5.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.4.1...v1.5.0) (2025-02-20)
### Add
- Add method "assignButtons" to the kit

### [1.4.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.4.0...v1.4.1) (2025-01-09)
### Fix
- Make the Trezor module to work with Webpack projects

### [1.4.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.3.0...v1.4.0) (2024-12-20)
### Add
- Add Trezor wallets support
- Update the returned value from the `openAccountSelector` method in the Ledger module.

### [1.3.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.2.5...v1.3.0) (2024-12-05)
### Add 
- Add Ledger wallets support
- Add new "account selector" component which can be used by wallets based on mnemonic phrases or similar (for example hardware wallets)
- Merge PR #48 - Add signMessage support for Hana wallet

### [1.2.5](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.2.3...v1.2.5) (2024-11-07)
### Fix
- Add `Buffer` package to correctly convert the response from a signed message/auth entry with Freighter ([Ticket created](https://github.com/stellar/freighter/issues/1626))
- Check if `window` is `undefined` before using it with Rabet and Hana so it works on server side flows.

### [1.2.3](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.2.2...v1.2.3) (2024-10-09)
### Fix
- Move the Modal component out from the Button component, we do this so the shadow DOM styles don't affect the modal component in those cases where there is a container that could prevent the modal from taking the whole screen

### [1.2.2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.2.1...v1.2.2) (2024-10-07)
### Add
- Add `removeButton` and `isButtonCreated` methods to the kit. These methods can be used in cases where we need to re-organize the layout of our frontend

### [1.2.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.2.0...v1.2.1) (2024-09-15)
### Change
- Use xBull Wallet Connect npm package instead of the github version, this way some lints don't trigger an error.

### [1.2.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.1.0...v1.2.0) (2024-08-24)
### Add
- Add a `disconnect` method to the `KitActions` interface.
- Update `WalletConnect` module so it accepts a `onSessionDeleted` parameter.

### Change
- Upgrade all dependencies, lock them and remove those that are not used anymore.

### [1.1.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v1.0.0...v1.1.0) (2024-08-22)
### Add
- Add the latest version of the Freighter API and update the calls to the API.
- Add a new `Button` component. This new component can show the selected address, and the current XLM balance allows copying the chosen address and allows the user to "disconnect".
- Allow listening to both "connect" and "disconnect" Button events
- Add a new state to the kit, so we can keep the current balance and picked address to show in the Button component.
- Add a new plugin to the build process, so it minimizes the distribution build.
- Add a new development server to make the development of the kit easier.

### [1.0.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.9.2...v1.0.0) (2024-08-11)
### Change
- BREAKING: Update all the kit interface to support [SEP-0043](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md).
- Transform all images from .svg to .png so sites not allowing that format can load the images.

### [0.9.2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.9.1...v0.9.2) (2024-07-27)
### Change
- Merge of PR [#33](https://github.com/Creit-Tech/Stellar-Wallets-Kit/pull/33) which allows defining a custom theme to the kit's modal
- Improve the custom theme feature so it allows more customization, also include default themes so users can use them directly if they want to 

### [0.9.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.9.0...v0.9.1) (2024-07-02)
### Change
- The list of wallets on the modal will now dynamically change its order based on the criteria here: https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/28 

### [0.9.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.8.3...v0.9.0) (2024-06-22)
### Change
- Allow passing a wallet connect client and modal to the kit
- Update Lit to 2.8.0
- Move to a Rollup bundle strategy so the kit is compatible with both Commonjs and ES Module projects
- BREAKING: Moved from "build" distribution folder to a root style distribution
- BREAKING: Wallet connect packages are no longer exported from the root file, import from `modules/walletconnect.module.ts` instead.

### [0.8.3](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.8.2...v0.8.3) (2024-06-05)
### Add
- Merge pull #22 and add Hana Wallet to the Kit

### Change
- Update Github action to move from npm to pnpm and be able to remove the package-lock file

### [0.8.2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.8.1...v0.8.2) (2024-05-28)
### Change
- Change the way we request the public key from Freighter (instead of using `getPublicKey` we now use `requestAccess` because otherwise we could receive an empty string)

### [0.8.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.8.0...v0.8.1) (2024-05-03)
### Add
- Introduce a timer to function `isAvailable` so `getSupportedWallets` doesn't take too much

### Change
- Update Lobstr name to LOBSTR
- Lock and update dependencies versions

### [0.8.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.7.0...v0.8.0) (2024-04-16)
### Add
- Add Lobstr extension support

### [0.7.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.6.1...v0.7.0) (2024-03-15)
### Add
- Bring back Wallet Connect module

### Delete
- Demo page and dependencies for it

### [0.6.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.6.0...v0.6.1) (2024-02-16)

### Change
- Get rid of the "build/main" folder for better compatibility with projects using this kit

### [0.6.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.5.0...v0.6.0) (2024-02-15)
### Add
- A new bundled version of the kit is available at /build/web-bundle.js

### Change
- The UI has been updated, so it now has a mobile version and show a quick and basic explanation of what a wallet it.
- Now when clicking on a wallet that is not installed, it will open the official wallet website.

### [0.5.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.2.0...v0.5.0) (2024-01-12)
#### Change
- Wallets/services are now handled as "modules" (a module is basically a driver for a wallet/service) and they all share a common interface. This way wallets' developers can create their own modules and make their products compatible with this kit.
- BREAKING: Modules now need to be imported when starting the kit, a function called `allowAllModules` is included and this one will inject all the builtin modules 
- BREAKING: When creating a new instance of `StellarWalletsKit`, you now send the wallet id (provided either by this kit or by the third party module) instead of `WalletType`.
- BREAKING: When using the modal, you need to pass the id of the selected wallet instead of the type. Check `README.md` for an example
- BREAKING: `allowedWallets` is no longer a valid parameter for the integrated modal, instead the modal uses the modules from the kit.
- BREAKING: WalletConnect support has been dropped, the integration got outdated and needs to be upgraded before we add it again.

### [0.2.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.1.4...v0.2.0) (2024-01-12)
#### Change
- Move away from Github distribution to a classic npm package distribution

### [0.1.4](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.1.3...v0.1.4) (2023-11-16)
#### Change
- Upgrade xBull-Wallet-connect library to the latest one

### [0.1.3](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.1.1...v0.1.3) (2023-11-16)
#### add
- Fix height issues (ios devices)

### [0.1.2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.1.0...v0.1.2) (2023-09-30)
#### add
- New version of the Freighter API (1.7.0)
- Merge PR [#4](https://github.com/Creit-Tech/Stellar-Wallets-Kit/pull/4)

### [0.1.1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.1.0...v0.1.1) (2023-08-04)
#### add
- New version of the Freighter API (1.6.0) which includes the new support to signing Blobs
- Merge of PRs [#1](https://github.com/Creit-Tech/Stellar-Wallets-Kit/pull/1), [#2](https://github.com/Creit-Tech/Stellar-Wallets-Kit/pull/2) and [#3](https://github.com/Creit-Tech/Stellar-Wallets-Kit/pull/3) which they include the support of Blob signing for Freighter

### [0.1.0](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.8...v0.1.0) (2023-06-03)
#### add
- Add new modal component integrated with the wallet kit

### [0.0.8](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.7...v0.0.8) (2023-05-30)
#### Change
- Upgrade the packages to support the latest Freighter wallet

### [0.0.7](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.6...v0.0.7) (2023-04-27)
#### Change
- Fix XDR returned from Albedo didn't include the signatures

### [0.0.6](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.5...v0.0.6) (2023-02-06)
#### Change
- Method `getSupportedWallets`is now static

### [0.0.5](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.4...v0.0.5) (2022-11-23)
#### Add
- Add method `closeSession` to allow disconnecting WalletConnect sessions from the kit

### [0.0.4](https://github.com/Creit-Tech/Stellar-Wallets-Kit/compare/v0.0.2...v0.0.4) (2022-11-18)
#### Add
- Add method `getSupportedWallets`

### 0.0.3 (2022-11-17)
#### Notes
- First day of deployment
````

## File: index.html
````html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <title>Stellar Wallets Kit dev testing</title>

  <style>
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #fafafa;
    }

    header {
      background-color: #fff;
      width: 100%;
      display: flex;
      border-bottom: solid 1px #ccc;
      padding: 0.5rem 1rem;
      align-items: center;
      justify-content: space-between;
    }

    main {
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    input, textarea, button {
      padding: 0.5rem 1rem;
    }
  </style>
</head>
<body>

<header>
  <div id='buttonWrapper'></div>
  <div>
    <button id='externalConnect'>Connect</button>
    <button id='externalDisconnect'>Disconnect</button>
  </div>
</header>

<main>
  <label for='publicKey'>Public key</label>
  <br>
  <input placeholder='Use the connect button to fetch the public key' id='publicKey' type='text'>
  <br>
  <label for='xdrTextArea'>XDR to sign</label>
  <br>
  <textarea rows='10' id='xdrTextArea'></textarea>
  <br>
  <button id='signButton'>Sign</button>
  <br>
  <pre id='signedXdr'></pre>
</main>

<br><br>
<button id='externalButton'>Connect with external button</button>
<br><br>
<div>
  <button id='createButton'>Create a button on the header</button>
  <button id='removeButton'>Remove the button from the header</button>
</div>
<br><br>

<script type='module'>
  import { Buffer } from 'buffer';
  window.Buffer = Buffer;
  window.global = window;
</script>

<script type='module'>
  import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    XBULL_ID
  } from './build/index.mjs';
  import { WalletConnectModule, WalletConnectAllowedMethods } from './build/modules/walletconnect.module.mjs'
  import { LedgerModule } from './build/modules/ledger.module.mjs'
  import { TrezorModule } from './build/modules/trezor.module.mjs';

  const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    modules: [
      ...allowAllModules({ filterBy: module => module.productId === XBULL_ID }),
      new LedgerModule(),
      new TrezorModule({
        appUrl: 'http://localhost:5173',
        email: 'test@localhost.com'
      }),
      new WalletConnectModule({
        url: 'https://stellarwalletskit.dev/',
        projectId: '4e0b84f6ba6bedf7c7f041d919a9f039',
        method: WalletConnectAllowedMethods.SIGN,
        description: `This is a development ID, DO NOT sign transactions that come from this request if you are not a developer testing.`,
        name: 'StellarWalletsKit',
        icons: [],
        network: WalletNetwork.TESTNET,
      }),
    ],
  });

  function createDefaultButton() {
    kit.createButton({
      container: document.querySelector('#buttonWrapper'),
      onConnect: ({ address }) => {
        console.log('Address requested: ', address);
        document.querySelector('#publicKey').setAttribute('value', address);
      },
      onDisconnect: () => console.log('Disconnected from the button'),
      buttonText: 'Connect',
      horizonUrl: 'https://horizon.stellar.org/'
    })
  }

  createDefaultButton();

  document.querySelector('#signButton').addEventListener('click', async function(e) {
    const inputElement = document.querySelector('#xdrTextArea');
    console.log('XDR to sign:', inputElement.value);

    const data = await kit.signTransaction(inputElement.value, {
      networkPassphrase: WalletNetwork.TESTNET,
      address: document.querySelector('#publicKey').value,
    });

    document.querySelector('#signedXdr').textContent = JSON.stringify(data, null, 2);
  })

  document.querySelector('#externalButton').addEventListener('click', function(e) {
    kit.openModal({
      onWalletSelected: onWalletSelected => {
        console.log({ onWalletSelected });
      },
      onClosed: onClosed => {
        console.error({ onClosed });
      },
      modalTitle: 'This is a different tittle',
      notAvailableText: 'Nope!'
    });
  });

  document.querySelector('#createButton').addEventListener('click', function(e) {
    createDefaultButton();
  });

  document.querySelector('#removeButton').addEventListener('click', function(e) {
    kit.removeButton();
  });

  kit.assignButtons({
    connectEl: '#externalConnect',
    disconnectEl: '#externalDisconnect',
    onConnect: ({ address }) => {
      console.log('Address requested: ', address);
      document.querySelector('#publicKey').setAttribute('value', address);
    },
    onDisconnect: () => console.log('Disconnected from the button'),
  })
</script>
</body>
</html>
````

## File: LICENSE
````
MIT License

Copyright (c) 2023 Creit Technologies LLP.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "name": "@creit.tech/stellar-wallets-kit",
  "version": "1.7.6",
  "description": "A kit to handle all Stellar Wallets at once",
  "author": {
    "name": "Creit Technologies LLP",
    "url": "https://creit.tech"
  },
  "main": "index.mjs",
  "types": "index.d.ts",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "https://github.com/Creit-Tech/Stellar-Wallets-Kit.git"
  },
  "keywords": [
    "Stellar",
    "Stellar Wallets",
    "Wallet",
    "Wallets",
    "Albedo",
    "xBull Wallet",
    "Rabet",
    "Freighter"
  ],
  "scripts": {
    "dev": "rimraf ./build && rollup -c -w",
    "serve": "vite",
    "build": "rimraf ./build && rollup -c && tsc --emitDeclarationOnly true --outDir ./build -p ./tsconfig.json",
    "copyfiles": "cp ./package.json ./build && cp ./LICENSE ./build && cp ./README.md ./build && cp ./CHANGELOG.md ./build",
    "all": "pnpm run build && pnpm run copyfiles"
  },
  "engines": {
    "node": ">=16"
  },
  "dependencies": {
    "@albedo-link/intent": "0.12.0",
    "@creit.tech/xbull-wallet-connect": "0.3.0",
    "@hot-wallet/sdk": "1.0.11",
    "@ledgerhq/hw-app-str": "7.0.4",
    "@ledgerhq/hw-transport": "6.31.4",
    "@ledgerhq/hw-transport-webusb": "6.29.4",
    "@lobstrco/signer-extension-api": "1.0.0-beta.0",
    "@ngneat/elf": "2.5.1",
    "@ngneat/elf-devtools": "1.3.0",
    "@ngneat/elf-entities": "5.0.2",
    "@ngneat/elf-persist-state": "1.2.1",
    "@stellar/freighter-api": "4.0.0",
    "@trezor/connect-plugin-stellar": "9.0.6",
    "@trezor/connect-web": "9.5.1",
    "@walletconnect/modal": "2.6.2",
    "@walletconnect/sign-client": "2.11.2",
    "buffer": "6.0.3",
    "events": "3.3.0",
    "lit": "3.2.0",
    "rxjs": "7.8.1"
  },
  "peerDependencies": {
    "@stellar/stellar-base": "^12.1.1"
  },
  "devDependencies": {
    "@ngneat/elf-cli": "3.1.0",
    "@rollup/plugin-typescript": "^12.1.2",
    "@typescript-eslint/eslint-plugin": "8.2.0",
    "@typescript-eslint/parser": "8.2.0",
    "@walletconnect/types": "2.15.1",
    "@webcomponents/webcomponentsjs": "2.8.0",
    "esbuild": "0.23.1",
    "eslint": "9.9.1",
    "prettier": "3.3.3",
    "rimraf": "6.0.1",
    "rollup": "4.27.2",
    "rollup-plugin-esbuild": "6.1.1",
    "rollup-watch": "4.3.1",
    "tslib": "^2.8.1",
    "typescript": "5.5.4",
    "vite": "5.4.11"
  }
}
````

## File: README.md
````markdown
A kit to handle all Stellar Wallets at once with a simple API and without caring about individual configurations for each one of them. This library cares only about the connection and interaction with the wallets, allowing developers handling the UI/UX in the way they want.

## Compatible Wallets:

- xBull Wallet (Both PWA and extension version)
- Albedo
- Freighter
- Rabet (extension version)
- WalletConnect
- Lobstr
- Hana
- Hot Wallet

## Installation

```shell
npm i @creit.tech/stellar-wallets-kit
```

## Who is using the kit?

If you would like to see the kit in action, check these websites that are already using it:

- https://lab.stellar.org/
- https://swap.xbull.app/
- https://mainnet.blend.capital/
- https://app.fxdao.io/
- https://app.sorobandomains.org/
- https://stellar.cables.finance/

## The StellarWalletsKit class

The first step will be creating a new instance from the main class, you should only create one instance in order to avoid unexpected results.

```typescript
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID
} from '@creit.tech/stellar-wallets-kit';

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
  modules: allowAllModules(),
});
```

> The `allowAllModules()` function doesn't import those modules where you need to provide a configuration (like WalletConnect), you will need to add them manually so check the folder `src/modules` to know all the available modules. 

If you want to specify only the wallets you want to support, you can start the kit with only those by sending the modules to the constructor like this:

```typescript
import {
  FreighterModule,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
  xBullModule
} from '@creit.tech/stellar-wallets-kit';

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
  modules: [
    new xBullModule(),
    new FreighterModule(),
  ]
});
```

The available modules and their identifier are : 
| Wallet | Module class | identifier |
| - | - | - |
| Albedo | AlbedoModule | ALBEDO_ID |
| Freigther | FreighterModule | FREIGHTER_ID |
| Hana | HanaModule | HANA_ID |
| Ledger Wallet | LedgerModule | LEDGER_ID |
| Trezor Wallet | TrezorModule | TREZOR_ID |
| Lobstr | LobstrModule | LOBSTR_ID |
| Rabet | RabetModule | RABET_ID |
| Wallet connect | WalletConnectModule | WALLET_CONNECT_ID |
| xBull | xBullModule | XBULL_ID |
| HOT Wallet | HotWalletModule | HOTWALLET_ID |



## Integrated UI Modal

![](./modal-ui.gif)

The library integrates a UI modal you can show your users after you have started the kit. Once they pick the wallet they want to use you can then use the other methods available. Here is how you can use it:
```typescript
await kit.openModal({
  onWalletSelected: async (option: ISupportedWallet) => {
    kit.setWallet(option.id);
    const { address } = await kit.getAddress();
    // Do something else
  }
});
```

And as simple as that you will give full support to all the Stellar wallets plus you don't even need to handle the modal UI yourself. 

The `openModal` method also lets you update multiple things about the model like the title, the allowed wallets or even the styles of it! Here are the accepted parameters:

```typescript
function openModal(params: {
    onWalletSelected: (option: ISupportedWallet) => void;
    onClosed?: (err: Error) => void;
    modalTitle?: string;
    notAvailableText?: string;
}) {}
```

## Integrated UI Button

![](./button-ui.gif)

Just like with the built-in modal component, the kit also includes a `Button` component that helps you to show an easy-to-use interface to your users so they can connect/disconnect their wallet while your site gets updates for when that happens. Here is how you can use it:

```typescript
await kit.createButton({
  container: document.querySelector('#containerDiv'),
  onConnect: ({ address}) => {
    // Do something when the user "connects" the wallet, like fetching the account data
  },
  onDisconnect: () => {
    // Do something when the user "disconnects" the wallet, like clearing all site data and reload
  }
})
```

With just that you will include an interactive button on your website that will show the built-in modal to the user, fetch the public key, fetch the current XLM balance (if you provide a horizon URL), and give the user a UI to use!.

You can see all the parameters you can include:
```typescript
function createButton(params: {
    container: HTMLElement;
    onConnect: (response: { address: string }) => void;
    onDisconnect: () => void;
    horizonUrl?: string;
    buttonText?: string;
}): Promise<void> {}
```

## Request the public key and sign transactions

Each wallet has its own way when it comes to both requesting the public key and signing a transaction. Using this kit you can do both actions with a unified API:
```typescript
const { address } = await kit.getAddress();
// AND THEN
const { signedTxXdr } = await kit.signTransaction('XDR_HERE', {
  address,
  networkPassphrase: WalletNetwork.PUBLIC
});
```

Both methods will trigger the action using the wallet you have set before calling those methods.
 
## Extra methods

There will be moments where you would like to change certain parameters from the kit like the selected wallet, the network, etc... or maybe listening when a WalletConnect session was removed. These methods will help you in those situations: 

### Set the target wallet

```typescript
await kit.setWallet(XBULL_ID)
```

And more methods, check the documentation to see all the methods available.

## License
![](https://img.shields.io/badge/License-MIT-lightgrey)

Licensed under the MIT License, Copyright © 2023-present Creit Technologies LLP.

Checkout the `LICENSE.md` file for more details.
````

## File: rollup.config.js
````javascript
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';

const bundle = config => ({
  ...config,
  input: [
    'src/index.ts',
    'src/modules/walletconnect.module.ts',
    'src/modules/ledger.module.ts',
    'src/modules/trezor.module.ts',
  ],
  external: id => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        dir: 'build',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        entryFileNames: '[name].mjs',
        validate: true,
      },
    ],
  }),
  bundle({
    plugins: [typescript()],
    output: [
      {
        dir: 'build',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        entryFileNames: '[name].cjs',
        validate: true,
      },
    ],
  }),
];
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "target": "ESNext",
    "outDir": "build",
    "rootDir": "src",
    "moduleResolution": "Node",
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "useDefineForClassFields": false,
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "traceResolution": false,
    "listEmittedFiles": false,
    "listFiles": false,
    "pretty": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitOverride": true,
    "plugins": [
      {
        "name": "ts-lit-plugin",
        "strict": true
      }
    ],

    "lib": ["es2020", "DOM", "DOM.Iterable"],
    "types": [],
    "typeRoots": ["node_modules/@types", "src/types"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/**"],
  "compileOnSave": false
}
````
