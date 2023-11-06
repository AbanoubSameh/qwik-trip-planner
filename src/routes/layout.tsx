import { component$, Slot, useStyles$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";
import globalCssVariables from "../theme/variables.css?inline"
import layoutStyles from "./layout-styles.css?inline";
import Header from "~/features/layout/components/header";


export default component$(() => {
  useStyles$(styles);
  useStyles$(globalCssVariables);
  useStylesScoped$(layoutStyles);
  return (
    <>
      <div class="main">
        <Header />
        <main>
          <Slot />
        </main>
      </div>
    </>
  );
});
