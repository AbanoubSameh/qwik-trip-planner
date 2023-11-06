import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./styles.css?inline"

interface SuggestedPlanProps {
    plan?: string;
}

export default component$((props: SuggestedPlanProps) => {
    useStyles$(styles)

    return (
        <>
            {props.plan && <h3>Travel Plan</h3>}
            <div class="plan" dangerouslySetInnerHTML={props.plan}></div>
        </>
    )
})