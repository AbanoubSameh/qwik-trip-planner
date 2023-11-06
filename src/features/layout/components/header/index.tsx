import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./style.css?inline"

export default component$(() => {
    useStylesScoped$(styles)
    return (
        <header>
            Travel Planner
        </header>
    )
})