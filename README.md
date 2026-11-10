This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## E2E tests

The Cypress end-to-end tests run the app locally (`http://localhost:3000`) against a **real DHIS2 instance**. Cypress logs in once through the API, reuses the `JSESSIONID` session cookie and writes `DHIS2_BASE_URL` to localStorage, so the app starts already authenticated.

### Local configuration

Copy `cypress.env.example.json` to `cypress.env.json` (ignored by git) and fill it in:

```json
{
    "dhis2BaseUrl": "https://<instance>/<context>",
    "dhis2Username": "<username>",
    "dhis2Password": "<password>"
}
```

The same values can be passed through the `CYPRESS_dhis2BaseUrl`, `CYPRESS_dhis2Username` and `CYPRESS_dhis2Password` environment variables.

### Running the tests locally

Requirements: Node 20 or later, yarn 1 and Google Chrome.

1. Install the dependencies (this also downloads the Cypress binary):

    ```sh
    yarn install
    ```

2. Create `cypress.env.json` as described above.

3. Run the tests with one of these two commands:

    - `yarn cy:run`: starts the app on `http://localhost:3000`, runs every spec headless in Chrome, then stops the app. Results are printed in the terminal.
    - `yarn cy:open`: starts the app, then opens the Cypress UI so you can pick a spec and follow it step by step.

    To run a single spec:

    ```sh
    yarn start-server-and-test cy:start http://localhost:3000 'cypress run --browser chrome --spec cypress/e2e/smoke.cy.js'
    ```

    If the app is already running (`yarn start`), you can call Cypress directly: `yarn cypress run --browser chrome` or `yarn cypress open --e2e`.

4. If a test fails, check the screenshots in `cypress/screenshots/` and the videos in `cypress/videos/` (both ignored by git).

The first Dashboard load can take up to 2 minutes while the app fetches data from the instance.

**VS Code integrated terminal:** VS Code sets `ELECTRON_RUN_AS_NODE=1` there, which prevents Cypress from starting (`bad option: --no-sandbox` error). Run the commands without that variable:

```sh
env -u ELECTRON_RUN_AS_NODE yarn cy:run
```

Specs live in `cypress/e2e/`, reusable selectors and actions in `cypress/elements/`. Selectors use the `data-test` attribute only.

### CI

The `.github/workflows/e2e.yml` workflow runs on every pull request. It needs the following GitHub secrets:

-   `DHIS2_BASE_URL`
-   `DHIS2_USERNAME`
-   `DHIS2_PASSWORD`

On failure, screenshots and videos are uploaded as the `cypress-artifacts` artifact.

### Instance requirements

-   `http://localhost:3000` must be in the CORS allowlist (System Settings → Access).
-   The instance must be dedicated to testing, never production.
-   The test account must have access to the organisation units and data shown by the app.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).

## Documentations of design decisions:

-   [Functional Specification Document](https://docs.google.com/document/d/1uc-UFbDTGFfDbordf0VsokOnf-byP_IFPWSVaKdC7Io/edit)

-   [Pride-c dashboard sketch](https://drive.google.com/file/d/12rUoKGxV8ykOJ1DL-mMcRxDtrVNE1c2B/view?usp=drive_link)

-   [Presentation prototype - figma](https://www.figma.com/proto/SNcOgQIuIiJpZtUCFNT5D6/Pride-C-MOCKUP-V1.0?type=design&node-id=106-1148&t=cXkxgVKi5FCiydRK-0&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=106%3A1148)

-   [DEV Roadmap](https://docs.google.com/spreadsheets/d/1urMvsAFnm_qJqCVxEhsfoXvVlpydr_7oQJgTX4WRGsA/edit#gid=0)
