import { component$, useStore, $, useStylesScoped$ } from "@builder.io/qwik";
import PlannerForm from "./components/planner-form";
import SuggestedPlan from "./components/suggested-plan";
import { buildGeneratePlanPrompt, getOpenAIChatStream } from "./services/open-ai";
import type { SubmitHandler } from "@modular-forms/qwik";
import type { PlannerFormDefinition } from "./components/planner-form/form-definition";
import Styles from "./styles.css?inline"

export default component$(() => {
    useStylesScoped$(Styles)
    const planningStore = useStore({
        isLoading: false,
        plan: '',
        error: ''
    })

    const generateTripPlan = $<SubmitHandler<PlannerFormDefinition>>(async (data,) => {
        planningStore.isLoading = true;
        planningStore.plan = '';
        planningStore.error = '';
        const prompts = [buildGeneratePlanPrompt(data)];
        try {
            const streamResponse = await getOpenAIChatStream(prompts);
            for await (const streamMessage of streamResponse) {
                if (streamMessage) {
                    planningStore.plan += streamMessage;
                }
            }
        } catch (error) {
            planningStore.error = (error as Error).message
            planningStore.isLoading = false;

        }
        planningStore.isLoading = false;
    });
    return (
        <div class="container">
            <PlannerForm isLoading={planningStore.isLoading} generateTripPlan={generateTripPlan} />
            <span class="error">{planningStore.error}</span>
            <SuggestedPlan plan={planningStore.plan} />
        </div>
    )
})